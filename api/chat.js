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

        console.log('Gemini Request Received. API Key length:', apiKey.length);

        const { contents, generationConfig, system_instruction } = req.body;

        const genAI = new GoogleGenerativeAI(apiKey);

        // System instruction goes in model initialization, not generateContent
        const modelConfig = {
            model: 'gemini-1.5-flash',
            safetySettings: [
                { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
                { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
                { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
                { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' }
            ]
        };

        // Add system instruction to model config if provided
        if (system_instruction && system_instruction.parts && system_instruction.parts[0]) {
            modelConfig.systemInstruction = system_instruction.parts[0].text;
        }

        const model = genAI.getGenerativeModel(modelConfig);

        console.log('Sending to Gemini SDK...');

        // Generate content with just contents and generationConfig
        const result = await model.generateContent({
            contents: contents || [],
            generationConfig: generationConfig || {}
        });

        const response = await result.response;
        const text = response.text();

        console.log('Gemini Response Success, length:', text.length);
        return res.status(200).json({
            candidates: [{
                content: {
                    parts: [{ text }]
                }
            }]
        });
    } catch (error) {
        console.error('GEMINI SDK CRITICAL ERROR:', error.message);
        console.error('Full error:', JSON.stringify(error, null, 2));
        return res.status(500).json({
            error: error.message,
            code: error.code || 'UNKNOWN'
        });
    }
};
