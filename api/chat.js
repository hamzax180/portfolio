const axios = require('axios');

export default async function handler(req, res) {
    // Vercel handles CORS and environment variables automatically
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const apiKey = process.env.GEMINI_API_KEY;
        const model = 'gemini-1.5-flash-latest';
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

        // Add safety settings to ensure consistent conversational flow
        const bodyWithSafety = {
            ...req.body,
            safetySettings: [
                { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
                { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
                { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
                { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' }
            ]
        };

        console.log('Vercel Function: Proxying request to Gemini...');
        const response = await axios.post(url, bodyWithSafety, {
            headers: { 'Content-Type': 'application/json' }
        });

        return res.status(200).json(response.data);
    } catch (error) {
        console.error('Gemini Proxy Error (Vercel):', error.response?.data || error.message);
        return res.status(error.response?.status || 500).json(error.response?.data || { error: 'Internal Server Error' });
    }
}
