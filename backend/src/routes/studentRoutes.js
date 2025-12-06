import express from "express";
import {
  createStudentController,
  getStudentController,
} from "../controllers/studentController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
const router = express.Router();

router.post("/create", authMiddleware, createStudentController);
router.get("/:id", authMiddleware, getStudentController);

export default router;
