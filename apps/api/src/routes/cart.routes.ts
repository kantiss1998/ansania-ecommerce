import { cartSchemas } from "@repo/shared/schemas";
import { Router, Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import * as cartController from "../controllers/cartController";
import { validateRequest } from "../middleware/validation";
import { AuthenticatedRequest } from "../types/express";

const router = Router();

// Standard simple optional auth
const extractUser = (req: Request, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    try {
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
      (req as AuthenticatedRequest).user = decoded as {
        userId: number;
        email: string;
        role: string;
      };
    } catch (e) {
      // Invalid token, ignore
    }
  }
  next();
};

router.use(extractUser);

router.get("/", cartController.getCart);

router.post(
  "/items",
  validateRequest(cartSchemas.addItem),
  cartController.addItem,
);

router.put(
  "/items/:id", // Item ID
  validateRequest(cartSchemas.updateItem),
  cartController.updateItem,
);

router.delete("/items/:id", cartController.removeItem);

router.delete("/clear", cartController.clearCart);

router.post("/merge", cartController.mergeCart);

export default router;
