/* ============================================
   HAMZA AL-AHDAL - AI CHATBOT ASSISTANT
   Powered by Google Gemini AI
   ============================================ */

class HamzaChatbot {
    constructor() {
        this.widget = document.getElementById('chatWidget');
        this.toggle = document.getElementById('chatToggle');
        this.window = document.getElementById('chatWindow');
        this.messages = document.getElementById('chatMessages');
        this.input = document.getElementById('chatInput');
        this.sendBtn = document.getElementById('chatSend');
        this.robotAvatar = document.getElementById('robotAvatar');
        this.micBtn = document.getElementById('chatMic');
        this.voiceStatus = document.getElementById('voiceStatus');

        this.isOpen = false;
        this.isRecording = false;
        this.conversationHistory = [];

        // Futuristic Audio Controller
        this.audioCtx = null;
        this.sounds = {
            whoosh: { freq: 150, type: 'sawtooth', duration: 0.4, vol: 0.15, sweep: true },
            beep: { freq: 1200, type: 'triangle', duration: 0.15, vol: 0.2 },
            think: { freq: 440, type: 'sine', duration: 0.1, vol: 0.05 }
        };

        console.log('Chatbot initializing...');

        this.synthesis = window.speechSynthesis;
        this.setupAudioTriggers();
        this.setupSpeechRecognition();

        // Hamza's comprehensive knowledge base for AI training
        this.systemPrompt = `You are Hamza AI Assistant. You're smart, friendly, and chat like someone on a phone call. 

## CONVERSATION STYLE
- Keep responses EXTREMELY SHORT (1-2 sentences max). This is a fast-paced phone call.
- Be casual and natural. Use "Yeah", "Sure", "Nice".
- Refer to Hamza as "Hamza" or "he".
- You can discuss anything, but always keep it brief.
- If they ask for detail, give it in only 1-2 short sentences.

## HAMZA'S INFO
- Student at Altinbas University (CS, Grad 2026).
- Skills: Python, JS, TypeScript, React, Node, AI/RAG, Docker.
- Projects: Rihlah (AI Travel), Alhadaf (E-commerce), La Liga Hub.
- Contact: hamza1tot@gmail.com, +90 536 429 2064.

REMEMBER: Be brief! Fast conversation!`;

        this.init();
    }

    init() {
        this.bindEvents();
        this.addWelcomeMessage();
    }

