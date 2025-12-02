import express from "express";
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from "../controllers/wishlistController.js";
import { requireAuth } from "../middlewares/authMiddleware.js";

const router = express.Router();

// All routes require authentication
router.use(requireAuth);

// Get user's wishlist
router.get("/", getWishlist);

// Add to wishlist
router.post("/add", addToWishlist);

// Remove from wishlist
router.delete("/:id", removeFromWishlist);

export default router;
