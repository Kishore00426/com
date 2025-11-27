// import express from "express";
// import {
//   getWishlist,
//   addToWishlist,
//   removeFromWishlist,
// } from "../controllers/wishlistController.js";

// const router = express.Router();

// // Get all wishlist items
// router.get("/", getWishlist);

// // Add to wishlist
// router.post("/add", addToWishlist);

// // Remove from wishlist
// router.delete("/:id", removeFromWishlist);

// export default router;

import express from "express";
import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
  clearWishlist,
} from "../controllers/wishlistController.js";

const router = express.Router();

// CREATE
router.post("/", addToWishlist);

// READ ALL
router.get("/", getWishlist);

// DELETE (single productId)
router.delete("/:productId", removeFromWishlist);

// DELETE ALL (optional)
router.delete("/", clearWishlist);

export default router;
