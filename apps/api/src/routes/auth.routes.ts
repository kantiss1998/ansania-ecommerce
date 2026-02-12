import { authSchemas } from "@repo/shared/schemas";
import { Router } from "express";

import * as authController from "../controllers/authController";
import { authenticate } from "../middleware/auth";
import { validateRequest } from "../middleware/validation";

const router = Router();

router.post(
  "/register",
  validateRequest(authSchemas.register),
  authController.register,
);

router.post("/login", validateRequest(authSchemas.login), authController.login);

router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);

router.post("/refresh", authController.refresh);
router.post("/logout", authController.logout);

router.post("/verify-email", authController.verifyEmail);

router.delete("/account", authenticate, authController.deleteAccount);

export default router;
