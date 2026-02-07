import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const apiKey = (process.env.GEMINI_API_KEY || '').trim();
        if (!apiKey) {
            throw new Error('GEMINI_API_KEY is not set or empty');
        }

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

        // Ensure contents is an array and formatted correctly
        const result = await model.generateContent({
            contents: Array.isArray(contents) ? contents : [],
            generationConfig: generationConfig || {},
            systemInstruction: system_instruction || undefined
        });

        const response = await result.response;
        const text = response.text();

        return res.status(200).json({
            candidates: [{
                content: {
                    parts: [{ text }]
                }
            }]
        });
    } catch (error) {
        console.error('Gemini SDK Error (Vercel):', error.message);
        return res.status(500).json({
            error: error.message || 'Internal Server Error',
            details: error.stack
        });
    }
}
