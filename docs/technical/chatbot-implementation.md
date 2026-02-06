# AI Chatbot - Technical Implementation

## Overview
The chatbot is powered by **Google Gemini 2.0 Flash API** with voice interaction support via the Web Speech API. It uses a comprehensive system prompt for context-aware conversations about Hamza Al-Ahdal.

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                   User Interface                     │
│  ┌──────────┐  ┌─────────────────────────────────┐  │
│  │ Chat     │  │ Message Display Area            │  │
│  │ Bubble   │──│ - User messages (right)         │  │
│  │ (Toggle) │  │ - Bot messages (left)           │  │
│  └──────────┘  │ - Typing indicator              │  │
│                └─────────────────────────────────┘  │
│                ┌─────────────────────────────────┐  │
│                │ 🎤 Mic | Input Field | Send     │  │
│                └─────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────┐
│               Gemini API Processor                   │
│  1. Build request with system prompt                │
│  2. Include conversation history (last 10 msgs)    │
│  3. Call Gemini 2.0 Flash endpoint                 │
│  4. Parse and display response                     │
│  5. Fallback to local responses if API fails       │
└─────────────────────────────────────────────────────┘
```

---

## API Integration

### Gemini 2.0 Flash Configuration

```javascript
// API Configuration
this.GEMINI_API_KEY = 'YOUR_API_KEY';
this.GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

// Generation Config
{
    temperature: 0.7,
    topK: 40,
    topP: 0.95,
    maxOutputTokens: 500
}
```

### System Prompt
The chatbot is trained with a comprehensive system prompt containing:
- Personal Info (name, location, contact)
- Education (Altinbas University, graduation date)
- Skills (Python, JavaScript, Docker, Kubernetes, AI/ML)
- Projects (RAG Chatbot, Alhadaf Level, La Liga Hub)
- Availability and guidelines for responses

---

## Voice Interaction

### Speech Recognition (Input)
```javascript
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
this.recognition = new SpeechRecognition();
this.recognition.lang = 'en-US';
this.recognition.continuous = false;
```

### Text-to-Speech (Output)
```javascript
const utterance = new SpeechSynthesisUtterance(cleanText);
utterance.rate = 1;
utterance.pitch = 1;
window.speechSynthesis.speak(utterance);
```

---

## Conversation Flow

```
User Input (Text or Voice)
    │
    ▼
┌──────────────┐
│ Add to       │ → Store in conversationHistory
│ History      │
└──────────────┘
    │
    ▼
┌──────────────┐
│ Show Typing  │ → Animate robot avatar (thinking)
│ Indicator    │
└──────────────┘
    │
    ▼
┌──────────────┐
│ Call Gemini  │ → POST to API with system prompt
│ API          │   + conversation history
└──────────────┘
    │
    ▼
┌──────────────┐
│ Display      │ → Format markdown, show message
│ Response     │   + animate robot (talking)
└──────────────┘
    │
    ▼
┌──────────────┐
│ Speak        │ → If voice input, read aloud
│ (Optional)   │
└──────────────┘
```

---

## Fallback System

If the Gemini API fails (network error, rate limit), the chatbot gracefully falls back to local pattern-matched responses:

```javascript
generateLocalResponse(input) {
    if (/^(hi|hello|hey)/i.test(input)) {
        return "Hey there! 👋 I'm Hamza's AI assistant...";
    }
    if (/(skills?|technologies)/i.test(input)) {
        return "Hamza's technical skills include...";
    }
    // ... more patterns
}
```

---

## Robot Avatar States

| State | CSS Class | Visual Effect |
|-------|-----------|---------------|
| Resting | (none) | Eyes blink periodically |
| Thinking | `.thinking` | Eyes pulse |
| Talking | `.talking` | Mouth animates |
| Listening | `.listening` | Magenta glow |

---

## File: chatbot.js
- Contains `HamzaChatbot` class
- Initializes on `DOMContentLoaded`
- Requires elements: `chatWidget`, `chatToggle`, `chatWindow`, `chatMessages`, `chatInput`, `chatSend`, `chatMic`
