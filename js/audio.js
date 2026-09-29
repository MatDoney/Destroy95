/**
 * Retro Bouzedows/98 Sound Synthesizer via Web Audio API
 * 100% pure client-side synthesis - no external audio files required!
 */
class RetroAudioEngine {
    constructor() {
        this.ctx = null;
        this.isMuted = false;
        this.masterVolume = 0.5;
        this.masterGain = null;
        this.initialized = false;

        // Fan Noise Synthesizer (Pentium sans ventilateur)
        this.fanNoiseNode = null;
        this.fanOscNode = null;
        this.fanGainNode = null;
        this.fanFilterNode = null;
        this.isFanRunning = false;
        this.fanBaseVolume = 0.15;
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
        if (this.fanGainNode && this.ctx) {
            this.fanGainNode.gain.setValueAtTime(this.isMuted ? 0 : this.fanBaseVolume, this.ctx.currentTime);
        }
        return this.isMuted;
    }

    setVolume(val) {
        this.masterVolume = Math.max(0, Math.min(1, val));
        if (this.masterGain && this.ctx && !this.isMuted) {
            this.masterGain.gain.setValueAtTime(this.masterVolume, this.ctx.currentTime);
        }
    }

    // Bouzedows Startup Chime (ambient chord arpeggio)
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

