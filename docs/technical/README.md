# Technical Documentation

## Architecture Overview

This document provides technical details on how the portfolio website is implemented.

---

## File Structure

```
portoflio/
├── frontend.html       # Main HTML structure
├── style.css           # All styling and animations
├── functions.js        # Particle system, scroll effects, navigation
├── chatbot.js          # AI chatbot (Gemini 2.0 Flash)
├── docs/
│   ├── features/       # Feature documentation
│   └── technical/      # Technical documentation
└── hamzah CVLAST (1).pdf   # Source CV file
```

---

## Tech Stack

| Component | Technology |
|-----------|------------|
| Structure | HTML5 Semantic Elements |
| Styling | CSS3 with Custom Properties |
| Animations | CSS Transitions + JavaScript |
| AI Chatbot | Google Gemini 2.0 Flash API |
| Voice | Web Speech API (Recognition + Synthesis) |
| Particles | Canvas API / Pure CSS |

---

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

Requires:
- CSS `backdrop-filter` support
- ES6+ JavaScript
- Intersection Observer API
