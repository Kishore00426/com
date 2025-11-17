// import express from "express";
// import { upload } from "../middlewares/upload.js";
// import {
//   createProduct,
//   getProducts,
//   getProductById,
//   updateProduct,
//   deleteProduct
// } from "../controllers/productsController.js";

// const router = express.Router();

// router.post("/", createProduct);
// router.get("/", getProducts);
// router.get("/:id", getProductById);
// router.put("/:id", updateProduct);
// router.delete("/:id", deleteProduct);

// export default router;
import express from "express";
import { upload } from "../middlewares/upload.js";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
} from "../controllers/productsController.js";

const router = express.Router();

// CREATE product (with image upload)
router.post("/", upload.single("image"), createProduct);

// GET all products
router.get("/", getProducts);

// GET product by ID
router.get("/:id", getProductById);

// UPDATE product (image optional)
router.put("/:id", upload.single("image"), updateProduct);

// DELETE product
router.delete("/:id", deleteProduct);

export default router;

