/**
 * HAMZA AI - Futuristic UI Audio System (Ultra Reliable Edition)
 * Uses Web Audio API to synthesize scifi/tech sounds.
 * Note: Browser requires a user gesture (click/keypress) before audio can play.
 */

class TechAudio {
    constructor() {
        this.ctx = null;
        this.isInitialized = false;
        this.ambientNodes = [];

        // High-volume Interaction Sounds
        this.sounds = {
            whoosh: { freq: 200, type: 'sawtooth', duration: 0.5, vol: 0.4, sweep: true },
            beep: { freq: 1500, type: 'triangle', duration: 0.2, vol: 0.5 },
            click: { freq: 800, type: 'sine', duration: 0.1, vol: 0.3 },
            startup: { freq: 400, type: 'sine', duration: 0.8, vol: 0.3, arpeggio: true }
        };
    }

    async init() {
        if (this.isInitialized && this.ctx && this.ctx.state !== 'suspended') return;

        try {
            if (!this.ctx) {
                this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            }
            if (this.ctx.state === 'suspended') {
                await this.ctx.resume();
            }
            this.isInitialized = true;
            console.log("🤖 Tech Audio: Context Activated (Gestured)");
        } catch (e) {
            console.error("🤖 Tech Audio: Failed to initialize context:", e);
        }
    }

    async play(name) {
        // Attempt to auto-resume on every play call if state is suspended
        if (!this.isInitialized || (this.ctx && this.ctx.state === 'suspended')) {
            await this.init();
        }

        if (!this.ctx || !this.sounds[name]) return;

        const s = this.sounds[name];
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = s.type;

        if (s.arpeggio) {
            osc.frequency.setValueAtTime(s.freq, now);
            osc.frequency.exponentialRampToValueAtTime(s.freq * 1.5, now + s.duration * 0.4);
            osc.frequency.exponentialRampToValueAtTime(s.freq * 2, now + s.duration);
        } else {
            osc.frequency.setValueAtTime(s.freq, now);
            if (s.sweep) {
                osc.frequency.exponentialRampToValueAtTime(s.freq * 5, now + s.duration);
            }
        }

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(4000, now);
        filter.frequency.exponentialRampToValueAtTime(800, now + s.duration);

        gain.gain.setValueAtTime(s.vol, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + s.duration);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + s.duration);
    }

    async startAmbient() {
        if (!this.ctx) await this.init();
        if (!this.ctx || (this.ambientNodes && this.ambientNodes.length > 0)) return;

        if (this.ctx.state === 'suspended') {
            await this.ctx.resume();
        }

        console.log("🎶 Tech Audio: Starting Futuristic Ambient Drone...");

        const createDrone = (freq, type, vol, modFreq = 0) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const lfo = this.ctx.createOscillator();
            const lfoGain = this.ctx.createGain();

            osc.type = type;
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

            // Robotic FM Modulation
            if (modFreq > 0) {
                const mod = this.ctx.createOscillator();
                const modGain = this.ctx.createGain();
                mod.frequency.setValueAtTime(modFreq, this.ctx.currentTime);
                modGain.gain.setValueAtTime(freq * 0.5, this.ctx.currentTime);
                mod.connect(modGain);
                modGain.connect(osc.frequency);
                mod.start();
            }

            gain.gain.setValueAtTime(0, this.ctx.currentTime);
            gain.gain.linearRampToValueAtTime(vol * 2.5, this.ctx.currentTime + 4);

            lfo.type = 'sine';
            lfo.frequency.setValueAtTime(0.1 + Math.random() * 0.2, this.ctx.currentTime);
            lfoGain.gain.setValueAtTime(freq * 0.08, this.ctx.currentTime);

            lfo.connect(lfoGain);
            lfoGain.connect(osc.frequency);
            osc.connect(gain);

            // Add Scifi "Filter Pulse"
            const filter = this.ctx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(freq * 2, this.ctx.currentTime);
            gain.connect(filter);
            filter.connect(this.ctx.destination);

            lfo.start();
            osc.start();

            return { osc, lfo, gain, filter };
        };

        // Multi-layered "Living Machine" atmosphere
        this.ambientNodes.push(createDrone(50, 'sine', 0.12));       // Deep hum
        this.ambientNodes.push(createDrone(150, 'sawtooth', 0.05, 30)); // Robotic buzz
        this.ambientNodes.push(createDrone(220, 'square', 0.03, 120)); // High-tech pulse
    }

    stopAmbient() {
        this.ambientNodes.forEach(node => {
            node.gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 1);
            setTimeout(() => {
                node.osc.stop();
                node.lfo.stop();
            }, 1000);
        });
        this.ambientNodes = [];
    }
}

// Global instance for window access
window.techAudio = new TechAudio();

// Multi-trigger listener for first-time activation - GESTURE REQUIRED
const initTrigger = async (evt) => {
    console.log(`🤖 Tech Audio: Interaction (${evt}) - Activating AI Audio Engine...`);
    try {
        await window.techAudio.init();
        if (window.techAudio.isInitialized) {
            await window.techAudio.startAmbient();
            window.techAudio.play('startup');

            // Remove listeners once activated
            ['click', 'mousedown', 'keydown', 'touchstart'].forEach(e => {
                window.removeEventListener(e, initTrigger);
            });
        }
    } catch (err) {
        console.error("🤖 Tech Audio: Activation failed:", err);
    }
};

['click', 'mousedown', 'keydown', 'touchstart'].forEach(evt => {
    window.addEventListener(evt, initTrigger);
});
