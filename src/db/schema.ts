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
    // Scout System Fields
    alphaScore: decimal("alpha_score", { precision: 10, scale: 2 }).default("0.00"),
    totalAlpha: decimal("total_alpha", { precision: 12, scale: 2 }).default("0.00"),
    accuracyRating: decimal("accuracy_rating", { precision: 5, scale: 2 }).default("50.00"),
    tier: varchar("tier", { length: 20 }).default("bronze"), // 'bronze' | 'silver' | 'gold'
    intentClass: varchar("intent_class", { length: 30 }).default("explorer"), // 'explorer', 'shopper', 'buyer', 'scout'
    churnRisk: decimal("churn_risk", { precision: 5, scale: 2 }).default("0.00"),
    // Financial Wallet Fields
    siteCredits: decimal("site_credits", { precision: 12, scale: 2 }).default("0.00"),
    claimableAlpha: decimal("claimable_alpha", { precision: 12, scale: 2 }).default("0.00"),
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
    // Product or Service type
    itemType: varchar("item_type", { length: 20 }).default("product"), // 'product' | 'service'
    // NPB/NSB Fields - New Products/Services Bank
    isInNpbNsb: boolean("is_in_npb_nsb").default(false), // Listed in New Products/Services Bank
    npbNsbExpiresAt: timestamp("npb_nsb_expires_at"),
    purchaseUrl: text("purchase_url"), // Where to buy this product/service
    externalPageUrl: text("external_page_url"), // Link to company page
    sentimentDiscount: varchar("sentiment_discount", { length: 100 }), // Discount offered for rating
    sentimentDiscountCode: varchar("sentiment_discount_code", { length: 50 }), // Discount code
    brandName: varchar("brand_name", { length: 100 }), // Brand for Brand Algorithm
    // IPS Share Issuance Fields
    totalShares: decimal("total_shares", { precision: 15, scale: 2 }).default("0.00"),
    availableShares: decimal("available_shares", { precision: 15, scale: 2 }).default("0.00"),
    initialSharePrice: decimal("initial_share_price", { precision: 10, scale: 2 }).default("5.00"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => [
    index("products_ticker_idx").on(table.ticker),
    index("products_status_idx").on(table.status),
    index("products_current_price_idx").on(table.currentPrice),
    index("products_owner_idx").on(table.ownerId),
    index("products_item_type_idx").on(table.itemType),
    index("products_npb_nsb_idx").on(table.isInNpbNsb),
    index("products_brand_idx").on(table.brandName),
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
    // Scout Tracking
    entryPrice: decimal("entry_price", { precision: 4, scale: 2 }), // Price at time of rating
    raterPosition: integer("rater_position").default(1), // n-th person to rate
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

// ============================================
// ALGORITHM TRACKING TABLES
// ============================================

// User Behavior Tracking - For Behaviour Algorithm
export const userBehavior = pgTable(
  "user_behavior",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    productId: integer("product_id")
      .references(() => products.id, { onDelete: "cascade" }),
    actionType: varchar("action_type", { length: 30 }).notNull(), // 'view', 'click', 'rate', 'watchlist_add', 'share', 'purchase_click'
    duration: integer("duration"), // Time spent in seconds (for views)
    intensityScore: decimal("intensity_score", { precision: 10, scale: 2 }).default("0.00"),
    metadata: text("metadata"), // JSON string for additional data
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => [
    index("user_behavior_user_idx").on(table.userId),
    index("user_behavior_product_idx").on(table.productId),
    index("user_behavior_action_idx").on(table.actionType),
    index("user_behavior_created_idx").on(table.createdAt),
  ]
);

// User Category Preferences - For Product/Service Preference Algorithm
export const userCategoryPreferences = pgTable(
  "user_category_preferences",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    category: varchar("category", { length: 50 }).notNull(),
    interactionCount: integer("interaction_count").default(0),
    avgRatingGiven: decimal("avg_rating_given", { precision: 4, scale: 2 }),
    lastInteraction: timestamp("last_interaction").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => [
    index("user_category_pref_user_idx").on(table.userId),
    index("user_category_pref_category_idx").on(table.category),
  ]
);

// User Brand Preferences - For Brand Algorithm
export const userBrandPreferences = pgTable(
  "user_brand_preferences",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    brandName: varchar("brand_name", { length: 100 }).notNull(),
    ownerId: integer("owner_id")
      .references(() => users.id, { onDelete: "cascade" }),
    interactionCount: integer("interaction_count").default(0),
    avgRatingGiven: decimal("avg_rating_given", { precision: 4, scale: 2 }),
    isFollowing: boolean("is_following").default(false),
    lastInteraction: timestamp("last_interaction").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => [
    index("user_brand_pref_user_idx").on(table.userId),
    index("user_brand_pref_brand_idx").on(table.brandName),
    index("user_brand_pref_owner_idx").on(table.ownerId),
  ]
);

// Sentiment Trends - For Sentiment Algorithm
export const sentimentTrends = pgTable(
  "sentiment_trends",
  {
    id: serial("id").primaryKey(),
    productId: integer("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    period: varchar("period", { length: 20 }).notNull(), // 'hourly', 'daily', 'weekly'
    avgSentiment: decimal("avg_sentiment", { precision: 4, scale: 2 }),
    ratingCount: integer("rating_count").default(0),
    trendDirection: varchar("trend_direction", { length: 10 }), // 'up', 'down', 'stable'
    trendStrength: decimal("trend_strength", { precision: 4, scale: 2 }), // 0-10 scale
    recordedAt: timestamp("recorded_at").defaultNow(),
  },
  (table) => [
    index("sentiment_trends_product_idx").on(table.productId),
    index("sentiment_trends_period_idx").on(table.period),
    index("sentiment_trends_recorded_idx").on(table.recordedAt),
  ]
);

// Location-Based Recommendations - For Location Algorithm
export const locationRecommendations = pgTable(
  "location_recommendations",
  {
    id: serial("id").primaryKey(),
    countryCode: varchar("country_code", { length: 2 }).notNull(),
    productId: integer("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    popularityScore: decimal("popularity_score", { precision: 6, scale: 2 }).default("0"),
    localRatingCount: integer("local_rating_count").default(0),
    localAvgScore: decimal("local_avg_score", { precision: 4, scale: 2 }),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => [
    index("location_rec_country_idx").on(table.countryCode),
    index("location_rec_product_idx").on(table.productId),
    index("location_rec_popularity_idx").on(table.popularityScore),
  ]
);

// NPB/NSB Listings - New Products/Services Bank
export const npbNsbListings = pgTable(
  "npb_nsb_listings",
  {
    id: serial("id").primaryKey(),
    productId: integer("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    ownerId: integer("owner_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    listingType: varchar("listing_type", { length: 10 }).notNull(), // 'npb' | 'nsb'
    featuredImage: text("featured_image"),
    shortDescription: varchar("short_description", { length: 200 }),
    purchaseLocation: text("purchase_location"), // Where to buy
    sentimentDiscount: varchar("sentiment_discount", { length: 100 }).notNull(), // Required discount
    discountCode: varchar("discount_code", { length: 50 }),
    discountExpiresAt: timestamp("discount_expires_at"),
    externalUrl: text("external_url"), // Link to company page
    impressions: integer("impressions").default(0),
    clicks: integer("clicks").default(0),
    ratingsFromListing: integer("ratings_from_listing").default(0),
    isActive: boolean("is_active").default(true),
    startsAt: timestamp("starts_at").defaultNow(),
    endsAt: timestamp("ends_at"),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => [
    index("npb_nsb_product_idx").on(table.productId),
    index("npb_nsb_owner_idx").on(table.ownerId),
    index("npb_nsb_type_idx").on(table.listingType),
    index("npb_nsb_active_idx").on(table.isActive),
  ]
);

// Dividend Claims History - Track Alpha to Credit conversions
export const dividendClaims = pgTable(
  "dividend_claims",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    alphaAmount: decimal("alpha_amount", { precision: 12, scale: 2 }).notNull(),
    creditAmount: decimal("credit_amount", { precision: 12, scale: 2 }).notNull(),
    conversionRate: decimal("conversion_rate", { precision: 5, scale: 2 }).default("0.10"), // 10 Alpha = 1 Credit
    claimedAt: timestamp("claimed_at").defaultNow(),
  },
  (table) => [
    index("dividend_claims_user_idx").on(table.userId),
    index("dividend_claims_date_idx").on(table.claimedAt),
  ]
);

// User Shares - Current portfolio holdings
export const userShares = pgTable(
  "user_shares",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    productId: integer("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    quantity: decimal("quantity", { precision: 15, scale: 2 }).notNull().default("0.00"),
    avgPurchasePrice: decimal("avg_purchase_price", { precision: 10, scale: 4 }).default("0.0000"),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => [
    index("user_shares_user_idx").on(table.userId),
    index("user_shares_product_idx").on(table.productId),
    index("user_shares_user_product_idx").on(table.userId, table.productId),
  ]
);

// Share Transactions - Audit log of all share movements
export const shareTransactions = pgTable(
  "share_transactions",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    productId: integer("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    type: varchar("type", { length: 20 }).notNull(), // 'BUY', 'SELL', 'BONUS', 'GRANT'
    quantity: decimal("quantity", { precision: 15, scale: 2 }).notNull(),
    pricePerShare: decimal("price_per_share", { precision: 10, scale: 4 }).notNull(),
    totalValue: decimal("total_value", { precision: 15, scale: 2 }).notNull(),
    performanceAtTime: decimal("performance_at_time", { precision: 10, scale: 2 }), // Current Prodo Score at time
    timestamp: timestamp("timestamp").defaultNow(),
  },
  (table) => [
    index("share_tx_user_idx").on(table.userId),
    index("share_tx_product_idx").on(table.productId),
    index("share_tx_type_idx").on(table.type),
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
export type UserBehavior = typeof userBehavior.$inferSelect;
export type NewUserBehavior = typeof userBehavior.$inferInsert;
export type UserCategoryPreference = typeof userCategoryPreferences.$inferSelect;
export type UserBrandPreference = typeof userBrandPreferences.$inferSelect;
export type SentimentTrend = typeof sentimentTrends.$inferSelect;
export type LocationRecommendation = typeof locationRecommendations.$inferSelect;
export type NpbNsbListing = typeof npbNsbListings.$inferSelect;
export type NewNpbNsbListing = typeof npbNsbListings.$inferInsert;
export type DividendClaim = typeof dividendClaims.$inferSelect;
export type NewDividendClaim = typeof dividendClaims.$inferInsert;
export type UserShare = typeof userShares.$inferSelect;
export type NewUserShare = typeof userShares.$inferInsert;
export type ShareTransaction = typeof shareTransactions.$inferSelect;
export type NewShareTransaction = typeof shareTransactions.$inferInsert;
