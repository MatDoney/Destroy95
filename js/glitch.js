/**
 * Visual Glitch & System Degradation Controller
 * Controls progressive corruption of the desktop, icons, fonts, screen effects, and BSOD.
 */

class GlitchController {
    constructor() {
        this.crtOverlay = null;
        this.desktop = null;
        this.bsodScreen = null;
        this.body = null;
        this.lastDialogSpawn = 0;
        this.iconGlitchInterval = null;
        this.zalgoChars = ['̸', '̵', '̷', '̴', '̶', '͜', '͝', '͠', '͏', '̢', '̧'];
    }

    init() {
        this.body = document.body;
        this.desktop = document.getElementById('desktop');
        this.crtOverlay = document.getElementById('crt-overlay');
        this.bsodScreen = document.getElementById('bsod-screen');

        this.setupBsodKeyHandler();
    }

    update(damage) {
        // Remove old glitch classes
        this.body.classList.remove(
            'glitch-stage-1', 'glitch-stage-2', 'glitch-stage-3', 
            'glitch-stage-4', 'glitch-stage-5', 'glitch-stage-apocalypse'
        );

        if (damage >= 25 && damage < 75) {
            this.body.classList.add('glitch-stage-1');
        } else if (damage >= 75 && damage < 150) {
            this.body.classList.add('glitch-stage-2');
        } else if (damage >= 150 && damage < 300) {
            this.body.classList.add('glitch-stage-3');
        } else if (damage >= 300 && damage < 600) {
            this.body.classList.add('glitch-stage-4');
        } else if (damage >= 600 && damage < 1200) {
            this.body.classList.add('glitch-stage-5');
        } else if (damage >= 1200) {
            this.body.classList.add('glitch-stage-apocalypse');
        }

        // Random error dialogue spawning as damage rises (divided by 4 frequency)
        if (damage >= 45) {
            const now = Date.now();
            // Interval divided by 4 frequency (4x longer: 48s min, 200s base)
            const interval = Math.max(48000, 200000 / (1 + damage * 0.005));
            if (now - this.lastDialogSpawn > interval && Math.random() < 0.25) {
                this.lastDialogSpawn = now;
                if (window.windowManager) {
                    window.windowManager.spawnErrorDialog();
                }
            }
        }

        // Icon gravity / displacement at high damage
        if (damage >= 50) {
            this.applyIconGlitch(damage);
        }

        // Glitch taskbar clock
        this.updateGlitchClock(damage);
    }

    applyIconGlitch(damage) {
        const icons = document.querySelectorAll('.desktop-shortcut');
        icons.forEach(icon => {
            if (Math.random() < (damage / 250)) {
                const angle = (Math.random() * (damage * 0.3) - (damage * 0.15)).toFixed(1);
                const shiftY = Math.min(25, (damage - 50) * 0.5);
                icon.style.transform = `rotate(${angle}deg) translateY(${shiftY}px)`;
            }
        });
    }

    resetIconGlitch() {
        const icons = document.querySelectorAll('.desktop-shortcut');
        icons.forEach(icon => {
            icon.style.transform = 'none';
        });
    }

    updateGlitchClock(damage) {
        const clockEl = document.getElementById('taskbar-clock-text');
        if (!clockEl) return;

        if (damage >= 70 && Math.random() < 0.3) {
            // Glitch clock to hex or corrupted year
            const hexes = ['0xDEAD', '1900', 'FFFF', 'ERR:01', 'NaN:NaN', '00:00'];
            clockEl.textContent = hexes[Math.floor(Math.random() * hexes.length)];
        } else {
            const d = new Date();
            const h = String(d.getHours()).padStart(2, '0');
            const m = String(d.getMinutes()).padStart(2, '0');
            clockEl.textContent = `${h}:${m}`;
        }
    }

    triggerScreenShake() {
        if (!this.desktop) return;
        this.desktop.classList.remove('screen-shake');
        void this.desktop.offsetWidth; // Force reflow
        this.desktop.classList.add('screen-shake');
        setTimeout(() => {
            if (this.desktop) this.desktop.classList.remove('screen-shake');
        }, 400);
    }

    triggerDegauss() {
        if (window.retroAudio) {
            window.retroAudio.playDegauss();
        }
        if (!this.body) return;

        this.body.classList.remove('degauss-active');
        void this.body.offsetWidth;
        this.body.classList.add('degauss-active');

        // Clear window trails if any
        if (window.windowManager) {
            window.windowManager.clearTrails();
        }

        setTimeout(() => {
            if (this.body) this.body.classList.remove('degauss-active');
        }, 1000);
    }

    showBsod() {
        if (!this.bsodScreen) return;
        this.bsodScreen.classList.remove('hidden');
        this.bsodScreen.focus();

        // Calculate prestige gains
        const bonusChips = Math.max(1, Math.floor(Math.sqrt((window.gameEngine.totalBytes || 1) / 100000)));
        const gainEl = document.getElementById('bsod-prestige-gain');
        if (gainEl) {
            gainEl.textContent = `Bonus de formatage : +${bonusChips} Processeur(s) Surchauffé(s) (+${(bonusChips * 25)}% destruction permanente)`;
        }
    }

    hideBsod() {
        if (!this.bsodScreen) return;
        this.bsodScreen.classList.add('hidden');
        this.resetIconGlitch();
        this.body.classList.remove('glitch-stage-1', 'glitch-stage-2', 'glitch-stage-3', 'glitch-stage-4');
        if (window.windowManager) {
            window.windowManager.clearTrails();
        }
    }

    setupBsodKeyHandler() {
        window.addEventListener('keydown', (e) => {
            if (window.gameEngine && window.gameEngine.bsodTriggered) {
                if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') {
                    e.preventDefault();
                    window.gameEngine.rebootSystem();
                }
            }
        });

        const rebootBtn = document.getElementById('bsod-reboot-btn');
        if (rebootBtn) {
            rebootBtn.onclick = () => {
                window.gameEngine.rebootSystem();
            };
        }
    }

    corruptText(str, severity = 0.2) {
        let result = '';
        for (let i = 0; i < str.length; i++) {
            result += str[i];
            if (Math.random() < severity) {
                result += this.zalgoChars[Math.floor(Math.random() * this.zalgoChars.length)];
            }
        }
        return result;
    }
}

// Global glitch controller instance
window.glitchController = new GlitchController();
