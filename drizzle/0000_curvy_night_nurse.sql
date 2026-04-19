CREATE TABLE "adflow_campaigns" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer NOT NULL,
	"owner_id" integer NOT NULL,
	"campaign_type" varchar(20) NOT NULL,
	"budget" numeric(10, 2),
	"impressions" integer DEFAULT 0,
	"starts_at" timestamp NOT NULL,
	"ends_at" timestamp NOT NULL,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "country_scores" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer NOT NULL,
	"country_code" varchar(2) NOT NULL,
	"average_score" numeric(4, 2),
	"total_ratings" integer DEFAULT 0,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "location_recommendations" (
	"id" serial PRIMARY KEY NOT NULL,
	"country_code" varchar(2) NOT NULL,
	"product_id" integer NOT NULL,
	"popularity_score" numeric(6, 2) DEFAULT '0',
	"local_rating_count" integer DEFAULT 0,
	"local_avg_score" numeric(4, 2),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "npb_nsb_listings" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer NOT NULL,
	"owner_id" integer NOT NULL,
	"listing_type" varchar(10) NOT NULL,
	"featured_image" text,
	"short_description" varchar(200),
	"purchase_location" text,
	"sentiment_discount" varchar(100) NOT NULL,
	"discount_code" varchar(50),
	"discount_expires_at" timestamp,
	"external_url" text,
	"impressions" integer DEFAULT 0,
	"clicks" integer DEFAULT 0,
	"ratings_from_listing" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"starts_at" timestamp DEFAULT now(),
	"ends_at" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "password_reset_tokens" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"token" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"used" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "password_reset_tokens_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "price_history" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer NOT NULL,
	"price" numeric(4, 2) NOT NULL,
	"volume" integer DEFAULT 0,
	"recorded_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "product_followers" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"ticker" varchar(10) NOT NULL,
	"description" text,
	"category" varchar(50),
	"image_url" text,
	"owner_id" integer NOT NULL,
	"current_price" numeric(4, 2) DEFAULT '5.00',
	"previous_price" numeric(4, 2) DEFAULT '5.00',
	"price_change" numeric(4, 2) DEFAULT '0.00',
	"price_change_percent" numeric(5, 2) DEFAULT '0.00',
	"total_ratings" integer DEFAULT 0,
	"status" varchar(20) DEFAULT 'active',
	"is_adflow_promoted" boolean DEFAULT false,
	"adflow_expires_at" timestamp,
	"has_dividend_badge" boolean DEFAULT false,
	"dividend_streak_days" integer DEFAULT 0,
	"item_type" varchar(20) DEFAULT 'product',
	"is_in_npb_nsb" boolean DEFAULT false,
	"npb_nsb_expires_at" timestamp,
	"purchase_url" text,
	"external_page_url" text,
	"sentiment_discount" varchar(100),
	"sentiment_discount_code" varchar(50),
	"brand_name" varchar(100),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "products_ticker_unique" UNIQUE("ticker")
);
--> statement-breakpoint
CREATE TABLE "ratings" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer NOT NULL,
	"user_id" integer,
	"country_code" varchar(2) DEFAULT 'US' NOT NULL,
	"statement" varchar(100) NOT NULL,
	"satisfaction" integer NOT NULL,
	"quality" integer NOT NULL,
	"feel" integer NOT NULL,
	"trendy" integer NOT NULL,
	"speculation" integer NOT NULL,
	"weighted_score" numeric(4, 2),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "sentiment_trends" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer NOT NULL,
	"period" varchar(20) NOT NULL,
	"avg_sentiment" numeric(4, 2),
	"rating_count" integer DEFAULT 0,
	"trend_direction" varchar(10),
	"trend_strength" numeric(4, 2),
	"recorded_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"token" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "sessions_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user_behavior" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"product_id" integer,
	"action_type" varchar(30) NOT NULL,
	"duration" integer,
	"metadata" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_brand_preferences" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"brand_name" varchar(100) NOT NULL,
	"owner_id" integer,
	"interaction_count" integer DEFAULT 0,
	"avg_rating_given" numeric(4, 2),
	"is_following" boolean DEFAULT false,
	"last_interaction" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_category_preferences" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"category" varchar(50) NOT NULL,
	"interaction_count" integer DEFAULT 0,
	"avg_rating_given" numeric(4, 2),
	"last_interaction" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" text NOT NULL,
	"name" varchar(100) NOT NULL,
	"role" varchar(20) DEFAULT 'consumer' NOT NULL,
	"avatar_url" text,
	"country_code" varchar(2) DEFAULT 'US',
	"is_verified" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification_tokens" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"token" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "verification_tokens_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "watchlist" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"product_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "adflow_campaigns" ADD CONSTRAINT "adflow_campaigns_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "adflow_campaigns" ADD CONSTRAINT "adflow_campaigns_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "country_scores" ADD CONSTRAINT "country_scores_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "location_recommendations" ADD CONSTRAINT "location_recommendations_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "npb_nsb_listings" ADD CONSTRAINT "npb_nsb_listings_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "npb_nsb_listings" ADD CONSTRAINT "npb_nsb_listings_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "price_history" ADD CONSTRAINT "price_history_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_followers" ADD CONSTRAINT "product_followers_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_followers" ADD CONSTRAINT "product_followers_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ratings" ADD CONSTRAINT "ratings_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ratings" ADD CONSTRAINT "ratings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sentiment_trends" ADD CONSTRAINT "sentiment_trends_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_behavior" ADD CONSTRAINT "user_behavior_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_behavior" ADD CONSTRAINT "user_behavior_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_brand_preferences" ADD CONSTRAINT "user_brand_preferences_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_brand_preferences" ADD CONSTRAINT "user_brand_preferences_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_category_preferences" ADD CONSTRAINT "user_category_preferences_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "verification_tokens" ADD CONSTRAINT "verification_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "watchlist" ADD CONSTRAINT "watchlist_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "watchlist" ADD CONSTRAINT "watchlist_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "country_scores_product_country_idx" ON "country_scores" USING btree ("product_id","country_code");--> statement-breakpoint
