import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { retailers } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const session = await auth();
    
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, website } = await req.json();

    if (!name) {
      return NextResponse.json({ error: "Store name is required" }, { status: 400 });
    }

    // Generate API key for the retailer
    const apiKey = `rtl_${crypto.randomBytes(24).toString("hex")}`;
    const webhookSecret = `whsec_${crypto.randomBytes(16).toString("hex")}`;

    // Create the retailer
    const [newRetailer] = await db
      .insert(retailers)
      .values({
        name,
        website: website || null,
        apiKey,
        webhookSecret,
      })
      .returning();

    return NextResponse.json({ 
      success: true, 
      message: "Retailer added successfully",
      retailer: newRetailer 
    });
  } catch (error) {
    console.error("Failed to add retailer:", error);
    return NextResponse.json({ error: "Failed to add retailer" }, { status: 500 });
  }
}
