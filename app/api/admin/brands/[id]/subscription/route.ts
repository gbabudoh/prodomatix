import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { brands } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { tier, status, website } = await req.json();

    const [updated] = await db
      .update(brands)
      .set({ 
        subscriptionTier: tier,
        subscriptionStatus: status,
        website: website || null,
        updatedAt: new Date(),
      })
      .where(eq(brands.id, id))
      .returning();

    return NextResponse.json({ success: true, brand: updated });
  } catch (error) {
    console.error("Failed to update subscription:", error);
    return NextResponse.json({ error: "Failed to update subscription" }, { status: 500 });
  }
}
