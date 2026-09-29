/**
 * Bouzedows / 98 Internet Explorer 5 Simulator
 * Vintage web experience with famous parody websites:
 * - Bouzgle (Google 1998)
 * - BouzeTube (YouTube 2005 / 144p RealPlayer)
 * - FaceBouze (Facebook / TheFacebook 2004)
 * - PouicPouic (Twitter / X 140 car.)
 * - AmaBouze (Amazon 1997)
 * - Bouzepedia (Wikipedia)
 * - eBouze (eBay Enchères)
 * - NetBouze (Netflix Club Vidéo VHS)
 * - AltaVista, Geocities, RAM-Booster 98, Kazaa P2P
 */

class BrowserApp {
    constructor() {
        this.winId = 'app-browser';
        this.homeUrl = 'http://www.bouzgle.fr';
        this.currentUrl = this.homeUrl;
        this.history = [this.homeUrl];
        this.historyIndex = 0;
        this.connected = false;
        this.dialing = false;

        // Dynamic State for Pages
        this.cartItems = 0;
        this.markPokes = 0;
        this.farmCarrots = 0;
        this.tubePlaying = false;
        this.tubeComments = [
            { author: "xX_dark_sasuke_93_Xx", text: "Trop lol la vidéo ! Ajoute-moi sur MSN Messenger : dark_sasuke@hotmail.fr" },
            { author: "KévinDu93", text: "Prem's !" },
            { author: "Jean-Eudes", text: "Ma mère a décroché le téléphone fixe, ça a coupé mon téléchargement à 99% :(" }
        ];
        this.facebouzePosts = [
            { author: "Mark Bouzeberg", meta: "Il y a 10 minutes", text: "Est en train de tapoter sur son écran cathodique pour décoller la poussière." },
            { author: "Clippy le Trombone", meta: "Il y a 32 minutes", text: "Il semblerait que vous passiez votre journée sur FaceBouze au lieu de bosser sur Excel." },
            { author: "Henry PC", meta: "Il y a 1 heure", text: "Qui a éteint la multiprise dans le couloir ?? J'avais pas sauvegardé !" }
        ];
        this.tweets = [
            { author: "Bill Portes", handle: "@Bill_Portes", text: "Bouzedows 98 sera le système le plus stable de l'univers. Aucun écran bleu n'apparaîtra jamais en direct, faites-moi confiance.", likes: 1482, rts: 412 },
            { author: "Elon Bouze", handle: "@Elon_Bouze", text: "Je propose de racheter AltaVista et d'envoyer 500 disquettes 3.5 pouces en orbite géostationnaire.", likes: 890, rts: 230 },
            { author: "Jean-Michel 56k", handle: "@JM_Modem", text: "ARRÊTEZ DE DÉCROCHER LE COMBINÉ DU SALON !!! Mon MP3 de 3 Mo était à 98% de téléchargement !!!", likes: 3410, rts: 1240 },
            { author: "Clippy 95", handle: "@Clippy_Officiel", text: "Astuce du jour : supprimer SYSTEM32 libère jusqu'à 42 Mo d'espace pour installer Encarta.", likes: 2190, rts: 980 }
        ];
        this.auctions = {
            aol: { price: 14, bids: 3, userHigh: false },
            ball: { price: 5, bids: 2, userHigh: false },
            book: { price: 25, bids: 7, userHigh: false },
            vhs: { price: 18, bids: 4, userHigh: false }
        };
    }

