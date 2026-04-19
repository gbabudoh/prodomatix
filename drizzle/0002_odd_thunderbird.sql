ALTER TABLE "user_behavior" ADD COLUMN "intensity_score" numeric(10, 2) DEFAULT '0.00';--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "intent_class" varchar(30) DEFAULT 'explorer';--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "churn_risk" numeric(5, 2) DEFAULT '0.00';