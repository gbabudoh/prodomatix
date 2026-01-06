
import { ChatGroq } from "@langchain/groq";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

const getModel = () => {
    if (!process.env.GROQ_API_KEY) {
      throw new Error("GROQ_API_KEY is missing");
    }
    return new ChatGroq({
      apiKey: process.env.GROQ_API_KEY,
      model: "llama-3.3-70b-versatile",
      temperature: 0.3, // Professional but slightly warm
      maxRetries: 0,
    });
};

const replyPrompt = PromptTemplate.fromTemplate(`
You are a senior customer success manager for a premium brand.
Draft a short, professional, and empathetic response to the following customer review.

Review:
Rating: {rating}/5
Reviewer: {reviewerName}
Content: "{content}"

GUIDELINES:
- Address the customer by name if provided.
- Thank them for the feedback.
- If negative: Apologize specifically for the issues mentioned (e.g., "Sorry to hear about the packaging").
- If positive: Thank them for their support.
- Keep it under 50 words.
- Sign off as "The {brandName} Team".

Draft Response:
`);

export async function generateDraftResponse(
  content: string, 
  rating: number, 
  reviewerName: string = "Customer",
  brandName: string = "Prodomatix"
) {
  try {
    const model = getModel();
    const chain = replyPrompt.pipe(model).pipe(new StringOutputParser());
    
    const response = await chain.invoke({ 
        content, 
        rating: rating.toString(),
        reviewerName, 
        brandName 
    });

    return response.trim().replace(/^"|"$/g, ''); // Remove quotes if model adds them
  } catch (error) {
    console.error("Auto-Reply Generation Failed:", error);
    return null;
  }
}
