import { wishlistSchemas } from "@repo/shared/schemas";
import { Router } from "express";

import * as wishlistController from "../controllers/wishlistController";
import { authenticate } from "../middleware/auth";
import { validateRequest } from "../middleware/validation";

const router = Router();

router.use(authenticate);

router.get(
  "/",
  validateRequest(wishlistSchemas.list),
  wishlistController.getWishlist,
);

router.post(
  "/",
  validateRequest(wishlistSchemas.add),
  wishlistController.addToWishlist,
);

router.delete("/:id", wishlistController.removeFromWishlist);

router.post("/move-to-cart/:id", wishlistController.moveToCart);

router.delete("/clear", wishlistController.clearWishlist);

export default router;
