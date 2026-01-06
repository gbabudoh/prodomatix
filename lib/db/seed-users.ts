
import { db } from "./index";
import { users } from "./schema";
import bcrypt from "bcryptjs";

async function seedUsers() {
  console.log("🌱 Seeding users...");

  // Hash passwords
  const adminPassword = await bcrypt.hash("admin1234X", 10);
  const userPassword = await bcrypt.hash("testuser1234X", 10);

  // Create admin account
  const [admin] = await db
    .insert(users)
    .values({
      name: "Super Admin",
      email: "admin@prodomatix.com",
      password: adminPassword,
      role: "admin",
    })
    .returning();

  console.log(`✅ Created admin: ${admin.email} (${admin.id})`);

  // Create regular user account
  const [user] = await db
    .insert(users)
    .values({
      name: "Test User",
      email: "user1@test.com",
      password: userPassword,
      role: "user",
    })
    .returning();

  console.log(`✅ Created user: ${user.email} (${user.id})`);

  console.log("\n🎉 User seeding complete!");
  console.log("\n📋 Login Credentials:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("Admin Login (http://localhost:3000/admin/login):");
  console.log("  Email: admin@prodomatix.com");
  console.log("  Password: admin1234X");
  console.log("\nUser Login (http://localhost:3000/login):");
  console.log("  Email: user1@test.com");
  console.log("  Password: testuser1234X");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  process.exit(0);
}

seedUsers().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
