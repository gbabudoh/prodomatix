import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

// Create a connection pool with timeout settings
const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ||
    "postgresql://postgres:postgres@localhost:5432/prodomatix",
  // Connection pool settings
  max: 10, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 10000, // Return an error after 10 seconds if connection could not be established
});

// Handle pool errors
pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
});

// Create the drizzle instance with schema
export const db = drizzle(pool, { schema });

// Export schema for convenience
export * from "./schema";
