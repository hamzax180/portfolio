const { GoogleGenerativeAI } = require('@google/generative-ai');

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const apiKey = process.env.GEMINI_API_KEY;
        const genAI = new GoogleGenerativeAI(apiKey);
        const modelName = 'gemini-1.5-flash';

        const model = genAI.getGenerativeModel({
            model: modelName,
            safetySettings: [
                { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
                { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
                { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
                { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' }
            ]
        });

        console.log('Vercel Function: Generating content via SDK...');

        // Extract contents and generationConfig from request
        const { contents, generationConfig, system_instruction } = req.body;

        // Use generateContent for a clean stateless response
        const result = await model.generateContent({
            contents,
            generationConfig,
            system_instruction
        });

        const response = await result.response;
        const data = {
            candidates: [
                {
                    content: {
                        parts: [{ text: response.text() }]
                    }
                }
            ]
        };

        return res.status(200).json(data);
    } catch (error) {
        console.error('Gemini SDK Error (Vercel):', error.message);
        return res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
}
