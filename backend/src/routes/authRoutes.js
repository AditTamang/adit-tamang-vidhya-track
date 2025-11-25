import express from "express";
import {
  register,
  verifyRegistration,
  login,
  forgotPassword,
  verifyResetOTP,
  resetPassword,
} from "../controllers/authController.js";
import {
  validateRegister,
  validateVerifyOTP,
  validateLogin,
  validateForgotPassword,
  validateResetPassword,
} from "../middlewares/authValidator.js";

const router = express.Router();

// Registration flow
router.post("/register", validateRegister, register);
router.post("/verify-registration", validateVerifyOTP, verifyRegistration);

// Login
router.post("/login", validateLogin, login);

// Password reset flow
router.post("/forgot-password", validateForgotPassword, forgotPassword);
router.post("/verify-reset-otp", validateVerifyOTP, verifyResetOTP);
router.post("/reset-password", validateResetPassword, resetPassword);

export default router;
