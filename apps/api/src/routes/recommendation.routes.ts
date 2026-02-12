import { Router } from "express";

import * as recommendationController from "../controllers/recommendationController";
import { authenticate } from "../middleware/auth";

const router = Router();

router.get(
  "/personalized",
  authenticate,
  recommendationController.getPersonalizedRecommendations,
);
router.get(
  "/frequently-bought/:productId",
  recommendationController.getFrequentlyBoughtTogether,
);

export default router;
