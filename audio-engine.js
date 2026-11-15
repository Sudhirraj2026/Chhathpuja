/**
 * audio-engine.js
 * 100% Offline Web Audio API Chhath Music Engine:
 * - Synthesized Chhath Geet melodies (Bhairavi Raag, Bansuri timbre)
 * - Ambient tanpura drone (Sa-Pa-Sa)
 * - Tabla-style rhythmic pattern (Teen Taal / Dadra)
 * - Realistic Shankhnaad and Temple Bell
 * - Custom local MP3 upload support
 * No YouTube / No internet required!
 */

class ChhathAudioEngine {
    constructor() {
        this.ctx = null;
        this.isMuted = false;
        this.volume = 0.8;

        // Track catalog — now pure synthesized melodies
        this.tracks = [
            {
                title: "केलवा के पात पर उगेलन सुरुज देव",
                artist: "शारदा सिन्हा (Synth Tribute)",
                melody: 'kelwa'
            },
            {
                title: "पहिले पहिल छठी मइया",
                artist: "शारदा सिन्हा (Synth Tribute)",
                melody: 'pahile'
            },
            {
                title: "उगिहें सूरज गोसइयां हे",
                artist: "शारदा सिन्हा (Synth Tribute)",
                melody: 'ugihe'
            },
            {
                title: "काँच ही बाँस के बहँगिया",
                artist: "अनुराधा पौडवाल (Synth Tribute)",
                melody: 'kach'
            }
        ];

        this.currentTrackIndex = 0;
        this.isPlaying = false;
        this.isLocalAudio = false;

        // Active synth nodes (for stop/pause)
        this._melodyTimeout = null;
        this._melodyNodes = [];
        this._droneNodes = [];
        this._tablaTimeout = null;
        this._masterGain = null;

        // Local MP3 player
        this.localAudio = null;
        this.initLocalAudio();
    }

    // ─────────────────────────────────────────────
    //  BHAIRAVI RAAG note frequencies (Sa = C4)
    // ─────────────────────────────────────────────
    get NOTES() {
        return {
            // Octave below
            NI_LOW:  246.94,  // Bb3 (komal Ni, lower octave)
            // Madhya Saptak (middle octave)
            SA:      261.63,  // C4
            RE:      277.18,  // C#4 (komal Re in Bhairavi)
            GA:      311.13,  // Eb4 (komal Ga in Bhairavi)
            MA:      349.23,  // F4
            PA:      392.00,  // G4
            DHA:     415.30,  // Ab4 (komal Dha in Bhairavi)
            NI:      466.16,  // Bb4 (komal Ni in Bhairavi)
            // Taar Saptak (upper octave)
            SA2:     523.25,  // C5
            RE2:     554.37,  // C#5
            GA2:     622.25,  // Eb5
            MA2:     698.46,  // F5
            PA2:     783.99,  // G5
        };
    }

