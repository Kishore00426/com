import express from "express";
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from "../controllers/wishlistController.js";

const router = express.Router();

// Get all wishlist items
router.get("/", getWishlist);

// Add to wishlist
router.post("/add", addToWishlist);

// Remove from wishlist
router.delete("/:id", removeFromWishlist);

export default router;
