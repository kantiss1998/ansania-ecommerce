import { Router } from "express";

import * as adminAttributeController from "../../controllers/admin/attributeController";
import { authenticate, authorizeAdmin } from "../../middleware/auth";

const router = Router();

router.use(authenticate, authorizeAdmin);

router.get("/", adminAttributeController.getAllAttributes);

// Colors
router.get("/colors", adminAttributeController.getColors);
router.post("/colors", adminAttributeController.createColor);
router.put("/colors/:id", adminAttributeController.updateColor);
router.delete("/colors/:id", adminAttributeController.deleteColor);

// Sizes
router.get("/sizes", adminAttributeController.getSizes);
router.post("/sizes", adminAttributeController.createSize);
router.put("/sizes/:id", adminAttributeController.updateSize);
router.delete("/sizes/:id", adminAttributeController.deleteSize);

// Finishing
router.get("/finishing", adminAttributeController.getFinishing);
router.post("/finishing", adminAttributeController.createFinishing);
router.put("/finishing/:id", adminAttributeController.updateFinishing);
router.delete("/finishing/:id", adminAttributeController.deleteFinishing);

export default router;
