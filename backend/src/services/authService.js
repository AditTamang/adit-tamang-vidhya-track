import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
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
} from "./otpService.js";
import { sendOTPEmail } from "./emailService.js";

// Generate JWT Token
const generateToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// Register Service
export const registerService = async (name, email, phone_number, password) => {
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    throw new Error("Email already registered");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await createUser(name, email, phone_number, hashedPassword);

  // Generate and send OTP
  const otp = generateOTP();
  await saveOTP(email, otp, "registration");
  await sendOTPEmail(email, otp, "registration");

  return newUser;
};

// Verify Registration OTP
export const verifyRegistrationOTP = async (email, otp) => {
  const isValid = await verifyOTP(email, otp, "registration");
  if (!isValid) {
    throw new Error("Invalid or expired OTP");
  }

  const verifiedUser = await verifyUserEmail(email);
  const token = generateToken(verifiedUser);

  return { user: verifiedUser, token };
};

// Login Service
export const loginService = async (email, password) => {
  const user = await findUserByEmail(email);
  if (!user) {
    throw new Error("Invalid email or password");
  }

  if (!user.is_verified) {
    throw new Error("Please verify your email first");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  const token = generateToken(user);
  const { password: _, ...userWithoutPassword } = user;

  return { user: userWithoutPassword, token };
};

// Forgot Password Service
export const forgotPasswordService = async (email) => {
  const user = await findUserByEmail(email);
  if (!user) {
    throw new Error("Email not found");
  }

  const otp = generateOTP();
  await saveOTP(email, otp, "forgot_password");
  await sendOTPEmail(email, otp, "forgot_password");

  return true;
};

// Verify Forgot Password OTP
export const verifyForgotPasswordOTP = async (email, otp) => {
  const isValid = await checkOTPValidity(email, otp, "forgot_password");
  if (!isValid) {
    throw new Error("Invalid or expired OTP");
  }

  return true;
};

// Reset Password Service
export const resetPasswordService = async (email, newPassword) => {
  const hashedPassword = await bcrypt.hash(newPassword, 11);
  const updatedUser = await updateUserPassword(email, hashedPassword);

  return updatedUser;
};
