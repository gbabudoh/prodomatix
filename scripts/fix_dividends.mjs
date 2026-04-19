import pkg from 'pg';
const { Client } = pkg;

const client = new Client({
  connectionString: 'postgresql://postgres:LetMeGetaces232823@109.205.181.195:5432/prodomatix'
});

const sql = `
  -- Add missing Scout and Financial fields to users table
  ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "alpha_score" numeric(10, 2) DEFAULT 0.00;
  ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "total_alpha" numeric(12, 2) DEFAULT 0.00;
  ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "accuracy_rating" numeric(5, 2) DEFAULT 50.00;
  ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "tier" varchar(20) DEFAULT 'bronze';
  ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "site_credits" numeric(12, 2) DEFAULT 0.00;
  ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "claimable_alpha" numeric(12, 2) DEFAULT 0.00;

  -- Create dividend_claims table if it doesn't exist
  CREATE TABLE IF NOT EXISTS "dividend_claims" (
    "id" serial PRIMARY KEY,
    "user_id" integer NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "alpha_amount" numeric(12, 2) NOT NULL,
    "credit_amount" numeric(12, 2) NOT NULL,
    "conversion_rate" numeric(5, 2) DEFAULT 0.10,
    "claimed_at" timestamp DEFAULT now()
  );

  -- Add indexes for performance
  CREATE INDEX IF NOT EXISTS "dividend_claims_user_idx" ON "dividend_claims" ("user_id");
  CREATE INDEX IF NOT EXISTS "dividend_claims_date_idx" ON "dividend_claims" ("claimed_at");
`;

async function run() {
  try {
    await client.connect();
    console.log('Connected to DB');
    await client.query(sql);
    console.log('Financial and Scout fields/tables added successfully');
  } catch (err) {
    console.error('Error adding fields:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

run();
