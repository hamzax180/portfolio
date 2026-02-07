const axios = require('axios');

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const apiKey = process.env.GEMINI_API_KEY;
        const url = `https://gateway.ai.cloudflare.com/v1/e6cb60143ddb10f4779652736b6cd451/h-a-m-z-a-s-s-i-s-t-a-n-t/openai/chat/completions`;

        if (!apiKey) {
            console.error('Vercel Config Error: GEMINI_API_KEY is missing');
            return res.status(500).json({ error: 'API Key not configured on server' });
        }

        // The frontend sends Gemini-formatted contents
        // messages: [{ role: 'user', parts: [{ text: '...' }] }, ...]
        const messages = req.body.contents.map((msg, index) => ({
            // If it's the first message, treat as system if we want
            // but the frontend specifically puts the system prompt as the first message
            role: index === 0 ? 'system' : (msg.role === 'model' ? 'assistant' : 'user'),
            content: msg.parts[0].text
        }));

        const requestBody = {
            model: 'openai/gpt-5.2', // User specified model ID
            messages: messages,
            temperature: 0.7
        };

        console.log('Forwarding to AI Gateway...', {
            model: requestBody.model,
            numMessages: messages.length
        });

        const response = await axios.post(url, requestBody, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            timeout: 10000 // 10s timeout for gateway
        });

        // Map OpenAI back to Gemini format for frontend
        return res.status(200).json({
            candidates: [{
                content: {
                    parts: [{ text: response.data.choices[0].message.content }]
                }
            }]
        });

    } catch (error) {
        console.error('AI Gateway Proxy Error Details:', error.response?.data || error.message);

        const status = error.response?.status || 500;
        const errorBody = error.response?.data || { error: error.message };

        return res.status(status).json({
            error: 'Gateway Communication Failed',
            details: errorBody,
            message: error.message
        });
    }
}
