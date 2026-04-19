import { NextResponse } from "next/server";
import { db } from "@/db";
import { userBehavior, users, products } from "@/db/schema";
import { eq, and, desc, sql, inArray } from "drizzle-orm";
import { cookies } from "next/headers";
import { validateSession } from "@/lib/auth";
import { classifyUserIntent, type IntentClass } from "@/lib/behaviour";

interface UserGroup {
  userId: number;
  name: string;
  avatar: string | null;
  tier: string | null;
  totalIntensity: number;
  actions: { actionType: string; duration: number | null }[];
  productsInteracted: Set<string>;
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;
    const session = token ? await validateSession(token) : null;

    if (!session || session.role !== 'owner') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1. Get all products owned by this user
    const ownerProducts = await db
      .select({ id: products.id })
      .from(products)
      .where(eq(products.ownerId, session.id));

    if (ownerProducts.length === 0) {
      return NextResponse.json({ insights: [] });
    }

    const productIds = ownerProducts.map(p => p.id);

    // 2. Aggregate high-intensity behavior for these products
    // We want to find the "Top Intent" scouts/buyers
    const recentBehavior = await db
      .select({
        userId: userBehavior.userId,
        userName: users.name,
        userAvatar: users.avatarUrl,
        userTier: users.tier,
        productId: userBehavior.productId,
        productName: products.name,
        actionType: userBehavior.actionType,
        intensity: userBehavior.intensityScore,
        duration: userBehavior.duration,
        createdAt: userBehavior.createdAt,
      })
      .from(userBehavior)
      .innerJoin(users, eq(userBehavior.userId, users.id))
      .innerJoin(products, eq(userBehavior.productId, products.id))
      .where(
        and(
          inArray(userBehavior.productId, productIds),
          sql`${userBehavior.createdAt} > now() - interval '24 hours'`
        )
      )
      .orderBy(desc(userBehavior.intensityScore))
      .limit(50);

    // 3. Group by user to classify intent
    const userGroups: Record<number, UserGroup> = {};
    
    recentBehavior.forEach(record => {
      if (!userGroups[record.userId]) {
        userGroups[record.userId] = {
          userId: record.userId,
          name: record.userName,
          avatar: record.userAvatar,
          tier: record.userTier,
          totalIntensity: 0,
          actions: [],
          productsInteracted: new Set()
        };
      }
      
      userGroups[record.userId].totalIntensity += parseFloat(record.intensity || '0');
      userGroups[record.userId].actions.push({
        actionType: record.actionType,
        duration: record.duration
      });
      userGroups[record.userId].productsInteracted.add(record.productName);
    });

    const insights = Object.values(userGroups).map(group => {
      const intent: IntentClass = classifyUserIntent(group.actions);
      return {
        userId: group.userId,
        name: group.name,
        avatar: group.avatar,
        tier: group.tier,
        intent,
        totalIntensity: Math.round(group.totalIntensity * 100) / 100,
        interactedWith: Array.from(group.productsInteracted),
        lastActive: new Date() // Simplified for now
      };
    }).sort((a, b) => b.totalIntensity - a.totalIntensity);

    return NextResponse.json({
      summary: {
        totalIntenseUsers: insights.length,
        topIntent: insights[0]?.intent || 'explorer'
      },
      insights: insights.slice(0, 10)
    });
  } catch (error) {
    console.error("Business Insights API Error:", error);
    return NextResponse.json({ error: "Failed to fetch insights" }, { status: 500 });
  }
}
