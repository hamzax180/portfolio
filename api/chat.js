const axios = require('axios');

export default async function handler(req, res) {
    // Vercel handles CORS and environment variables automatically
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const apiKey = process.env.GEMINI_API_KEY;
        // User provided Cloudflare AI Gateway URL
        const url = `https://gateway.ai.cloudflare.com/v1/e6cb60143ddb10f4779652736b6cd451/h-a-m-z-a-s-s-i-s-t-a-n-t/openai/chat/completions`;

        const requestBody = {
            model: 'gpt-4o-mini', // Guaranteed stable model for OpenAI gateway
            messages: req.body.contents.map(c => ({
                role: c.role === 'user' ? 'user' : 'assistant',
                content: c.parts[0].text
            })),
            temperature: 0.7
        };

        console.log('Vercel Function: Proxying request to AI Gateway...', {
            url: url,
            model: requestBody.model,
            hasKey: !!apiKey
        });

        const response = await axios.post(url, requestBody, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            }
        });

        // Convert OpenAI format back to the format the frontend expects or simplify it
        return res.status(200).json({
            candidates: [{
                content: {
                    parts: [{ text: response.data.choices[0].message.content }]
                }
            }]
        });
    } catch (error) {
        console.error('AI Gateway Proxy Error:', error.response?.data || error.message);
        const errorDetail = error.response?.data || { error: error.message };
        return res.status(error.response?.status || 500).json({
            error: 'AI Gateway Request Failed',
            details: errorDetail
        });
    }
}
