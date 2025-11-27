// import { db } from "../db/index.js";
// import { wishlist } from "../db/schema.js";
// import { eq } from "drizzle-orm";

// export const getWishlist = async (req, res) => {
//   const items = await db.select().from(wishlist);
//   res.json(items);
// };

// export const addToWishlist = async (req, res) => {
//   const { productId } = req.body;
//   await db.insert(wishlist).values({ productId });
//   res.json({ message: "Added to wishlist" });
// };

// export const removeFromWishlist = async (req, res) => {
//   const { id } = req.params;
//   await db.delete(wishlist).where(eq(wishlist.productId, id));
//   res.json({ message: "Removed from wishlist" });
// };
 
import { db } from "../db/index.js";
import { wishlist, products } from "../db/schema.js";
import { eq, and } from "drizzle-orm";

// --------------------------------------------------
// ADD TO WISHLIST
// --------------------------------------------------
export const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res
        .status(400)
        .json({ success: false, message: "productId is required" });
    }

    // Check if already exists (global for now)
    const existing = await db
      .select()
      .from(wishlist)
      .where(eq(wishlist.productId, productId));

    if (existing.length > 0) {
      return res.json({ success: true, message: "Already in wishlist" });
    }

    const inserted = await db
      .insert(wishlist)
      .values({ productId }) // no userId yet
      .returning();

    res.json({ success: true, data: inserted[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// --------------------------------------------------
// GET ALL WISHLIST ITEMS
// --------------------------------------------------
export const getWishlist = async (req, res) => {
  try {
    const items = await db
      .select({
        id: wishlist.id,
        productId: wishlist.productId,
        product: products, // JOIN full product
      })
      .from(wishlist)
      .leftJoin(products, eq(products.id, wishlist.productId));

    res.json({ success: true, items });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// --------------------------------------------------
// REMOVE FROM WISHLIST
// --------------------------------------------------
export const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    await db
      .delete(wishlist)
      .where(eq(wishlist.productId, Number(productId)));

    res.json({ success: true, message: "Removed from wishlist" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// --------------------------------------------------
// CLEAR WHOLE WISHLIST (optional)
// --------------------------------------------------
export const clearWishlist = async (req, res) => {
  try {
    await db.delete(wishlist);
    res.json({ success: true, message: "Wishlist cleared" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
