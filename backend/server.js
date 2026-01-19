import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import tagRoutes from "./routes/tagRoutes.js";
import productsRoutes from "./routes/productsRoutes.js";
import categoriesRoutes from "./routes/categoriesRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import ordersRoutes from "./routes/ordersRoutes.js";

dotenv.config();
const app = express();

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use("/admin", express.static(path.join(process.cwd(), "fe"))); // Serve admin panel

// // 404 handler for unknown routes (place at the very end, after all other routes)
// app.all("*", (req, res) => {
//   res.status(404).json({ success: false, message: "Route not found" });
// });

// import cors from "cors";

app.use(cors({

  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:3000",
    "http://127.0.0.1:5500", // Live Server
    "http://localhost:5500",  // Live Server
    "https://com-frontend-unvw.onrender.com", // Deployed Frontend
    "https://com-frontend-jdpr.onrender.com" // New Deployed Frontend
  ], // frontend URLs
  credentials: true,               // allow cookies
  // methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // allowed methods
  // allowedHeaders: ["Content-Type", "Authorization"],   // allowed headers
}));



app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// check server status
app.get("/", (req, res) => res.send("✅ E-com Backend Running"));

// API Routes
app.use("/api/products", productsRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/tags", tagRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", ordersRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
