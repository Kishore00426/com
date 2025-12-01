// backend/routes/cartRoutes.js
import express from "express";
import {
  getCartItems,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart
} from "../controllers/cartController.js";
import { requireAuth } from "../middlewares/authMiddleware.js";

const router = express.Router();

// All routes require login
router.use(requireAuth);

router.get("/", getCartItems);
router.post("/add", addToCart);
router.put("/update", updateCartItem);
router.delete("/remove/:cartId", removeCartItem);
router.delete("/clear", clearCart);

export default router;
