import { NextRequest, NextResponse } from "next/server";
import { askSadaAI, generateImageGemini, generateVideoGemini } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const { prompt, type = "text" } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    let response;
    if (type === "image") {
      response = await generateImageGemini(prompt);
    } else if (type === "video") {
      response = await generateVideoGemini(prompt);
    } else {
      response = await askSadaAI(prompt);
    }
    
    return NextResponse.json({ response });
  } catch (error: any) {
    console.error("AI API Route Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
