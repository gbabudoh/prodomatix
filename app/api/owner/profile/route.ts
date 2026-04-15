import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";

// PATCH - Update owner profile
export async function PATCH(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (user.role !== "owner" && user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { name, countryCode } = await request.json();

    const updateData: { name?: string; countryCode?: string; updatedAt: Date } = {
      updatedAt: new Date(),
    };

    if (name && typeof name === "string" && name.trim().length > 0) {
      updateData.name = name.trim();
    }

    if (countryCode && typeof countryCode === "string" && countryCode.length === 2) {
      updateData.countryCode = countryCode.toUpperCase();
    }

    const [updatedUser] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, user.id))
      .returning({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
        countryCode: users.countryCode,
        avatarUrl: users.avatarUrl,
        isVerified: users.isVerified,
        createdAt: users.createdAt,
      });

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error("Failed to update profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
