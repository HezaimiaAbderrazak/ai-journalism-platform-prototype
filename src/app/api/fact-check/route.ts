import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { headline } = await req.json();

    if (!headline) {
      return NextResponse.json({ success: false, error: "Headline is required" }, { status: 400 });
    }

    const modelsToTry = ["gemini-2.0-flash", "gemini-flash-latest", "gemini-2.0-flash-lite", "gemini-1.5-flash"];
    let result;
    let lastError;

    for (const modelName of modelsToTry) {
      try {
        const model = genAI.getGenerativeModel({ 
          model: modelName,
          systemInstruction: {
            role: "system",
            parts: [{ text: "You are a professional fact-checker for Sada News. Analyze headlines for accuracy and ethical standards in Algeria. Return JSON only." }]
          }
        });

        const prompt = `Analyze this news headline for truthfulness and ethics: "${headline}"
        
        Return ONLY a raw JSON object with these keys:
        - verdict: (صحيح ✅, زائف ❌, مضلل ⚠️, or غير مهني 🚫)
        - confidence: string (e.g. "95%")
        - details: explanation in Arabic (2 sentences)
        - correction: the correct version of the news in Arabic
        - ethics_check: "آمن" or "غير آمن" (based on Algerian values/hate speech)
        
        No markdown, no backticks. Just raw JSON.`;

        const resultObj = await model.generateContent(prompt);
        result = resultObj;
        if (result) break;
      } catch (err) {
        console.error(`Failed with model ${modelName}:`, err);
        lastError = err;
      }
    }

    if (!result) throw lastError;

    const response = await result.response;
    const text = response.text().replace(/```json|```/gi, '').trim();
    
    const analysisResult = JSON.parse(text);

    return NextResponse.json({ success: true, ...analysisResult });

  } catch (error) {
    console.error("Fact Checker API Error:", error);
    return NextResponse.json({ 
      success: false, 
      reply: "نعتذر، واجه محرك صدى التقني ضغطاً مؤقتاً." 
    }, { status: 500 });
  }
}
