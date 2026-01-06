
import { ChatGroq } from "@langchain/groq";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";

const getModel = () => {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is missing");
  }
  return new ChatGroq({
    apiKey: process.env.GROQ_API_KEY,
    model: "llama-3.3-70b-versatile",
    temperature: 0.2,
    maxRetries: 0,
  });
};

const INTELLIGENCE_PROMPT = `
You are the Prodomatix AI Intelligence Engine. Your task is to analyze customer reviews and generate an executive monthly report.

DATA PROVIDED:
- Positive Reviews (Top Snippets): {positiveReviews}
- Negative Reviews (Top Snippets): {negativeReviews}
- Retailers Analyzed: {retailers}

OUTPUT FORMAT:
Return ONLY a JSON object with the following structure:
{{
  "aiInsights": {{
    "winner": {{ "title": "string", "insight": "string", "recommendation": "string" }},
    "friction": {{ "title": "string", "insight": "string", "recommendation": "string" }},
    "opportunity": {{ "title": "string", "insight": "string", "recommendation": "string" }}
  }},
  "retailerInsights": {{ "RetailerName": "string" }},
  "benchmarks": [
    {{ "metric": "Price Satisfaction", "value": "15%", "status": "higher" }},
    {{ "metric": "Customer Service", "value": "22%", "status": "higher" }},
    {{ "metric": "Reliability", "value": "5%", "status": "lower" }}
  ],
  "actionItems": [
    {{ "title": "string", "desc": "string" }},
    {{ "title": "string", "desc": "string" }},
    {{ "title": "string", "desc": "string" }}
  ]
}}

RULES:
1. Winner: Identify the strongest positive theme. Suggest how to use it in marketing.
2. Friction: Identify the most common complaint. Suggest a tactical fix.
3. Opportunity: Identify a missing feature or "wish list" item.
4. Benchmarks: Estimate these based on the tone of reviews compared to general industry standards.
5. Retailer Insights: Provide a 1-sentence behavioral insight for each retailer based on reviews from that source.
6. Professional, data-driven, and "Executive" tone.

JSON:
`;

export async function generateintelligenceReport(data: {
  positiveReviews: string[];
  negativeReviews: string[];
  retailers: string[];
}) {
  try {
    const model = getModel();
    const prompt = PromptTemplate.fromTemplate(INTELLIGENCE_PROMPT);
    
    const chain = prompt.pipe(model).pipe(new StringOutputParser());

    const response = await chain.invoke({
      positiveReviews: data.positiveReviews.join("\n- "),
      negativeReviews: data.negativeReviews.join("\n- "),
      retailers: data.retailers.join(", "),
    });

    const cleaned = response.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleaned);
  } catch (error) {
    console.error("AI Intelligence Report failed (Rate limit or parse error):", error);
    return null;
  }
}
