import { db } from "../src/db/index";
import { sql } from "drizzle-orm";

async function resetDatabase() {
  console.log("🗑️  Dropping existing tables...\n");

  try {
    // Drop all tables in the public schema
    await db.execute(sql`
      DO $$ DECLARE
        r RECORD;
      BEGIN
        FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
          EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
        END LOOP;
      END $$;
    `);

    console.log("✅ All tables dropped successfully!");
    console.log("\nNow run: npm run db:push && npm run db:seed");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Failed to reset database:", error);
    process.exit(1);
  }
}

resetDatabase();
