/**
 * Windows 95 / 98 Internet Explorer 5 Simulator
 * Vintage web experience with AltaVista, Geocities, Free RAM scams, and 56k dial-up audio!
 */

class BrowserApp {
    constructor() {
        this.winId = 'app-browser';
        this.currentUrl = 'http://www.altavista.digital.com';
        this.connected = false;
        this.dialing = false;
    }

    open() {
        const content = `
            <div class="browser-app">
                <div class="browser-toolbar">
                    <button class="win-btn b-btn" id="br-back">◄</button>
                    <button class="win-btn b-btn" id="br-forward">►</button>
                    <button class="win-btn b-btn" id="br-stop">✕</button>
                    <button class="win-btn b-btn" id="br-refresh">🔄</button>
                    <button class="win-btn b-btn" id="br-home">🏠</button>
                    <button class="win-btn b-btn-dial" id="br-dial-btn">📞 Connecter Modem 56k</button>
                </div>
                <div class="browser-address-bar">
                    <span class="addr-label">Adresse :</span>
                    <input type="text" class="win-input addr-input" id="br-url-input" value="${this.currentUrl}" />
                    <button class="win-btn" id="br-go-btn">OK</button>
                </div>
                <div class="browser-viewport" id="br-viewport">
                    <!-- Page content will be injected here -->
                </div>
                <div class="browser-status-bar">
                    <span id="br-status-text">Prêt</span>
                    <span class="br-status-zone">Zone Internet</span>
                </div>
            </div>
        `;

        window.windowManager.createWindow({
            id: this.winId,
            title: 'Microsoft Internet Explorer 5.0',
            icon: 'internetExplorer',
            width: 520,
            height: 440,
            content,
            resizable: true
        });

        this.initBrowser();
    }

    initBrowser() {
        const urlInput = document.getElementById('br-url-input');
        const goBtn = document.getElementById('br-go-btn');
        const dialBtn = document.getElementById('br-dial-btn');
        const homeBtn = document.getElementById('br-home');

        if (goBtn && urlInput) {
            goBtn.onclick = () => {
                this.navigate(urlInput.value);
            };
            urlInput.onkeydown = (e) => {
                if (e.key === 'Enter') this.navigate(urlInput.value);
            };
        }

        if (homeBtn) {
            homeBtn.onclick = () => {
                this.navigate('http://www.altavista.digital.com');
            };
        }

        if (dialBtn) {
            dialBtn.onclick = () => {
                this.triggerDialup();
            };
        }

        this.renderPage(this.currentUrl);
    }

    triggerDialup() {
        if (this.dialing) return;
        this.dialing = true;
        const status = document.getElementById('br-status-text');
        if (status) status.textContent = 'Composition du numéro 08 36 01 02 03... (Modem US Robotics 56k)';

        window.retroAudio.playModem56k();

        setTimeout(() => {
            this.connected = true;
            this.dialing = false;
            if (status) status.textContent = 'Connecté à 53 333 bps (Compression V.90 activée)';
            const dialBtn = document.getElementById('br-dial-btn');
            if (dialBtn) dialBtn.textContent = '🟢 Connecté (56 Kbps)';

            if (window.gameEngine) {
                window.gameEngine.showNotification('🌐 Connexion Internet 56k établie', 'Attention : Ne décrochez pas le téléphone du salon !');
            }
        }, 5500);
    }

    navigate(url) {
        window.retroAudio.playClick();
        this.currentUrl = url.trim();
        const input = document.getElementById('br-url-input');
        if (input) input.value = this.currentUrl;
        this.renderPage(this.currentUrl);
    }

