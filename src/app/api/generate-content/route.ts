import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: NextRequest) {
  try {
    const { prompt, type = "script", language = "ar" } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: {
        role: "system",
        parts: [{ text: `أنت خبير في الإنتاج الإعلامي وصناعة المحتوى (Media Production Expert). 
        وظيفتك هي تحويل المعلومات الخام إلى محتوى إعلامي احترافي.
        عند تقديم "خبر خام"، يجب أن تقوم بتوليد:
        1. سكريبت تلفزيوني/إذاعي احترافي (Professional TV/Radio Script).
        2. مشاهد بصرية مقترحة (Suggested visual scenes / Video B-roll) توضع بين أقواس مربعة مثل [مشهد: ...].
        3. نص التعليق الصوتي (Voice-over text) يوضع بين أقواس مثل (صوت المذيع: ...).
        
        كما يمكنك تحويل المحتوى إلى تنسيقات أخرى:
        - تقرير إخباري (News Report): أسلوب رصين وموضوعي.
        - هوك لسوشيال ميديا (Social Media Hook): قصير، جذاب، ومثير للاهتمام.
        - أسئلة مقابلة (Interview Questions): قائمة من 5 أسئلة للمسؤولين تتعلق بالخبر.
        
        يمكنك أيضاً إعادة صياغة أو ترجمة المحتوى مع الحفاظ على النبرة الصحفية.
        أجب دائماً باللغة المطلوبة (${language}) وبأسلوب احترافي.` }]
      }
    });

    let finalPrompt = prompt;
    if (type === "news-report") {
      finalPrompt = `حول هذا المحتوى إلى تقرير إخباري رصين وموضوعي: ${prompt}`;
    } else if (type === "social-hook") {
      finalPrompt = `حول هذا المحتوى إلى هوك (Hook) جذاب للسوشيال ميديا: ${prompt}`;
    } else if (type === "interview") {
      finalPrompt = `بناءً على هذا الخبر، اقترح 5 أسئلة ذكية لمقابلة المسؤولين: ${prompt}`;
    } else if (type === "translate") {
      finalPrompt = `ترجم هذا المحتوى إلى اللغة ${language} مع الحفاظ على النبرة الصحفية والاحترافية: ${prompt}`;
    } else if (type === "script") {
      finalPrompt = `حول هذه المعلومة الخام إلى سكريبت متكامل (سكريبت، مشاهد، صوت مذيع): ${prompt}`;
    }

    const result = await model.generateContent(finalPrompt);
    const response = await result.response;
    const text = response.text();
    
    return NextResponse.json({ response: text });
  } catch (error: any) {
    console.error("AI Production Studio Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
