/**
 * Bouzedows XP Welcome Screen (Écran de Bienvenue / Login)
 * Authentic XP logon interface with Hollywood-hacker style auto-typing:
 * Typing any key automatically fills "Henry PC" and password bullets "••••••••••••".
 */

class XpLoginScreen {
    constructor() {
        this.targetPseudo = "Henry PC";
        this.targetPasswordBullets = "••••••••••••";
        this.currentPseudo = "";
        this.currentPassword = "";
        this.activeField = 'pseudo'; // 'pseudo' | 'password'
        this.isLoggedIn = false;
        this.onLoginCallback = null;
    }

    init(onLoginCallback) {
        this.onLoginCallback = onLoginCallback;
        this.screenEl = document.getElementById('xp-login-screen');
        if (!this.screenEl) return;

        this.pseudoInput = document.getElementById('xp-pseudo-input');
        this.passwordInput = document.getElementById('xp-password-input');
        this.goBtn = document.getElementById('xp-go-btn');
        this.quickBtn = document.getElementById('xp-quick-login-btn');
        this.powerBtn = document.getElementById('xp-power-btn');
        this.statusRow = document.getElementById('xp-status-row');
        this.inputGroup = document.getElementById('xp-input-group');

        this.updateDisplay();
        this.bindEvents();
    }

