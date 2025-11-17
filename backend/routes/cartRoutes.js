import express from "express";
import {
  getCart,
  addToCart,
  updateQuantity,
  removeFromCart,
  clearCart,
} from "../controllers/cartController.js";

const router = express.Router();

// Get all cart items
router.get("/", getCart);

// Add to cart
router.post("/add", addToCart);

// Update quantity
router.put("/update/:id", updateQuantity);

// Remove item
router.delete("/remove/:id", removeFromCart);

// Clear cart
router.delete("/clear", clearCart);

export default router;
