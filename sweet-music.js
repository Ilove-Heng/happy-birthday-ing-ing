/**
 * Sweet Romantic Background Music & Sound FX Engine
 * For Ing Ing's Birthday Website 💕
 * Provides rich celebratory sound effects and melodic music box playback across all pages.
 */

(function () {
    class SweetMusicEngine {
        constructor() {
            this.ctx = null;
            this.isPlaying = false;
            this.step = 0;
            this.timer = null;
            this.particleTimer = null;
            this.masterGain = null;

            // Retrieve previous user preference from sessionStorage
            const savedState = sessionStorage.getItem('sweet_music_enabled');
            this.isEnabled = (savedState !== 'false');

            // Romantic Music Box Progression: 32-step melodic lullaby in C Major
            this.melody = [
                // Phase 1: Sweet Melodic Theme
                [523.25, 1.0, [261.63, 329.63, 392.00]], // C5 + C chord
                [659.25, 1.0, []],                        // E5
                [783.99, 1.5, [329.63, 392.00]],          // G5
                [659.25, 0.5, []],                        // E5
                [523.25, 1.0, []],                        // C5
                [587.33, 1.0, [196.00, 246.94, 293.66]], // D5 + G/B chord
                [493.88, 1.0, []],                        // B4
                [587.33, 1.5, [246.94]],                  // D5
                [659.25, 0.5, []],                        // E5
                [440.00, 1.5, [220.00, 261.63, 329.63]], // A4 + Am chord
                [523.25, 0.5, []],                        // C5
                [659.25, 1.0, [261.63]],                  // E5
                [587.33, 1.0, []],                        // D5
                [523.25, 1.0, [174.61, 220.00, 261.63]], // C5 + F chord
                [659.25, 1.0, []],                        // E5
                [587.33, 1.5, [196.00, 293.66]],          // D5 + G7
                [493.88, 0.5, []],                        // B4
                [523.25, 2.0, [261.63, 329.63, 523.25]], // C5 resolve

                // Phase 2: Soaring Romantic Melody
                [392.00, 1.0, []],                        // G4
                [523.25, 1.0, [261.63, 329.63]],          // C5
                [659.25, 1.0, []],                        // E5
                [783.99, 1.5, [392.00, 523.25]],          // G5
                [880.00, 0.5, []],                        // A5
                [783.99, 1.0, [329.63, 392.00]],          // G5 + Em chord
                [659.25, 1.0, []],                        // E5
                [698.46, 1.5, [174.61, 261.63, 349.23]], // F5 + F chord
                [659.25, 0.5, []],                        // E5
                [587.33, 1.0, [293.66, 349.23]],          // D5 + Dm
                [698.46, 1.0, []],                        // F5
                [659.25, 1.5, [196.00, 293.66, 493.88]], // E5 + G7
                [587.33, 0.5, []],                        // D5
                [523.25, 3.0, [130.81, 261.63, 329.63, 392.00, 523.25]] // C5 final resolve
            ];
        }

        initContext() {
            if (!this.ctx) {
                const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
                if (AudioCtxClass) {
                    this.ctx = new AudioCtxClass();
                    this.masterGain = this.ctx.createGain();
                    this.masterGain.gain.setValueAtTime(0.55, this.ctx.currentTime);
                    this.masterGain.connect(this.ctx.destination);
                }
            }
            if (this.ctx && this.ctx.state === 'suspended') {
                this.ctx.resume().catch(() => {});
            }
            return this.ctx;
        }

        // ==========================================
        // 1. CELEBRATION SOUND EFFECTS
        // ==========================================
        playCelebrationSound() {
            this.initContext();
            if (!this.ctx) return;
            if (this.ctx.state === 'suspended') {
                this.ctx.resume().catch(() => {});
            }

            const ctx = this.ctx;
            const now = ctx.currentTime + 0.015;

            // Sparkling joyful celebration chime arpeggio: C5, E5, G5, B5, C6, E6, G6
            const notes = [523.25, 659.25, 783.99, 987.77, 1046.50, 1318.51, 1567.98];
            notes.forEach((freq, idx) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                const noteTime = now + idx * 0.085;

                osc.type = 'triangle';
                osc.frequency.setValueAtTime(freq, noteTime);

                // Direct crisp attack with smooth decay
                gain.gain.setValueAtTime(0.42, noteTime);
                gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.85);

                osc.connect(gain);
                gain.connect(ctx.destination);

                osc.start(noteTime);
                osc.stop(noteTime + 0.9);
            });
        }

        playSparkleSound() {
            this.initContext();
            if (!this.ctx) return;
            if (this.ctx.state === 'suspended') {
                this.ctx.resume().catch(() => {});
            }

            const ctx = this.ctx;
            const now = ctx.currentTime + 0.015;
            const notes = [783.99, 1046.50, 1318.51, 1567.98];
            notes.forEach((freq, idx) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                const noteTime = now + idx * 0.06;

                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, noteTime);

                gain.gain.setValueAtTime(0.3, noteTime);
                gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.45);

                osc.connect(gain);
                gain.connect(ctx.destination);

                osc.start(noteTime);
                osc.stop(noteTime + 0.5);
            });
        }

        // ==========================================
        // 2. BACKGROUND MUSIC BOX SYNTHESIS
        // ==========================================
        playNote(freq, time, duration = 1.4, volume = 0.32) {
            if (!this.ctx || !freq) return;
            try {
                const ctx = this.ctx;
                const noteTime = (time && time > ctx.currentTime ? time : ctx.currentTime) + 0.012;

                // 1. Warm Triangle Tone (Celesta / Music Box)
                const osc = ctx.createOscillator();
                const noteGain = ctx.createGain();

                osc.type = 'triangle';
                osc.frequency.setValueAtTime(freq, noteTime);

                // Direct attack with natural exponential chime decay
                noteGain.gain.setValueAtTime(volume, noteTime);
                noteGain.gain.exponentialRampToValueAtTime(0.001, noteTime + duration);

                osc.connect(noteGain);
                noteGain.connect(this.masterGain);

                osc.start(noteTime);
                osc.stop(noteTime + duration + 0.05);

                // 2. Shimmer Sparkle Overtone (Sine at 2x freq)
                const sparkOsc = ctx.createOscillator();
                const sparkGain = ctx.createGain();

                sparkOsc.type = 'sine';
                sparkOsc.frequency.setValueAtTime(freq * 2, noteTime);

                sparkGain.gain.setValueAtTime(volume * 0.35, noteTime);
                sparkGain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.35);

                sparkOsc.connect(sparkGain);
                sparkGain.connect(this.masterGain);

                sparkOsc.start(noteTime);
                sparkOsc.stop(noteTime + 0.4);
            } catch (e) {
                console.warn('Audio scheduling note:', e);
            }
        }

        playNextStep() {
            if (!this.isPlaying || !this.ctx) return;
            if (this.ctx.state === 'suspended') {
                this.ctx.resume().then(() => this.playNextStep()).catch(() => {});
                return;
            }

            const item = this.melody[this.step];
            if (!item) {
                this.step = 0;
                return;
            }

            const [melodyFreq, durationBeats, chordNotes] = item;
            const now = this.ctx.currentTime;

            // Play main melody bell note
            this.playNote(melodyFreq, now, 1.4, 0.32);

            // Play accompanying chord harmony notes
            if (chordNotes && chordNotes.length > 0) {
                chordNotes.forEach((cf, idx) => {
                    this.playNote(cf, now + idx * 0.02, 2.0, 0.20);
                });
            }

            // Beat interval: 440ms per beat
            const beatDurationMs = durationBeats * 440;
            this.step = (this.step + 1) % this.melody.length;
            this.timer = setTimeout(() => this.playNextStep(), beatDurationMs);
        }

        async start() {
            this.initContext();
            if (this.ctx && this.ctx.state === 'suspended') {
                try {
                    await this.ctx.resume();
                } catch (e) {}
            }
            if (this.isPlaying) return;
            this.isPlaying = true;
            this.isEnabled = true;
            sessionStorage.setItem('sweet_music_enabled', 'true');
            this.playNextStep();
            this.startParticles();
            this.updateAllUI(true);
        }

        stop() {
            this.isPlaying = false;
            this.isEnabled = false;
            sessionStorage.setItem('sweet_music_enabled', 'false');
            if (this.timer) {
                clearTimeout(this.timer);
                this.timer = null;
            }
            this.stopParticles();
            this.updateAllUI(false);
        }

        toggle() {
            if (this.isPlaying) {
                this.stop();
            } else {
                this.start();
            }
        }

        startParticles() {
            if (this.particleTimer) return;
            const notes = ['♪', '♫', '♬', '💕', '✨', '🌸'];
            this.particleTimer = setInterval(() => {
                if (!this.isPlaying) return;
                const targetEl = document.getElementById('sweetMusicWidget') || 
                                 document.getElementById('music-toggle') || 
                                 document.getElementById('musicToggleBtn');
                if (!targetEl) return;

                const noteEl = document.createElement('span');
                noteEl.className = 'music-floating-note';
                noteEl.textContent = notes[Math.floor(Math.random() * notes.length)];

                const rect = targetEl.getBoundingClientRect();
                noteEl.style.left = `${rect.left + rect.width / 2 - 10 + (Math.random() * 20 - 10)}px`;
                noteEl.style.top = `${rect.top}px`;
                noteEl.style.fontSize = `${14 + Math.random() * 10}px`;

                document.body.appendChild(noteEl);
                setTimeout(() => {
                    if (noteEl.parentNode) noteEl.parentNode.removeChild(noteEl);
                }, 2400);
            }, 1200);
        }

        stopParticles() {
            if (this.particleTimer) {
                clearInterval(this.particleTimer);
                this.particleTimer = null;
            }
        }

        updateAllUI(playing) {
            // 1. Update Floating Widget
            const widget = document.getElementById('sweetMusicWidget');
            const widgetIcon = document.getElementById('sweetMusicIcon');
            const tooltip = document.getElementById('sweetMusicTooltip');

            if (widget) {
                if (playing) {
                    widget.classList.add('is-playing');
                    widget.classList.remove('is-paused');
                    if (widgetIcon) widgetIcon.className = 'fa-solid fa-music music-icon-spin';
                    if (tooltip) tooltip.textContent = 'Sweet Music 💕 (Playing)';
                } else {
                    widget.classList.remove('is-playing');
                    widget.classList.add('is-paused');
                    if (widgetIcon) widgetIcon.className = 'fa-solid fa-play';
                    if (tooltip) tooltip.textContent = 'Play Music 🎵';
                }
            }

            // 2. Update Header Button (e.g. index.html)
            const headerBtn = document.getElementById('musicToggleBtn');
            const headerIcon = document.getElementById('musicIcon');
            const headerText = document.getElementById('musicText');

            if (headerBtn) {
                if (playing) {
                    headerBtn.classList.add('music-active');
                    if (headerIcon) headerIcon.className = 'fa-solid fa-music';
                    if (headerText) headerText.textContent = 'Sweet Music 💕';
                } else {
                    headerBtn.classList.remove('music-active');
                    if (headerIcon) headerIcon.className = 'fa-solid fa-play';
                    if (headerText) headerText.textContent = 'Play Music 🎵';
                }
            }

            // 3. Update letter.html widget if present
            const letterToggle = document.getElementById('music-toggle');
            const letterIcon = document.getElementById('music-icon');
            if (letterToggle) {
                if (playing) {
                    letterToggle.classList.add('playing');
                    if (letterIcon) letterIcon.className = 'fas fa-music';
                } else {
                    letterToggle.classList.remove('playing');
                    if (letterIcon) letterIcon.className = 'fas fa-play';
                }
            }
        }
    }

    // Global Singleton Instances
    const musicEngine = new SweetMusicEngine();
    window.sweetMusic = musicEngine;
    window.playCelebrationSound = () => musicEngine.playCelebrationSound();
    window.playCelebrationChime = () => musicEngine.playCelebrationSound();
    window.playSparkleSound = () => musicEngine.playSparkleSound();

    function setupMusicUI() {
        let widget = document.getElementById('sweetMusicWidget');
        const letterToggle = document.getElementById('music-toggle');

        if (!widget && !letterToggle) {
            widget = document.createElement('div');
            widget.id = 'sweetMusicWidget';
            widget.className = 'sweet-music-widget is-paused';
            widget.setAttribute('aria-label', 'Toggle Sweet Romantic Music');
            widget.innerHTML = `
                <span class="sweet-music-tooltip" id="sweetMusicTooltip">Play Music 🎵</span>
                <i class="fa-solid fa-play" id="sweetMusicIcon"></i>
            `;
            document.body.appendChild(widget);

            widget.addEventListener('click', (e) => {
                e.stopPropagation();
                musicEngine.toggle();
            });
        }

        // Sync with index.html header button if present
        const headerBtn = document.getElementById('musicToggleBtn');
        if (headerBtn) {
            headerBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                musicEngine.toggle();
            });
        }

        // Sync with letter.html toggle if present
        if (letterToggle) {
            letterToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                musicEngine.toggle();
            });
        }

        // Autoplay logic across page navigation:
        if (musicEngine.isEnabled) {
            const attemptStart = () => {
                musicEngine.initContext();
                if (musicEngine.ctx && musicEngine.ctx.state === 'running') {
                    if (!musicEngine.isPlaying) {
                        musicEngine.start();
                    }
                }
            };

            attemptStart();

            // Unlock AudioContext on first user interaction anywhere if restricted by browser policy
            const unlockUserGesture = () => {
                if (musicEngine.isEnabled && !musicEngine.isPlaying) {
                    musicEngine.start();
                } else if (musicEngine.ctx && musicEngine.ctx.state === 'suspended') {
                    musicEngine.ctx.resume();
                }
                ['click', 'touchstart', 'scroll', 'keydown'].forEach((evt) => {
                    document.removeEventListener(evt, unlockUserGesture);
                });
            };

            ['click', 'touchstart', 'scroll', 'keydown'].forEach((evt) => {
                document.addEventListener(evt, unlockUserGesture, { passive: true, once: true });
            });
        } else {
            musicEngine.updateAllUI(false);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupMusicUI);
    } else {
        setupMusicUI();
    }
})();