    // ─────────────────────────────────────────────
    //  MELODY DEFINITIONS  (freq, duration pairs)
    //  Each phrase loops seamlessly
    // ─────────────────────────────────────────────
    getMelodySequence(key) {
        const N = this.NOTES;
        const melodies = {
            // "Kelwa Ke Paat Par Ugelan Suruj Dev"
            kelwa: [
                [N.SA,  0.4], [N.GA,  0.4], [N.MA,  0.5], [N.PA,  0.6],
                [N.MA,  0.3], [N.GA,  0.4], [N.RE,  0.5], [N.SA,  0.7],
                [N.NI_LOW,0.3],[N.SA, 0.4], [N.RE,  0.4], [N.GA,  0.5],
                [N.MA,  0.4], [N.PA,  0.5], [N.DHA, 0.4], [N.PA,  0.5],
                [N.MA,  0.3], [N.GA,  0.4], [N.SA,  0.8], [0,     0.4],
                [N.SA,  0.3], [N.RE,  0.3], [N.GA,  0.4], [N.MA,  0.5],
                [N.GA,  0.3], [N.RE,  0.4], [N.SA,  1.0], [0,     0.5],
            ],
            // "Pahile Pahil Chhathi Maiya"
            pahile: [
                [N.PA,  0.4], [N.MA,  0.3], [N.GA,  0.5], [N.MA,  0.4],
                [N.PA,  0.6], [N.DHA, 0.4], [N.PA,  0.5], [0,     0.3],
                [N.MA,  0.4], [N.GA,  0.4], [N.RE,  0.4], [N.SA,  0.6],
                [N.NI_LOW,0.4],[N.SA, 0.5], [N.RE,  0.4], [N.GA,  0.5],
                [N.MA,  0.3], [N.PA,  0.5], [N.SA2, 0.5], [N.NI,  0.4],
                [N.PA,  0.4], [N.MA,  0.4], [N.GA,  0.4], [N.SA,  0.9],
                [0,     0.5],
            ],
            // "Ugihe Suraj Gosain He"
            ugihe: [
                [N.RE,  0.3], [N.GA,  0.5], [N.MA,  0.4], [N.PA,  0.5],
                [N.MA,  0.3], [N.RE,  0.4], [N.GA,  0.5], [N.SA,  0.6],
                [N.SA2, 0.4], [N.NI,  0.3], [N.PA,  0.4], [N.DHA, 0.5],
                [N.PA,  0.4], [N.MA,  0.4], [N.GA,  0.4], [N.RE,  0.5],
                [N.SA,  0.5], [N.NI_LOW,0.3],[N.SA, 0.4], [N.GA,  0.4],
                [N.MA,  0.5], [N.GA,  0.3], [N.RE,  0.4], [N.SA,  0.9],
                [0,     0.4],
            ],
            // "Kanch Hi Baans Ke Bahangia"
            kach: [
                [N.SA,  0.3], [N.SA,  0.3], [N.RE,  0.4], [N.GA,  0.5],
                [N.MA,  0.5], [N.GA,  0.3], [N.MA,  0.4], [N.PA,  0.6],
                [N.DHA, 0.4], [N.PA,  0.4], [N.MA,  0.4], [N.GA,  0.5],
                [N.RE,  0.4], [N.SA,  0.6], [0,     0.3],
                [N.NI_LOW,0.3],[N.SA, 0.4], [N.RE,  0.4], [N.GA,  0.5],
                [N.MA,  0.4], [N.PA,  0.5], [N.MA2, 0.4], [N.PA2, 0.5],
                [N.GA2, 0.4], [N.MA2, 0.4], [N.SA2, 0.9], [0,     0.5],
            ],
        };
        return melodies[key] || melodies.kelwa;
    }

    // ─────────────────────────────────────────────
    //  BANSURI (Flute) note synthesizer
    // ─────────────────────────────────────────────
    _playFluteNote(freq, duration, startTime, gainNode) {
        if (!this.ctx || freq === 0) return;

        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const noteGain = this.ctx.createGain();

        // Flute-like timbre: sine + small triangle harmonic
        osc1.type = 'sine';
        osc2.type = 'triangle';
        osc1.frequency.setValueAtTime(freq, startTime);
        osc2.frequency.setValueAtTime(freq * 2.01, startTime);

        // Breath attack + decay envelope
        noteGain.gain.setValueAtTime(0.001, startTime);
        noteGain.gain.linearRampToValueAtTime(0.28, startTime + 0.06);
        noteGain.gain.linearRampToValueAtTime(0.22, startTime + duration * 0.5);
        noteGain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

        // Slight vibrato (gamak)
        const vibrato = this.ctx.createOscillator();
        const vibratoGain = this.ctx.createGain();
        vibrato.frequency.value = 5.5;
        vibratoGain.gain.value = 3.5;
        vibrato.connect(vibratoGain);
        vibratoGain.connect(osc1.frequency);

        const warmFilter = this.ctx.createBiquadFilter();
        warmFilter.type = 'lowpass';
        warmFilter.frequency.value = 2800;

        osc1.connect(warmFilter);
        osc2.connect(warmFilter);
        warmFilter.connect(noteGain);
        noteGain.connect(gainNode);

        osc1.start(startTime);
        osc2.start(startTime);
        vibrato.start(startTime);
        osc1.stop(startTime + duration + 0.05);
        osc2.stop(startTime + duration + 0.05);
        vibrato.stop(startTime + duration + 0.05);

        this._melodyNodes.push(osc1, osc2, vibrato);
    }

    // ─────────────────────────────────────────────
    //  TANPURA DRONE  (Sa - Pa - Sa loop)
    // ─────────────────────────────────────────────
    _startDrone() {
        if (!this.ctx) return;
        const N = this.NOTES;
        const droneFreqs = [N.SA / 2, N.SA, N.PA, N.SA2];

        droneFreqs.forEach((freq, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const filter = this.ctx.createBiquadFilter();

            osc.type = 'sawtooth';
            osc.frequency.value = freq;
            filter.type = 'lowpass';
            filter.frequency.value = 600;
            gain.gain.value = [0.06, 0.04, 0.03, 0.025][i];

            // Slow swell
            gain.gain.setValueAtTime(0, this.ctx.currentTime);
            gain.gain.linearRampToValueAtTime(gain.gain.value, this.ctx.currentTime + 3.0);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(this._masterGain);
            osc.start();
            this._droneNodes.push(osc, gain);
        });
    }

