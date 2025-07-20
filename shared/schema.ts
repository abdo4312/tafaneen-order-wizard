import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const orders = pgTable("orders", {
  id: text("id").primaryKey(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  customerInfo: jsonb("customer_info").notNull(),
  items: jsonb("items").notNull(),
  paymentMethod: text("payment_method").notNull(),
  subtotal: integer("subtotal").notNull(),
  deliveryFee: integer("delivery_fee").notNull(),
  paymentFee: integer("payment_fee").notNull(),
  total: integer("total").notNull(),
  status: text("status").notNull().default("pending"),
});

export const products = pgTable("products", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  price: integer("price").notNull(),
  image: text("image"),
  category: text("category").notNull(),
  subcategory: text("subcategory"),
  brand: text("brand"),
  featured: boolean("featured").default(false),
  newProduct: boolean("new_product").default(false),
  bestSeller: boolean("best_seller").default(false),
  inStock: boolean("in_stock").default(true),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  createdAt: true,
});

export const insertProductSchema = createInsertSchema(products);

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;
