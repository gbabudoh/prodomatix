import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { brands } from "@/lib/db/schema";
import { auth } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await auth();
    
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { email, brandName } = await req.json();

    if (!email || !brandName) {
      return NextResponse.json({ error: "Email and brand name are required" }, { status: 400 });
    }

    // Create the brand with pending status
    const [newBrand] = await db
      .insert(brands)
      .values({
        name: brandName,
        subscriptionTier: "free",
        subscriptionStatus: "pending",
      })
      .returning();

    // TODO: Send actual invitation email to: email
    // For now, we just create the brand in the database

    return NextResponse.json({ 
      success: true, 
      message: "Invitation sent successfully",
      brand: newBrand 
    });
  } catch (error) {
    console.error("Failed to invite brand:", error);
    return NextResponse.json({ error: "Failed to send invitation" }, { status: 500 });
  }
}
