import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { retailers } from "@/lib/db/schema";
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
    const { webhookUrl } = await req.json();

    const [updated] = await db
      .update(retailers)
      .set({ webhookUrl: webhookUrl || null })
      .where(eq(retailers.id, id))
      .returning();

    return NextResponse.json({ success: true, retailer: updated });
  } catch (error) {
    console.error("Failed to update settings:", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