    renderPage(url) {
        const vp = document.getElementById('br-viewport');
        if (!vp) return;

        if (url.includes('altavista')) {
            vp.innerHTML = `
                <div class="web-altavista">
                    <div class="av-logo">AltaVista<span>™</span> Search</div>
                    <div class="av-tagline">Le moteur de recherche le plus rapide du World Wide Web</div>
                    <div class="av-search-box">
                        <input type="text" class="win-input" id="av-query" placeholder="Rechercher des fichiers MP3, astuces Windows..." value="comment télécharger de la ram" />
                        <button class="win-btn" id="av-btn">Chercher</button>
                    </div>
                    <div class="av-links">
                        <a href="#" class="av-link" data-url="http://www.telecharger-ram-gratuite.net">👉 Télécharger 128 Mo de RAM Gratuitement</a> |
                        <a href="#" class="av-link" data-url="http://www.geocities.com/area51/vault/9842">👽 Site perso Geocities de Kévin</a> |
                        <a href="#" class="av-link" data-url="http://www.kazaa-mp3-gratuit.com">🎵 Kazaa MP3 & Cracks</a>
                    </div>
                    <div class="vintage-banner">
                        ★ FÉLICITATIONS ! VOUS ÊTES LE 1 000 000ème VISITEUR ! CLIQUEZ ICI POUR GAGNER UN SCANNER À PLAT ★
                    </div>
                </div>
            `;
        } else if (url.includes('ram')) {
            vp.innerHTML = `
                <div class="web-ram">
                    <h2 class="blink-text">⚡ RAM-BOOSTER 98 TURBO ⚡</h2>
                    <p class="ram-sub">Votre ordinateur manque de mémoire pour faire tourner Half-Life ou Encarta 95 ?</p>
                    <div class="ram-box">
                        <div class="ram-meter">RAM Système actuelle : <strong>16 Mo</strong></div>
                        <div class="ram-target">RAM après installation : <strong>512 Mo DDR !</strong></div>
                        <button class="win-btn ram-download-btn" id="btn-download-ram">💾 TÉLÉCHARGER LA RAM (14 Ko)</button>
                    </div>
                    <p class="ram-disclaimer">* Garanti 100% sans virus, compatible Windows 95 OSR2.</p>
                </div>
            `;
        } else if (url.includes('geocities')) {
            vp.innerHTML = `
                <div class="web-geocities">
                    <div class="geo-marquee"><marquee scrollamount="6">★★★ BIENVENUE SUR MON SITE CYBER-ESPACE 1998 ★★★ NE PAS COPIER MES GIFS SANS PERMISSION ★★★</marquee></div>
                    <div class="geo-construction">
                        <span class="geo-icon">🚧</span>
                        <span>SITE EN CONSTRUCTION PERMANENTE</span>
                        <span class="geo-icon">🚧</span>
                    </div>
                    <p>Salut à tous ! Moi c'est Kévin du 93. Voici ma page dédiée aux codes de triche Doom 2 et aux photos de mon chat.</p>
                    <div class="geo-midi-player">
                        ♫ Musique de fond : <em>Final_Fantasy_7_battle.mid</em> (Lecture...)
                    </div>
                    <div class="geo-counter">
                        Nombre de visiteurs : <strong>[ 0 0 1 8 4 9 ]</strong>
                    </div>
                    <div class="geo-guestbook">
                        <button class="win-btn" id="btn-guestbook">✍️ Signer mon livre d'or (+100 Octets)</button>
                    </div>
                </div>
            `;
        } else if (url.includes('kazaa')) {
            vp.innerHTML = `
                <div class="web-kazaa">
                    <h3>💿 Kazaa P2P FastTrack - Top Téléchargements 1999</h3>
                    <div class="kazaa-list">
                        <div class="kazaa-item">
                            <span>🎵 Eiffel_65_Blue_Da_Ba_Dee.mp3.exe (45 Ko)</span>
                            <button class="win-btn kz-dl" data-name="Eiffel 65">Télécharger</button>
                        </div>
                        <div class="kazaa-item">
                            <span>🎵 Britney_Spears_Baby_One_More_Time.mp3.vbs (12 Ko)</span>
                            <button class="win-btn kz-dl" data-name="Britney">Télécharger</button>
                        </div>
                        <div class="kazaa-item">
                            <span>🎮 Diablo_2_Crack_NoCD_Keygen.exe (88 Ko)</span>
                            <button class="win-btn kz-dl" data-name="Diablo 2 Keygen">Télécharger</button>
                        </div>
                        <div class="kazaa-item">
                            <span>👾 Matrix_ScreenSaver_Real3D.scr (120 Ko)</span>
                            <button class="win-btn kz-dl" data-name="Matrix Saver">Télécharger</button>
                        </div>
                    </div>
                </div>
            `;
        } else {
            vp.innerHTML = `
                <div class="web-error">
                    <h2>Impossible d'afficher la page</h2>
                    <p>La page demandée est introuvable ou le serveur DNS est tombé en panne.</p>
                    <p>Vérifiez que votre câble de modem RJ11 est bien branché dans la prise murale.</p>
                </div>
            `;
        }

        // Attach event listeners for web page links
        const links = vp.querySelectorAll('.av-link');
        links.forEach(l => {
            l.onclick = (e) => {
                e.preventDefault();
                this.navigate(l.dataset.url);
            };
        });

        // Banner clicker
        const banner = vp.querySelector('.vintage-banner');
        if (banner) {
            banner.onclick = () => {
                window.retroAudio.playAsterisk();
                if (window.windowManager) window.windowManager.spawnErrorDialog('ALERTE POPUP', 'VOUS AVEZ REMPORTÉ UNE IMPRIMANTE COULEUR ! (Veuillez insérer votre carte de crédit)');
            };
        }

        // RAM download
        const ramBtn = vp.querySelector('#btn-download-ram');
        if (ramBtn) {
            ramBtn.onclick = () => {
                window.retroAudio.playError();
                if (window.gameEngine) {
                    const dmgBonus = 1200;
                    window.gameEngine.bytes += dmgBonus;
                    window.gameEngine.totalBytes += dmgBonus;
                    window.gameEngine.updateDamage();
                    window.gameEngine.spawnFloatText(`+${dmgBonus} Octets (RAM Infectée)`, window.innerWidth / 2, window.innerHeight / 2);
                    window.gameEngine.showNotification('⚠️ Téléchargement terminé', 'ram_booster_setup.exe a remplacé SYSTEM.DAT par un script VBS.');
                }
                if (window.windowManager) {
                    window.windowManager.spawnErrorDialog("Erreur d'allocation mémoire", "Erreur fatale : La RAM téléchargée a écrasé l'espace d'adressage du noyau.");
                }
            };
        }

        // Kazaa downloads
        const kzButtons = vp.querySelectorAll('.kz-dl');
        kzButtons.forEach(b => {
            b.onclick = () => {
                window.retroAudio.playAsterisk();
                if (window.gameEngine) {
                    const bonus = 800;
                    window.gameEngine.bytes += bonus;
                    window.gameEngine.totalBytes += bonus;
                    window.gameEngine.updateDamage();
                    window.gameEngine.spawnFloatText(`+${bonus} Octets (Trojan reçu)`, window.innerWidth / 2, window.innerHeight / 2);
                    window.gameEngine.showNotification('📥 Kazaa P2P', `Téléchargement de ${b.dataset.name} terminé. 4 nouveaux processus inconnus ont démarré.`);
                }
            };
        });

        // Geocities Guestbook
        const gbBtn = vp.querySelector('#btn-guestbook');
        if (gbBtn) {
            gbBtn.onclick = () => {
                window.retroAudio.playDing();
                if (window.gameEngine) {
                    window.gameEngine.bytes += 100;
                    window.gameEngine.totalBytes += 100;
                    window.gameEngine.updateDamage();
                    window.gameEngine.showNotification('✍️ Livre d\'or signé', 'Vous avez laissé un message : "Super site Kévin ! Viens voir le mien !"');
                }
            };
        }
    }
}

// Global instance
window.browserApp = new BrowserApp();