    bindEvents() {
        // Global keydown listener when login screen is active
        this.keyHandler = (e) => {
            if (this.isLoggedIn) return;

            // Ensure Web Audio context is started on user gesture
            if (window.retroAudio) {
                window.retroAudio.ensureContext();
            }

            // Ignore browser command keys
            if (e.ctrlKey || e.altKey || e.metaKey) return;
            if (['Shift', 'CapsLock', 'Control', 'Alt', 'Meta', 'Escape'].includes(e.key)) return;

            e.preventDefault();

            // Enter key
            if (e.key === 'Enter') {
                if (this.activeField === 'pseudo') {
                    if (this.currentPseudo.length < this.targetPseudo.length) {
                        this.currentPseudo = this.targetPseudo;
                    }
                    this.activeField = 'password';
                    this.updateDisplay();
                    if (window.retroAudio) window.retroAudio.playClick();
                } else {
                    if (this.currentPassword.length === 0) {
                        this.currentPassword = this.targetPasswordBullets;
                        this.updateDisplay();
                    }
                    this.submitLogin();
                }
                return;
            }

            // Tab key
            if (e.key === 'Tab') {
                this.activeField = (this.activeField === 'pseudo') ? 'password' : 'pseudo';
                this.updateDisplay();
                if (window.retroAudio) window.retroAudio.playClick();
                return;
            }

            // Backspace key
            if (e.key === 'Backspace') {
                if (this.activeField === 'password') {
                    if (this.currentPassword.length > 0) {
                        this.currentPassword = this.currentPassword.slice(0, -1);
                    } else {
                        this.activeField = 'pseudo';
                    }
                } else {
                    this.currentPseudo = this.currentPseudo.slice(0, -1);
                }
                this.updateDisplay();
                if (window.retroAudio) window.retroAudio.playClick();
                return;
            }

            // Any regular key -> Auto-type next character!
            if (this.activeField === 'pseudo') {
                if (this.currentPseudo.length < this.targetPseudo.length) {
                    this.currentPseudo = this.targetPseudo.slice(0, this.currentPseudo.length + 1);
                    if (window.retroAudio) window.retroAudio.playClick();

                    // If pseudo is complete, automatically switch to password after a brief pause
                    if (this.currentPseudo.length === this.targetPseudo.length) {
                        setTimeout(() => {
                            if (!this.isLoggedIn) {
                                this.activeField = 'password';
                                this.updateDisplay();
                            }
                        }, 120);
                    }
                } else {
                    // Already full, advance to password and add first bullet
                    this.activeField = 'password';
                    this.currentPassword = this.targetPasswordBullets.slice(0, 1);
                    if (window.retroAudio) window.retroAudio.playClick();
                }
            } else if (this.activeField === 'password') {
                if (this.currentPassword.length < this.targetPasswordBullets.length) {
                    this.currentPassword = this.targetPasswordBullets.slice(0, this.currentPassword.length + 1);
                    if (window.retroAudio) window.retroAudio.playClick();

                    // If password reached 12 characters, pressing any more keys will trigger login!
                    if (this.currentPassword.length === this.targetPasswordBullets.length) {
                        setTimeout(() => {
                            if (!this.isLoggedIn) {
                                this.submitLogin();
                            }
                        }, 250);
                    }
                } else {
                    this.submitLogin();
                }
            }

            this.updateDisplay();
        };

        window.addEventListener('keydown', this.keyHandler);

        // Click to switch field focus
        if (this.pseudoInput) {
            this.pseudoInput.addEventListener('click', (e) => {
                e.stopPropagation();
                this.activeField = 'pseudo';
                this.updateDisplay();
            });
        }

        if (this.passwordInput) {
            this.passwordInput.addEventListener('click', (e) => {
                e.stopPropagation();
                this.activeField = 'password';
                this.updateDisplay();
            });
        }

        // Green Go button
        if (this.goBtn) {
            this.goBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.submitLogin();
            });
        }

        // Quick 1-click login button
        if (this.quickBtn) {
            this.quickBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.submitLogin();
            });
        }

        // Power button (Shutdown)
        if (this.powerBtn) {
            this.powerBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (window.triggerShutDownScreen) {
                    window.triggerShutDownScreen();
                }
            });
        }
    }

    updateDisplay() {
        if (this.pseudoInput) {
            this.pseudoInput.value = this.currentPseudo;
            if (this.activeField === 'pseudo') {
                this.pseudoInput.classList.add('active-field');
            } else {
                this.pseudoInput.classList.remove('active-field');
            }
        }

        if (this.passwordInput) {
            this.passwordInput.value = this.currentPassword;
            if (this.activeField === 'password') {
                this.passwordInput.classList.add('active-field');
            } else {
                this.passwordInput.classList.remove('active-field');
            }
        }
    }

    submitLogin() {
        if (this.isLoggedIn) return;
        this.isLoggedIn = true;

        // Auto-fill full values for visual polish
        this.currentPseudo = this.targetPseudo;
        this.currentPassword = this.targetPasswordBullets;
        this.updateDisplay();

        // Switch to "Bienvenue..." loading state
        if (this.inputGroup) {
            this.inputGroup.classList.add('hidden');
        }
        if (this.statusRow) {
            this.statusRow.classList.remove('hidden');
        }

        // Play Bouzedows XP Logon Chime via Web Audio API
        if (window.retroAudio) {
            window.retroAudio.ensureContext();
            if (window.retroAudio.playXpLogon) {
                window.retroAudio.playXpLogon();
            } else if (window.retroAudio.playStartup) {
                window.retroAudio.playStartup();
            }
        }

        // Smooth fade-out of XP Login screen
        setTimeout(() => {
            if (this.screenEl) {
                this.screenEl.classList.add('fade-out');
            }

            setTimeout(() => {
                if (this.screenEl) {
                    this.screenEl.style.display = 'none';
                }
                // Cleanup listener
                window.removeEventListener('keydown', this.keyHandler);

                // Launch desktop apps and chaos engine
                if (typeof this.onLoginCallback === 'function') {
                    this.onLoginCallback();
                }
            }, 750);
        }, 1100);
    }

    // Re-lock and show login screen
    lock() {
        this.isLoggedIn = false;
        this.currentPseudo = "";
        this.currentPassword = "";
        this.activeField = 'pseudo';
        this.updateDisplay();

        if (this.inputGroup) {
            this.inputGroup.classList.remove('hidden');
        }
        if (this.statusRow) {
            this.statusRow.classList.add('hidden');
        }

        if (this.screenEl) {
            this.screenEl.style.display = 'flex';
            this.screenEl.classList.remove('fade-out');
        }

        window.removeEventListener('keydown', this.keyHandler);
        window.addEventListener('keydown', this.keyHandler);
    }
}

// Global instance
window.xpLoginScreen = new XpLoginScreen();
