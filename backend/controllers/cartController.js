// backend/controllers/cartController.js
import { db } from "../db/index.js";
import { cart, products, productImages } from "../db/schema.js";
import { eq, and } from "drizzle-orm";

// ==============================
// GET CART ITEMS
// ==============================
export const getCartItems = async (req, res) => {
  try {
    const userId = req.user.id;

    // First, get all cart items for the user
    const cartItems = await db
      .select({
        cartId: cart.id,
        quantity: cart.quantity,
        productId: products.id,
        title: products.title,
        price: products.price,
        discount: products.discount,
        availableStock: products.availableStock,
      })
      .from(cart)
      .leftJoin(products, eq(cart.productId, products.id))
      .where(eq(cart.userId, userId));

    // For each cart item, get the first image
    const enrichedCart = await Promise.all(
      cartItems.map(async (item) => {
        const image = await db
          .select({
            thumbnail: productImages.thumbnailUrl,
            preview: productImages.previewUrl,
            original: productImages.originalUrl,
          })
          .from(productImages)
          .where(eq(productImages.productId, item.productId))
          .limit(1);

        return {
          ...item,
          ...image[0],
        };
      })
    );

    res.json({ success: true, cart: enrichedCart });
  } catch (error) {
    console.error("Get Cart Error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch cart items." });
  }
};

// ==============================
// ADD TO CART
// ==============================
export const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ success: false, message: "productId is required" });
    }

    // Check product exists
    const product = await db
      .select()
      .from(products)
      .where(eq(products.id, productId))
      .limit(1);

    if (!product.length) {
      return res.status(404).json({ success: false, message: "Product not found." });
    }

    // Check if already in cart
    const existingCartItem = await db
      .select()
      .from(cart)
      .where(and(eq(cart.userId, userId), eq(cart.productId, productId)))
      .limit(1);

    if (existingCartItem.length) {
      await db
        .update(cart)
        .set({ quantity: existingCartItem[0].quantity + quantity })
        .where(eq(cart.id, existingCartItem[0].id));
    } else {
      await db.insert(cart).values({
        userId,
        productId,
        quantity,
      });
    }

    res.json({ success: true, message: "Product added to cart." });
  } catch (error) {
    console.error("Add to Cart Error:", error);
    res.status(500).json({ success: false, message: "Failed to add to cart." });
  }
};

// ==============================
// UPDATE CART ITEM
// ==============================
export const updateCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { cartId, quantity } = req.body;

    if (!cartId || quantity === undefined) {
      return res.status(400).json({ success: false, message: "cartId and quantity are required" });
    }

    const cartItem = await db
      .select()
      .from(cart)
      .where(and(eq(cart.id, cartId), eq(cart.userId, userId)))
      .limit(1);

    if (!cartItem.length) {
      return res.status(404).json({ success: false, message: "Cart item not found." });
    }

    if (quantity <= 0) {
      await db.delete(cart).where(eq(cart.id, cartId));
    } else {
      await db.update(cart).set({ quantity }).where(eq(cart.id, cartId));
    }

    res.json({ success: true, message: "Cart updated successfully." });
  } catch (error) {
    console.error("Update Cart Error:", error);
    res.status(500).json({ success: false, message: "Failed to update cart." });
  }
};

// ==============================
// REMOVE CART ITEM
// ==============================
export const removeCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { cartId } = req.params;

    if (!cartId) {
      return res.status(400).json({ success: false, message: "cartId is required" });
    }

    const cartItem = await db
      .select()
      .from(cart)
      .where(and(eq(cart.id, cartId), eq(cart.userId, userId)))
      .limit(1);

    if (!cartItem.length) {
      return res.status(404).json({ success: false, message: "Cart item not found." });
    }

    await db.delete(cart).where(eq(cart.id, cartId));

    res.json({ success: true, message: "Cart item removed." });
  } catch (error) {
    console.error("Remove Cart Item Error:", error);
    res.status(500).json({ success: false, message: "Failed to remove cart item." });
  }
};

// ==============================
// CLEAR CART
// ==============================
export const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;

    await db.delete(cart).where(eq(cart.userId, userId));

    res.json({ success: true, message: "Cart cleared." });
  } catch (error) {
    console.error("Clear Cart Error:", error);
    res.status(500).json({ success: false, message: "Failed to clear cart." });
  }
};
