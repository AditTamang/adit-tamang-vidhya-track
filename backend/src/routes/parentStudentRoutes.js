import express from "express";
import {
  requestLinkController,
  approveLinkController,
  getLinkedStudentsController,
  requestLinkByCodeController,
} from "../controllers/parentStudentController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/request", authenticate, requestLinkController);
router.post("/request-by-code", authenticate, requestLinkByCodeController);
router.post("/approve", authenticate, approveLinkController);
router.get("/linked", authenticate, getLinkedStudentsController);

export default router;
