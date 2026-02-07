const { GoogleGenerativeAI } = require('@google/generative-ai');

module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const apiKey = (process.env.GEMINI_API_KEY || '').trim();
        if (!apiKey) {
            console.error('SERVER ERROR: GEMINI_API_KEY is missing');
            return res.status(500).json({ error: 'GEMINI_API_KEY is not configured on the server.' });
        }

        console.log('Gemini Request Received. API Key present (length):', apiKey.length);

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: 'gemini-1.5-flash',
            safetySettings: [
                { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
                { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
                { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
                { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' }
            ]
        });

        const { contents, generationConfig, system_instruction } = req.body;

        console.log('Sending to Gemini SDK...');
        const result = await model.generateContent({
            contents: contents || [],
            generationConfig: generationConfig || {},
            systemInstruction: system_instruction || undefined
        });

        const response = await result.response;
        const text = response.text();

        console.log('Gemini Response Success');
        return res.status(200).json({
            candidates: [{
                content: {
                    parts: [{ text }]
                }
            }]
        });
    } catch (error) {
        console.error('GEMINI SDK CRITICAL ERROR:', error);
        return res.status(500).json({
            error: error.message,
            stack: error.stack
        });
    }
};
