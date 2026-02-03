const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY);

app.post('/api/verify-news', async (req, res) => {
  const { headline } = req.body;
  console.log('Received news:', headline);

  if (!headline) {
    return res.status(400).json({ success: false, error: "Headline is required" });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Analyze this news headline for accuracy and ethics: "${headline}". 
    Return ONLY a raw JSON object with these keys: {"verdict": "صحيح/زائف/مضلل", "confidence": "90%", "details": "explanation in Arabic", "correction": "corrected news in Arabic"}. 
    Do not include markdown blocks like \`\`\`json or any other text.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text().replace(/```json|```/gi, '').trim();
    
    console.log('Gemini raw response:', text);
    
    const resultJson = JSON.parse(text);
    res.json({ success: true, ...resultJson });

  } catch (error) {
    console.error('Fact-Check Error:', error);
    res.status(500).json({ 
      success: false, 
      error: "Connection Error",
      details: "تعذر الاتصال بالمحرك، حاول مجدداً"
    });
  }
});

const PORT = 5005;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Fact-Check Backend running on port ${PORT}`);
});
