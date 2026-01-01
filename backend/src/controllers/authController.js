import {
  registerService,
  verifyRegistrationOTP,
  loginService,
  forgotPasswordService,
  verifyForgotPasswordOTP,
  resetPasswordService,
  resendOTPService,
} from "../services/authService.js";

const sendResponse = (res, status, message, data = null) => {
  res.status(status).json({ status, message, data });
};

// Register
export const register = async (req, res, next) => {
  try {
    const { name, email, phone_number, password, role, className, section } =
      req.body;

    if (!role) {
      return res
        .status(400)
        .json({ status: 400, message: '"role" is required' });
    }

    const newUser = await registerService(
      name,
      email,
      phone_number,
      password,
      role,
      className,
      section
    );

    res.status(201).json({
      status: 201,
      message: "Registration successful",
      data: newUser,
    });
  } catch (err) {
    next(err);
  }
};

// Verify Registration OTP
export const verifyRegistration = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const result = await verifyRegistrationOTP(email, otp);
    sendResponse(res, 200, "Email verified successfully", result);
  } catch (err) {
    if (err.message === "Invalid or expired OTP")
      return sendResponse(res, 400, err.message);
    next(err);
  }
};

// In-memory lockout store (reset on server restart)
const loginAttempts = new Map(); // email -> { count, lockUntil }
const MAX_ATTEMPTS = 5;
const LOCK_TIME = 15 * 60 * 1000; // 15 minutes

// Login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check Lockout
    const attempt = loginAttempts.get(email);
    if (attempt) {
        if (attempt.lockUntil > Date.now()) {
            const remaining = Math.ceil((attempt.lockUntil - Date.now()) / 60000);
            return sendResponse(res, 429, `Account locked. Try again in ${remaining} minutes.`);
        }
        // Reset if lock expired
        if (attempt.lockUntil <= Date.now() && attempt.count >= MAX_ATTEMPTS) {
            loginAttempts.delete(email);
        }
    }

    
    try {
        const result = await loginService(email, password);
        // Success - clear attempts
        loginAttempts.delete(email);
        sendResponse(res, 200, "Login successful", result);
    } catch (err) {
        // Track failed attempts
        if (err.message === "Invalid email or password") {
            const current = loginAttempts.get(email) || { count: 0, lockUntil: 0 };
            current.count++;
            
            if (current.count >= MAX_ATTEMPTS) {
                current.lockUntil = Date.now() + LOCK_TIME;
                loginAttempts.set(email, current);
                return sendResponse(res, 429, "Too many failed attempts. Account locked for 15 minutes.");
            } else {
                loginAttempts.set(email, current);
            }
        }
        throw err; 
    }
  } catch (err) {
    if (
      err.message === "Invalid email or password" ||
      err.message === "Please verify your email first"
    ) {
      return sendResponse(res, 401, err.message);
    }
    // Handle pending admin approval
    if (err.message === "Your account is pending admin approval") {
      return sendResponse(res, 403, err.message);
    }
    next(err);
  }
};

// Forgot Password
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    await forgotPasswordService(email);
    sendResponse(res, 200, "OTP sent to your email");
  } catch (err) {
    if (err.message === "Email not found")
      return sendResponse(res, 404, err.message);
    next(err);
  }
};

// Verify Forgot Password OTP
export const verifyResetOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    await verifyForgotPasswordOTP(email, otp);
    sendResponse(res, 200, "OTP verified. You can now reset your password.");
  } catch (err) {
    if (err.message === "Invalid or expired OTP")
      return sendResponse(res, 400, err.message);
    next(err);
  }
};

// Reset Password
export const resetPassword = async (req, res, next) => {
  try {
    const { email, newPassword } = req.body;
    await resetPasswordService(email, newPassword);
    sendResponse(res, 200, "Password reset successful");
  } catch (err) {
    next(err);
  }
};

// Resend OTP
export const resendOTP = async (req, res, next) => {
  try {
    const { email, purpose } = req.body;

    if (!email || !purpose) {
      return sendResponse(res, 400, "Email and purpose are required");
    }

    await resendOTPService(email, purpose);
    sendResponse(res, 200, "New OTP sent to your email");
  } catch (err) {
    if (err.message === "Email not found") {
      return sendResponse(res, 404, err.message);
    }
    if (err.message === "Email already verified") {
      return sendResponse(res, 400, err.message);
    }
    next(err);
  }
};
