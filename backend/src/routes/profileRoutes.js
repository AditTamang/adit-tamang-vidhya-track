import express from "express";
import { updateProfileController } from "../controllers/profileController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.put("/update", authenticate, updateProfileController);

export default router;
