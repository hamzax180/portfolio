/**
 * HAMZA AI - Robotic UI Audio System
 * Uses Web Audio API to synthesize advanced robotic and tech sounds.
 */

class TechAudio {
    constructor() {
        this.ctx = null;
        this.isInitialized = false;
        this.ambientNodes = [];
        this.sounds = {
            whoosh: { freq: 150, type: 'sawtooth', duration: 0.4, vol: 0.3, sweep: true },
            beep: { freq: 1800, type: 'square', duration: 0.1, vol: 0.2 },
            click: { freq: 1200, type: 'sine', duration: 0.05, vol: 0.2 },
            startup: { freq: 300, type: 'sine', duration: 1.2, vol: 0.4, robotic: true }
        };
    }

    async init() {
        if (this.isInitialized && this.ctx && this.ctx.state !== 'suspended') return;
        try {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            if (this.ctx.state === 'suspended') await this.ctx.resume();
            this.isInitialized = true;
            console.log("🤖 Robotic Audio: System Online");
        } catch (e) {
            console.error("🤖 Robotic Audio: Init failed", e);
        }
    }

    async play(name) {
        if (!this.isInitialized) await this.init();
        if (!this.ctx || !this.sounds[name]) return;

        const s = this.sounds[name];
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = s.type;
        osc.frequency.setValueAtTime(s.freq, now);

        if (s.sweep) {
            osc.frequency.exponentialRampToValueAtTime(s.freq * 4, now + s.duration);
        }

        if (s.robotic) {
            // Add a vibrating effect for robotic sound
            const lfo = this.ctx.createOscillator();
            const lfoGain = this.ctx.createGain();
            lfo.frequency.value = 30;
            lfoGain.gain.value = s.freq * 0.5;
            lfo.connect(lfoGain);
            lfoGain.connect(osc.frequency);
            lfo.start(now);
            lfo.stop(now + s.duration);
        }

        filter.type = 'lowpass';
        filter.frequency.value = 2000;
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
        if (!this.ctx || this.ambientNodes.length > 0) return;

        console.log("🎶 Activating Robotic Ambient Drones...");

        const createDroneLayer = (freq, type, vol, modFreq) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const lfo = this.ctx.createOscillator();
            const lfoGain = this.ctx.createGain();

            osc.type = type;
            osc.frequency.value = freq;

            // FM Modulation for robotic grit
            const mod = this.ctx.createOscillator();
            const modGain = this.ctx.createGain();
            mod.frequency.value = modFreq;
            modGain.gain.value = freq * 0.5;
            mod.connect(modGain);
            modGain.connect(osc.frequency);
            mod.start();

            gain.gain.setValueAtTime(0, this.ctx.currentTime);
            gain.gain.linearRampToValueAtTime(vol, this.ctx.currentTime + 3);

            lfo.frequency.value = 0.2;
            lfoGain.gain.value = vol * 0.3;
            lfo.connect(gain.gain);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            lfo.start();
            osc.start();

            return { osc, mod, lfo, gain };
        };

        // Layer 1: Base hum
        this.ambientNodes.push(createDroneLayer(60, 'sine', 0.15, 0.5));
        // Layer 2: Robotic buzz
        this.ambientNodes.push(createDroneLayer(120, 'sawtooth', 0.05, 45));
        // Layer 3: High-tech shimmer
        this.ambientNodes.push(createDroneLayer(240, 'square', 0.02, 120));
    }

    stopAmbient() {
        this.ambientNodes.forEach(node => {
            node.gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 1);
            setTimeout(() => {
                node.osc.stop();
                node.mod.stop();
                node.lfo.stop();
            }, 1000);
        });
        this.ambientNodes = [];
    }
}

window.techAudio = new TechAudio();

const activateAudio = () => {
    window.techAudio.init().then(() => {
        window.techAudio.startAmbient();
        window.techAudio.play('startup');
        ['click', 'keydown', 'touchstart'].forEach(e => window.removeEventListener(e, activateAudio));
    });
};

['click', 'keydown', 'touchstart'].forEach(e => window.addEventListener(e, activateAudio));
