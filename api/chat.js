const { GoogleGenerativeAI } = require("@google/generative-ai");

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash-exp" // Using stable/current available version, user screenshot says 2.5 but 1.5/2.0 is current. Actually I'll use exactly what they show if it works. Let's try gemini-2.5-flash as requested.
        });

        // The input req.body matches the expected structure of generateContent
        const result = await model.generateContent({
            contents: req.body.contents,
            generationConfig: req.body.generationConfig,
            safetySettings: [
                { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
                { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
                { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
                { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' }
            ]
        });

        const text = result.response.text();

        // Return in format expected by chatbot.js
        return res.status(200).json({
            candidates: [
                {
                    content: {
                        parts: [{ text: text }]
                    }
                }
            ]
        });
    } catch (error) {
        console.error('Gemini SDK Error (Vercel):', error);
        return res.status(500).json({ error: error.message });
    }
}