    // ─────────────────────────────────────────────
    //  TABLA rhythm pattern (Dadra taal 6-beat)
    // ─────────────────────────────────────────────
    _scheduleTabla(startTime, bpm = 72) {
        if (!this.ctx || this.isMuted) return;
        const beatDur = 60 / bpm;
        // Dadra pattern: Dha Dhi Na | Dha Ti Na
        //                  beat: 1    2    3  | 4    5    6
        const pattern = [
            { beat: 0,   freq: 100, dur: 0.12, gain: 0.22 }, // Dha (bayan+dayan)
            { beat: 1,   freq: 180, dur: 0.08, gain: 0.14 }, // Dhi
            { beat: 2,   freq: 220, dur: 0.07, gain: 0.10 }, // Na
            { beat: 3,   freq: 95,  dur: 0.13, gain: 0.20 }, // Dha
            { beat: 4,   freq: 240, dur: 0.07, gain: 0.09 }, // Ti
            { beat: 5,   freq: 220, dur: 0.07, gain: 0.09 }, // Na
        ];

        const cycleDur = beatDur * 6;

        pattern.forEach(hit => {
            const hitTime = startTime + hit.beat * beatDur;
            this._playDrum(hitTime, hit.freq, hit.dur, hit.gain);
        });

        // Schedule next cycle
        const nextCycle = startTime + cycleDur;
        const delay = (nextCycle - this.ctx.currentTime) * 1000 - 50;
        this._tablaTimeout = setTimeout(() => {
            if (this.isPlaying && !this.isLocalAudio) {
                this._scheduleTabla(nextCycle, bpm);
            }
        }, Math.max(delay, 0));
    }

