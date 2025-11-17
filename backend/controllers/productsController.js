// import { db } from "../db/index.js";
// import { products } from "../db/schema.js";
// import { eq } from "drizzle-orm";

// // CREATE PRODUCT
// export const createProduct = async (req, res) => {
//   try {
//     const newProduct = await db.insert(products).values(req.body).returning();
//     res.status(201).json({ success: true, product: newProduct[0] });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // GET ALL PRODUCTS
// export const getProducts = async (req, res) => {
//   try {
//     const allProducts = await db.select().from(products);
//     res.status(200).json({ success: true, products: allProducts });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // GET SINGLE PRODUCT
// export const getProductById = async (req, res) => {
//   try {
//     const product = await db.select().from(products).where(eq(products.id, req.params.id));
    
//     if (product.length === 0) {
//       return res.status(404).json({ success: false, message: "Product not found" });
//     }

//     res.status(200).json({ success: true, product: product[0] });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // UPDATE PRODUCT
// export const updateProduct = async (req, res) => {
//   try {
//     const updated = await db
//       .update(products)
//       .set({ ...req.body, updatedAt: new Date() })
//       .where(eq(products.id, req.params.id))
//       .returning();

//     res.status(200).json({ success: true, product: updated[0] });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // DELETE PRODUCT
// export const deleteProduct = async (req, res) => {
//   try {
//     const deleted = await db
//       .delete(products)
//       .where(eq(products.id, req.params.id))
//       .returning();

//     res.status(200).json({ success: true, deleted: deleted[0] });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

import { db } from "../db/index.js";
import { products } from "../db/schema.js";
import { eq } from "drizzle-orm";

// CREATE PRODUCT
export const createProduct = async (req, res) => {
  try {
    const body = req.body;

    // handle uploaded image
    let imageArray = [];
    if (req.file) {
      imageArray = [`/uploads/${req.file.filename}`];
    }

    const newProduct = await db
      .insert(products)
      .values({
        ...body,
        price: Number(body.price),
        discount: Number(body.discount),
        stock: Number(body.stock),
        availableStock: Number(body.availableStock),
        tags: body.tags ? JSON.parse(body.tags) : [],
        images: imageArray,
      })
      .returning();

    res.status(201).json({ success: true, product: newProduct[0] });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET ALL PRODUCTS
export const getProducts = async (req, res) => {
  try {
    const allProducts = await db.select().from(products);
    res.status(200).json({ success: true, products: allProducts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET SINGLE PRODUCT
export const getProductById = async (req, res) => {
  try {
    const product = await db
      .select()
      .from(products)
      .where(eq(products.id, req.params.id));

    if (product.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, product: product[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE PRODUCT
export const updateProduct = async (req, res) => {
  try {
    const body = req.body;

    // handle new image upload
    let newImage = null;
    if (req.file) {
      newImage = `/uploads/${req.file.filename}`;
    }

    // fetch old product
    const oldProduct = await db
      .select()
      .from(products)
      .where(eq(products.id, req.params.id));

    if (oldProduct.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    let updatedImages = oldProduct[0].images || [];
    if (newImage) updatedImages.push(newImage);

    const updated = await db
      .update(products)
      .set({
        ...body,
        price: body.price ? Number(body.price) : oldProduct[0].price,
        discount: body.discount ? Number(body.discount) : oldProduct[0].discount,
        stock: body.stock ? Number(body.stock) : oldProduct[0].stock,
        availableStock: body.availableStock
          ? Number(body.availableStock)
          : oldProduct[0].availableStock,
        tags: body.tags ? JSON.parse(body.tags) : oldProduct[0].tags,
        images: updatedImages,
        updatedAt: new Date(),
      })
      .where(eq(products.id, req.params.id))
      .returning();

    res.status(200).json({ success: true, product: updated[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE PRODUCT
export const deleteProduct = async (req, res) => {
  try {
    const deleted = await db
      .delete(products)
      .where(eq(products.id, req.params.id))
      .returning();

    res.status(200).json({ success: true, deleted: deleted[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
                 };

