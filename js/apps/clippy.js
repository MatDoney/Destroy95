/**
 * Bouzedows / Office 97 Assistant: Clippy (Le Trombone)
 * Animated assistant with sarcastic advice, glitch states, and interactive dialogue.
 */

class ClippyCompanion {
    constructor() {
        this.el = null;
        this.bubble = null;
        this.interval = null;
        this.visible = false;
        this.quotes = [
            {
                text: "Il semblerait que vous essayiez de faire planter ce PC. Voulez-vous que je supprime C:\\BOUZEDOWS\\SYSTEM32 pour gagner du temps ?",
                yesBonus: 500,
                yesMsg: "C'est parti ! 412 fichiers DLL ont été effacés."
            },
            {
                text: "Astuce : Saviez-vous que retirer la disquette pendant que la LED rouge clignote crée de superbes glitchs ?",
                yesBonus: 350,
                yesMsg: "Bruit de secteur défectueux simulé avec succès."
            },
            {
                text: "Votre processeur chauffe à plus de 80°C. Voulez-vous que j'augmente la vitesse du ventilateur (ou que je fasse griller un toast) ?",
                yesBonus: 800,
                yesMsg: "Odeur de composant électronique brûlé détectée."
            },
            {
                text: "J'ai trouvé 14 virus non enregistrés sur votre machine. Voulez-vous leur donner un accès Internet prioritaire ?",
                yesBonus: 1200,
                yesMsg: "Les virus remercient chaleureusement votre aimable coopération."
            },
            {
                text: "Il semble que vous cliquiez comme un forcené. Voulez-vous que je remplace votre curseur par une explosion nucléaire ?",
                yesBonus: 600,
                yesMsg: "Curseur surchargé de positrons !"
            }
        ];
    }

    init() {
        this.createElements();
        // Periodically appear
        setTimeout(() => this.showRandomQuote(), 4000);
        this.interval = setInterval(() => {
            if (!this.visible && Math.random() < 0.45) {
                this.showRandomQuote();
            }
        }, 22000);
    }

    createElements() {
        const wrap = document.createElement('div');
        wrap.className = 'clippy-wrapper hidden';
        wrap.id = 'clippy-actor';

        wrap.innerHTML = `
            <div class="clippy-speech-bubble" id="clippy-bubble">
                <div class="clippy-text" id="clippy-msg">Bonjour ! Je suis Clippy, votre assistant.</div>
                <div class="clippy-bubble-btns">
                    <button class="win-btn clippy-btn" id="clippy-btn-yes">Oui</button>
                    <button class="win-btn clippy-btn" id="clippy-btn-no">Non</button>
                    <button class="win-btn clippy-btn" id="clippy-btn-shutup">Tais-toi</button>
                </div>
            </div>
            <div class="clippy-character" id="clippy-sprite" title="Clippy - Cliquez pour lui parler !">
                ${RetroIcons.clippy}
            </div>
        `;

        document.body.appendChild(wrap);
        this.el = wrap;
        this.bubble = wrap.querySelector('#clippy-bubble');

        wrap.querySelector('#clippy-sprite').onclick = () => {
            window.retroAudio.playDing();
            this.showRandomQuote();
        };

        wrap.querySelector('#clippy-btn-no').onclick = () => {
            window.retroAudio.playClick();
            this.hide();
        };

        wrap.querySelector('#clippy-btn-shutup').onclick = () => {
            window.retroAudio.playError();
            this.showCustomMessage("C'est vexant. Je me retire dans la Corbeille.", 2000);
            setTimeout(() => this.hide(), 2000);
        };
    }

    showRandomQuote() {
        if (!this.el) return;
        const q = this.quotes[Math.floor(Math.random() * this.quotes.length)];

        let txt = q.text;
        // Corrupt text if system damage is high
        if (window.gameEngine && window.gameEngine.systemDamage >= 65 && window.glitchController) {
            txt = window.glitchController.corruptText(txt, 0.15);
            this.el.classList.add('clippy-corrupted');
        } else {
            this.el.classList.remove('clippy-corrupted');
        }

        const msgEl = document.getElementById('clippy-msg');
        if (msgEl) msgEl.textContent = txt;

        const yesBtn = document.getElementById('clippy-btn-yes');
        if (yesBtn) {
            yesBtn.onclick = () => {
                window.retroAudio.playAsterisk();
                if (window.gameEngine) {
                    window.gameEngine.addReward(q.yesBonus, 'Clippy', {
                        clientX: window.innerWidth - 150,
                        clientY: window.innerHeight - 150
                    });
                }
                this.showCustomMessage(q.yesMsg, 2500);
                setTimeout(() => this.hide(), 2500);
            };
        }

        this.show();
    }

    showCustomMessage(text, autoHideMs = 0) {
        const msgEl = document.getElementById('clippy-msg');
        if (msgEl) msgEl.textContent = text;
        this.show();

        if (autoHideMs > 0) {
            setTimeout(() => this.hide(), autoHideMs);
        }
    }

    show() {
        if (!this.el) return;
        this.el.classList.remove('hidden');
        this.visible = true;
        if (window.retroAudio) {
            window.retroAudio.playDing();
        }
    }

    hide() {
        if (!this.el) return;
        this.el.classList.add('hidden');
        this.visible = false;
    }
}

// Global instance
window.clippyCompanion = new ClippyCompanion();