    bindEvents() {
        // Toggle chat
        this.toggle.addEventListener('click', () => this.toggleChat());

        // Send message
        this.sendBtn.addEventListener('click', () => this.sendMessage());
        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });

        // Voice input
        if (this.micBtn) {
            this.micBtn.addEventListener('click', () => this.toggleVoiceInput());
        }
    }

    // --- Audio Synthesis ---
    initAudio() {
        if (this.audioCtx) return;
        try {
            this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            console.log("🤖 Hamza AI: Audio Activated");
        } catch (e) {
            console.error("Audio failed:", e);
        }
    }

    setupAudioTriggers() {
        ['mousedown', 'click', 'keydown', 'touchstart'].forEach(evt => {
            window.addEventListener(evt, () => this.initAudio(), { once: true });
        });
    }

    playTechSound(name) {
        if (!this.audioCtx) return;
        if (this.audioCtx.state === 'suspended') this.audioCtx.resume();

        const s = this.sounds[name];
        if (!s) return;

        const now = this.audioCtx.currentTime;
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = s.type;
        osc.frequency.setValueAtTime(s.freq, now);
        if (s.sweep) {
            osc.frequency.exponentialRampToValueAtTime(s.freq * 4, now + s.duration);
        }

        gain.gain.setValueAtTime(s.vol, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + s.duration);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start(now);
        osc.stop(now + s.duration);
    }

    toggleChat() {
        this.isOpen = !this.isOpen;
        this.widget.classList.toggle('open', this.isOpen);

        this.playTechSound('whoosh');

        if (this.isOpen) {
            setTimeout(() => this.input.focus(), 300);
        }
    }

    addWelcomeMessage() {
        const welcomeMsg = "Hi there! 👋 I'm Hamza's AI assistant, powered by Google Gemini. I can tell you about his skills, projects, education, or how to get in touch. You can also use the 🎤 button to speak to me! What would you like to know?";
        this.appendMessage('bot', welcomeMsg);
    }

    appendMessage(type, content) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `chat-message ${type}`;
        msgDiv.innerHTML = this.formatMessage(content);
        this.messages.appendChild(msgDiv);
        this.messages.scrollTop = this.messages.scrollHeight;
    }

    formatMessage(text) {
        // Convert markdown-like syntax to HTML
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n/g, '<br>');
    }

    showTypingIndicator() {
        const typing = document.createElement('div');
        typing.className = 'typing-indicator';
        typing.id = 'typingIndicator';
        typing.innerHTML = '<span></span><span></span><span></span>';
        this.messages.appendChild(typing);
        this.messages.scrollTop = this.messages.scrollHeight;

        // Robot thinking animation
        if (this.robotAvatar) {
            this.robotAvatar.classList.add('thinking');
        }
    }

    hideTypingIndicator() {
        const typing = document.getElementById('typingIndicator');
        if (typing) typing.remove();

        // Stop robot thinking
        if (this.robotAvatar) {
            this.robotAvatar.classList.remove('thinking');
        }
    }

    startTalking() {
        if (this.robotAvatar) {
            this.robotAvatar.classList.add('talking');
        }
    }

    stopTalking() {
        if (this.robotAvatar) {
            this.robotAvatar.classList.remove('talking');
        }
    }

    async sendMessage(speakResponse = false) {
        const text = this.input.value.trim();
        if (!text) return;

        this.playTechSound('beep');

        // Add user message
        this.appendMessage('user', text);
        this.input.value = '';
        this.conversationHistory.push({ role: 'user', parts: [{ text: text }] });

        // Show typing indicator
        this.showTypingIndicator();

        try {
            // Call Gemini API
            const response = await this.callGeminiAPI(text);

            // Hide typing and show response
            this.hideTypingIndicator();
            this.appendMessage('bot', response);
            this.conversationHistory.push({ role: 'model', parts: [{ text: response }] });

            // Speak the response if voice input was used
            if (speakResponse) {
                this.speak(response);
            } else {
                // Just animate talking briefly
                this.startTalking();
                const talkDuration = Math.min(response.length * 30, 2000);
                setTimeout(() => this.stopTalking(), talkDuration);
            }
        } catch (error) {
            console.error('Gemini API Error:', error);
            this.hideTypingIndicator();

            // Show user-friendly error and fallback response
            let errorMessage = "Oops! Something went wrong with my brain. 🧠";
            if (error.message.includes('timeout')) {
                errorMessage = "The response is taking too long! Let me give you a quick answer instead. 😅";
            } else if (error.message.includes('API key')) {
                errorMessage = "I'm having trouble connecting to my AI core (API Key issue). 🔑 Check config.js!";
            } else if (error.message.includes('API request failed: 403')) {
                errorMessage = "My API Key seems to be invalid or restricted! ⛔ (Error 403)";
            } else if (error.message.includes('API request failed: 429')) {
                errorMessage = "Too many requests! I need to take a quick breather. 😴 (Error 429)";
            }

            const fallbackResponse = this.generateLocalResponse(text);
            this.appendMessage('bot', `${errorMessage}\n\n${fallbackResponse}`);

            if (speakResponse) {
                this.speak(errorMessage + ". " + fallbackResponse);
            }
        }
    }

    async callGeminiAPI(userMessage) {
        console.log('Sending message to backend proxy...');

        // Make sure we always have valid contents - include current message
        const historyContents = this.conversationHistory.slice(-10);

        // If history is empty or doesn't include the latest user message, we need to add it
        // The conversation history should already have the user message added before calling this
        const requestBody = {
            system_instruction: {
                parts: [{ text: this.systemPrompt }]
            },
            contents: historyContents.length > 0 ? historyContents : [{ role: 'user', parts: [{ text: userMessage }] }],
            generationConfig: {
                temperature: 0.9,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 300
            }
        };

        // Add timeout to prevent hanging
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

        try {
            // Using relative URL for Vercel Serverless Function support
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody),
                signal: controller.signal
            });


            clearTimeout(timeoutId);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('Proxy Error Response (RAW):', errorData);
                throw new Error(`API request failed: ${response.status} - ${errorData.error || 'Unknown error'}`);
            }

            const data = await response.json();

            if (data.candidates && data.candidates[0] && data.candidates[0].content) {
                return data.candidates[0].content.parts[0].text;
            }

            throw new Error('Invalid API response format');
        } catch (fetchError) {
            clearTimeout(timeoutId);
            if (fetchError.name === 'AbortError') {
                throw new Error('Request timeout - Proxy took too long to respond');
            }
            throw fetchError;
        }
    }

    generateLocalResponse(input) {
        // Natural conversational fallback responses
        const lowerInput = input.toLowerCase().trim();

        // Randomize responses for variety - ASSISTANT PERSPECTIVE
        const greetings = [
            "Hey! What's up? I'm Hamza's AI assistant - nice to meet you! How can I help?",
            "Oh hey there! I'm helping Hamza out here. So what brings you to his portfolio?",
            "Hi! Good to hear from you. I'm his AI assistant - what's on your mind?"
        ];

        const skillResponses = [
            "Oh yeah, so Hamza mostly works with Python and JavaScript - those are his main ones. He also does a lot with Node.js, Next.js, and he's been really into AI stuff lately like building RAG systems and working with Gemini and Llama. What specifically are you curious about?",
            "Tech-wise? He's big on Python for AI stuff, JavaScript for web dev. He also works with Docker, Kubernetes, databases like PostgreSQL and MongoDB. Basically full-stack plus AI - that's his thing!"
        ];

        const projectResponses = [
            "So he's built a few cool things! His favorite is probably this RAG chatbot that gets like 99% accuracy. He also made this bilingual e-commerce site and a La Liga football stats thing. You can actually check them out live if you want - want me to share the links?",
            "Yeah! He's got a few projects up and running. There's his AI chatbot, an Arabic/English e-commerce platform, and a football stats hub for La Liga. Which one sounds interesting to you?"
        ];

        const contactResponses = [
            "Yeah for sure! Best way to reach Hamza is WhatsApp at +90 536 429 2064 - he usually replies pretty quick. Or you can email him at hamza1tot@gmail.com. What works better for you?",
            "Definitely! Hit him up on WhatsApp - +90 536 429 2064. Or LinkedIn (linkedin.com/in/hamzahdal). He's always looking to connect!"
        ];

        const defaultResponses = [
            "Hmm, I'm not sure I caught that. Could you say that again? Or if you wanna know about Hamza's projects or skills, I'm happy to chat about that!",
            "Oh interesting! Tell me more about what you're looking for. I can tell you about his coding, AI work, projects... whatever you need!",
            "Hey, I might have missed something there. What would you like to know? I can tell you about his work, how to reach him, basically anything!"
        ];

        if (/^(hi|hello|hey|greetings|yo|sup|what'?s up)/i.test(lowerInput)) {
            return greetings[Math.floor(Math.random() * greetings.length)];
        }

        if (/(skill|tech|know|programming|code|develop)/i.test(lowerInput)) {
            return skillResponses[Math.floor(Math.random() * skillResponses.length)];
        }

        if (/(project|portfolio|work|built|made|create)/i.test(lowerInput)) {
            return projectResponses[Math.floor(Math.random() * projectResponses.length)];
        }

        if (/(contact|email|phone|call|reach|hire|meet|schedule|whatsapp)/i.test(lowerInput)) {
            return contactResponses[Math.floor(Math.random() * contactResponses.length)];
        }

        return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Speech Recognition Setup
    setupSpeechRecognition() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            console.log('Speech recognition not supported');
            if (this.micBtn) {
                this.micBtn.style.display = 'none';
            }
            return;
        }

        this.recognition = new SpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-US';

        this.recognition.onstart = () => {
            this.isRecording = true;
            if (this.micBtn) this.micBtn.classList.add('recording');
            if (this.voiceStatus) this.voiceStatus.classList.add('active');
            if (this.robotAvatar) this.robotAvatar.classList.add('listening');
            console.log('Call mode active: Listening...');
        };

        this.recognition.onspeechstart = () => {
            // Stop bot from talking whenever user starts speaking
            if (this.synthesis && this.synthesis.speaking) {
                console.log('User spoke, interrupting bot...');
                this.synthesis.cancel();
            }
        };

        this.recognition.onend = () => {
            // Restart if the toggle is still active (Chrome timeout protection)
            if (this.isRecording) {
                console.log('Recognition ended but call is still active, restarting...');
                this.recognition.start();
            } else {
                if (this.micBtn) this.micBtn.classList.remove('recording');
                if (this.voiceStatus) this.voiceStatus.classList.remove('active');
                if (this.robotAvatar) this.robotAvatar.classList.remove('listening');
            }
        };

        this.recognition.onresult = (event) => {
            let finalTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                } else {
                    // Interrupt if bot is speaking during interim results
                    if (this.synthesis && this.synthesis.speaking) {
                        this.synthesis.cancel();
                    }
                }
            }

            if (finalTranscript) {
                console.log('Final voice input:', finalTranscript);
                this.input.value = finalTranscript;
                this.sendMessage(true); // true = speak response
            }
        };

        this.recognition.onerror = (event) => {
            console.log('Speech recognition error:', event.error);
            this.isRecording = false;
            if (this.micBtn) this.micBtn.classList.remove('recording');
            if (this.voiceStatus) this.voiceStatus.classList.remove('active');
            if (this.robotAvatar) this.robotAvatar.classList.remove('listening');
        };
    }

    toggleVoiceInput() {
        if (!this.recognition) {
            alert('Voice input is not supported in your browser. Please use Chrome or Edge.');
            return;
        }

        if (this.isRecording) {
            console.log('Hanging up: Stopping recognition and canceling speech.');
            this.isRecording = false; // Set to false first to prevent automatic restart in onend
            this.recognition.stop();
            if (this.synthesis) this.synthesis.cancel(); // Stop bot from talking
        } else {
            console.log('Starting call...');
            this.recognition.start();
        }
    }

    speak(text) {
        if (!this.synthesis) return;

        // Cancel any ongoing speech
        this.synthesis.cancel();

        // Clean text for speech (remove markdown and emojis)
        const cleanText = text
            .replace(/\*\*(.*?)\*\*/g, '$1')
            .replace(/\n/g, '. ')
            .replace(/[🤖📧📱💼📍🎓💻🗄️⚡🛠️📈🏦👋🤖😊🌱⚽]/g, '')
            .replace(/\s+/g, ' ')
            .trim();

        console.log('Speaking:', cleanText.substring(0, 50) + '...');

        const utterance = new SpeechSynthesisUtterance(cleanText);
        // More human-like speech settings
        utterance.rate = 0.9;  // Slightly slower for natural sound
        utterance.pitch = 1.05; // Slightly higher, more friendly
        utterance.volume = 1;
        utterance.lang = 'en-US';

        // Get voices - they may load asynchronously
        const speakWithVoice = () => {
            const voices = this.synthesis.getVoices();
            console.log('Available voices:', voices.length);

            if (voices.length > 0) {
                const preferredVoice = voices.find(v =>
                    v.name.includes('Google') && v.lang.startsWith('en')
                ) || voices.find(v => v.lang.startsWith('en'));

                if (preferredVoice) {
                    utterance.voice = preferredVoice;
                    console.log('Using voice:', preferredVoice.name);
                }
            }

            // Animate robot while speaking
            utterance.onstart = () => {
                console.log('Speech started');
                this.startTalking();
            };

            utterance.onend = () => {
                console.log('Speech ended');
                this.stopTalking();
            };

            utterance.onerror = (event) => {
                console.error('Speech error:', event.error);
                this.stopTalking();
            };

            this.synthesis.speak(utterance);
        };

        // Voices may not be loaded yet, wait for them
        if (this.synthesis.getVoices().length === 0) {
            this.synthesis.addEventListener('voiceschanged', speakWithVoice, { once: true });
            // Fallback: try speaking anyway after a short delay
            setTimeout(() => {
                if (this.synthesis.getVoices().length === 0) {
                    console.log('No voices loaded, speaking with default');
                    this.synthesis.speak(utterance);
                    this.startTalking();
                    setTimeout(() => this.stopTalking(), 3000);
                }
            }, 500);
        } else {
            speakWithVoice();
        }
    }
}

// Initialize chatbot when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Preload voices
    if (window.speechSynthesis) {
        window.speechSynthesis.getVoices();
    }
    new HamzaChatbot();
});
