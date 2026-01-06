import {
  pgTable,
  text,
  timestamp,
  integer,
  uuid,
  varchar,
  boolean,
} from "drizzle-orm/pg-core";

export const brands = pgTable("brands", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  website: varchar("website", { length: 255 }),
  logoUrl: text("logo_url"),
  subscriptionTier: varchar("subscription_tier", { length: 50 }).default("free").notNull(), // free, pro, enterprise
  subscriptionStatus: varchar("subscription_status", { length: 50 }).default("active").notNull(), // active, past_due, canceled
  stripeCustomerId: varchar("stripe_customer_id", { length: 255 }),
  stripeSubscriptionId: varchar("stripe_subscription_id", { length: 255 }),
  stripePriceId: varchar("stripe_price_id", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const retailers = pgTable("retailers", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  website: varchar("website", { length: 255 }),
  apiKey: varchar("api_key", { length: 255 }).unique(),
  webhookUrl: text("webhook_url"), // URL to POST new reviews to
  webhookSecret: varchar("webhook_secret", { length: 255 }), // Secret for signing payload
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const products = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),
  brandId: uuid("brand_id")
    .references(() => brands.id)
    .notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  sku: varchar("sku", { length: 100 }).notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  aiSummary: text("ai_summary"), // JSON string: { pros: [], cons: [], verdict: "" }
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const incentives = pgTable("incentives", {
  id: uuid("id").primaryKey().defaultRandom(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  description: text("description").notNull(), // e.g., "10% off your next order"
  isActive: boolean("is_active").default(true).notNull(),
  productId: uuid("product_id").references(() => products.id), // Optional: specific to a product
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const reviews = pgTable("reviews", {
  id: uuid("id").primaryKey().defaultRandom(),
  productId: uuid("product_id")
    .references(() => products.id)
    .notNull(),
  retailerId: uuid("retailer_id").references(() => retailers.id), // If syndicated from a retailer
  rating: integer("rating").notNull(),
  title: varchar("title", { length: 255 }),
  content: text("content").notNull(),
  reviewerName: varchar("reviewer_name", { length: 255 }),
  reviewerEmail: varchar("reviewer_email", { length: 255 }),
  isVerified: boolean("is_verified").default(false).notNull(),
  status: varchar("status", { length: 50 }).default("pending").notNull(), // pending, approved, rejected
  sentiment: varchar("sentiment", { length: 50 }), // positive, neutral, negative
  tags: text("tags"), // JSON or comma-separated for AI tags like "Quality", "Price"
  manufacturerResponse: text("manufacturer_response"),
  manufacturerResponseDate: timestamp("manufacturer_response_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const reviewMedia = pgTable("review_media", {
  id: uuid("id").primaryKey().defaultRandom(),
  reviewId: uuid("review_id")
    .references(() => reviews.id)
    .notNull(),
  url: text("url").notNull(),
  type: varchar("type", { length: 50 }).notNull(), // image, video
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull().unique(),
  emailVerified: timestamp("email_verified"),
  image: text("image"),
  password: text("password"),
  role: varchar("role", { length: 50 }).default("user").notNull(), // admin, brand_user, retailer_user
  brandId: uuid("brand_id").references(() => brands.id),
  retailerId: uuid("retailer_id").references(() => retailers.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
export const orders = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  productId: uuid("product_id")
    .references(() => products.id)
    .notNull(),
  customerEmail: varchar("customer_email", { length: 255 }).notNull(),
  orderDate: timestamp("order_date").defaultNow().notNull(),
  status: varchar("status", { length: 50 }).default("completed").notNull(),
});

export const adminLogs = pgTable("admin_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  adminId: uuid("admin_id").references(() => users.id).notNull(),
  action: varchar("action", { length: 255 }).notNull(), // e.g., "Updated Subscription", "Rejected Review"
  targetType: varchar("target_type", { length: 50 }).notNull(), // Brand, Review, User
  targetId: uuid("target_id").notNull(),
  details: text("details"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

import { relations } from "drizzle-orm";

export const productsRelations = relations(products, ({ one, many }) => ({
  brand: one(brands, {
    fields: [products.brandId],
    references: [brands.id],
  }),
  reviews: many(reviews),
}));

export const reviewsRelations = relations(reviews, ({ one, many }) => ({
  product: one(products, {
    fields: [reviews.productId],
    references: [products.id],
  }),
  retailer: one(retailers, {
    fields: [reviews.retailerId],
    references: [retailers.id],
  }),
  media: many(reviewMedia),
}));

export const reviewMediaRelations = relations(reviewMedia, ({ one }) => ({
  review: one(reviews, {
    fields: [reviewMedia.reviewId],
    references: [reviews.id],
  }),
}));

export const usersRelations = relations(users, ({ one }) => ({
  brand: one(brands, {
    fields: [users.brandId],
    references: [brands.id],
  }),
  retailer: one(retailers, {
    fields: [users.retailerId],
    references: [retailers.id],
  }),
}));
