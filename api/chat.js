const axios = require('axios');

export default async function handler(req, res) {
    // Vercel handles CORS and environment variables automatically
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const apiKey = process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY;

        if (!apiKey) {
            console.error('Vercel Function: Missing API Key in environment variables.');
            return res.status(500).json({
                error: 'Configuration Error',
                details: 'API Key is not configured on the server.'
            });
        }

        // Cloudflare AI Gateway URL (OpenAI compatible)
        const url = `https://gateway.ai.cloudflare.com/v1/e6cb60143ddb10f4779652736b6cd451/h-a-m-z-a-s-s-i-s-t-a-n-t/openai/chat/completions`;

        // Map Gemini-style request from frontend to OpenAI-style for Gateway
        const messages = (req.body.contents || []).map((c, index) => ({
            role: index === 0 ? 'system' : (c.role === 'user' ? 'user' : 'assistant'),
            content: c.parts?.[0]?.text || ''
        }));

        if (messages.length === 0) {
            return res.status(400).json({ error: 'Invalid Request', details: 'No messages provided' });
        }

        console.log('Vercel Function: Proxying request to AI Gateway...', {
            model: 'gpt-4o-mini',
            messageCount: messages.length
        });

        const response = await axios.post(url, {
            model: 'gpt-4o-mini',
            messages: messages,
            temperature: 0.7,
            max_tokens: 500
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            timeout: 10000 // 10 second timeout for the upstream request
        });

        // Map back to the candidate format the frontend expects
        const botMessage = response.data?.choices?.[0]?.message?.content || "I'm sorry, I couldn't process that.";

        return res.status(200).json({
            candidates: [{
                content: {
                    parts: [{ text: botMessage }]
                }
            }]
        });
    } catch (error) {
        const status = error.response?.status || 500;
        const errorBody = error.response?.data || { error: error.message };

        console.error(`AI Gateway Proxy Error (${status}):`, JSON.stringify(errorBody));

        return res.status(status).json({
            error: 'AI Gateway Request Failed',
            details: errorBody
        });
    }
}