    open() {
        const content = `
            <div class="browser-app">
                <div class="browser-toolbar">
                    <button class="win-btn b-btn" id="br-back" title="Page précédente">◄</button>
                    <button class="win-btn b-btn" id="br-forward" title="Page suivante">►</button>
                    <button class="win-btn b-btn" id="br-stop" title="Arrêter">✕</button>
                    <button class="win-btn b-btn" id="br-refresh" title="Actualiser">🔄</button>
                    <button class="win-btn b-btn" id="br-home" title="Page d'accueil">🏠</button>
                    <button class="win-btn b-btn-dial" id="br-dial-btn">${this.connected ? '🟢 Connecté (56 Kbps)' : '📞 Connecter Modem 56k'}</button>
                </div>
                <div class="browser-address-bar">
                    <span class="addr-label">Adresse :</span>
                    <input type="text" class="win-input addr-input" id="br-url-input" value="${this.currentUrl}" autocomplete="off" />
                    <button class="win-btn" id="br-go-btn">OK</button>
                </div>
                <!-- Favorites Quick Bar -->
                <div class="browser-favorites-bar">
                    <span class="fav-label">Favoris :</span>
                    <button class="win-btn fav-btn" data-url="http://www.bouzgle.fr">🔍 Bouzgle</button>
                    <button class="win-btn fav-btn" data-url="http://www.bouzetube.com">📺 BouzeTube</button>
                    <button class="win-btn fav-btn" data-url="http://www.facebouze.com">👤 FaceBouze</button>
                    <button class="win-btn fav-btn" data-url="http://www.pouicpouic.com">🐤 PouicPouic</button>
                    <button class="win-btn fav-btn" data-url="http://www.amabouze.com">📦 AmaBouze</button>
                    <button class="win-btn fav-btn" data-url="http://www.bouzepedia.org">📚 Bouzepedia</button>
                    <button class="win-btn fav-btn" data-url="http://www.ebouze.fr">🔨 eBouze</button>
                    <button class="win-btn fav-btn" data-url="http://www.netbouze.com">🎬 NetBouze</button>
                    <button class="win-btn fav-btn" data-url="http://www.telecharger-ram-gratuite.net">💾 RAM-Booster</button>
                    <button class="win-btn fav-btn" data-url="http://www.kazaa-mp3-gratuit.com">💿 Kazaa</button>
                    <button class="win-btn fav-btn" data-url="http://www.geocities.com/area51/vault/9842">👽 Geocities</button>
                    <button class="win-btn fav-btn" data-url="http://www.altavista.digital.com">🌐 AltaVista</button>
                </div>
                <!-- Stacked Toolbars Container (16 Toolbars Upgrade) -->
                <div class="browser-toolbars-container" id="br-toolbars-stack"></div>
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
            width: 580,
            height: 490,
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
        const backBtn = document.getElementById('br-back');
        const forwardBtn = document.getElementById('br-forward');
        const stopBtn = document.getElementById('br-stop');
        const refreshBtn = document.getElementById('br-refresh');

        if (goBtn && urlInput) {
            goBtn.onclick = () => this.navigate(urlInput.value);
            urlInput.onkeydown = (e) => {
                if (e.key === 'Enter') this.navigate(urlInput.value);
            };
        }

        if (homeBtn) {
            homeBtn.onclick = () => this.navigate(this.homeUrl);
        }

        if (backBtn) {
            backBtn.onclick = () => this.goBack();
        }

        if (forwardBtn) {
            forwardBtn.onclick = () => this.goForward();
        }

        if (refreshBtn) {
            refreshBtn.onclick = () => {
                window.retroAudio.playClick();
                this.renderPage(this.currentUrl);
            };
        }

        if (stopBtn) {
            stopBtn.onclick = () => {
                window.retroAudio.playClick();
                const st = document.getElementById('br-status-text');
                if (st) st.textContent = 'Chargement interrompu par l\'utilisateur.';
            };
        }

        if (dialBtn) {
            dialBtn.onclick = () => this.triggerDialup();
        }

        // Favorites quick bar listeners
        const favButtons = document.querySelectorAll('.fav-btn');
        favButtons.forEach(btn => {
            btn.onclick = () => {
                if (btn.dataset.url) this.navigate(btn.dataset.url);
            };
        });

        this.renderPage(this.currentUrl);

        if (window.virusEffects) {
            window.virusEffects.renderBrowserToolbars();
        }
    }

    goBack() {
        if (this.historyIndex > 0) {
            this.historyIndex--;
            this.currentUrl = this.history[this.historyIndex];
            const input = document.getElementById('br-url-input');
            if (input) input.value = this.currentUrl;
            window.retroAudio.playClick();
            this.renderPage(this.currentUrl);
        }
    }

    goForward() {
        if (this.historyIndex < this.history.length - 1) {
            this.historyIndex++;
            this.currentUrl = this.history[this.historyIndex];
            const input = document.getElementById('br-url-input');
            if (input) input.value = this.currentUrl;
            window.retroAudio.playClick();
            this.renderPage(this.currentUrl);
        }
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
                window.gameEngine.showNotification('🌐 Connexion Internet 56k établie', 'Attention : Ne décrochez pas le combiné téléphonique du salon !');
            }
        }, 5500);
    }

    navigate(rawUrl, addToHistory = true) {
        window.retroAudio.playClick();
        let target = rawUrl.trim().toLowerCase();

        // Smart Parody URL Routing aliases
        if (target.includes('google') || target.includes('bouzgle')) {
            target = 'http://www.bouzgle.fr';
        } else if (target.includes('youtube') || target.includes('bouzetube') || target.includes('tutube') || target.includes('tube')) {
            target = 'http://www.bouzetube.com';
        } else if (target.includes('facebook') || target.includes('facebouze') || target.includes('fb')) {
            target = 'http://www.facebouze.com';
        } else if (target.includes('amazon') || target.includes('amabouze')) {
            target = 'http://www.amabouze.com';
        } else if (target.includes('twitter') || target.includes('pouic') || target.includes('x.com')) {
            target = 'http://www.pouicpouic.com';
        } else if (target.includes('wikipedia') || target.includes('bouzepedia') || target.includes('wiki')) {
            target = 'http://www.bouzepedia.org';
        } else if (target.includes('ebay') || target.includes('ebouze')) {
            target = 'http://www.ebouze.fr';
        } else if (target.includes('netflix') || target.includes('netbouze') || target.includes('vhs')) {
            target = 'http://www.netbouze.com';
        } else if (target.includes('ram')) {
            target = 'http://www.telecharger-ram-gratuite.net';
        } else if (target.includes('kazaa')) {
            target = 'http://www.kazaa-mp3-gratuit.com';
        } else if (target.includes('geocities')) {
            target = 'http://www.geocities.com/area51/vault/9842';
        } else if (target.includes('altavista')) {
            target = 'http://www.altavista.digital.com';
        } else if (!target.startsWith('http://') && !target.startsWith('https://')) {
            target = 'http://' + target;
        }

        this.currentUrl = target;
        const input = document.getElementById('br-url-input');
        if (input) input.value = this.currentUrl;

        if (addToHistory && this.history[this.historyIndex] !== this.currentUrl) {
            this.history = this.history.slice(0, this.historyIndex + 1);
            this.history.push(this.currentUrl);
            this.historyIndex = this.history.length - 1;
        }

        const status = document.getElementById('br-status-text');
        if (status) status.textContent = `Ouverture de la page ${this.currentUrl}...`;

        setTimeout(() => {
            this.renderPage(this.currentUrl);
            if (status) status.textContent = 'Terminé';
        }, 120);
    }

    renderPage(url) {
        const vp = document.getElementById('br-viewport');
        if (!vp) return;

        const u = url.toLowerCase();

        if (u.includes('bouzgle')) {
            vp.innerHTML = this.getBouzgleHTML();
            this.bindBouzgleEvents(vp);
        } else if (u.includes('bouzetube')) {
            vp.innerHTML = this.getBouzeTubeHTML();
            this.bindBouzeTubeEvents(vp);
        } else if (u.includes('facebouze')) {
            vp.innerHTML = this.getFaceBouzeHTML();
            this.bindFaceBouzeEvents(vp);
        } else if (u.includes('amabouze')) {
            vp.innerHTML = this.getAmaBouzeHTML();
            this.bindAmaBouzeEvents(vp);
        } else if (u.includes('pouicpouic')) {
            vp.innerHTML = this.getPouicPouicHTML();
            this.bindPouicPouicEvents(vp);
        } else if (u.includes('bouzepedia')) {
            vp.innerHTML = this.getBouzepediaHTML();
            this.bindBouzepediaEvents(vp);
        } else if (u.includes('ebouze')) {
            vp.innerHTML = this.geteBouzeHTML();
            this.bindeBouzeEvents(vp);
        } else if (u.includes('netbouze')) {
            vp.innerHTML = this.getNetBouzeHTML();
            this.bindNetBouzeEvents(vp);
        } else if (u.includes('altavista')) {
            vp.innerHTML = this.getAltaVistaHTML();
            this.bindAltaVistaEvents(vp);
        } else if (u.includes('ram')) {
            vp.innerHTML = this.getRamBoosterHTML();
            this.bindRamBoosterEvents(vp);
        } else if (u.includes('geocities')) {
            vp.innerHTML = this.getGeocitiesHTML();
            this.bindGeocitiesEvents(vp);
        } else if (u.includes('kazaa')) {
            vp.innerHTML = this.getKazaaHTML();
            this.bindKazaaEvents(vp);
        } else {
            vp.innerHTML = `
                <div class="web-error">
                    <h2>Impossible d'afficher la page</h2>
                    <p>La page demandée (<strong>${this.escapeHTML(url)}</strong>) est introuvable ou le serveur DNS est tombé en panne.</p>
                    <p>Vérifiez que votre câble de modem RJ11 est bien branché dans la prise téléphonique murale.</p>
                    <br>
                    <button class="win-btn" id="btn-err-home">Retourner à la page d'accueil Bouzgle</button>
                </div>
            `;
            const btn = vp.querySelector('#btn-err-home');
            if (btn) btn.onclick = () => this.navigate(this.homeUrl);
        }

        // Generic click-through links within simulated pages
        const internalLinks = vp.querySelectorAll('.web-link');
        internalLinks.forEach(l => {
            l.onclick = (e) => {
                e.preventDefault();
                if (l.dataset.url) this.navigate(l.dataset.url);
            };
        });
    }

    // ==========================================
    // 1. BOUZGLE (Google 1998 Parody)
    // ==========================================
    getBouzgleHTML() {
        return `
            <div class="web-bouzgle">
                <div class="bouzgle-logo">
                    <span class="b-b">B</span><span class="b-o1">o</span><span class="b-u">u</span><span class="b-z">z</span><span class="b-g">g</span><span class="b-l">l</span><span class="b-e">e</span><span class="b-o1">!</span>
                </div>
                <div class="bouzgle-sub">Le moteur de recherche du Cyber-Espace (Index : 24 518 pages Web mondiales)</div>
                <div class="bouzgle-search-box">
                    <input type="text" class="win-input bouzgle-search-input" id="bg-query" placeholder="Rechercher des astuces Bouzedows, MP3, cracks..." value="comment formater mon pc" />
                    <button class="win-btn" id="bg-btn-search">Recherche Bouzgle</button>
                    <button class="win-btn" id="bg-btn-lucky">J'ai de la chance</button>
                </div>
                <div class="bouzgle-links-row">
                    Explorer : 
                    <a class="web-link" data-url="http://www.bouzetube.com">BouzeTube</a> |
                    <a class="web-link" data-url="http://www.facebouze.com">FaceBouze</a> |
                    <a class="web-link" data-url="http://www.pouicpouic.com">PouicPouic</a> |
                    <a class="web-link" data-url="http://www.amabouze.com">AmaBouze</a> |
                    <a class="web-link" data-url="http://www.bouzepedia.org">Bouzepedia</a> |
                    <a class="web-link" data-url="http://www.ebouze.fr">eBouze</a> |
                    <a class="web-link" data-url="http://www.netbouze.com">NetBouze</a>
                </div>
                <div class="bouzgle-results" id="bg-results">
                    <div class="bouzgle-res-item">
                        <div class="bouzgle-res-title web-link" data-url="http://www.bouzetube.com">📺 BouzeTube : Diffusez vos vidéos en 144p haute lenteur</div>
                        <div class="bouzgle-res-url">http://www.bouzetube.com/watch?v=zoo_vincennes</div>
                        <div class="bouzgle-res-desc">Regardez les dernières vidéos virales encodées en RealVideo 28.8k. Temps de mise en mémoire tampon moyen : 45 minutes par sketch.</div>
                    </div>
                    <div class="bouzgle-res-item">
                        <div class="bouzgle-res-title web-link" data-url="http://www.facebouze.com">👤 FaceBouze - Retrouvez vos camarades de classe et envoyez des pokes</div>
                        <div class="bouzgle-res-url">http://www.facebouze.com/profile.php?id=mark</div>
                        <div class="bouzgle-res-desc">Le trombinoscope étudiant où vous pouvez piquer vos amis, jouer à FarmBouze et étaler vos états d'âme sur votre mur.</div>
                    </div>
                    <div class="bouzgle-res-item">
                        <div class="bouzgle-res-title web-link" data-url="http://www.telecharger-ram-gratuite.net">⚡ RAM-Booster 98 Turbo - Téléchargez 512 Mo de RAM en 1 clic</div>
                        <div class="bouzgle-res-url">http://www.telecharger-ram-gratuite.net/setup.exe</div>
                        <div class="bouzgle-res-desc">Logiciel 100% garanti sans virus pour doubler la vitesse de votre Pentium 133 MHz. Écrase le noyau KERNEL32 immédiatement.</div>
                    </div>
                    <div class="bouzgle-res-item">
                        <div class="bouzgle-res-title web-link" data-url="http://www.amabouze.com">📦 AmaBouze.com - Encarta 95, Disquettes Verbatim et Souris à boule</div>
                        <div class="bouzgle-res-url">http://www.amabouze.com/boutique_1997.htm</div>
                        <div class="bouzgle-res-desc">Commandez vos fournitures informatiques et CD-ROM culturels en paiement 1-Clic. Livraison estimée sous 6 semaines.</div>
                    </div>
                </div>
            </div>
        `;
    }

    bindBouzgleEvents(vp) {
        const searchBtn = vp.querySelector('#bg-btn-search');
        const luckyBtn = vp.querySelector('#bg-btn-lucky');
        const queryInput = vp.querySelector('#bg-query');

        const doSearch = () => {
            window.retroAudio.playClick();
            const resultsBox = vp.querySelector('#bg-results');
            if (resultsBox) {
                resultsBox.innerHTML = `
                    <div style="font-size:11px; color:#555; margin-bottom:8px;">Résultats 1 - 4 pour "<strong>${this.escapeHTML(queryInput.value)}</strong>" (Recherche effectuée en 0.08 sec) :</div>
                    <div class="bouzgle-res-item">
                        <div class="bouzgle-res-title web-link" data-url="http://www.bouzepedia.org">📚 Bouzepedia : L'encyclopédie libre - Tout savoir sur Bouzedows</div>
                        <div class="bouzgle-res-url">http://www.bouzepedia.org/wiki/Bouzedows_95</div>
                        <div class="bouzgle-res-desc">Historique du système, description détaillée de l'écran bleu BSOD et astuces pour taper sur le boîtier en cas de gel complet.</div>
                    </div>
                    <div class="bouzgle-res-item">
                        <div class="bouzgle-res-title web-link" data-url="http://www.pouicpouic.com">🐤 PouicPouic : Les derniers ragots de Bill Portes et Clippy</div>
                        <div class="bouzgle-res-url">http://www.pouicpouic.com/timeline</div>
                        <div class="bouzgle-res-desc">Lisez les messages de 140 caractères des grands magnats de la micro-informatique des années 90.</div>
                    </div>
                    <div class="bouzgle-res-item">
                        <div class="bouzgle-res-title web-link" data-url="http://www.ebouze.fr">🔨 eBouze : Enchères pour CD-ROM AOL 50h et boules de souris usagées</div>
                        <div class="bouzgle-res-url">http://www.ebouze.fr/encheres_vintage</div>
                        <div class="bouzgle-res-desc">Déposez vos offres en Francs pour acquérir les reliques les plus prestigieuses du début d'Internet.</div>
                    </div>
                `;
                // Re-bind links
                resultsBox.querySelectorAll('.web-link').forEach(l => {
                    l.onclick = () => this.navigate(l.dataset.url);
                });
            }
        };

        if (searchBtn) searchBtn.onclick = doSearch;
        if (queryInput) {
            queryInput.onkeydown = (e) => { if (e.key === 'Enter') doSearch(); };
        }

        if (luckyBtn) {
            luckyBtn.onclick = () => {
                const pool = [
                    'http://www.bouzetube.com',
                    'http://www.facebouze.com',
                    'http://www.pouicpouic.com',
                    'http://www.amabouze.com',
                    'http://www.bouzepedia.org',
                    'http://www.ebouze.fr',
                    'http://www.netbouze.com',
                    'http://www.telecharger-ram-gratuite.net'
                ];
                const dest = pool[Math.floor(Math.random() * pool.length)];
                this.navigate(dest);
            };
        }
    }

    // ==========================================
    // 2. BOUZETUBE (YouTube 2005 / RealPlayer Parody)
    // ==========================================
    getBouzeTubeHTML() {
        const commentsHTML = this.tubeComments.map(c => `
            <div class="bt-comment-item">
                <strong>${this.escapeHTML(c.author)} :</strong> ${this.escapeHTML(c.text)}
            </div>
        `).join('');

        return `
            <div class="web-bouzetube">
                <div class="bt-header">
                    <div class="bt-logo">
                        <span class="bt-logo-text">Bouze</span><span class="bt-logo-badge">Tube</span>
                    </div>
                    <div class="bt-tagline">Diffusez vos vidéos en 144p • Lecteur RealPlayer / Bouzedows Media</div>
                </div>

                <div class="bt-main-grid">
                    <div class="bt-player-col">
                        <!-- Simulated Retro Media Player -->
                        <div class="bt-screen" id="bt-screen">
                            ${this.tubePlaying ? `
                                <div class="bt-screen-anim">
                                    <div style="font-size:32px; animation: bounce 0.6s infinite alternate;">📹 📼 🐒</div>
                                    <div style="font-size:11px; color:#ffcc00; margin-top:8px;">Lecture : 0:14 / 3:42 (144p - Mono 8 kHz)</div>
                                    <div style="font-size:10px; color:#aaa;">Buffering 56k : Flux fluide (Interrompu par le grille-pain)</div>
                                </div>
                            ` : `
                                <div class="bt-play-btn" id="bt-play-trigger" title="Lancer la vidéo">▶</div>
                                <div style="font-size:10px; color:#ccc; margin-top:8px;">Cliquez pour charger la vidéo (Patienter 12 secondes)</div>
                            `}
                        </div>
                        <div class="bt-controls">
                            <button class="win-btn" id="bt-btn-play-pause">${this.tubePlaying ? '⏸ Pause' : '▶ Play'}</button>
                            <button class="win-btn" id="bt-btn-stop">⏹ Stop</button>
                            <div class="bt-track-bar">
                                <div class="bt-track-fill" id="bt-track-fill"></div>
                            </div>
                            <span>0:14 / 3:42</span>
                        </div>

                        <div class="bt-info">
                            <div class="bt-title">📹 TUTO : Comment télécharger un sandwich sur Kazaa avec Bouzedows</div>
                            <div class="bt-meta-row">
                                <span>Par : <strong>KévinDu93</strong> (42 abonnés) • 1 842 vues</span>
                                <span class="bt-stars" id="bt-star-btn" title="Donner 5 étoiles">⭐⭐⭐⭐⭐ (4.9/5)</span>
                            </div>
                            <div class="bt-actions">
                                <button class="win-btn" id="bt-btn-star">⭐ Voter 5 étoiles (+150 Octets)</button>
                                <button class="win-btn" id="bt-btn-avi">💾 Télécharger en .AVI (Temps restant : 3 semaines)</button>
                            </div>
                        </div>

                        <div class="bt-comments-box">
                            <div style="font-weight:bold; margin-bottom:4px;">Commentaires récents (${this.tubeComments.length}) :</div>
                            <div class="bt-comment-input-row" style="display:flex; gap:4px; margin-bottom:6px;">
                                <input type="text" class="win-input" id="bt-new-comment" placeholder="Écrire un commentaire..." style="flex:1;" />
                                <button class="win-btn" id="bt-btn-send-comment">Envoyer</button>
                            </div>
                            <div id="bt-comments-list">${commentsHTML}</div>
                        </div>
                    </div>

                    <div class="bt-side-col">
                        <div class="bt-side-title">Vidéos suggérées :</div>
                        <div class="bt-rec-item" data-title="NUMA NUMA DANCE (Qualité caméscope VHS)">
                            <div class="bt-rec-thumb">🕺</div>
                            <div class="bt-rec-info">
                                <strong>NUMA NUMA DANCE</strong><br>
                                <span style="color:#666;">Gary_Bross • 34k vues</span>
                            </div>
                        </div>
                        <div class="bt-rec-item" data-title="ME AT THE ZOO (Zoo de Vincennes 1999)">
                            <div class="bt-rec-thumb">🐘</div>
                            <div class="bt-rec-info">
                                <strong>ME AT THE ZOO</strong><br>
                                <span style="color:#666;">Jawed95 • 12k vues</span>
                            </div>
                        </div>
                        <div class="bt-rec-item" data-title="CRAZY FROG - Version Sonnerie Polyphonique">
                            <div class="bt-rec-thumb">🐸</div>
                            <div class="bt-rec-info">
                                <strong>CRAZY FROG (MIDI)</strong><br>
                                <span style="color:#666;">Jamba_Fr • 98k vues</span>
                            </div>
                        </div>
                        <div class="bt-rec-item" data-title="RICK ASTLEY - Never Gonna Give You Up (Sound Blaster 16)">
                            <div class="bt-rec-thumb">🎤</div>
                            <div class="bt-rec-info">
                                <strong>RICK ASTLEY (MIDI)</strong><br>
                                <span style="color:#666;">RickRoll_Origin • 44k vues</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    bindBouzeTubeEvents(vp) {
        const playTrigger = vp.querySelector('#bt-play-trigger');
        const playPauseBtn = vp.querySelector('#bt-btn-play-pause');
        const stopBtn = vp.querySelector('#bt-btn-stop');
        const starBtn = vp.querySelector('#bt-btn-star');
        const aviBtn = vp.querySelector('#bt-btn-avi');
        const commentInput = vp.querySelector('#bt-new-comment');
        const sendCommentBtn = vp.querySelector('#bt-btn-send-comment');

        const togglePlay = () => {
            this.tubePlaying = !this.tubePlaying;
            if (this.tubePlaying) {
                window.retroAudio.playAsterisk();
                if (window.gameEngine) {
                    window.gameEngine.showNotification('📺 BouzeTube', 'Mise en mémoire tampon RealPlayer... Résolution 144p engagée !');
                }
            } else {
                window.retroAudio.playClick();
            }
            this.renderPage(this.currentUrl);
        };

        if (playTrigger) playTrigger.onclick = togglePlay;
        if (playPauseBtn) playPauseBtn.onclick = togglePlay;
        if (stopBtn) {
            stopBtn.onclick = () => {
                this.tubePlaying = false;
                window.retroAudio.playClick();
                this.renderPage(this.currentUrl);
            };
        }

        if (starBtn) {
            starBtn.onclick = () => {
                window.retroAudio.playDing();
                if (window.gameEngine) {
                    window.gameEngine.addReward(150, '5 Étoiles', { clientX: window.innerWidth / 2, clientY: window.innerHeight / 2 });
                    window.gameEngine.showNotification('⭐ Vote enregistré', 'Vous avez attribué 5 étoiles à KévinDu93 !');
                }
            };
        }

        if (aviBtn) {
            aviBtn.onclick = () => {
                window.retroAudio.playError();
                if (window.windowManager) {
                    window.windowManager.spawnErrorDialog('Téléchargement .AVI', 'Erreur 0x404 : Le serveur RealVideo a pris feu. Veuillez patienter 2 semaines.');
                }
            };
        }

        if (sendCommentBtn && commentInput) {
            sendCommentBtn.onclick = () => {
                const txt = commentInput.value.trim();
                if (!txt) return;
                this.tubeComments.unshift({ author: "Henry PC", text: txt });
                window.retroAudio.playClick();
                if (window.gameEngine) {
                    window.gameEngine.addReward(80, 'Commentaire');
                }
                this.renderPage(this.currentUrl);
            };
        }

        // Suggestions click
        vp.querySelectorAll('.bt-rec-item').forEach(item => {
            item.onclick = () => {
                window.retroAudio.playClick();
                const title = item.dataset.title;
                const titleEl = vp.querySelector('.bt-title');
                if (titleEl) titleEl.textContent = '📹 ' + title;
                this.tubePlaying = true;
                this.renderPage(this.currentUrl);
            };
        });
    }

    // ==========================================
    // 3. FACEBOUZE (TheFacebook 2004 Parody)
    // ==========================================
    getFaceBouzeHTML() {
        const postsHTML = this.facebouzePosts.map(p => `
            <div class="fb-post-card">
                <span class="fb-post-author">${this.escapeHTML(p.author)}</span>
                <span class="fb-post-meta">• ${this.escapeHTML(p.meta)}</span>
                <div style="margin-top:2px;">${this.escapeHTML(p.text)}</div>
            </div>
        `).join('');

        return `
            <div class="web-facebouze">
                <div class="fb-header">
                    <div class="fb-logo">[FaceBouze]</div>
                    <div class="fb-subtext">L'annuaire des étudiants et fans de Bouzedows</div>
                </div>

                <div class="fb-body">
                    <div class="fb-sidebar">
                        <div class="fb-profile-avatar">👨‍💻</div>
                        <div class="fb-profile-name">Mark Bouzeberg</div>
                        <div class="fb-quick-info">
                            <strong>Statut :</strong> En ligne<br>
                            <strong>Réseau :</strong> Harvard-sur-Marne<br>
                            <strong>Amour :</strong> C'est compliqué (en couple avec son ventilateur)
                        </div>
                        <div style="margin-top:10px;">
                            <button class="win-btn" id="fb-poke-btn" style="width:100%; font-size:10px;">👉 POKER Mark (${this.markPokes})</button>
                        </div>
                    </div>

                    <div class="fb-wall-col">
                        <!-- FarmBouze Mini-Game -->
                        <div class="fb-farm-game">
                            🌾 <strong>FarmBouze 1999</strong> : Votre champ de carottes pixelisées.<br>
                            Carottes récoltées : <strong>${this.farmCarrots}</strong> | 
                            <button class="win-btn" id="fb-btn-farm">🥕 Récolter mes carottes (+200 Octets)</button>
                        </div>

                        <!-- Wall input -->
                        <div class="fb-status-box">
                            <span style="font-weight:bold; font-size:10px;">Publier sur le mur de FaceBouze :</span>
                            <div class="fb-input-area">
                                <input type="text" class="win-input" id="fb-status-input" placeholder="Que faites-vous devant votre PC ?" style="flex:1;" />
                                <button class="win-btn" id="fb-btn-publish">Publier</button>
                            </div>
                        </div>

                        <div class="fb-feed">
                            <div style="font-weight:bold; font-size:11px; margin-bottom:4px;">Flux d'actualités du campus :</div>
                            ${postsHTML}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    bindFaceBouzeEvents(vp) {
        const pokeBtn = vp.querySelector('#fb-poke-btn');
        const farmBtn = vp.querySelector('#fb-btn-farm');
        const pubBtn = vp.querySelector('#fb-btn-publish');
        const statusInput = vp.querySelector('#fb-status-input');

        if (pokeBtn) {
            pokeBtn.onclick = () => {
                this.markPokes++;
                window.retroAudio.playDing();
                if (window.gameEngine) {
                    window.gameEngine.addReward(120, 'Poke', { clientX: window.innerWidth / 2, clientY: window.innerHeight / 2 });
                    window.gameEngine.showNotification('👉 POKE !', `Vous avez poké Mark Bouzeberg (${this.markPokes} fois). Mark vous a re-poké !`);
                }
                pokeBtn.textContent = `👉 POKER Mark (${this.markPokes})`;
            };
        }

        if (farmBtn) {
            farmBtn.onclick = () => {
                this.farmCarrots += 3;
                window.retroAudio.playAsterisk();
                if (window.gameEngine) {
                    window.gameEngine.addReward(200, 'FarmBouze', { clientX: window.innerWidth / 2, clientY: window.innerHeight / 2 });
                    window.gameEngine.showNotification('🥕 FarmBouze', '3 carottes pixelisées récoltées sans planter de KERNEL32 !');
                }
                this.renderPage(this.currentUrl);
            };
        }

        if (pubBtn && statusInput) {
            pubBtn.onclick = () => {
                const val = statusInput.value.trim();
                if (!val) return;
                this.facebouzePosts.unshift({
                    author: "Henry PC",
                    meta: "À l'instant",
                    text: val
                });
                window.retroAudio.playClick();
                if (window.gameEngine) {
                    window.gameEngine.addReward(90, 'FaceBouze');
                }
                this.renderPage(this.currentUrl);
            };
        }
    }

    // ==========================================
    // 4. AMABOUZE (Amazon 1997 Parody)
    // ==========================================
    getAmaBouzeHTML() {
        return `
            <div class="web-amabouze">
                <div class="am-navbar">
                    <div class="am-logo">Ama<span>Bouze</span>.com</div>
                    <div class="am-cart-tag" id="am-cart-display">🛒 Mon Panier (${this.cartItems})</div>
                </div>
                <div style="font-size:10px; color:#555; margin:6px 0;">
                    La plus grande librairie & quincaillerie informatique du Web mondial • Paiement par chèque ou mandat postal
                </div>

                <table class="am-table">
                    <thead>
                        <tr>
                            <th>Article</th>
                            <th>Description</th>
                            <th>Prix</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>💿 <strong>Encarta 95 Prestige</strong></td>
                            <td>Encyclopédie universelle sur 4 CD-ROM avec vidéos 120x90. Indispensable pour les exposés.</td>
                            <td class="am-item-price">499 Francs</td>
                            <td><button class="win-btn am-buy-btn" data-item="Encarta 95">🛒 1-Clic</button></td>
                        </tr>
                        <tr>
                            <td>💾 <strong>Lot 50 Disquettes 3.5"</strong></td>
                            <td>Boîte plastique de disquettes Verbatim MF2-HD 1.44 Mo haute densité.</td>
                            <td class="am-item-price">89 Francs</td>
                            <td><button class="win-btn am-buy-btn" data-item="50 Disquettes">🛒 1-Clic</button></td>
                        </tr>
                        <tr>
                            <td>🧹 <strong>Kit Nettoyage Souris</strong></td>
                            <td>Flacon d'alcool à 90° et grattoir pour retirer la crasse sur la boule en caoutchouc.</td>
                            <td class="am-item-price">29 Francs</td>
                            <td><button class="win-btn am-buy-btn" data-item="Nettoie-Souris">🛒 1-Clic</button></td>
                        </tr>
                        <tr>
                            <td>🌬️ <strong>Ventilateur à manivelle</strong></td>
                            <td>Dispositif mécanique de secours pour refroidir votre Pentium II en cas de canicule.</td>
                            <td class="am-item-price">149 Francs</td>
                            <td><button class="win-btn am-buy-btn" data-item="Ventilo Manivelle">🛒 1-Clic</button></td>
                        </tr>
                        <tr>
                            <td>📖 <strong>Bouzedows pour les Nuls</strong></td>
                            <td>Livre de 600 pages expliquant comment redémarrer son ordinateur après chaque plantage.</td>
                            <td class="am-item-price">119 Francs</td>
                            <td><button class="win-btn am-buy-btn" data-item="Livre Nuls">🛒 1-Clic</button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `;
    }

    bindAmaBouzeEvents(vp) {
        vp.querySelectorAll('.am-buy-btn').forEach(btn => {
            btn.onclick = () => {
                this.cartItems++;
                window.retroAudio.playAsterisk();
                const item = btn.dataset.item;
                if (window.gameEngine) {
                    window.gameEngine.addReward(300, 'Panier', { clientX: window.innerWidth / 2, clientY: window.innerHeight / 2 });
                    window.gameEngine.showNotification('🛒 AmaBouze.com', `Article "${item}" ajouté au panier ! Livraison estimée par pigeon voyageur sous 6 semaines.`);
                }
                const cartTag = vp.querySelector('#am-cart-display');
                if (cartTag) cartTag.textContent = `🛒 Mon Panier (${this.cartItems})`;
            };
        });
    }

    // ==========================================
    // 5. POUICPOUIC (Twitter / X Parody)
    // ==========================================
    getPouicPouicHTML() {
        const tweetsHTML = this.tweets.map((t, idx) => `
            <div class="pp-card">
                <div class="pp-header-row">
                    <span class="pp-author">${this.escapeHTML(t.author)}</span>
                    <span class="pp-handle">${this.escapeHTML(t.handle)}</span>
                </div>
                <div style="margin:4px 0;">${this.escapeHTML(t.text)}</div>
                <div class="pp-actions-row">
                    <span class="pp-act-btn pp-like-btn" data-idx="${idx}">❤️ ${t.likes} J'aime</span>
                    <span class="pp-act-btn pp-rt-btn" data-idx="${idx}">🔁 ${t.rts} Re-pouics</span>
                </div>
            </div>
        `).join('');

        return `
            <div class="web-pouicpouic">
                <div class="pp-navbar">
                    <div class="pp-logo">🐤 PouicPouic</div>
                    <div style="font-size:10px;">Exprimez-vous en 140 caractères maximum</div>
                </div>

                <div class="pp-compose-box">
                    <input type="text" class="win-input" id="pp-input" maxlength="140" placeholder="Quoi de neuf dans le Cyber-Espace ?" style="width:100%; margin-bottom:4px;" />
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <span style="font-size:9px; color:#888;" id="pp-char-counter">140 caractères restants</span>
                        <button class="win-btn" id="pp-btn-tweet">🐤 Pouiquer !</button>
                    </div>
                </div>

                <div class="pp-feed">
                    ${tweetsHTML}
                </div>
            </div>
        `;
    }

    bindPouicPouicEvents(vp) {
        const tweetBtn = vp.querySelector('#pp-btn-tweet');
        const input = vp.querySelector('#pp-input');
        const counter = vp.querySelector('#pp-char-counter');

        if (input && counter) {
            input.oninput = () => {
                counter.textContent = `${140 - input.value.length} caractères restants`;
            };
        }

        if (tweetBtn && input) {
            tweetBtn.onclick = () => {
                const text = input.value.trim();
                if (!text) return;
                this.tweets.unshift({
                    author: "Henry PC",
                    handle: "@Henry_PC_95",
                    text: text,
                    likes: 1,
                    rts: 0
                });
                window.retroAudio.playDing();
                if (window.gameEngine) {
                    window.gameEngine.addReward(250, 'PouicPouic');
                    window.gameEngine.showNotification('🐤 Pouic envoyé !', 'Votre message a été diffusé à l\'ensemble du cyber-espace.');
                }
                this.renderPage(this.currentUrl);
            };
        }

        vp.querySelectorAll('.pp-like-btn').forEach(btn => {
            btn.onclick = () => {
                const idx = parseInt(btn.dataset.idx, 10);
                if (this.tweets[idx]) {
                    this.tweets[idx].likes++;
                    window.retroAudio.playClick();
                    if (window.gameEngine) {
                        window.gameEngine.addReward(50, 'J\'aime');
                    }
                    btn.textContent = `❤️ ${this.tweets[idx].likes} J'aime`;
                }
            };
        });

        vp.querySelectorAll('.pp-rt-btn').forEach(btn => {
            btn.onclick = () => {
                const idx = parseInt(btn.dataset.idx, 10);
                if (this.tweets[idx]) {
                    this.tweets[idx].rts++;
                    window.retroAudio.playAsterisk();
                    if (window.gameEngine) {
                        window.gameEngine.showNotification('🔁 Re-pouic', 'Message partagé à vos abonnés 56k !');
                    }
                    btn.textContent = `🔁 ${this.tweets[idx].rts} Re-pouics`;
                }
            };
        });
    }

    // ==========================================
    // 6. BOUZEPEDIA (Wikipedia Parody)
    // ==========================================
    getBouzepediaHTML() {
        return `
            <div class="web-bouzepedia">
                <div class="bp-donate-banner">
                    ⚠️ <strong>APPEL URGENT DE JIMMY :</strong> Bouzepedia a besoin de vous ! Si chaque visiteur donnait une disquette 3.5 pouces vierge, notre encyclopédie vivrait 1 000 ans.
                    <button class="win-btn" id="bp-btn-donate" style="margin-left:6px; font-size:10px;">💾 Donner une disquette (+400 Octets)</button>
                </div>

                <div class="bp-layout">
                    <div class="bp-content">
                        <div class="bp-header-title">Bouzedows (Système d'exploitation)</div>
                        <p><strong>Bouzedows</strong> est un environnement d'exploitation graphique commercialisé en 1995 par la société Microbouze. Célèbre pour son bouton <em>Démarrer</em> et sa propension à s'autodétruire en cas de mouvement brusque de la souris.</p>

                        <div class="bp-infobox">
                            <div class="bp-infobox-header">Bouzedows</div>
                            <strong>Développeur :</strong> Microbouze<br>
                            <strong>Sortie :</strong> 24 août 1995<br>
                            <strong>Stabilité :</strong> -42%<br>
                            <strong>Mascotte :</strong> Clippy le trombone<br>
                            <strong>Ennemi juré :</strong> KERNEL32.DLL
                        </div>

                        <h3>1. Histoire et Genèse du Plantage</h3>
                        <p>Dès sa conception, Bouzedows a intégré la technologie révolutionnaire <em>Plug and Pray</em> (Branchez et Priez), permettant de brancher une imprimante matricielle et de faire disjoncter tout le quartier.</p>

                        <h3>2. Le Monumental Écran Bleu (BSOD)</h3>
                        <p>Classé au patrimoine mondial des arts numériques minimalistes, l'écran bleu <code>0028:C0011E36</code> survient généralement lorsque l'utilisateur s'apprête à enregistrer un document Word de 40 pages non sauvegardé.</p>

                        <div style="margin-top:12px;">
                            <button class="win-btn" id="bp-btn-vandalize">✏️ Modifier cet article (Vandaliser avec des glitchs)</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    bindBouzepediaEvents(vp) {
        const donBtn = vp.querySelector('#bp-btn-donate');
        const vanBtn = vp.querySelector('#bp-btn-vandalize');

        if (donBtn) {
            donBtn.onclick = () => {
                window.retroAudio.playDing();
                if (window.gameEngine) {
                    window.gameEngine.addReward(400, 'Donateur', { clientX: window.innerWidth / 2, clientY: window.innerHeight / 2 });
                    window.gameEngine.showNotification('📚 Bouzepedia', 'Merci pour votre don de disquette ! Jimmy vous remercie chaleureusement.');
                }
            };
        }

        if (vanBtn) {
            vanBtn.onclick = () => {
                window.retroAudio.playError();
                if (window.gameEngine) {
                    window.gameEngine.addReward(350, 'Vandalisme', { clientX: window.innerWidth / 2, clientY: window.innerHeight / 2 });
                    window.gameEngine.showNotification('✏️ Bouzepedia corrompu', 'Article vandalisé avec succès. Les modérateurs dorment.');
                }
                const content = vp.querySelector('.bp-content p');
                if (content && window.glitchController) {
                    content.textContent = window.glitchController.corruptText(content.textContent, 0.4);
                }
            };
        }
    }

    // ==========================================
    // 7. EBOUZE (eBay Parody)
    // ==========================================
    geteBouzeHTML() {
        return `
            <div class="web-ebouze">
                <div class="eb-top">
                    <div class="eb-logo">
                        <span style="color:#e53238;">e</span><span style="color:#0064d2;">B</span><span style="color:#f5af02;">o</span><span style="color:#86b817;">u</span><span style="color:#0064d2;">z</span><span style="color:#e53238;">e</span>
                    </div>
                    <div style="font-size:10px; color:#555;">Le site d'enchères numéro 1 entre internautes branchés 56k</div>
                </div>

                <div class="eb-grid">
                    <div class="eb-item-card">
                        <div>
                            <div class="eb-item-title">📦 CD-ROM AOL 50 heures gratuites (Sous blister)</div>
                            <div style="color:#666;">Objet de collection rarissime. Jamais inséré dans un tiroir de lecteur CD.</div>
                        </div>
                        <div>
                            <div class="eb-price">${this.auctions.aol.price} Francs</div>
                            <div style="font-size:9px; color:#666;">${this.auctions.aol.bids} offres • ${this.auctions.aol.userHigh ? '✅ Vous êtes en tête !' : 'Enchère en cours'}</div>
                            <button class="win-btn eb-bid-btn" data-key="aol" style="margin-top:4px;">🔨 Enchérir (+2 Francs)</button>
                        </div>
                    </div>

                    <div class="eb-item-card">
                        <div>
                            <div class="eb-item-title">🖱️ Boule de souris mécanique Logitech 1995</div>
                            <div style="color:#666;">Boule en caoutchouc lourd authentique. Un peu noircie sur l'équateur.</div>
                        </div>
                        <div>
                            <div class="eb-price">${this.auctions.ball.price} Francs</div>
                            <div style="font-size:9px; color:#666;">${this.auctions.ball.bids} offres • ${this.auctions.ball.userHigh ? '✅ Vous êtes en tête !' : 'Enchère en cours'}</div>
                            <button class="win-btn eb-bid-btn" data-key="ball" style="margin-top:4px;">🔨 Enchérir (+2 Francs)</button>
                        </div>
                    </div>

                    <div class="eb-item-card">
                        <div>
                            <div class="eb-item-title">📜 Guide officiel d'installation Bouzedows</div>
                            <div style="color:#666;">Manuel d'époque avec le certificat d'authenticité et la clé de produit 111-1111111.</div>
                        </div>
                        <div>
                            <div class="eb-price">${this.auctions.book.price} Francs</div>
                            <div style="font-size:9px; color:#666;">${this.auctions.book.bids} offres • ${this.auctions.book.userHigh ? '✅ Vous êtes en tête !' : 'Enchère en cours'}</div>
                            <button class="win-btn eb-bid-btn" data-key="book" style="margin-top:4px;">🔨 Enchérir (+2 Francs)</button>
                        </div>
                    </div>

                    <div class="eb-item-card">
                        <div>
                            <div class="eb-item-title">📼 Cassette VHS Titanic (Volume 1 uniquement)</div>
                            <div style="color:#666;">La cassette s'arrête pile quand le bateau heurte l'iceberg. Non rembobinée.</div>
                        </div>
                        <div>
                            <div class="eb-price">${this.auctions.vhs.price} Francs</div>
                            <div style="font-size:9px; color:#666;">${this.auctions.vhs.bids} offres • ${this.auctions.vhs.userHigh ? '✅ Vous êtes en tête !' : 'Enchère en cours'}</div>
                            <button class="win-btn eb-bid-btn" data-key="vhs" style="margin-top:4px;">🔨 Enchérir (+2 Francs)</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    bindeBouzeEvents(vp) {
        vp.querySelectorAll('.eb-bid-btn').forEach(btn => {
            btn.onclick = () => {
                const k = btn.dataset.key;
                if (this.auctions[k]) {
                    this.auctions[k].price += 2;
                    this.auctions[k].bids += 1;
                    this.auctions[k].userHigh = true;
                    window.retroAudio.playAsterisk();
                    if (window.gameEngine) {
                        window.gameEngine.addReward(180, 'Enchère', { clientX: window.innerWidth / 2, clientY: window.innerHeight / 2 });
                        window.gameEngine.showNotification('🔨 Adjugé !', `Enchère déposée à ${this.auctions[k].price} Francs. Vous êtes le meilleur enchérisseur.`);
                    }
                    this.renderPage(this.currentUrl);
                }
            };
        });
    }

    // ==========================================
    // 8. NETBOUZE (Netflix / VHS Club Parody)
    // ==========================================
    getNetBouzeHTML() {
        const vhsBonus = window.gameEngine ? window.gameEngine.formatNumber(window.gameEngine.scaleReward(220)) : '220';
        return `
            <div class="web-netbouze">
                <div class="nb-header">
                    <span>NETBOUZE</span>
                    <span style="font-size:11px; font-weight:normal;">Club Vidéo & Cassettes VHS par correspondance</span>
                </div>
                <div class="nb-warning">
                    ⚠️ RAPPEL DE SÉCURITÉ : N'oubliez pas de rembobiner vos cassettes à l'aide d'un stylo à bille avant retour postal sous peine de 15 Francs de majoration.
                </div>

                <div class="nb-catalog">
                    <div class="nb-movie-card">
                        <div class="nb-movie-title">🎬 The Matrix (1999)</div>
                        <div style="color:#aaa;">Qualité VHS 240p • Encodé avec son Mono 8-bit. Les lettres vertes défilent en vrai !</div>
                        <button class="win-btn nb-rent-btn" data-movie="The Matrix" style="margin-top:6px;">📼 Louer la VHS (+${vhsBonus} Octets)</button>
                    </div>
                    <div class="nb-movie-card">
                        <div class="nb-movie-title">🎬 Titanic (1997)</div>
                        <div style="color:#aaa;">Double VHS ultra lourde. Prévoyez 3 heures de lecture et une boîte de mouchoirs.</div>
                        <button class="win-btn nb-rent-btn" data-movie="Titanic" style="margin-top:6px;">📼 Louer la VHS (+${vhsBonus} Octets)</button>
                    </div>
                    <div class="nb-movie-card">
                        <div class="nb-movie-title">🎬 Men In Black (1997)</div>
                        <div style="color:#aaa;">Streaming RealPlayer 12 fps. Le flash du neuralyseur fait griller votre écran cathodique.</div>
                        <button class="win-btn nb-rent-btn" data-movie="Men In Black" style="margin-top:6px;">📼 Louer la VHS (+${vhsBonus} Octets)</button>
                    </div>
                    <div class="nb-movie-card">
                        <div class="nb-movie-title">🎬 Jurassic Park (1993)</div>
                        <div style="color:#aaa;">Version spéciale reconstituée image par image sous Paint par des collégiens passionnés.</div>
                        <button class="win-btn nb-rent-btn" data-movie="Jurassic Park" style="margin-top:6px;">📼 Louer la VHS (+${vhsBonus} Octets)</button>
                    </div>
                </div>
            </div>
        `;
    }

    bindNetBouzeEvents(vp) {
        vp.querySelectorAll('.nb-rent-btn').forEach(btn => {
            btn.onclick = () => {
                const m = btn.dataset.movie;
                window.retroAudio.playAsterisk();
                if (window.gameEngine) {
                    window.gameEngine.addReward(220, 'VHS', { clientX: window.innerWidth / 2, clientY: window.innerHeight / 2 });
                    window.gameEngine.showNotification('📼 NetBouze Club', `Cassette de "${m}" expédiée dans une enveloppe bulle ! N'oubliez pas le stylo Bic.`);
                }
            };
        });
    }

    // ==========================================
    // 9. ALTAVISTA (Original Search Engine)
    // ==========================================
    getAltaVistaHTML() {
        return `
            <div class="web-altavista">
                <div class="av-logo">AltaVista<span>™</span> Search</div>
                <div class="av-tagline">Le moteur de recherche le plus rapide du World Wide Web</div>
                <div class="av-search-box">
                    <input type="text" class="win-input" id="av-query" placeholder="Rechercher des fichiers MP3, astuces Bouzedows..." value="comment télécharger de la ram" />
                    <button class="win-btn" id="av-btn">Chercher</button>
                </div>
                <div class="av-links">
                    <a href="#" class="web-link" data-url="http://www.bouzgle.fr">🔍 Aller sur Bouzgle</a> |
                    <a href="#" class="web-link" data-url="http://www.bouzetube.com">📺 BouzeTube</a> |
                    <a href="#" class="web-link" data-url="http://www.facebouze.com">👤 FaceBouze</a> |
                    <a href="#" class="web-link" data-url="http://www.amabouze.com">📦 AmaBouze</a> |
                    <a href="#" class="web-link" data-url="http://www.telecharger-ram-gratuite.net">👉 Télécharger 128 Mo de RAM Gratuitement</a> |
                    <a href="#" class="web-link" data-url="http://www.geocities.com/area51/vault/9842">👽 Site perso Geocities de Kévin</a> |
                    <a href="#" class="web-link" data-url="http://www.kazaa-mp3-gratuit.com">🎵 Kazaa MP3 & Cracks</a>
                </div>
                <div class="vintage-banner">
                    ★ FÉLICITATIONS ! VOUS ÊTES LE 1 000 000ème VISITEUR ! CLIQUEZ ICI POUR GAGNER UN SCANNER À PLAT ★
                </div>
            </div>
        `;
    }

    bindAltaVistaEvents(vp) {
        const btn = vp.querySelector('#av-btn');
        if (btn) btn.onclick = () => this.navigate('http://www.bouzgle.fr');

        const banner = vp.querySelector('.vintage-banner');
        if (banner) {
            banner.onclick = () => {
                window.retroAudio.playAsterisk();
                if (window.windowManager) window.windowManager.spawnErrorDialog('ALERTE POPUP', 'VOUS AVEZ REMPORTÉ UNE IMPRIMANTE COULEUR ! (Veuillez insérer votre carte bancaire)');
            };
        }
    }

    // ==========================================
    // 10. RAM-BOOSTER 98 TURBO
    // ==========================================
    getRamBoosterHTML() {
        return `
            <div class="web-ram">
                <h2 class="blink-text">⚡ RAM-BOOSTER 98 TURBO ⚡</h2>
                <p class="ram-sub">Votre ordinateur manque de mémoire pour faire tourner Half-Life ou Encarta 95 ?</p>
                <div class="ram-box">
                    <div class="ram-meter">RAM Système actuelle : <strong>16 Mo</strong></div>
                    <div class="ram-target">RAM après installation : <strong>512 Mo DDR !</strong></div>
                    <button class="win-btn ram-download-btn" id="btn-download-ram">💾 TÉLÉCHARGER LA RAM (14 Ko)</button>
                </div>
                <p class="ram-disclaimer">* Garanti 100% sans virus, compatible Bouzedows OSR2.</p>
            </div>
        `;
    }

    bindRamBoosterEvents(vp) {
        const ramBtn = vp.querySelector('#btn-download-ram');
        if (ramBtn) {
            ramBtn.onclick = () => {
                window.retroAudio.playError();
                if (window.gameEngine) {
                    window.gameEngine.addReward(1200, 'RAM Infectée', { clientX: window.innerWidth / 2, clientY: window.innerHeight / 2 });
                    window.gameEngine.showNotification('⚠️ Téléchargement terminé', 'ram_booster_setup.exe a remplacé SYSTEM.DAT par un script VBS.');
                }
                if (window.windowManager) {
                    window.windowManager.spawnErrorDialog("Erreur d'allocation mémoire", "Erreur fatale : La RAM téléchargée a écrasé l'espace d'adressage du noyau.");
                }
            };
        }
    }

    // ==========================================
    // 11. GEOCITIES (Site perso de Kévin)
    // ==========================================
    getGeocitiesHTML() {
        const gbBonus = window.gameEngine ? window.gameEngine.formatNumber(window.gameEngine.scaleReward(100)) : '100';
        return `
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
                    <button class="win-btn" id="btn-guestbook">✍️ Signer mon livre d'or (+${gbBonus} Octets)</button>
                </div>
            </div>
        `;
    }

    bindGeocitiesEvents(vp) {
        const gbBtn = vp.querySelector('#btn-guestbook');
        if (gbBtn) {
            gbBtn.onclick = () => {
                window.retroAudio.playDing();
                if (window.gameEngine) {
                    window.gameEngine.addReward(100, 'Livre d\'or');
                    window.gameEngine.showNotification('✍️ Livre d\'or signé', 'Vous avez laissé un message : "Super site Kévin ! Viens voir le mien !"');
                }
            };
        }
    }

    // ==========================================
    // 12. KAZAA P2P FASTTRACK
    // ==========================================
    getKazaaHTML() {
        return `
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
    }

    bindKazaaEvents(vp) {
        const kzButtons = vp.querySelectorAll('.kz-dl');
        kzButtons.forEach(b => {
            b.onclick = () => {
                window.retroAudio.playAsterisk();
                if (window.gameEngine) {
                    window.gameEngine.addReward(800, 'Trojan Kazaa', { clientX: window.innerWidth / 2, clientY: window.innerHeight / 2 });
                    window.gameEngine.showNotification('📥 Kazaa P2P', `Téléchargement de ${b.dataset.name} terminé. 4 nouveaux processus inconnus ont démarré.`);
                }
            };
        });
    }

    escapeHTML(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }
}

// Global instance
window.browserApp = new BrowserApp();
