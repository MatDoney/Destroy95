/**
 * Retro Windows 95/98 Sound Synthesizer via Web Audio API
 * 100% pure client-side synthesis - no external audio files required!
 */
class RetroAudioEngine {
    constructor() {
        this.ctx = null;
        this.isMuted = false;
        this.masterVolume = 0.5;
        this.masterGain = null;
        this.initialized = false;
    }

    init() {
        if (this.initialized) return;
        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) return;
            this.ctx = new AudioCtx();
            this.masterGain = this.ctx.createGain();
            this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.masterVolume, this.ctx.currentTime);
            this.masterGain.connect(this.ctx.destination);
            this.initialized = true;
        } catch (e) {
            console.warn("Web Audio not supported or blocked", e);
        }
    }

    ensureContext() {
        if (!this.initialized) {
            this.init();
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.masterGain && this.ctx) {
            this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.masterVolume, this.ctx.currentTime);
        }
        return this.isMuted;
    }

    setVolume(val) {
        this.masterVolume = Math.max(0, Math.min(1, val));
        if (this.masterGain && this.ctx && !this.isMuted) {
            this.masterGain.gain.setValueAtTime(this.masterVolume, this.ctx.currentTime);
        }
    }

    // Windows 95 Startup Chime (ambient chord arpeggio)
    playStartup() {
        this.ensureContext();
        if (!this.ctx || this.isMuted) return;

        const now = this.ctx.currentTime;
        // Famous chords: Eb, Bb, G, C, F, high chime notes
        const notes = [
            { freq: 155.56, time: 0.0, dur: 3.5, gain: 0.25, type: 'sine' },  // Eb3
            { freq: 233.08, time: 0.2, dur: 3.2, gain: 0.22, type: 'sine' },  // Bb3
            { freq: 311.13, time: 0.45, dur: 3.0, gain: 0.20, type: 'triangle' }, // Eb4
            { freq: 392.00, time: 0.7, dur: 2.8, gain: 0.20, type: 'sine' },  // G4
            { freq: 466.16, time: 0.95, dur: 2.6, gain: 0.22, type: 'sine' }, // Bb4
            { freq: 622.25, time: 1.25, dur: 2.5, gain: 0.25, type: 'triangle' }, // Eb5
            { freq: 932.33, time: 1.55, dur: 2.3, gain: 0.18, type: 'sine' }, // Bb5
            { freq: 1244.5, time: 1.85, dur: 2.2, gain: 0.15, type: 'sine' }  // Eb6 shimmer
        ];

        // Low ambient pad
        const padOsc = this.ctx.createOscillator();
        const padGain = this.ctx.createGain();
        padOsc.type = 'sawtooth';
        padOsc.frequency.setValueAtTime(77.78, now); // Eb2

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(200, now);
        filter.frequency.exponentialRampToValueAtTime(1200, now + 1.8);
        filter.frequency.exponentialRampToValueAtTime(300, now + 3.5);

        padGain.gain.setValueAtTime(0.01, now);
        padGain.gain.linearRampToValueAtTime(0.12, now + 1.0);
        padGain.gain.exponentialRampToValueAtTime(0.001, now + 3.5);

        padOsc.connect(filter);
        filter.connect(padGain);
        padGain.connect(this.masterGain);

        padOsc.start(now);
        padOsc.stop(now + 3.6);

        // Arpeggiated bell notes
        notes.forEach(n => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = n.type;
            osc.frequency.setValueAtTime(n.freq, now + n.time);

            gain.gain.setValueAtTime(0.001, now + n.time);
            gain.gain.linearRampToValueAtTime(n.gain, now + n.time + 0.15);
            gain.gain.exponentialRampToValueAtTime(0.001, now + n.time + n.dur);

            osc.connect(gain);
            gain.connect(this.masterGain);

            osc.start(now + n.time);
            osc.stop(now + n.time + n.dur);
        });
    }

    // Windows Error Sound ("Chord")
    playError() {
        this.ensureContext();
        if (!this.ctx || this.isMuted) return;

        const now = this.ctx.currentTime;
        // Two dissonant / brassy tones with quick punch
        const freqs = [146.83, 220.0, 293.66, 440.0]; // D3, A3, D4, A4
        freqs.forEach((f, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = i % 2 === 0 ? 'sawtooth' : 'triangle';
            osc.frequency.setValueAtTime(f, now);

            // Filter for vintage 16-bit soundcard punch
            const filter = this.ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(1800, now);

            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(this.masterGain);

            osc.start(now);
            osc.stop(now + 0.58);
        });
    }

    // Windows Ding / Exclamation chime
    playDing() {
        this.ensureContext();
        if (!this.ctx || this.isMuted) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, now); // A5
        osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.35); // E5

        gain.gain.setValueAtTime(0.28, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 0.42);
    }

    // Asterisk sound (upward major second)
    playAsterisk() {
        this.ensureContext();
        if (!this.ctx || this.isMuted) return;

        const now = this.ctx.currentTime;
        [523.25, 659.25].forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + idx * 0.08);

            gain.gain.setValueAtTime(0.2, now + idx * 0.08);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.25);

            osc.connect(gain);
            gain.connect(this.masterGain);

            osc.start(now + idx * 0.08);
            osc.stop(now + idx * 0.08 + 0.28);
        });
    }

    // Mechanical mouse click / UI click
    playClick() {
        this.ensureContext();
        if (!this.ctx || this.isMuted) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(1400, now);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.03);

        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 0.035);
    }

    // Retro Hard Drive seek / crunch noise
    playHddCrunch() {
        this.ensureContext();
        if (!this.ctx || this.isMuted) return;

        const now = this.ctx.currentTime;
        const bufferSize = this.ctx.sampleRate * 0.08;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            // Filtered pulse noise
            output[i] = (Math.random() * 2 - 1) * (i % 20 < 4 ? 1 : 0.1);
        }

        const whiteNoise = this.ctx.createBufferSource();
        whiteNoise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1200 + Math.random() * 800, now);
        filter.Q.setValueAtTime(3, now);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

        whiteNoise.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        whiteNoise.start(now);
    }

    // Degauss "BOOIINNGG-THUMP"
    playDegauss() {
        this.ensureContext();
        if (!this.ctx || this.isMuted) return;

        const now = this.ctx.currentTime;
        // Heavy low coil buzz
        const osc1 = this.ctx.createOscillator();
        const gain1 = this.ctx.createGain();
        osc1.type = 'sawtooth';
        osc1.frequency.setValueAtTime(120, now);
        osc1.frequency.exponentialRampToValueAtTime(40, now + 0.8);

        gain1.gain.setValueAtTime(0.4, now);
        gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

        osc1.connect(gain1);
        gain1.connect(this.masterGain);

        osc1.start(now);
        osc1.stop(now + 0.85);

        // Spring wobble
        const osc2 = this.ctx.createOscillator();
        const gain2 = this.ctx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(320, now);
        osc2.frequency.linearRampToValueAtTime(150, now + 0.6);

        gain2.gain.setValueAtTime(0.25, now + 0.05);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

        osc2.connect(gain2);
        gain2.connect(this.masterGain);

        osc2.start(now + 0.05);
        osc2.stop(now + 0.75);
    }

    // 56k Dial-up Modem Connect Sequence!
    playModem56k() {
        this.ensureContext();
        if (!this.ctx || this.isMuted) return;

        const now = this.ctx.currentTime;

        // 1. Dial tone (350Hz + 440Hz) for 0.7s
        [350, 440].forEach(f => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.frequency.setValueAtTime(f, now);
            gain.gain.setValueAtTime(0.07, now);
            gain.gain.setValueAtTime(0.001, now + 0.7);
            osc.connect(gain);
            gain.connect(this.masterGain);
            osc.start(now);
            osc.stop(now + 0.72);
        });

        // 2. DTMF tones dialing phone number
        const dtmfPairs = [
            [697, 1209], [770, 1336], [852, 1477], [697, 1336],
            [941, 1336], [770, 1209], [852, 1336]
        ];
        dtmfPairs.forEach((pair, idx) => {
            const startT = now + 0.8 + idx * 0.09;
            pair.forEach(f => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.frequency.setValueAtTime(f, startT);
                gain.gain.setValueAtTime(0.08, startT);
                gain.gain.setValueAtTime(0.001, startT + 0.06);
                osc.connect(gain);
                gain.connect(this.masterGain);
                osc.start(startT);
                osc.stop(startT + 0.07);
            });
        });

        // 3. Ringing
        const ringStart = now + 1.5;
        [440, 480].forEach(f => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.frequency.setValueAtTime(f, ringStart);
            gain.gain.setValueAtTime(0.06, ringStart);
            gain.gain.setValueAtTime(0.001, ringStart + 1.0);
            osc.connect(gain);
            gain.connect(this.masterGain);
            osc.start(ringStart);
            osc.stop(ringStart + 1.05);
        });

        // 4. Remote Answer Tone (2100Hz CED tone)
        const cedStart = now + 2.7;
        const cedOsc = this.ctx.createOscillator();
        const cedGain = this.ctx.createGain();
        cedOsc.frequency.setValueAtTime(2100, cedStart);
        cedGain.gain.setValueAtTime(0.12, cedStart);
        cedGain.gain.setValueAtTime(0.001, cedStart + 1.2);
        cedOsc.connect(cedGain);
        cedGain.connect(this.masterGain);
        cedOsc.start(cedStart);
        cedOsc.stop(cedStart + 1.22);

        // 5. Screech / V.34 Handshake noise
        const handshakeStart = now + 4.0;
        const bufferSize = this.ctx.sampleRate * 2.2;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1);
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const noiseFilter = this.ctx.createBiquadFilter();
        noiseFilter.type = 'bandpass';
        noiseFilter.frequency.setValueAtTime(1800, handshakeStart);
        noiseFilter.frequency.linearRampToValueAtTime(3200, handshakeStart + 1.2);
        noiseFilter.frequency.linearRampToValueAtTime(900, handshakeStart + 2.0);
        noiseFilter.Q.setValueAtTime(6, handshakeStart);

        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(0.1, handshakeStart);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, handshakeStart + 2.2);

        noise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(this.masterGain);

        noise.start(handshakeStart);
        noise.stop(handshakeStart + 2.25);
    }

    // Pinball flipper sound
    playPinballFlipper() {
        this.ensureContext();
        if (!this.ctx || this.isMuted) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(350, now);
        osc.frequency.exponentialRampToValueAtTime(90, now + 0.05);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 0.07);
    }

    // Pinball Bumper hit sound
    playPinballBumper() {
        this.ensureContext();
        if (!this.ctx || this.isMuted) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(750 + Math.random() * 300, now);
        osc.frequency.exponentialRampToValueAtTime(1400, now + 0.08);

        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 0.13);
    }

    // Pinball Ball Launch (spring pull & snap)
    playPinballLaunch() {
        this.ensureContext();
        if (!this.ctx || this.isMuted) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(120, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.15);

        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 0.17);
    }

    // Explosion (Minesweeper bomb / critical glitch)
    playExplosion() {
        this.ensureContext();
        if (!this.ctx || this.isMuted) return;

        const now = this.ctx.currentTime;
        const bufferSize = this.ctx.sampleRate * 0.7;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1);
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(400, now);
        filter.frequency.exponentialRampToValueAtTime(60, now + 0.65);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        noise.start(now);
    }

    // BSOD crash screech
    playBsod() {
        this.ensureContext();
        if (!this.ctx || this.isMuted) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.setValueAtTime(110, now + 0.15);

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 1.2);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 1.25);
    }

    // Popup Ad Bubble Pop Sound
    playPop() {
        this.ensureContext();
        if (!this.ctx || this.isMuted) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(450, now);
        osc.frequency.exponentialRampToValueAtTime(1200, now + 0.08);

        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 0.1);
    }

    // Comic Quack / Boing Sound for parody ads
    playQuack() {
        this.ensureContext();
        if (!this.ctx || this.isMuted) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.linearRampToValueAtTime(480, now + 0.08);
        osc.frequency.linearRampToValueAtTime(220, now + 0.22);

        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 0.26);
    }

    // High frequency glitch bleep
    playGlitchBleep() {
        this.ensureContext();
        if (!this.ctx || this.isMuted) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        const freqs = [320, 640, 1200, 1800, 2400, 3600, 4800];
        const f = freqs[Math.floor(Math.random() * freqs.length)];

        osc.type = Math.random() < 0.5 ? 'square' : 'sawtooth';
        osc.frequency.setValueAtTime(f, now);
        osc.frequency.setValueAtTime(f * (Math.random() < 0.5 ? 1.5 : 0.6), now + 0.03);

        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 0.09);
    }

    // Static burst / modem noise crackle
    playStaticBurst() {
        this.ensureContext();
        if (!this.ctx || this.isMuted) return;

        const now = this.ctx.currentTime;
        const bufferSize = Math.floor(this.ctx.sampleRate * 0.09);
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * (Math.random() < 0.3 ? 1 : 0.2);
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(800 + Math.random() * 2000, now);
        filter.Q.setValueAtTime(4, now);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.14, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        noise.start(now);
    }

    // Play random bug / glitch sound
    playRandomBugSound() {
        const r = Math.random();
        if (r < 0.3) {
            this.playGlitchBleep();
        } else if (r < 0.6) {
            this.playStaticBurst();
        } else if (r < 0.85) {
            this.playError();
        } else {
            this.playQuack();
        }
    }
}

// Global audio singleton
window.retroAudio = new RetroAudioEngine();
