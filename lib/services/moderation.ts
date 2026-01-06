import { ChatGroq } from "@langchain/groq";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import OpenAI from "openai";

// --- Fallback: Local Rule-Based Moderation ---
function localRegexModeration(title: string, content: string, rating: number) {
  const combined = `${title} ${content}`.toLowerCase();
  
  // Basic profanity filter
  const badWords = ["fuck", "shit", "ass", "bitch", "damn"]; // Minimal list for demo
  const hasProfanity = badWords.some(word => combined.includes(word));

  if (hasProfanity) {
    return {
      status: "rejected",
      sentiment: "negative",
      reason: "Local Rule: Profanity detected.",
      tags: ["Policy Violation"]
    };
  }

  // Basic sentiment approximation
  const positiveWords = ["love", "great", "excellent", "good", "amazing", "best", "perfect"];
  const negativeWords = ["bad", "terrible", "worst", "awful", "horrible", "broken", "failed"];

  let score = 0;
  positiveWords.forEach(w => { if (combined.includes(w)) score++; });
  negativeWords.forEach(w => { if (combined.includes(w)) score--; });

  let sentiment: "positive" | "neutral" | "negative" = "neutral";
  if (score > 0 || rating >= 4) sentiment = "positive";
  else if (score < 0 || rating <= 2) sentiment = "negative";

  return {
    status: "pending", // Default to pending for human review if AI is down
    sentiment,
    reason: "Processed via Local Fallback (AI Provider Rate Limited/Unavailable).",
    tags: ["Local Scan"]
  };
}

// --- Pass 1: Safety (High-Speed) ---
async function safetyCheck(content: string) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.warn("Skipping Pass 1 (Safety): OPENAI_API_KEY missing.");
    return { flagged: false, categories: [] };
  }

  try {
    const openai = new OpenAI({ apiKey, maxRetries: 0 }); // Fail fast
    const response = await openai.moderations.create({ input: content });
    const result = response.results[0];
    
    // Flatten categories that are true
    const flaggedCategories = Object.entries(result.categories)
      .filter(([, value]) => value)
      .map(([key]) => key);

    return { 
      flagged: result.flagged, 
      categories: flaggedCategories 
    };
  } catch (err) {
    console.error("Pass 1: Safety Check Failed:", err);
    return { flagged: false, categories: [] }; // Fail open or closed based on policy
  }
}

// --- Pass 2: Deep Reasoning (Insight) ---
const getModel = () => {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is missing");
  }
  return new ChatGroq({
    apiKey: process.env.GROQ_API_KEY,
    model: "llama-3.3-70b-versatile",
    temperature: 0,
    maxRetries: 0, // Fail fast during rate limits
  });
};

const moderationPrompt = PromptTemplate.fromTemplate(`
You are an expert content moderator for an e-commerce platform. 
Analyze the following product review and determine if it should be approved, rejected, or needs manual review (pending).

Input:
Rating: {rating} / 5
Title: {title}
Content: {content}

REJECTION CRITERIA:
- Profanity or offensive language.
- Obvious spam or promotional content for other products.
- Gibberish or irrelevant content.
- Hate speech or harassment.

PENDING CRITERIA:
- Highly suspicious content that might be fake but isn't obvious spam.
- Content that mentions competitors in a way that needs human verification.
- **RATING MISMATCH**: The sentiment of the text strongly contradicts the numeric rating (e.g., 5 stars but "Terrible product", or 1 star but "I love it").

TASKS:
1. Assign a status: "approved", "rejected", or "pending".
2. Extract the sentiment: "positive", "neutral", or "negative".
3. Provide a brief reason if rejected or pending (specifically mention "Rating Mismatch" if applicable).
4. Extract key tags (e.g., "Quality", "Price", "Shipping").

Return the result as a raw JSON object with the following keys:
"status", "sentiment", "reason", "tags" (array of strings).
Do not include any other text in your response.
`);

export async function moderateReview(title: string, content: string, rating: number) {
  // Pass 1: Safety Check
  const safety = await safetyCheck(content);
  if (safety.flagged) {
    return {
      status: "rejected",
      sentiment: "negative",
      reason: `Flagged by AI Safety: ${safety.categories.join(", ")}`,
      tags: ["Policy Violation"],
    };
  }

  // Pass 2: Deep Reasoning
  try {
    const model = getModel();
    const chain = moderationPrompt.pipe(model).pipe(new StringOutputParser());
    const response = await chain.invoke({ title, content, rating: rating.toString() });
    
    const cleanedResponse = response.replace(/```json|```/g, "").trim();
    return JSON.parse(cleanedResponse);
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    if (errorMsg.includes("429") || errorMsg.includes("rate_limit")) {
      console.warn("Moderation AI: Rate limit reached. Using local fallback.");
    } else {
      console.error("Moderation AI error (Falling back to local rules):", errorMsg);
    }
    return localRegexModeration(title, content, rating);
  }
}
