import { userSchemas } from "@repo/shared/schemas";
import { Router } from "express";

import * as profileController from "../controllers/profileController";
import { authenticate } from "../middleware/auth";
import { validateRequest } from "../middleware/validation";

const router = Router();

router.use(authenticate);

router.get("/", profileController.getProfile);

router.put(
  "/",
  validateRequest(userSchemas.updateProfile),
  profileController.updateProfile,
);

router.put(
  "/password",
  validateRequest(userSchemas.changePassword),
  profileController.changePassword,
);

export default router;
