import {
  pgTable,
  serial,
  varchar,
  text,
  integer,
  timestamp,
  decimal
} from "drizzle-orm/pg-core";

// ------------------------
//  CATEGORIES TABLE
// ------------------------
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// ------------------------
//  TAGS TABLE
// ------------------------
export const tags = pgTable("tags", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow()
});

// ------------------------
//  PRODUCTS TABLE
// ------------------------
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  discount: decimal("discount", { precision: 5, scale: 2 }).default("0"),
  stock: integer("stock").notNull(),
  availableStock: integer("available_stock").notNull(),
  brand: varchar("brand", { length: 255 }),
  warrantyInfo: varchar("warranty_info", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// ------------------------
//  PRODUCT_CATEGORIES (join table)
// ------------------------
export const productCategories = pgTable("product_categories", {
  id: serial("id").primaryKey(),
  productId: integer("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  categoryId: integer("category_id")
    .notNull()
    .references(() => categories.id, { onDelete: "cascade" })
});

// ------------------------
//  PRODUCT_TAGS (join table)
// ------------------------
export const productTags = pgTable("product_tags", {
  id: serial("id").primaryKey(),
  productId: integer("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  tagId: integer("tag_id")
    .notNull()
    .references(() => tags.id, { onDelete: "cascade" })
});

// ------------------------------------------------------------
//  PRODUCT_IMAGES TABLE (3 columns: thumbnail, preview, original)
// ------------------------------------------------------------
export const productImages = pgTable("product_images", {
  id: serial("id").primaryKey(),

  productId: integer("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),

  // Three separate URLs
  thumbnailUrl: varchar("thumbnail_url", { length: 500 }),
  previewUrl: varchar("preview_url", { length: 500 }),
  originalUrl: varchar("original_url", { length: 500 }),

  altText: varchar("alt_text", { length: 255 }),

  position: integer("position").default(0),

  createdAt: timestamp("created_at").defaultNow()
});





//
// WISHLIST TABLE
//
export const wishlist = pgTable("wishlist", {
  id: serial("id").primaryKey(),
  productId: integer("product_id")
    .references(() => products.id)
    .notNull(),
});

//
// CART TABLE
//
export const cart = pgTable("cart", {
  id: serial("id").primaryKey(),
  productId: integer("product_id")
    .references(() => products.id)
    .notNull(),
  quantity: integer("quantity").default(1),
});

//
// ORDERS TABLE
//
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),

  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  status: text("status").default("pending"),

  createdAt: timestamp("created_at").defaultNow(),
});

//
// ORDER ITEMS TABLE
//
export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),

  orderId: integer("order_id")
    .references(() => orders.id)
    .notNull(),

  productId: integer("product_id")
    .references(() => products.id)
    .notNull(),

  quantity: integer("quantity").notNull(),

  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
});

//
// CONTACT MESSAGES TABLE
//
export const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  name: text("name"),
  email: text("email"),
  message: text("message"),
  createdAt: timestamp("created_at").defaultNow(),
});

