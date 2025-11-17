import {
  pgTable,
  serial,
  varchar,
  text,
  integer,
  timestamp,
  jsonb,
  decimal
} from "drizzle-orm/pg-core";

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  category: varchar("category", { length: 255 }).notNull(),

  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  discount: decimal("discount", { precision: 5, scale: 2 }).default("0"),

  stock: integer("stock").notNull(),
  availableStock: integer("available_stock").notNull(),

  brand: varchar("brand", { length: 255 }),
  warrantyInfo: varchar("warranty_info", { length: 255 }),

  tags: jsonb("tags").default([]),
  images: jsonb("images").default([]),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
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

