// import { db } from "../db/index.js";
// import { orders, orderItems } from "../db/schema.js";

// export const getOrders = async (req, res) => {
//   const allOrders = await db.select().from(orders);
//   res.json(allOrders);
// };

// export const createOrder = async (req, res) => {
//   const { items, totalAmount } = req.body;

//   const [newOrder] = await db.insert(orders).values({ totalAmount }).returning({ id: orders.id });

//   for (const item of items) {
//     await db.insert(orderItems).values({
//       orderId: newOrder.id,
//       productId: item.id,
//       quantity: item.quantity,
//       price: item.price,
//     });
//   }

//   res.json({ message: "Order created successfully", orderId: newOrder.id });
// };
