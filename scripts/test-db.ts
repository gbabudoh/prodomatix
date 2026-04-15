import { db } from "../src/db/index";
import { users } from "../src/db/schema";
import { eq } from "drizzle-orm";

async function testConnection() {
  console.log("Testing database connection...\n");
  
  const start = Date.now();
  
  try {
    // Test 1: Simple query
    const queryStart = Date.now();
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, "cosumer@demo.com"))
      .limit(1);
    
    console.log(`✓ Query completed in ${Date.now() - queryStart}ms`);
    console.log(`  Found user: ${user?.name || "Not found"}`);
    
    console.log(`\n✓ Total time: ${Date.now() - start}ms`);
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Connection failed:", error);
    process.exit(1);
  }
}

testConnection();
