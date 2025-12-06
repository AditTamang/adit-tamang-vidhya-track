import express from "express";
import {
  requestLinkController,
  approveLinkController,
  getLinkedStudentsController,
} from "../controllers/parentStudentController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/request", authenticate, requestLinkController);
router.post("/approve", authenticate, approveLinkController);
router.get("/my-students", authenticate, getLinkedStudentsController);

export default router;
