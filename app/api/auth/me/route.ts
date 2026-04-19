import { getCurrentUser } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        countryCode: user.countryCode,
        avatarUrl: user.avatarUrl,
        isVerified: user.isVerified,
        alphaScore: user.alphaScore,
        tier: user.tier,
        siteCredits: user.siteCredits,
        claimableAlpha: user.claimableAlpha,
        createdAt: user.createdAt,
      },
    });
  } catch {
    return NextResponse.json({ error: "Failed to get user" }, { status: 500 });
  }
}
