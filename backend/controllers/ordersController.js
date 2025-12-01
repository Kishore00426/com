import { db } from "../db/index.js";
import { orders, orderItems } from "../db/schema.js"; // assume you have these tables
import { eq } from "drizzle-orm";

// CREATE ORDER
export const createOrder = async (req, res) => {
  try {
    const { items, subtotal, tax, shipping, totalAmount, shippingInfo, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    // Insert into orders table
    const newOrder = await db.insert(orders).values({
      userId: req.user?.id || null, // if you have auth
      subtotal,
      tax,
      shipping,
      total: totalAmount,
      paymentMethod,
      shippingInfo: JSON.stringify(shippingInfo)
    }).returning();

    // Insert each item into orderItems table
    const orderId = newOrder[0].id;
    for (const item of items) {
      await db.insert(orderItems).values({
        orderId,
        productId: item.id,
        title: item.title || item.name,
        quantity: item.quantity,
        price: item.price,
        discountPercentage: item.discountPercentage || 0
      });
    }

    res.json({ success: true, orderId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to create order" });
  }
};

// GET ALL ORDERS (for logged-in user or all)
export const getOrders = async (req, res) => {
  try {
    const userId = req.user?.id || null; // if auth
    const allOrders = await db.select().from(orders).where(userId ? eq(orders.userId, userId) : {});
    
    // Attach items
    const ordersWithItems = await Promise.all(allOrders.map(async order => {
      const items = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id));
      return { ...order, items, shippingInfo: JSON.parse(order.shippingInfo) };
    }));

    res.json(ordersWithItems);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to fetch orders" });
  }
};
