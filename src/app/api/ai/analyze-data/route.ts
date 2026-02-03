import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Try using gemini-1.5-flash-latest which is often more reliable
const MODEL_NAME = "gemini-1.5-flash-latest";

// Explicitly use v1 if v1beta fails, but SDK defaults to v1beta for some features.
// We can try to initialize with v1 to see if it fixes the 404.
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: NextRequest) {
  try {
    const { dataContent, fileName, fileType, fileData, mimeType, inputType, url } = await req.json();

    if (!dataContent && !fileData && !url) {
      return NextResponse.json({ error: "Content, file or URL is required" }, { status: 400 });
    }

    // Initialize model
    const model = genAI.getGenerativeModel({ 
      model: MODEL_NAME,
systemInstruction: {
role: "system",
parts: [{ text: `أنت خبير فائق الذكاء في صحافة البيانات والتحليل الإعلامي الاستقصائي (Advanced Data Journalism & investigative Media Analysis). 
مهمتك هي تحويل البيانات الخام والوسائط إلى قصص صحفية ذات أثر عميق ورؤى استراتيجية.
يجب أن ترجع النتيجة بتنسيق JSON حصرياً يحتوي على الحقول التالية:
1. "summary": ملخص صحفي استراتيجي (3-5 جمل) يركز على "لماذا هذا مهم الآن؟" و "ما هي القصة المخفية؟".
2. "insights": مصفوفة من أهم 5 رؤى عميقة (Deep Insights) تشمل: الاتجاهات المكتشفة، المفارقات، العلاقات بين المتغيرات، والتوقعات المستقبلية.
3. "chartData": مصفوفة من الكائنات تحتوي على "category" (نص قصير ومعبر) و "value" (رقم دقيق مستخرج أو نسبي) لتمثيل البيانات بصرياً بأفضل شكل ممكن.
4. "chartType": نوع الرسم البياني الأنسب لعرض هذه القصة المحددة (bar, line, pie, area).
5. "suggestedTitle": عنوان صحفي مثير للاهتمام، مهني، ومبتكر (Catchy & Professional).
6. "humanImpact": جملة قصيرة توضح كيف تؤثر هذه البيانات على حياة الناس اليومية.
7. "investigativeQuestion": سؤال استقصائي للمستقبل بناءً على هذه البيانات.
    34
قواعد صارمة:
- إذا كانت البيانات رقمية، استخرج الأرقام بدقة.
- إذا كانت البيانات نصية/صوتية، حلل النبرة (Sentiment) والتكرارات والمواضيع الرئيسية لتمثيلها رقمياً في الرسم البياني.
- ابحث دائماً عن "الارتباطات غير المتوقعة" (Anomalies & Correlations).
- أجب دائماً باللغة العربية الفصحى الرصينة.
- لا تضف أي نص خارج كائن JSON.` }]
}
    });

    let promptParts: any[] = [];

    if (inputType === 'text' && dataContent) {
      promptParts.push({ text: `قم بتحليل هذا المحتوى النصي:\n\n${dataContent}` });
    } else if (inputType === 'file' && fileData) {
      promptParts.push({
        inlineData: {
          data: fileData,
          mimeType: mimeType || 'application/octet-stream'
        }
      });
      promptParts.push({ text: `هذا الملف هو (${fileName}) بنوع (${mimeType}). قم بتحليل محتواه بعمق واستخرج البيانات والقصة الصحفية منه.` });
    } else if (inputType === 'url' && url) {
      try {
        const response = await fetch(url);
        if (response.ok) {
          const html = await response.text();
          const bodyText = html
            .replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gmi, '')
            .replace(/<style\b[^>]*>([\s\S]*?)<\/style>/gmi, '')
            .replace(/<[^>]+>/g, ' ')
            .replace(/\s+/g, ' ')
            .trim()
            .slice(0, 30000);

          promptParts.push({ text: `قم بتحليل هذا المحتوى المستخرج من الرابط (${url}):\n\n${bodyText}` });
        } else {
          promptParts.push({ text: `حلل محتوى هذا الرابط واستخرج أهم البيانات منه: ${url}` });
        }
      } catch (fetchError) {
        promptParts.push({ text: `حلل محتوى هذا الرابط: ${url}` });
      }
    } else if (dataContent) {
        promptParts.push({ text: dataContent });
    }

    promptParts.push({ text: "تذكر أن ترد بتنسيق JSON فقط." });

    const result = await model.generateContent({ contents: [{ role: 'user', parts: promptParts }] });
    const aiResponse = await result.response;
    const text = aiResponse.text();
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
        return NextResponse.json({ error: "فشل استخراج البيانات من رد الذكاء الاصطناعي" }, { status: 500 });
    }

    try {
        const jsonResponse = JSON.parse(jsonMatch[0]);
        return NextResponse.json(jsonResponse);
    } catch (parseError) {
        return NextResponse.json({ error: "خطأ في معالجة البيانات المستخرجة" }, { status: 500 });
    }

  } catch (error: any) {
    console.error("Data Analysis Error:", error);
    let errorMessage = error.message || "حدث خطأ غير متوقع أثناء التحليل";
    if (errorMessage.includes("404")) {
        errorMessage = "نموذج Gemini (1.5 Flash) غير متاح حالياً لهذا المفتاح أو المنطقة. حاول استخدام مفتاح آخر أو تأكد من إعدادات المشروع في Google AI Studio.";
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
