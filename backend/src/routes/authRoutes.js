import express from "express";
import {
  register,
  verifyRegistration,
  login,
  forgotPassword,
  verifyResetOTP,
  resetPassword,
  resendOTP,
} from "../controllers/authController.js";
import {
  validateRegister,
  validateVerifyOTP,
  validateLogin,
  validateForgotPassword,
  validateResetPassword,
} from "../middlewares/authValidator.js";
import { authenticate } from "../middlewares/authMiddleware.js";
import { logoutMiddleware } from "../middlewares/logoutMiddleware.js";

const router = express.Router();

// Registration flow
router.post("/register", validateRegister, register);
router.post("/verify-registration", validateVerifyOTP, verifyRegistration);

// Login
router.post("/login", validateLogin, login);

// OTP
router.post("/resend-otp", resendOTP);

// Password reset
router.post("/forgot-password", validateForgotPassword, forgotPassword);
router.post("/verify-reset-otp", validateVerifyOTP, verifyResetOTP);
router.post("/reset-password", validateResetPassword, resetPassword);

// Logout
router.post("/logout", authenticate, logoutMiddleware);

export default router;
