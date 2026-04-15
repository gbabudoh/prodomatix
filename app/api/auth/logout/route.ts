import { logoutUser } from "@/lib/auth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;

    if (token) {
      await logoutUser(token);
    }

    cookieStore.delete("session");

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Logout failed" }, { status: 500 });
  }
}