    _playDrum(time, freq, dur, gainVal) {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, time);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.4, time + dur);
        filter.type = 'lowpass';
        filter.frequency.value = 500;

        gain.gain.setValueAtTime(gainVal, time);
        gain.gain.exponentialRampToValueAtTime(0.0001, time + dur);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this._masterGain);
        osc.start(time);
        osc.stop(time + dur + 0.01);
        this._melodyNodes.push(osc);
    }

    // ─────────────────────────────────────────────
    //  PLAY a full synthesized track (loops)
    // ─────────────────────────────────────────────
    _playSynthTrack(trackIndex) {
        if (!this.ctx) return;
        this._stopSynthTrack();

        const track = this.tracks[trackIndex];
        const sequence = this.getMelodySequence(track.melody);

        // Master gain (controls overall synth volume)
        this._masterGain = this.ctx.createGain();
        this._masterGain.gain.value = this.isMuted ? 0 : this.volume * 0.9;
        this._masterGain.connect(this.ctx.destination);

        // Reverb-like delay for warmth
        const delay = this.ctx.createDelay(0.4);
        const delayGain = this.ctx.createGain();
        delay.delayTime.value = 0.22;
        delayGain.gain.value = 0.18;
        this._masterGain.connect(delay);
        delay.connect(delayGain);
        delayGain.connect(this._masterGain);

        this._startDrone();

        // Schedule melody notes
        const scheduleLoop = (loopStart) => {
            if (!this.isPlaying || this.isLocalAudio) return;

            let t = loopStart;
            const loopGain = this.ctx.createGain();
            loopGain.gain.value = 1;
            loopGain.connect(this._masterGain);

            sequence.forEach(([freq, dur]) => {
                this._playFluteNote(freq, dur, t, loopGain);
                t += dur;
            });

            // Start tabla on the first loop
            if (loopStart === this.ctx.currentTime + 0.1) {
                this._scheduleTabla(loopStart, 72);
            }

            const loopDuration = sequence.reduce((sum, [, d]) => sum + d, 0);
            const nextLoopTime = loopStart + loopDuration;
            const msUntilNext = (nextLoopTime - this.ctx.currentTime) * 1000 - 100;

            this._melodyTimeout = setTimeout(() => {
                if (this.isPlaying && !this.isLocalAudio) {
                    scheduleLoop(nextLoopTime);
                }
            }, Math.max(msUntilNext, 0));
        };

        scheduleLoop(this.ctx.currentTime + 0.1);
    }

    _stopSynthTrack() {
        clearTimeout(this._melodyTimeout);
        clearTimeout(this._tablaTimeout);
        this._melodyTimeout = null;
        this._tablaTimeout = null;

        this._melodyNodes.forEach(node => {
            try { node.stop(); } catch (e) {}
            try { node.disconnect(); } catch (e) {}
        });
        this._melodyNodes = [];

        this._droneNodes.forEach(node => {
            try { node.stop && node.stop(); } catch (e) {}
            try { node.disconnect(); } catch (e) {}
        });
        this._droneNodes = [];

        if (this._masterGain) {
            try { this._masterGain.disconnect(); } catch (e) {}
            this._masterGain = null;
        }
    }

    // ─────────────────────────────────────────────
    //  PUBLIC API
    // ─────────────────────────────────────────────

    /** Creates & resumes AudioContext; always returns a Promise. */
    async init() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContext();
        }
        if (this.ctx.state === 'suspended') {
            await this.ctx.resume();
        }
    }

    initLocalAudio() {
        this.localAudio = document.getElementById('localAudioPlayer');
        if (this.localAudio) {
            this.localAudio.volume = this.volume;
            this.localAudio.addEventListener('ended', () => this.nextTrack());
        }
    }

    async playTrack(index) {
        await this.init();   // ← await so context is RUNNING before scheduling notes

        // Stop local audio if running
        if (this.isLocalAudio && this.localAudio) {
            this.localAudio.pause();
            this.isLocalAudio = false;
        }

        this.currentTrackIndex = index;
        this.isPlaying = true;
        this._playSynthTrack(index);
        this.updateUI(true);

        if (window.showToast) {
            window.showToast(`🎵 ${this.tracks[index].title}`);
        }
    }

    async togglePlay() {
        // Handle local MP3
        if (this.isLocalAudio && this.localAudio) {
            await this.init();
            if (this.localAudio.paused) {
                this.localAudio.play();
                this.isPlaying = true;
                this.updateUI(true);
            } else {
                this.localAudio.pause();
                this.isPlaying = false;
                this.updateUI(false);
            }
            return;
        }

        if (this.isPlaying) {
            // Pause: stop synth (no need to await — just stopping)
            this._stopSynthTrack();
            this.isPlaying = false;
            this.updateUI(false);
        } else {
            // Resume / Play — MUST await init so context is running first
            await this.init();
            this.isPlaying = true;
            this._playSynthTrack(this.currentTrackIndex);
            this.updateUI(true);
        }
    }

    nextTrack() {
        const nextIndex = (this.currentTrackIndex + 1) % this.tracks.length;
        const trackSelect = document.getElementById('trackSelect');
        if (trackSelect) trackSelect.value = nextIndex;
        this.playTrack(nextIndex);
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        if (this._masterGain && this.ctx) {
            this._masterGain.gain.setTargetAtTime(
                this.isMuted ? 0 : this.volume * 0.9,
                this.ctx.currentTime, 0.05
            );
        }
        if (this.localAudio) this.localAudio.muted = this.isMuted;
        return this.isMuted;
    }

    startAmbientMelody() {
        // No-op — music starts on user ▶ press to respect autoplay policy.
    }

    setVolume(percent) {
        this.volume = percent / 100;
        if (this._masterGain && this.ctx && !this.isMuted) {
            this._masterGain.gain.setTargetAtTime(
                this.volume * 0.9, this.ctx.currentTime, 0.05
            );
        }
        if (this.localAudio) this.localAudio.volume = this.volume;
    }

    playCustomFile(file) {
        if (!file || !this.localAudio) return;

        // Stop synth
        this._stopSynthTrack();
        this.isPlaying = false;

        const fileUrl = URL.createObjectURL(file);
        this.localAudio.src = fileUrl;
        this.localAudio.volume = this.volume;
        this.localAudio.play().then(() => {
            this.isLocalAudio = true;
            this.isPlaying = true;
            this.updateUI(true);
            if (window.showToast) {
                window.showToast(`🎵 आपका गाना शुरू हुआ: ${file.name}`);
            }
        }).catch(err => {
            console.error('Local audio playback error:', err);
        });
    }

    updateUI(playing) {
        const playIcon = document.getElementById('playIcon');
        const vinyl = document.getElementById('vinylRecord');
        const equalizerBars = document.querySelectorAll('.equalizer-bar');

        if (playIcon) playIcon.innerText = playing ? '⏸' : '▶';
        if (vinyl) vinyl.classList.toggle('spinning', playing);
        equalizerBars.forEach(bar => bar.classList.toggle('animating', playing));
    }

    // ─────────────────────────────────────────────
    //  SHANKHNAAD  (शंखनाद)
    // ─────────────────────────────────────────────
    playShankh() {
        this.init();
        if (!this.ctx) return;

        const t = this.ctx.currentTime;
        const duration = 4.2;
        const fundamental = 246.94; // B3

        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const subOsc = this.ctx.createOscillator();

        osc1.type = 'sawtooth';
        osc2.type = 'triangle';
        subOsc.type = 'sine';

        const setupPitch = (osc, multiplier) => {
            osc.frequency.setValueAtTime(fundamental * multiplier * 0.92, t);
            osc.frequency.exponentialRampToValueAtTime(fundamental * multiplier * 1.05, t + 0.4);
            osc.frequency.exponentialRampToValueAtTime(fundamental * multiplier * 1.0, t + 1.2);
            osc.frequency.exponentialRampToValueAtTime(fundamental * multiplier * 0.95, t + duration - 0.5);
            osc.frequency.exponentialRampToValueAtTime(fundamental * multiplier * 0.85, t + duration);
        };

        setupPitch(osc1, 1.0);
        setupPitch(osc2, 2.0);
        setupPitch(subOsc, 0.5);

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(600, t);
        filter.frequency.exponentialRampToValueAtTime(1400, t + 0.5);
        filter.frequency.exponentialRampToValueAtTime(800, t + duration);
        filter.Q.value = 4.0;

        const gainNode = this.ctx.createGain();
        gainNode.gain.setValueAtTime(0.001, t);
        gainNode.gain.linearRampToValueAtTime(0.5, t + 0.5);
        gainNode.gain.linearRampToValueAtTime(0.42, t + 2.0);
        gainNode.gain.exponentialRampToValueAtTime(0.001, t + duration);

        osc1.connect(filter);
        osc2.connect(filter);
        subOsc.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.ctx.destination);

        [osc1, osc2, subOsc].forEach(osc => { osc.start(t); osc.stop(t + duration); });
    }

    // ─────────────────────────────────────────────
    //  TEMPLE BELL  (मंदिर की घंटी)
    // ─────────────────────────────────────────────
    playBell(freq = 1200) {
        this.init();
        if (!this.ctx) return;

        const t = this.ctx.currentTime;
        const partials = [1, 2.76, 5.4];
        const gains   = [0.35, 0.2, 0.08];

        partials.forEach((ratio, i) => {
            const osc  = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const decay = 2.0 / (i + 1);

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq * ratio, t);
            gain.gain.setValueAtTime(gains[i], t);
            gain.gain.exponentialRampToValueAtTime(0.0001, t + decay);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(t);
            osc.stop(t + decay);
        });
    }

    // ─────────────────────────────────────────────
    //  ARGHYA SPLASH  (जल की धार)
    // ─────────────────────────────────────────────
    playArghyaSplash() {
        this.init();
        if (!this.ctx) return;

        const t = this.ctx.currentTime;
        const bufferSize = this.ctx.sampleRate * 2.0;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data   = buffer.getChannelData(0);

        let b0 = 0, b1 = 0, b2 = 0;
        for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            b0 = 0.99886 * b0 + white * 0.055;
            b1 = 0.99332 * b1 + white * 0.075;
            b2 = 0.96900 * b2 + white * 0.15;
            data[i] = (b0 + b1 + b2) * 0.15;
        }

        const noise  = this.ctx.createBufferSource();
        noise.buffer = buffer;
        const filter = this.ctx.createBiquadFilter();
        filter.type  = 'bandpass';
        filter.frequency.setValueAtTime(750, t);
        filter.frequency.exponentialRampToValueAtTime(400, t + 1.8);
        filter.Q.value = 2.0;

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.01, t);
        gain.gain.linearRampToValueAtTime(0.3, t + 0.3);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 2.0);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);
        noise.start(t);
        noise.stop(t + 2.0);
    }

    // YouTube API stub — no longer used but kept to avoid errors if YT script loads
    onYouTubeIframeAPIReady() { /* no-op — offline synth replaces YouTube */ }
}

// Global singleton
window.chhathAudio = new ChhathAudioEngine();

// YouTube hook stub (script still loads from index.html — just ignore it)
window.onYouTubeIframeAPIReady = function () {
    if (window.chhathAudio) window.chhathAudio.onYouTubeIframeAPIReady();
};
