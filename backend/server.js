const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
    res.status(200).send('OK');
});

// Proxy endpoint for Gemini API

app.post('/api/chat', async (req, res) => {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        // User provided Cloudflare AI Gateway URL
        const url = `https://gateway.ai.cloudflare.com/v1/e6cb60143ddb10f4779652736b6cd451/h-a-m-z-a-s-s-i-s-t-a-n-t/openai/chat/completions`;

        const requestBody = {
            model: 'openai/gpt-5.2',
            messages: req.body.contents.map(c => ({
                role: c.role === 'user' ? 'user' : 'assistant',
                content: c.parts[0].text
            })),
            temperature: 0.7
        };

        console.log('Proxying request to AI Gateway...');
        const response = await axios.post(url, requestBody, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            }
        });

        // Convert OpenAI format back to the format the frontend expects or simplify it
        res.json({
            candidates: [{
                content: {
                    parts: [{ text: response.data.choices[0].message.content }]
                }
            }]
        });
    } catch (error) {
        console.error('AI Gateway Proxy Error:', error.response?.data || error.message);
        res.status(error.response?.status || 500).json(error.response?.data || { error: 'Internal Server Error' });
    }
});

app.listen(PORT, () => {
    console.log(`Backend proxy running on http://localhost:${PORT}`);
});
