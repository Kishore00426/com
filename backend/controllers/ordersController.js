import { db } from "../db/index.js";
import { orders, orderItems, products, cart } from "../db/schema.js";
import { eq } from "drizzle-orm";

// CREATE ORDER
export const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { subtotal, tax, shipping, totalAmount, shippingInfo, paymentMethod } = req.body;

    console.log("=== ORDER CREATION REQUEST ===");
    console.log("User ID:", userId);
    console.log("Received body:", req.body);
    console.log("Parsed fields:", { subtotal, tax, shipping, totalAmount, shippingInfo, paymentMethod });

    // Better validation - check for undefined/null instead of falsy
    const missingFields = [];
    if (subtotal === undefined || subtotal === null) missingFields.push("subtotal");
    if (tax === undefined || tax === null) missingFields.push("tax");
    if (shipping === undefined || shipping === null) missingFields.push("shipping");
    if (totalAmount === undefined || totalAmount === null) missingFields.push("totalAmount");
    if (!shippingInfo) missingFields.push("shippingInfo");
    if (!paymentMethod) missingFields.push("paymentMethod");

    if (missingFields.length > 0) {
      console.log("Missing fields:", missingFields);
      return res.status(400).json({ 
        success: false, 
        message: `Missing required order fields: ${missingFields.join(", ")}` 
      });
    }

    // Get current cart items for this user
    const cartItems = await db
      .select({
        productId: cart.productId,
        quantity: cart.quantity,
        title: products.title,
        price: products.price,
        discount: products.discount,
      })
      .from(cart)
      .leftJoin(products, eq(cart.productId, products.id))
      .where(eq(cart.userId, userId));

    if (!cartItems.length) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    // Insert into orders table
    const newOrder = await db
      .insert(orders)
      .values({
        userId,
        subtotal: Number(subtotal),
        tax: Number(tax),
        shipping: Number(shipping),
        totalAmount: Number(totalAmount),
        paymentMethod,
        status: "pending",
        shippingInfo: JSON.stringify(shippingInfo),
      })
      .returning();

    const orderId = newOrder[0].id;

    // Insert each cart item into orderItems table
    for (const item of cartItems) {
      await db.insert(orderItems).values({
        orderId,
        productId: item.productId,
        title: item.title,
        quantity: item.quantity,
        price: Number(item.price),
        discountPercentage: Number(item.discount) || 0,
      });
    }

    // Clear the user's cart after order creation
    await db.delete(cart).where(eq(cart.userId, userId));

    res.status(201).json({ 
      success: true, 
      orderId: orderId,
      message: "Order created successfully"
    });
  } catch (err) {
    console.error("Create Order Error:", err);
    res.status(500).json({ success: false, message: "Failed to create order" });
  }
};

// GET ALL ORDERS FOR LOGGED-IN USER
export const getOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const userOrders = await db
      .select()
      .from(orders)
      .where(eq(orders.userId, userId));

    // Attach items to each order
    const ordersWithItems = await Promise.all(
      userOrders.map(async (order) => {
        const items = await db
          .select()
          .from(orderItems)
          .where(eq(orderItems.orderId, order.id));

        return {
          ...order,
          items,
          shippingInfo: typeof order.shippingInfo === 'string' 
            ? JSON.parse(order.shippingInfo || "{}") 
            : order.shippingInfo,
        };
      })
    );

    res.json({ 
      success: true, 
      data: ordersWithItems 
    });
  } catch (err) {
    console.error("Get Orders Error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch orders" });
  }
};

// GET SINGLE ORDER
export const getOrderById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const order = await db
      .select()
      .from(orders)
      .where(eq(orders.id, Number(id)))
      .limit(1);

    if (!order.length || order[0].userId !== userId) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    const items = await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, Number(id)));

    res.json({
      success: true,
      data: {
        ...order[0],
        items,
        shippingInfo: typeof order[0].shippingInfo === 'string' 
          ? JSON.parse(order[0].shippingInfo || "{}") 
          : order[0].shippingInfo,
      }
    });
  } catch (err) {
    console.error("Get Order Error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch order" });
  }
};
