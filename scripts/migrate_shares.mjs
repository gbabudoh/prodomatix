import pkg from 'pg';
const { Client } = pkg;

const client = new Client({
  connectionString: 'postgresql://postgres:LetMeGetaces232823@109.205.181.195:5432/prodomatix'
});

const sql = `
  -- Update products table with share fields
  ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "total_shares" numeric(15, 2) DEFAULT 0.00;
  ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "available_shares" numeric(15, 2) DEFAULT 0.00;
  ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "initial_share_price" numeric(10, 2) DEFAULT 5.00;

  -- Create user_shares table
  CREATE TABLE IF NOT EXISTS "user_shares" (
    "id" serial PRIMARY KEY,
    "user_id" integer NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "product_id" integer NOT NULL REFERENCES "products"("id") ON DELETE CASCADE,
    "quantity" numeric(15, 2) NOT NULL DEFAULT 0.00,
    "avg_purchase_price" numeric(10, 4) DEFAULT 0.0000,
    "updated_at" timestamp DEFAULT now()
  );

  -- Create share_transactions table
  CREATE TABLE IF NOT EXISTS "share_transactions" (
    "id" serial PRIMARY KEY,
    "user_id" integer NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "product_id" integer NOT NULL REFERENCES "products"("id") ON DELETE CASCADE,
    "type" varchar(20) NOT NULL,
    "quantity" numeric(15, 2) NOT NULL,
    "price_per_share" numeric(10, 4) NOT NULL,
    "total_value" numeric(15, 2) NOT NULL,
    "performance_at_time" numeric(10, 2),
    "timestamp" timestamp DEFAULT now()
  );

  -- Add indexes
  CREATE INDEX IF NOT EXISTS "user_shares_user_idx" ON "user_shares" ("user_id");
  CREATE INDEX IF NOT EXISTS "user_shares_product_idx" ON "user_shares" ("product_id");
  CREATE INDEX IF NOT EXISTS "user_shares_user_product_idx" ON "user_shares" ("user_id", "product_id");
  CREATE INDEX IF NOT EXISTS "share_tx_user_idx" ON "share_transactions" ("user_id");
  CREATE INDEX IF NOT EXISTS "share_tx_product_idx" ON "share_transactions" ("product_id");
  CREATE INDEX IF NOT EXISTS "share_tx_type_idx" ON "share_transactions" ("type");

  -- Initialize some dummy supply for existing IPS products
  UPDATE "products" 
  SET "total_shares" = 1000000.00, "available_shares" = 1000000.00 
  WHERE "status" = 'ipo' AND "total_shares" = 0;
`;

async function run() {
  try {
    await client.connect();
    console.log('Connected to DB');
    await client.query(sql);
    console.log('Share system tables and fields added successfully');
  } catch (err) {
    console.error('Error migrating shares schema:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

run();
