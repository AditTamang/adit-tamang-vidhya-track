import {
  registerService,
  verifyRegistrationOTP,
  loginService,
  forgotPasswordService,
  verifyForgotPasswordOTP,
  resetPasswordService,
} from "../services/authService.js";

const sendResponse = (res, status, message, data = null) => {
  res.status(status).json({ status, message, data });
};

// Register
export const register = async (req, res, next) => {
  try {
    const { name, email, phone_number, password, role } = req.body;

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
      role
    );
    res.status(201).json({
      status: 201,
      message: "Registration successful. Please check your email for OTP.",
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

// Login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await loginService(email, password);
    sendResponse(res, 200, "Login successful", result);
  } catch (err) {
    if (
      err.message === "Invalid email or password" ||
      err.message === "Please verify your email first"
    ) {
      return sendResponse(res, 401, err.message);
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
