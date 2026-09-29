/**
 * Bouzedows Bloc-notes (Notepad)
 * Vintage text editor with classic MS-DOS config files, easter eggs, and secret passwords.
 */

class NotepadApp {
    constructor() {
        this.winId = 'app-notepad';
        this.files = {
            'AUTOEXEC.BAT': `@ECHO OFF
PROMPT $p$g
PATH C:\\BOUZEDOWS;C:\\BOUZEDOWS\\COMMAND;C:\\DOS
LH C:\\DRIVERS\\MOUSE.COM
SET BLASTER=A220 I5 D1 H5 P330 T6
SET SOUND=C:\\SB16
REM --- DEMARRAGE SYSTEME TERMINE ---`,

            'CONFIG.SYS': `DEVICE=C:\\BOUZEDOWS\\HIMEM.SYS /TESTMEM:OFF
DEVICE=C:\\BOUZEDOWS\\EMM386.EXE NOEMS
DOS=HIGH,UMB
FILES=40
BUFFERS=30
LASTDRIVE=Z
DEVICEHIGH=C:\\DRIVERS\\OAKCDROM.SYS /D:MSCD001`,

            'MOTS_DE_PASSE.TXT': `[COMPTES ET IDENTIFIANTS 1998]
ICQ UIN : 4892147 (Pass : kazaa98)
AOL France : dark_reaper_du_93 (Pass : carmageddon)
Caramail : cyber_surfer@caramail.com
Connexion Wanadoo 56k : fti/7789311 (Pass : azerty123)
Napster : mp3_lover_99`,

            'JOURNAL_VIRUS.LOG': `[14 OCTOBRE 1998 - 23:42]
Mon cousin m'a prêté une disquette sans étiquette.
Il m'a dit que c'était le nouveau Need For Speed 3.
Quand j'ai double-cliqué sur SETUP.EXE :
- Mon lecteur CD s'est ouvert tout seul.
- Le ventilateur s'est mis à hurler.
- Un gorille violet est apparu en chantant la Macarena.
- Quelque chose a effacé C:\\BOUZEDOWS\\SYSTEM...
AIDEZ-MOI.`
        };

        this.currentFileName = 'AUTOEXEC.BAT';
    }

    open() {
        const fileOptions = Object.keys(this.files).map(name => `
            <option value="${name}">${name}</option>
        `).join('');

        const content = `
            <div class="notepad-app">
                <div class="notepad-menu-bar">
                    <span>Fichier</span>
                    <span>Édition</span>
                    <span>Recherche</span>
                    <span>Aide</span>
                </div>
                <div class="notepad-toolbar">
                    <label>Fichier :</label>
                    <select class="win-select" id="np-file-select">
                        ${fileOptions}
                    </select>
                    <button class="win-btn" id="np-save-btn">Enregistrer</button>
                    <button class="win-btn" id="np-corrupt-btn">Corrompre (+Bits)</button>
                </div>
                <textarea class="notepad-textarea" id="np-editor" spellcheck="false"></textarea>
                <div class="notepad-status-bar">
                    <span id="np-status-lines">Lignes: 8 | Caractères: 214</span>
                    <span>Format : DOS / ANSI</span>
                </div>
            </div>
        `;

        window.windowManager.createWindow({
            id: this.winId,
            title: `${this.currentFileName} - Bloc-notes`,
            icon: 'notepad',
            width: 440,
            height: 350,
            content,
            resizable: true
        });

        this.initEditor();
    }

    initEditor() {
        const select = document.getElementById('np-file-select');
        const editor = document.getElementById('np-editor');
        const saveBtn = document.getElementById('np-save-btn');
        const corruptBtn = document.getElementById('np-corrupt-btn');

        if (select && editor) {
            editor.value = this.files[this.currentFileName] || '';
            this.updateStats();

            select.value = this.currentFileName;
            select.onchange = () => {
                this.currentFileName = select.value;
                editor.value = this.files[this.currentFileName] || '';
                this.updateTitle();
                this.updateStats();
                window.retroAudio.playClick();
            };

            editor.oninput = () => this.updateStats();
        }

        if (saveBtn) {
            saveBtn.onclick = () => {
                window.retroAudio.playDing();
                this.files[this.currentFileName] = editor.value;
                if (window.gameEngine) {
                    window.gameEngine.showNotification('Fichier enregistré', `Les modifications de ${this.currentFileName} ont été écrites sur le disque.`);
                }
            };
        }

        if (corruptBtn && editor) {
            corruptBtn.onclick = () => {
                window.retroAudio.playError();
                let txt = editor.value;
                const chars = ['#', '!', '?', '§', '0', '1', 'ø', '¥', '■', '▲'];
                for (let i = 0; i < 20; i++) {
                    const pos = Math.floor(Math.random() * txt.length);
                    txt = txt.substring(0, pos) + chars[Math.floor(Math.random() * chars.length)] + txt.substring(pos + 1);
                }
                editor.value = txt;
                this.files[this.currentFileName] = txt;
                this.updateStats();

                if (window.gameEngine) {
                    window.gameEngine.addReward(200, 'Texte Corrompu', {
                        clientX: window.innerWidth / 2,
                        clientY: window.innerHeight / 2
                    });
                }
            };
        }
    }

    updateStats() {
        const editor = document.getElementById('np-editor');
        const statusEl = document.getElementById('np-status-lines');
        if (!editor || !statusEl) return;

        const lines = editor.value.split('\n').length;
        const chars = editor.value.length;
        statusEl.textContent = `Lignes: ${lines} | Caractères: ${chars}`;
    }

    updateTitle() {
        const win = window.windowManager.windows.get(this.winId);
        if (win) {
            const titleEl = win.el.querySelector('.window-title-text');
            if (titleEl) titleEl.textContent = `${this.currentFileName} - Bloc-notes`;
        }
    }
}

// Global instance
window.notepadApp = new NotepadApp();
