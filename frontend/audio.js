/**
 * HAMZA AI - Futuristic UI Audio System
 * Uses Web Audio API to synthesize scifi/tech sounds
 */

class TechAudio {
    constructor() {
        this.ctx = null;
        this.enabled = false;

        // Interaction sounds
        this.sounds = {
            hover: { freq: 880, type: 'sine', duration: 0.1, volume: 0.05 },
            click: { freq: 440, type: 'square', duration: 0.05, volume: 0.1 },
            beep: { freq: 1200, type: 'triangle', duration: 0.2, volume: 0.08 },
            whoosh: { freq: 200, type: 'sawtooth', duration: 0.3, volume: 0.05, sweep: true }
        };
    }

    init() {
        if (this.ctx) return;
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.enabled = true;
        console.log("🤖 Tech Audio Initialized");
    }

    play(name) {
        if (!this.ctx || !this.enabled) return;
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }

        const sound = this.sounds[name];
        if (!sound) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = sound.type;
        osc.frequency.setValueAtTime(sound.freq, this.ctx.currentTime);

        if (sound.sweep) {
            osc.frequency.exponentialRampToValueAtTime(sound.freq * 2, this.ctx.currentTime + sound.duration);
        }

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(2000, this.ctx.currentTime);
        filter.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + sound.duration);

        gain.gain.setValueAtTime(sound.volume, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + sound.duration);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + sound.duration);
    }
}

// Global instance
window.techAudio = new TechAudio();

// Initialize on first user interaction
window.addEventListener('mousedown', () => window.techAudio.init(), { once: true });
window.addEventListener('keydown', () => window.techAudio.init(), { once: true });
