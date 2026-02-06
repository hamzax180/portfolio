/**
 * HAMZA AI - Futuristic UI Audio System
 * Uses Web Audio API to synthesize scifi/tech sounds
 */

class TechAudio {
    constructor() {
        this.ctx = null;
        this.enabled = true; // Enabled by default, constrained by browser policy

        // Interaction sounds
        this.sounds = {
            hover: { freq: 880, type: 'sine', duration: 0.1, volume: 0.1 },
            click: { freq: 440, type: 'square', duration: 0.08, volume: 0.15 },
            beep: { freq: 1200, type: 'triangle', duration: 0.15, volume: 0.12 },
            whoosh: { freq: 150, type: 'sawtooth', duration: 0.4, volume: 0.1, sweep: true },
            startup: { freq: 600, type: 'sine', duration: 0.5, volume: 0.1, arpeggio: true }
        };
    }

    async init() {
        if (this.ctx) {
            if (this.ctx.state === 'suspended') {
                await this.ctx.resume();
            }
            return;
        }

        try {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            if (this.ctx.state === 'suspended') {
                await this.ctx.resume();
            }
            console.log("🤖 Tech Audio Activated");
        } catch (e) {
            console.warn("Audio Context failed:", e);
        }
    }

    async play(name) {
        // Auto-init on play if possible
        if (!this.ctx) await this.init();
        if (!this.ctx || this.ctx.state === 'suspended') {
            await this.ctx.resume();
        }

        const sound = this.sounds[name];
        if (!sound) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = sound.type;

        if (sound.arpeggio) {
            osc.frequency.setValueAtTime(sound.freq, now);
            osc.frequency.exponentialRampToValueAtTime(sound.freq * 1.5, now + sound.duration * 0.5);
            osc.frequency.exponentialRampToValueAtTime(sound.freq * 2, now + sound.duration);
        } else {
            osc.frequency.setValueAtTime(sound.freq, now);
            if (sound.sweep) {
                osc.frequency.exponentialRampToValueAtTime(sound.freq * 3, now + sound.duration);
            }
        }

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(3000, now);
        filter.frequency.exponentialRampToValueAtTime(500, now + sound.duration);

        gain.gain.setValueAtTime(sound.volume, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + sound.duration);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + sound.duration);
    }
}

// Global instance
window.techAudio = new TechAudio();

// Multiple triggers to bypass browser autoplay restrictions
['mousedown', 'touchstart', 'keydown', 'click'].forEach(evt => {
    window.addEventListener(evt, () => window.techAudio.init(), { once: true });
});
