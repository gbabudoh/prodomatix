import postgres from "postgres";

const connStr = "postgres://postgres:LetMeGetaces232823@109.205.181.195:5432/postgres";
const sql = postgres(connStr);

async function createDb() {
  console.log("Creating 'prodomatix' database...");
  try {
    await sql`CREATE DATABASE prodomatix`;
    console.log("Database 'prodomatix' created successfully.");
  } catch (err) {
    if (err && typeof err === "object" && "code" in err && err.code === "42P04") {
      console.log("Database 'prodomatix' already exists.");
    } else {
      console.error("Failed to create database:", err);
    }
  } finally {
    await sql.end();
  }
}

createDb();
