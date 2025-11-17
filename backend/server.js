import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

import productsRoutes from "./routes/productsRoutes.js";
// import wishlistRoutes from "./routes/wishlistRoutes.js";
// import cartRoutes from "./routes/cartRoutes.js";
// import ordersRoutes from "./routes/ordersRoutes.js";

dotenv.config();
const app = express();

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => res.send("✅ E-com Backend Running"));

// API Routes
app.use("/api/products", productsRoutes);
// app.use("/api/wishlist", wishlistRoutes);
// app.use("/api/cart", cartRoutes);
// app.use("/api/orders", ordersRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
