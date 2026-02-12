import { Router } from "express";

import * as searchController from "../controllers/searchController";
import { authenticate } from "../middleware/auth";

const router = Router();

// Main search (public)
router.get("/", searchController.search);

// Autocomplete search (public)
router.get("/autocomplete", searchController.autocomplete);

// Advanced search (public, POST for complex filters)
router.post("/advanced", searchController.advancedSearch);

// Delete search history (protected)
router.delete("/history", authenticate, searchController.deleteHistory);

export default router;
