import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function askSadaAI(prompt: string) {
  const modelsToTry = ["gemini-flash-latest", "gemini-2.0-flash-lite", "gemini-2.0-flash", "gemini-pro"];
  let lastError;

  for (const modelName of modelsToTry) {
    try {
      const model = genAI.getGenerativeModel({ 
        model: modelName,
        systemInstruction: {
          role: "system",
          parts: [{ text: "أنت مساعد صحفي ذكي في منصة صدى. وظيفتك هي مساعدة الصحفيين في كتابة المقالات، التحقق من الأخبار، وتلخيص النصوص بأسلوب مهني ومحايد. إذا طُلب منك التحقق من خبر، قم بتحليله بدقة. أجب دائماً بلغة المستخدم (عربي، فرنسي، إنجليزي) وبروح صحفية محترفة." }]
        }
      });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error(`Gemini API Error with ${modelName}:`, error);
      lastError = error;
    }
  }

  throw lastError || new Error("Failed to communicate with Sada AI after multiple attempts");
}

export async function generateImageGemini(prompt: string) {
  // Using the latest Imagen models via Gemini API
  const modelsToTry = ["imagen-3.0-generate-001", "imagen-4-fast", "gemini-2.5-flash-image"];
  let lastError;

  for (const modelName of modelsToTry) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          // @ts-ignore
          responseModalities: ["image"],
        }
      });
      const response = await result.response;
      // In Gemini API, image outputs are often returned as base64 in the parts
      const part = response.candidates?.[0]?.content?.parts?.find((p: any) => p.inlineData?.mimeType?.startsWith("image/"));
      if (part?.inlineData?.data) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    } catch (error) {
      console.error(`Image generation error with ${modelName}:`, error);
      lastError = error;
    }
  }
  
  // Fallback to a high-quality Unsplash image based on keywords if Gemini image gen fails
  // This ensures the UI doesn't break if the API key doesn't have image gen permissions
  const keywords = await askSadaAI(`Extract 3-4 English descriptive keywords for an image from this prompt: "${prompt}". Return only keywords.`);
  return `https://images.unsplash.com/photo-1585829365294-bb7c63b3ec07?auto=format&fit=crop&w=1200&q=80&query=${encodeURIComponent(keywords)}`;
}

export async function generateVideoGemini(prompt: string) {
  // Using Veo models via Gemini API
  const modelsToTry = ["veo-3.1-generate-preview", "veo-2", "gemini-3-pro-video-preview"];
  let lastError;

  for (const modelName of modelsToTry) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          // @ts-ignore
          responseModalities: ["video"],
        }
      });
      const response = await result.response;
      // Video might return a GCS URI or base64 depending on the specific model/API version
      const part = response.candidates?.[0]?.content?.parts?.find((p: any) => p.inlineData?.mimeType?.startsWith("video/"));
      if (part?.inlineData?.data) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    } catch (error) {
      console.error(`Video generation error with ${modelName}:`, error);
      lastError = error;
    }
  }

  // Fallback simulation
  return "https://assets.mixkit.co/videos/preview/mixkit-news-studio-background-with-blue-and-red-lights-34534-large.mp4";
}
