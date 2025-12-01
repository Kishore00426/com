import express from "express";
import { getOrders, createOrder } from "../controllers/ordersController.js";

const router = express.Router();

// Get all orders
router.get("/", getOrders);

// Create new order
router.post("/create", createOrder);

export default router;
