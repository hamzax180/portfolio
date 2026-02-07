const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
    res.status(200).send('OK');
});

// Proxy endpoint for Gemini API using official SDK
app.post('/api/chat', async (req, res) => {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        console.log('Proxying request to Gemini via SDK...');
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
        res.json({
            candidates: [
                {
                    content: {
                        parts: [{ text: text }]
                    }
                }
            ]
        });
    } catch (error) {
        console.error('Gemini SDK Error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Backend proxy running on http://localhost:${PORT}`);
});
