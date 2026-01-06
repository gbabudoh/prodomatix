import { ChatGroq } from "@langchain/groq";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { db } from "@/lib/db";
import { products, reviews } from "@/lib/db/schema";
import { eq, desc, and } from "drizzle-orm";

const getModel = () => {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is missing");
  }
  return new ChatGroq({
    apiKey: process.env.GROQ_API_KEY,
    model: "llama-3.3-70b-versatile",
    temperature: 0.2, // Slightly creative for summaries
    maxRetries: 0,
  });
};

const summaryPrompt = PromptTemplate.fromTemplate(`
You are an expert product analyst. Review the following customer feedback for a product and synthesize a concise summary.

REVIEWS:
{reviews}

TASKS:
1. Identify the top 3 Pros (recurring positive themes).
2. Identify the top 3 Cons (recurring negative themes).
3. Write a 1-sentence Verdict summarizing the general consensus.

Return the result as a raw JSON object with the following keys:
"pros" (array of strings), "cons" (array of strings), "verdict" (string).
Do not include any other text in your response.
`);

export async function generateProductSummary(productId: string) {
  try {
    // 1. Fetch recent approved reviews (last 20)
    const recentReviews = await db.query.reviews.findMany({
      where: and(eq(reviews.productId, productId), eq(reviews.status, "approved")),
      orderBy: [desc(reviews.createdAt)],
      limit: 20,
    });

    if (recentReviews.length < 3) {
      return null; // Not enough data for a meaningful summary
    }

    // 2. Format reviews for the prompt
    const reviewText = recentReviews
      .map((r) => `- Rating: ${r.rating}/5. "${r.content}"`)
      .join("\n");

    // 3. Generate Summary
    const model = getModel();
    const chain = summaryPrompt.pipe(model).pipe(new StringOutputParser());
    const response = await chain.invoke({ reviews: reviewText });
    
    const cleanedResponse = response.replace(/```json|```/g, "").trim();
    const summaryData = JSON.parse(cleanedResponse);

    // 4. Save to Database
    await db
      .update(products)
      .set({ 
        aiSummary: JSON.stringify(summaryData),
        updatedAt: new Date(), 
      })
      .where(eq(products.id, productId));

    return summaryData;

  } catch (error) {
    console.error("AI Summary generation failed:", error);
    return null;
  }
}
