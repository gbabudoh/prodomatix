ALTER TABLE "ratings" ADD COLUMN "entry_price" numeric(4, 2);--> statement-breakpoint
ALTER TABLE "ratings" ADD COLUMN "rater_position" integer DEFAULT 1;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "alpha_score" numeric(10, 2) DEFAULT '0.00';--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "total_alpha" numeric(12, 2) DEFAULT '0.00';--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "accuracy_rating" numeric(5, 2) DEFAULT '50.00';--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "tier" varchar(20) DEFAULT 'bronze';