    // Bouzedows XP Logon Sound (Famous Bill Brown / Tom Ockerse startup chime)
    playXpLogon() {
        this.ensureContext();
        if (!this.ctx || this.isMuted) return;

        const now = this.ctx.currentTime;
        // Warm rich pad chord (Eb major)
        const chord = [
            { freq: 155.56, gain: 0.16, type: 'sawtooth' }, // Eb3
            { freq: 196.00, gain: 0.12, type: 'sine' },     // G3
            { freq: 233.08, gain: 0.15, type: 'sine' },     // Bb3
            { freq: 311.13, gain: 0.12, type: 'triangle' }  // Eb4
        ];

        chord.forEach(c => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const flt = this.ctx.createBiquadFilter();
            flt.type = 'lowpass';
            flt.frequency.setValueAtTime(300, now);
            flt.frequency.exponentialRampToValueAtTime(1400, now + 0.8);
            flt.frequency.exponentialRampToValueAtTime(400, now + 3.2);

            osc.type = c.type;
            osc.frequency.setValueAtTime(c.freq, now);

            gain.gain.setValueAtTime(0.001, now);
            gain.gain.linearRampToValueAtTime(c.gain, now + 0.3);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 3.2);

            osc.connect(flt);
            flt.connect(gain);
            gain.connect(this.masterGain);

            osc.start(now);
            osc.stop(now + 3.3);
        });

        // Crystal chime notes of XP logon arpeggio: Eb4, Bb4, Ab4, Eb4, Bb4, Eb5
        const bellNotes = [
            { freq: 311.13, time: 0.00, dur: 1.8, gain: 0.22 }, // Eb4
            { freq: 466.16, time: 0.18, dur: 1.8, gain: 0.22 }, // Bb4
            { freq: 415.30, time: 0.38, dur: 1.8, gain: 0.20 }, // Ab4
            { freq: 311.13, time: 0.58, dur: 1.8, gain: 0.22 }, // Eb4
            { freq: 466.16, time: 0.78, dur: 2.2, gain: 0.24 }, // Bb4
            { freq: 622.25, time: 0.98, dur: 2.8, gain: 0.28 }  // Eb5
        ];

        bellNotes.forEach(b => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(b.freq, now + b.time);

            // Shimmer harmonic overtone
            const harm = this.ctx.createOscillator();
            const harmGain = this.ctx.createGain();
            harm.type = 'sine';
            harm.frequency.setValueAtTime(b.freq * 2, now + b.time);

            gain.gain.setValueAtTime(0.001, now + b.time);
            gain.gain.linearRampToValueAtTime(b.gain, now + b.time + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, now + b.time + b.dur);

            harmGain.gain.setValueAtTime(0.001, now + b.time);
            harmGain.gain.linearRampToValueAtTime(b.gain * 0.4, now + b.time + 0.03);
            harmGain.gain.exponentialRampToValueAtTime(0.001, now + b.time + b.dur * 0.7);

            osc.connect(gain);
            harm.connect(harmGain);
            gain.connect(this.masterGain);
            harmGain.connect(this.masterGain);

            osc.start(now + b.time);
            harm.start(now + b.time);
            osc.stop(now + b.time + b.dur);
            harm.stop(now + b.time + b.dur);
        });
    }

    // Bouzedows Error Sound ("Chord")
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

    // Bouzedows Ding / Exclamation chime
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

    // Retro 90s cheeky synth sigh ("Ouuuh~")
    playSexySynth() {
        this.ensureContext();
        if (!this.ctx || this.isMuted) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(420, now);
        osc.frequency.exponentialRampToValueAtTime(580, now + 0.12);
        osc.frequency.exponentialRampToValueAtTime(260, now + 0.45);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.18, now + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.48);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 0.5);
    }

    // Continuous 12,000 RPM Fan Noise (Pentium sans ventilateur)
    startFanNoise(intensity = 1) {
        this.ensureContext();
        if (!this.ctx) return;
        if (this.isFanRunning) {
            this.setFanSpeed(intensity);
            return;
        }

        try {
            // White noise buffer for wind/air turbulence
            const bufferSize = Math.floor(this.ctx.sampleRate * 1.5);
            const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }

            this.fanNoiseNode = this.ctx.createBufferSource();
            this.fanNoiseNode.buffer = buffer;
            this.fanNoiseNode.loop = true;

            // Bandpass filter to sculpt howling fan air rush
            this.fanFilterNode = this.ctx.createBiquadFilter();
            this.fanFilterNode.type = 'bandpass';
            const fFreq = Math.min(3200, 1100 + (intensity * 140));
            this.fanFilterNode.frequency.setValueAtTime(fFreq, this.ctx.currentTime);
            this.fanFilterNode.Q.setValueAtTime(1.8, this.ctx.currentTime);

            // High RPM Whine oscillator (fan motor & bearing screech)
            this.fanOscNode = this.ctx.createOscillator();
            this.fanOscNode.type = 'sawtooth';
            const oscFreq = Math.min(880, 410 + (intensity * 40));
            this.fanOscNode.frequency.setValueAtTime(oscFreq, this.ctx.currentTime);

            const oscFilter = this.ctx.createBiquadFilter();
            oscFilter.type = 'lowpass';
            oscFilter.frequency.setValueAtTime(950, this.ctx.currentTime);

            const oscGain = this.ctx.createGain();
            oscGain.gain.setValueAtTime(0.05, this.ctx.currentTime);

            this.fanGainNode = this.ctx.createGain();
            this.fanGainNode.gain.setValueAtTime(this.isMuted ? 0 : this.fanBaseVolume, this.ctx.currentTime);

            // Connect graph
            this.fanNoiseNode.connect(this.fanFilterNode);
            this.fanFilterNode.connect(this.fanGainNode);

            this.fanOscNode.connect(oscFilter);
            oscFilter.connect(oscGain);
            oscGain.connect(this.fanGainNode);

            this.fanGainNode.connect(this.masterGain);

            this.fanNoiseNode.start();
            this.fanOscNode.start();
            this.isFanRunning = true;
        } catch (e) {
            console.warn("Could not start fan noise:", e);
        }
    }

    setFanSpeed(intensity = 1) {
        if (!this.ctx || !this.isFanRunning) return;
        const now = this.ctx.currentTime;
        if (this.fanFilterNode) {
            const freq = Math.min(3400, 1100 + (intensity * 140));
            this.fanFilterNode.frequency.setTargetAtTime(freq, now, 0.15);
        }
        if (this.fanOscNode) {
            const oscFreq = Math.min(950, 410 + (intensity * 40));
            this.fanOscNode.frequency.setTargetAtTime(oscFreq, now, 0.15);
        }
    }

    stopFanNoise() {
        if (!this.isFanRunning) return;
        try {
            if (this.fanNoiseNode) {
                this.fanNoiseNode.stop();
                this.fanNoiseNode.disconnect();
            }
            if (this.fanOscNode) {
                this.fanOscNode.stop();
                this.fanOscNode.disconnect();
            }
        } catch (e) { }
        this.isFanRunning = false;
        this.fanNoiseNode = null;
        this.fanOscNode = null;
    }

    // Mechanical 3.5" Floppy Disk seek sound
    playFloppyDrive() {
        this.ensureContext();
        if (!this.ctx || this.isMuted) return;
        const now = this.ctx.currentTime;

        for (let i = 0; i < 4; i++) {
            const t = now + (i * 0.07);
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'square';
            osc.frequency.setValueAtTime(140 + (i % 2 === 0 ? 80 : 0), t);

            gain.gain.setValueAtTime(0.14, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.045);

            osc.connect(gain);
            gain.connect(this.masterGain);

            osc.start(t);
            osc.stop(t + 0.05);
        }
    }

    // Mechanical CD-ROM tray eject & close
    playCdEject() {
        this.ensureContext();
        if (!this.ctx || this.isMuted) return;
        const now = this.ctx.currentTime;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.linearRampToValueAtTime(220, now + 0.4);

        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.42);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 0.43);
    }

    playCdClose() {
        this.ensureContext();
        if (!this.ctx || this.isMuted) return;
        const now = this.ctx.currentTime;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(160, now);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 0.13);
    }
}

// Global audio singleton
window.retroAudio = new RetroAudioEngine();
