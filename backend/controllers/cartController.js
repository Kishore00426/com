import { db } from "../db/index.js";
import { cart } from "../db/schema.js";
import { eq } from "drizzle-orm";

export const getCart = async (req, res) => {
  const items = await db.select().from(cart);
  res.json(items);
};

export const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  await db.insert(cart).values({ productId, quantity });
  res.json({ message: "Added to cart" });
};

export const updateQuantity = async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;
  await db.update(cart).set({ quantity }).where(eq(cart.productId, id));
  res.json({ message: "Quantity updated" });
};

export const removeFromCart = async (req, res) => {
  const { id } = req.params;
  await db.delete(cart).where(eq(cart.productId, id));
  res.json({ message: "Removed from cart" });
};

export const clearCart = async (req, res) => {
  await db.delete(cart);
  res.json({ message: "Cart cleared" });
};
