import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../config/dbConnection.js";

import {
  findUserByEmail,
  createUser,
  verifyUserEmail,
  updateUserPassword,
} from "../models/authModel.js";

import {
  checkOTPValidity,
  generateOTP,
  saveOTP,
  verifyOTP,
  invalidateOldOTPs,
} from "./otpService.js";

import { sendOTPEmail } from "./emailService.js";

// Generate JWT Token
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// Generate unique student code (STU20251234)
const generateStudentCode = async () => {
  const year = new Date().getFullYear();
  const random = Math.floor(1000 + Math.random() * 9000);
  const code = `STU${year}${random}`;

  const exists = await pool.query(
    "SELECT id FROM students WHERE student_code=$1",
    [code]
  );

  if (exists.rows.length > 0) return generateStudentCode();
  return code;
};

// REGISTER
export const registerService = async (
  name,
  email,
  phone_number,
  password,
  role,
  className = null,
  section = null
) => {
  // Check existing user
  const existing = await findUserByEmail(email);
  if (existing) throw new Error("Email already registered");

  const hashedPassword = await bcrypt.hash(password, 10);

  // 1. Insert into users table
  const newUser = await createUser(
    name,
    email,
    phone_number,
    hashedPassword,
    role
  );

  // 2. Insert into role-based tables
  if (role === "student") {
    const studentCode = await generateStudentCode();

    await pool.query(
      `INSERT INTO students (user_id, student_code, class, section)
       VALUES ($1, $2, $3, $4)`,
      [newUser.id, studentCode, className, section]
    );
  }

  if (role === "parent") {
    await pool.query(`INSERT INTO parents (user_id) VALUES ($1)`, [newUser.id]);
  }

  if (role === "teacher") {
    await pool.query(`INSERT INTO teachers (user_id) VALUES ($1)`, [
      newUser.id,
    ]);
  }

  // 3. Generate & store OTP
  const otp = generateOTP();
  await saveOTP(email, otp, "registration");
  await sendOTPEmail(email, otp, "registration");

  return newUser;
};

// Verify registration OTP
// After OTP is verified, user must wait for admin approval before login
export const verifyRegistrationOTP = async (email, otp) => {
  const isValid = await verifyOTP(email, otp, "registration");
  if (!isValid) throw new Error("Invalid or expired OTP");

  const verifiedUser = await verifyUserEmail(email);

  // Return user info without token
  return {
    user: verifiedUser,
    message:
      "Email verified. Please wait for admin approval before logging in.",
  };
};

// Login Service
export const loginService = async (email, password) => {
  const user = await findUserByEmail(email);
  if (!user) throw new Error("Invalid email or password");

  if (!user.is_verified) throw new Error("Please verify your email first");

  // Check if admin has approved the account
  if (!user.is_approved)
    throw new Error("Your account is pending admin approval");

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error("Invalid email or password");

  const token = generateToken(user);

  // Remove sensitive fields from user object
  const { password: _, ...cleanUser } = user;

  // Return user and token - token goes to secure storage
  return { user: cleanUser, token };
};

// Forgot Password
export const forgotPasswordService = async (email) => {
  const user = await findUserByEmail(email);
  if (!user) throw new Error("Email not found");

  const otp = generateOTP();
  await saveOTP(email, otp, "forgot_password");
  await sendOTPEmail(email, otp, "forgot_password");

  return true;
};

// Verify Forgot Password OTP
export const verifyForgotPasswordOTP = async (email, otp) => {
  const valid = await checkOTPValidity(email, otp, "forgot_password");
  if (!valid) throw new Error("Invalid or expired OTP");

  return true;
};

// Reset Password
export const resetPasswordService = async (email, newPassword) => {
  const hash = await bcrypt.hash(newPassword, 10);
  return await updateUserPassword(email, hash);
};

// Resend OTP - generates new OTP and invalidates old ones
export const resendOTPService = async (email, purpose) => {
  // Check if user exists
  const user = await findUserByEmail(email);
  if (!user) throw new Error("Email not found");

  // If registration OTP and user already verified, don't allow
  if (purpose === "registration" && user.is_verified) {
    throw new Error("Email already verified");
  }

  // Invalidate old OTPs for this email and purpose
  await invalidateOldOTPs(email, purpose);

  // Generate and save new OTP
  const otp = generateOTP();
  await saveOTP(email, otp, purpose);
  await sendOTPEmail(email, otp, purpose);

  return true;
};
