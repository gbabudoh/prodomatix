import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { retailers } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import crypto from "crypto";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const newApiKey = `rtl_${crypto.randomBytes(24).toString("hex")}`;
    const newWebhookSecret = `whsec_${crypto.randomBytes(16).toString("hex")}`;

    const [updated] = await db
      .update(retailers)
      .set({ apiKey: newApiKey, webhookSecret: newWebhookSecret })
      .where(eq(retailers.id, id))
      .returning();

    return NextResponse.json({ success: true, retailer: updated });
  } catch (error) {
    console.error("Failed to regenerate key:", error);
    return NextResponse.json({ error: "Failed to regenerate key" }, { status: 500 });
  }
}
