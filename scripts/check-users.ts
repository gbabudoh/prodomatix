import { db } from "../src/db";
import { users } from "../src/db/schema";

async function checkUsers() {
  try {
    const allUsers = await db.select().from(users);
    console.log("Users found:", allUsers.length);
    allUsers.forEach((user) => {
      console.log(`  - ${user.id}: ${user.email} (${user.role}) - verified: ${user.isVerified}`);
    });
  } catch (error) {
    console.error("Error:", error);
  }
  process.exit(0);
}

checkUsers();
