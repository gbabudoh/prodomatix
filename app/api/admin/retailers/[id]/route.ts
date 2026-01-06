import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { retailers } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    await db.delete(retailers).where(eq(retailers.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete retailer:", error);
    return NextResponse.json({ error: "Failed to delete retailer" }, { status: 500 });
  }
}
