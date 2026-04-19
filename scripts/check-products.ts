import { db } from "../src/db";
import { products } from "../src/db/schema";

async function checkProducts() {
  try {
    const allProducts = await db.select().from(products).limit(10);
    console.log("Products found:", allProducts.length);
    if (allProducts.length > 0) {
      console.log("Sample products:");
      allProducts.forEach((p) => {
        console.log(`  - ${p.id}: ${p.ticker} - ${p.name}`);
      });
    } else {
      console.log("No products in database. You may need to seed the database.");
    }
  } catch (e) {
    console.error("Error:", e);
  }
  process.exit(0);
}

checkProducts();