CREATE INDEX "location_rec_country_idx" ON "location_recommendations" USING btree ("country_code");--> statement-breakpoint
CREATE INDEX "location_rec_product_idx" ON "location_recommendations" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "location_rec_popularity_idx" ON "location_recommendations" USING btree ("popularity_score");--> statement-breakpoint
CREATE INDEX "npb_nsb_product_idx" ON "npb_nsb_listings" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "npb_nsb_owner_idx" ON "npb_nsb_listings" USING btree ("owner_id");--> statement-breakpoint
CREATE INDEX "npb_nsb_type_idx" ON "npb_nsb_listings" USING btree ("listing_type");--> statement-breakpoint
CREATE INDEX "npb_nsb_active_idx" ON "npb_nsb_listings" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "password_reset_tokens_token_idx" ON "password_reset_tokens" USING btree ("token");--> statement-breakpoint
CREATE INDEX "password_reset_tokens_user_idx" ON "password_reset_tokens" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "price_history_product_id_idx" ON "price_history" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "price_history_recorded_at_idx" ON "price_history" USING btree ("recorded_at");--> statement-breakpoint
CREATE INDEX "product_followers_product_idx" ON "product_followers" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "product_followers_user_idx" ON "product_followers" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "products_ticker_idx" ON "products" USING btree ("ticker");--> statement-breakpoint
CREATE INDEX "products_status_idx" ON "products" USING btree ("status");--> statement-breakpoint
CREATE INDEX "products_current_price_idx" ON "products" USING btree ("current_price");--> statement-breakpoint
CREATE INDEX "products_owner_idx" ON "products" USING btree ("owner_id");--> statement-breakpoint
CREATE INDEX "products_item_type_idx" ON "products" USING btree ("item_type");--> statement-breakpoint
CREATE INDEX "products_npb_nsb_idx" ON "products" USING btree ("is_in_npb_nsb");--> statement-breakpoint
CREATE INDEX "products_brand_idx" ON "products" USING btree ("brand_name");--> statement-breakpoint
CREATE INDEX "ratings_product_id_idx" ON "ratings" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "ratings_user_id_idx" ON "ratings" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "ratings_country_code_idx" ON "ratings" USING btree ("country_code");--> statement-breakpoint
CREATE INDEX "ratings_created_at_idx" ON "ratings" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "sentiment_trends_product_idx" ON "sentiment_trends" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "sentiment_trends_period_idx" ON "sentiment_trends" USING btree ("period");--> statement-breakpoint
CREATE INDEX "sentiment_trends_recorded_idx" ON "sentiment_trends" USING btree ("recorded_at");--> statement-breakpoint
CREATE INDEX "sessions_token_idx" ON "sessions" USING btree ("token");--> statement-breakpoint
CREATE INDEX "sessions_user_idx" ON "sessions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_behavior_user_idx" ON "user_behavior" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_behavior_product_idx" ON "user_behavior" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "user_behavior_action_idx" ON "user_behavior" USING btree ("action_type");--> statement-breakpoint
CREATE INDEX "user_behavior_created_idx" ON "user_behavior" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "user_brand_pref_user_idx" ON "user_brand_preferences" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_brand_pref_brand_idx" ON "user_brand_preferences" USING btree ("brand_name");--> statement-breakpoint
CREATE INDEX "user_brand_pref_owner_idx" ON "user_brand_preferences" USING btree ("owner_id");--> statement-breakpoint
CREATE INDEX "user_category_pref_user_idx" ON "user_category_preferences" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_category_pref_category_idx" ON "user_category_preferences" USING btree ("category");--> statement-breakpoint
CREATE INDEX "users_email_idx" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "users_role_idx" ON "users" USING btree ("role");--> statement-breakpoint
CREATE INDEX "verification_tokens_token_idx" ON "verification_tokens" USING btree ("token");--> statement-breakpoint
CREATE INDEX "verification_tokens_user_idx" ON "verification_tokens" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "watchlist_user_idx" ON "watchlist" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "watchlist_product_idx" ON "watchlist" USING btree ("product_id");