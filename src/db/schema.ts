import {
  pgTable,
  serial,
  text,
  varchar,
  integer,
  decimal,
  timestamp,
  boolean,
  index,
} from "drizzle-orm/pg-core";

// Users - Both Owners and Consumers
export const users = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    passwordHash: text("password_hash").notNull(),
    name: varchar("name", { length: 100 }).notNull(),
    role: varchar("role", { length: 20 }).notNull().default("consumer"), // 'owner' | 'consumer' | 'admin'
    avatarUrl: text("avatar_url"),
    countryCode: varchar("country_code", { length: 2 }).default("US"),
    isVerified: boolean("is_verified").default(false),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => [
    index("users_email_idx").on(table.email),
    index("users_role_idx").on(table.role),
  ]
);

// Sessions for authentication
export const sessions = pgTable(
  "sessions",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    token: text("token").notNull().unique(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => [
    index("sessions_token_idx").on(table.token),
    index("sessions_user_idx").on(table.userId),
  ]
);

// Email Verification Tokens
export const verificationTokens = pgTable(
  "verification_tokens",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    token: text("token").notNull().unique(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => [
    index("verification_tokens_token_idx").on(table.token),
    index("verification_tokens_user_idx").on(table.userId),
  ]
);

// Password Reset Tokens
export const passwordResetTokens = pgTable(
  "password_reset_tokens",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    token: text("token").notNull().unique(),
    expiresAt: timestamp("expires_at").notNull(),
    used: boolean("used").default(false),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => [
    index("password_reset_tokens_token_idx").on(table.token),
    index("password_reset_tokens_user_idx").on(table.userId),
  ]
);

// Products - The "Stocks" of the sentiment market
export const products = pgTable(
  "products",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    ticker: varchar("ticker", { length: 10 }).notNull().unique(),
    description: text("description"),
    category: varchar("category", { length: 50 }),
    imageUrl: text("image_url"),
    ownerId: integer("owner_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    currentPrice: decimal("current_price", { precision: 4, scale: 2 }).default("5.00"),
    previousPrice: decimal("previous_price", { precision: 4, scale: 2 }).default("5.00"),
    priceChange: decimal("price_change", { precision: 4, scale: 2 }).default("0.00"),
    priceChangePercent: decimal("price_change_percent", { precision: 5, scale: 2 }).default("0.00"),
    totalRatings: integer("total_ratings").default(0),
    status: varchar("status", { length: 20 }).default("active"), // 'active', 'adflow_promoted', 'ipo'
    isAdflowPromoted: boolean("is_adflow_promoted").default(false),
    adflowExpiresAt: timestamp("adflow_expires_at"),
    hasDividendBadge: boolean("has_dividend_badge").default(false),
    dividendStreakDays: integer("dividend_streak_days").default(0),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => [
    index("products_ticker_idx").on(table.ticker),
    index("products_status_idx").on(table.status),
    index("products_current_price_idx").on(table.currentPrice),
    index("products_owner_idx").on(table.ownerId),
  ]
);

// Ratings - Individual sentiment submissions
export const ratings = pgTable(
  "ratings",
  {
    id: serial("id").primaryKey(),
    productId: integer("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    userId: integer("user_id")
      .references(() => users.id, { onDelete: "set null" }),
    countryCode: varchar("country_code", { length: 2 }).notNull().default("US"),
    tenWordStatement: varchar("statement", { length: 100 }).notNull(),
    satisfaction: integer("satisfaction").notNull(),
    quality: integer("quality").notNull(),
    feel: integer("feel").notNull(),
    trendy: integer("trendy").notNull(),
    speculation: integer("speculation").notNull(),
    weightedScore: decimal("weighted_score", { precision: 4, scale: 2 }),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => [
    index("ratings_product_id_idx").on(table.productId),
    index("ratings_user_id_idx").on(table.userId),
    index("ratings_country_code_idx").on(table.countryCode),
    index("ratings_created_at_idx").on(table.createdAt),
  ]
);

// Price History - For charting "stock" movements
export const priceHistory = pgTable(
  "price_history",
  {
    id: serial("id").primaryKey(),
    productId: integer("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    price: decimal("price", { precision: 4, scale: 2 }).notNull(),
    volume: integer("volume").default(0),
    recordedAt: timestamp("recorded_at").defaultNow(),
  },
  (table) => [
    index("price_history_product_id_idx").on(table.productId),
    index("price_history_recorded_at_idx").on(table.recordedAt),
  ]
);

// Country Scores - Aggregated scores by country for heat map
export const countryScores = pgTable(
  "country_scores",
  {
    id: serial("id").primaryKey(),
    productId: integer("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    countryCode: varchar("country_code", { length: 2 }).notNull(),
    averageScore: decimal("average_score", { precision: 4, scale: 2 }),
    totalRatings: integer("total_ratings").default(0),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => [
    index("country_scores_product_country_idx").on(table.productId, table.countryCode),
  ]
);

// AdFlow Campaigns - Billboard promotions
export const adflowCampaigns = pgTable("adflow_campaigns", {
  id: serial("id").primaryKey(),
  productId: integer("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  ownerId: integer("owner_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  campaignType: varchar("campaign_type", { length: 20 }).notNull(),
  budget: decimal("budget", { precision: 10, scale: 2 }),
  impressions: integer("impressions").default(0),
  startsAt: timestamp("starts_at").notNull(),
  endsAt: timestamp("ends_at").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Product Followers - Users following products (Prodo Groups)
export const productFollowers = pgTable(
  "product_followers",
  {
    id: serial("id").primaryKey(),
    productId: integer("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => [
    index("product_followers_product_idx").on(table.productId),
    index("product_followers_user_idx").on(table.userId),
  ]
);

// Consumer Watchlist - Products consumers are tracking
export const watchlist = pgTable(
  "watchlist",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    productId: integer("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => [
    index("watchlist_user_idx").on(table.userId),
    index("watchlist_product_idx").on(table.productId),
  ]
);

// Types for TypeScript
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Session = typeof sessions.$inferSelect;
export type VerificationToken = typeof verificationTokens.$inferSelect;
export type PasswordResetToken = typeof passwordResetTokens.$inferSelect;
export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type Rating = typeof ratings.$inferSelect;
export type NewRating = typeof ratings.$inferInsert;
export type PriceHistory = typeof priceHistory.$inferSelect;
export type CountryScore = typeof countryScores.$inferSelect;
export type AdflowCampaign = typeof adflowCampaigns.$inferSelect;
export type Watchlist = typeof watchlist.$inferSelect;
