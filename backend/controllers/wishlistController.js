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
