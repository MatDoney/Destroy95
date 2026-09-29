/**
 * Virus Effects & Dynamic UI Impacts Controller
 * Brings the 13 retro virus upgrades to life on the screen and in audio:
 * - 16 Toolbars: Real stacked toolbars filling Internet Explorer
 * - BonziBuddy: Interactive purple gorilla on desktop with jokes & adware
 * - Pentium sans ventilateur: Continuous 12,000 RPM howling fan audio + heat shimmer
 * - Modem 56k: External US Robotics modem widget with flashing LEDs
 * - Sub7 Trojan: Mechanical CD-ROM tray popout animation & servo sounds
 * - Ver Blaster: Authentic 60s NT AUTHORITY shutdown countdown with [ shutdown -a ]
 * - ILOVEYOU: Floating love letter envelopes and .vbs desktop icons
 * - Disquette 3.5": Floppy drive grinding seek sounds & blinking LED
 * - Bug de l'An 2000 (Y2K): Clock rewinds to 1900 with disco glitch
 * - Supprimer C:\\BOUZEDOWS\\SYSTEM32: Start button panic & tilted desktop icons
 */

class VirusEffectsController {
    constructor() {
        this.initialized = false;
        this.fanRunning = false;
        this.bonziEl = null;
        this.bonziBubbleEl = null;
        this.modemEl = null;
        this.blasterDialogEl = null;
        this.blasterTimeLeft = 60;
        this.blasterTimerInterval = null;
        this.cdTrayEl = null;
        this.cdInterval = null;
        this.ledInterval = null;

        this.bonziQuotes = [
            "Bonjour mon ami ! J'ai remarqué que ton disque dur tournait trop lentement. Veux-tu que j'installe 8 nouvelles barres d'outils ?",
            "Savais-tu que fermer un pop-up publicitaire ne fait que le rendre plus fort ?",
            "J'ai trouvé une offre exceptionnelle sur des chaussettes en laine sur AmaBouze.com !",
            "Veux-tu que je te chante la Macarena en RealAudio mono 8 kHz ?",
            "Ton unité centrale émet une douce odeur de plastique brûlé... C'est signe que le système monte en puissance !",
            "Astuce : Tapoter 3 fois sur ton moniteur avec le plat de la main accélère les téléchargements Kazaa."
        ];
    }

    init() {
        if (this.initialized) return;
        this.initialized = true;

        // Periodic checks & animations
        setInterval(() => this.onPeriodicTick(), 4000);

        // Sync with existing upgrades if engine is loaded
        if (window.gameEngine && window.gameEngine.upgrades) {
            this.syncAll(window.gameEngine.upgrades);
        }
    }

    syncAll(upgrades) {
        if (!upgrades) return;

        upgrades.forEach(u => {
            if (u.count > 0) {
                this.applyEffect(u.id, u.count, false);
            }
        });
    }

    onUpgradePurchased(upgradeId, newCount) {
        this.applyEffect(upgradeId, newCount, true);
    }

    applyEffect(id, count, isNewPurchase = false) {
        switch (id) {
            case 'toolbars':
                this.updateToolbars(count, isNewPurchase);
                break;
            case 'bonzi':
                this.updateBonziBuddy(count, isNewPurchase);
                break;
            case 'overclock':
                this.updatePentiumFan(count, isNewPurchase);
                break;
            case 'modem56k':
                this.updateModem56k(count, isNewPurchase);
                break;
            case 'subseven':
                this.updateSub7(count, isNewPurchase);
                break;
            case 'blaster':
                this.updateBlaster(count, isNewPurchase);
                break;
            case 'iloveyou':
                this.updateIloveYou(count, isNewPurchase);
                break;
            case 'disquette':
                this.updateFloppy(count, isNewPurchase);
                break;
            case 'y2k':
                this.updateY2K(count, isNewPurchase);
                break;
            case 'del_system32':
                this.updateDelSystem32(count, isNewPurchase);
                break;
            default:
                break;
        }
    }

    // =========================================================================
    // 1. 16 TOOLBARS IN INTERNET EXPLORER
    // =========================================================================
    updateToolbars(count, isNewPurchase) {
        if (isNewPurchase && window.gameEngine) {
            window.gameEngine.showNotification('🌐 16 Toolbars IE', `Nouvelle barre d'outils installée ! Il reste encore un peu de place pour naviguer.`);
        }
        this.renderBrowserToolbars();
    }

    renderBrowserToolbars() {
        const stack = document.getElementById('br-toolbars-stack');
        if (!stack) return;

        const up = window.gameEngine ? window.gameEngine.upgrades.find(u => u.id === 'toolbars') : null;
        const count = up ? up.count : 0;

        if (count === 0) {
            stack.innerHTML = '';
            return;
        }

        // List of 16 hilarious bloatware toolbars
        const allToolbars = [
            {
                cls: 'tb-yahoo',
                html: `<span class="tb-brand">🔍 Yahoo!</span>
                       <input type="text" class="win-input tb-input" placeholder="Chercher Yahoo..." />
                       <button class="win-btn tb-btn">Chercher</button>
                       <button class="win-btn tb-btn">Météo</button>
                       <button class="win-btn tb-btn">Mail (0)</button>
                       <button class="win-btn tb-btn">Horoscope</button>`
            },
            {
                cls: 'tb-ask',
                html: `<span class="tb-brand">🎩 AskJeeves</span>
                       <input type="text" class="win-input tb-input" placeholder="Demander à Jeeves..." />
                       <button class="win-btn tb-btn">Question</button>
                       <button class="win-btn tb-btn">Dictionnaire</button>
                       <button class="win-btn tb-btn">Astuce du jour</button>`
            },
            {
                cls: 'tb-smiley',
                html: `<span class="tb-brand">😊 SmileyCentral</span>
                       <button class="win-btn tb-btn">😄 Smileys 3D</button>
                       <button class="win-btn tb-btn">✨ Paillettes</button>
                       <button class="win-btn tb-btn">💩 Crotte qui danse</button>
                       <button class="win-btn tb-btn">Curseurs Coeur</button>`
            },
            {
                cls: 'tb-kazaa',
                html: `<span class="tb-brand">🎵 Kazaa FastTrack</span>
                       <button class="win-btn tb-btn">⚡ Turbo P2P 10x</button>
                       <button class="win-btn tb-btn">Top 50 MP3</button>
                       <button class="win-btn tb-btn">Cracks NoCD</button>`
            },
            {
                cls: 'tb-dogpile',
                html: `<span class="tb-brand">🐶 Dogpile</span>
                       <input type="text" class="win-input tb-input" placeholder="Renifler..." />
                       <button class="win-btn tb-btn">Chercher partout</button>
                       <button class="win-btn tb-btn">Os en or</button>`
            },
            {
                cls: 'tb-weather',
                html: `<span class="tb-brand">☀️ WeatherBug</span>
                       <span style="font-weight:bold; color:#cc3300;">Paris : 38°C</span>
                       <button class="win-btn tb-btn">Radar Doppler</button>
                       <button class="win-btn tb-btn">Alerte Tornade</button>`
            },
            {
                cls: 'tb-hotbar',
                html: `<span class="tb-brand">💖 Hotbar Neon</span>
                       <button class="win-btn tb-btn">Barbie 98</button>
                       <button class="win-btn tb-btn">Matrix Vert</button>
                       <button class="win-btn tb-btn">Flammes V8</button>`
            },
            {
                cls: 'tb-gator',
                html: `<span class="tb-brand">🛡️ Gator eWallet</span>
                       <button class="win-btn tb-btn">Auto-Remplir Formulaire</button>
                       <button class="win-btn tb-btn">Mots de passe</button>`
            },
            {
                cls: 'tb-casino',
                html: `<span class="tb-brand">🎰 Golden Palace</span>
                       <button class="win-btn tb-btn" style="color:#b8860b; font-weight:bold;">★ 500 TOURS GRATUITS ★</button>
                       <button class="win-btn tb-btn">Jackpot</button>`
            },
            {
                cls: 'tb-real',
                html: `<span class="tb-brand">📻 RealOne Player</span>
                       <button class="win-btn tb-btn">▶ Radio 28.8k</button>
                       <button class="win-btn tb-btn">Égaliseur</button>
                       <span style="color:#666;">Buffering...</span>`
            },
            {
                cls: 'tb-altavista',
                html: `<span class="tb-brand">🧭 AltaVista BabelFish</span>
                       <button class="win-btn tb-btn">Traduire en Latin</button>
                       <button class="win-btn tb-btn">Dictionnaire</button>`
            },
            {
                cls: 'tb-registry',
                html: `<span class="tb-brand">🧹 RegistryCleaner PRO</span>
                       <button class="win-btn tb-btn" style="color:#b71c1c; font-weight:bold;">⚠️ 4 892 ERREURS !</button>
                       <button class="win-btn tb-btn">Réparer</button>`
            },
            {
                cls: 'tb-mapquest',
                html: `<span class="tb-brand">🗺️ MapQuest Itinéraires</span>
                       <button class="win-btn tb-btn">Feuille de route</button>
                       <button class="win-btn tb-btn">Imprimer 18 pages</button>`
            },
            {
                cls: 'tb-shockwave',
                html: `<span class="tb-brand">🎮 Shockwave Games</span>
                       <button class="win-btn tb-btn">Yéti Sports</button>
                       <button class="win-btn tb-btn">Mini-Golf Flash</button>`
            },
            {
                cls: 'tb-clippy',
                html: `<span class="tb-brand">📎 Clippy Toolbar</span>
                       <button class="win-btn tb-btn">Conseil sarcastique</button>
                       <button class="win-btn tb-btn">Aide F1</button>`
            },
            {
                cls: 'tb-chaos',
                html: `<span class="tb-brand">💥 Bouzedows Destruction</span>
                       <button class="win-btn tb-btn" id="tb-btn-more-chaos">🔥 CORROMPRE PLUS VITE (+300 Octets)</button>`
            }
        ];

        // Number of toolbars rendered is clamped to Math.min(16, count)
        const visibleCount = Math.min(16, count);
        let html = '';
        for (let i = 0; i < visibleCount; i++) {
            const tb = allToolbars[i];
            html += `<div class="retro-toolbar ${tb.cls}">${tb.html}</div>`;
        }
        stack.innerHTML = html;

        // Bind interactive buttons inside toolbars
        stack.querySelectorAll('.tb-btn').forEach(btn => {
            btn.onclick = (e) => {
                e.stopPropagation();
                window.retroAudio.playClick();
                if (window.gameEngine) {
                    window.gameEngine.addReward(100, 'Toolbar', { clientX: e.clientX, clientY: e.clientY });
                }
            };
        });

        const chaosBtn = stack.querySelector('#tb-btn-more-chaos');
        if (chaosBtn) {
            chaosBtn.onclick = () => {
                window.retroAudio.playError();
                if (window.gameEngine) {
                    window.gameEngine.addReward(300, 'Toolbar Chaos', { clientX: window.innerWidth / 2, clientY: window.innerHeight / 2 });
                }
            };
        }
    }

    // =========================================================================
    // 2. BONZIBUDDY V1.0 (Purple Gorilla Character)
    // =========================================================================
    updateBonziBuddy(count, isNewPurchase) {
        if (!this.bonziEl) {
            this.createBonziBuddy();
        }

        if (isNewPurchase) {
            window.retroAudio.playDing();
            if (window.gameEngine) {
                window.gameEngine.showNotification('🐵 BonziBuddy v1.0 est là !', 'Bonjour mon ami ! Je suis là pour vous aider à surfer et à espionner vos fichiers.');
            }
            this.showBonziBubble("Bonjour mon ami ! Merci de m'avoir adopté. Je vais veiller sur ton ordinateur... et installer quelques barres d'outils !", 8000);
        }
    }

    createBonziBuddy() {
        const desktop = document.getElementById('desktop');
        if (!desktop) return;

        const wrap = document.createElement('div');
        wrap.className = 'bonzi-widget';
        wrap.id = 'bonzibuddy-actor';
        wrap.title = "BonziBuddy - Cliquez pour lui parler !";

        // Authentic Purple Gorilla SVG with yellow belly & green bow tie
        wrap.innerHTML = `
            <div class="bonzi-bubble hidden" id="bonzi-speech-bubble">
                <div id="bonzi-bubble-text">Bonjour mon ami !</div>
                <div class="bonzi-bubble-btns">
                    <button class="win-btn" id="bonzi-btn-joke">🎭 Blague</button>
                    <button class="win-btn" id="bonzi-btn-sing">🎵 Chanter</button>
                    <button class="win-btn" id="bonzi-btn-close">✕</button>
                </div>
            </div>
            <div class="bonzi-sprite">
                <svg viewBox="0 0 100 120" width="90" height="110">
                    <defs>
                        <radialGradient id="bonzi_purple" cx="40%" cy="35%" r="60%">
                            <stop offset="0%" stop-color="#9933cc"/>
                            <stop offset="60%" stop-color="#660099"/>
                            <stop offset="100%" stop-color="#440066"/>
                        </radialGradient>
                        <radialGradient id="bonzi_belly" cx="50%" cy="40%" r="55%">
                            <stop offset="0%" stop-color="#ffec8b"/>
                            <stop offset="100%" stop-color="#e6b800"/>
                        </radialGradient>
                    </defs>
                    <!-- Gorilla Ears -->
                    <circle cx="20" cy="38" r="14" fill="#660099" stroke="#330044" stroke-width="2"/>
                    <circle cx="20" cy="38" r="8" fill="#e6b800"/>
                    <circle cx="80" cy="38" r="14" fill="#660099" stroke="#330044" stroke-width="2"/>
                    <circle cx="80" cy="38" r="8" fill="#e6b800"/>
                    <!-- Gorilla Body -->
                    <ellipse cx="50" cy="85" rx="36" ry="32" fill="url(#bonzi_purple)" stroke="#330044" stroke-width="2"/>
                    <!-- Yellow Belly -->
                    <ellipse cx="50" cy="88" rx="24" ry="22" fill="url(#bonzi_belly)"/>
                    <!-- Gorilla Head -->
                    <ellipse cx="50" cy="42" rx="30" ry="26" fill="url(#bonzi_purple)" stroke="#330044" stroke-width="2"/>
                    <!-- Muzzle / Beak Area -->
                    <ellipse cx="50" cy="50" rx="20" ry="14" fill="url(#bonzi_belly)"/>
                    <!-- Nostrils -->
                    <ellipse cx="46" cy="46" rx="2" ry="3" fill="#884400"/>
                    <ellipse cx="54" cy="46" rx="2" ry="3" fill="#884400"/>
                    <!-- Big Smile -->
                    <path d="M 38 52 Q 50 62 62 52" stroke="#663300" stroke-width="2.5" fill="none" stroke-linecap="round"/>
                    <!-- Eyes with blinking highlight -->
                    <ellipse cx="40" cy="32" rx="6" ry="8" fill="#ffffff" stroke="#330044" stroke-width="1.5"/>
                    <circle cx="41" cy="33" r="3.5" fill="#000000"/>
                    <circle cx="43" cy="31" r="1.2" fill="#ffffff"/>
                    <ellipse cx="60" cy="32" rx="6" ry="8" fill="#ffffff" stroke="#330044" stroke-width="1.5"/>
                    <circle cx="59" cy="33" r="3.5" fill="#000000"/>
                    <circle cx="61" cy="31" r="1.2" fill="#ffffff"/>
                    <!-- Green Bow Tie -->
                    <polygon points="40,64 50,68 40,72" fill="#00aa00" stroke="#004400" stroke-width="1.5"/>
                    <polygon points="60,64 50,68 60,72" fill="#00aa00" stroke="#004400" stroke-width="1.5"/>
                    <circle cx="50" cy="68" r="3" fill="#ffcc00"/>
                    <!-- Gorilla Arms -->
                    <path d="M 18 70 C 8 85 10 102 18 106 C 24 104 22 90 26 78" fill="#660099" stroke="#330044" stroke-width="2"/>
                    <path d="M 82 70 C 92 85 90 102 82 106 C 76 104 78 90 74 78" fill="#660099" stroke="#330044" stroke-width="2"/>
                    <!-- Feet -->
                    <ellipse cx="34" cy="114" rx="10" ry="5" fill="#440066"/>
                    <ellipse cx="66" cy="114" rx="10" ry="5" fill="#440066"/>
                </svg>
            </div>
        `;

        desktop.appendChild(wrap);
        this.bonziEl = wrap;
        this.bonziBubbleEl = wrap.querySelector('#bonzi-speech-bubble');

        // Drag and drop for Bonzi
        let isDragging = false;
        let startX, startY, origX, origY;

        wrap.onmousedown = (e) => {
            if (e.target.closest('button')) return;
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            const rect = wrap.getBoundingClientRect();
            origX = rect.left;
            origY = rect.top;

            const onMouseMove = (moveEv) => {
                if (!isDragging) return;
                const dx = moveEv.clientX - startX;
                const dy = moveEv.clientY - startY;
                wrap.style.left = `${Math.max(0, Math.min(window.innerWidth - 100, origX + dx))}px`;
                wrap.style.top = `${Math.max(0, Math.min(window.innerHeight - 130, origY + dy))}px`;
                wrap.style.bottom = 'auto';
                wrap.style.right = 'auto';
            };

            const onMouseUp = () => {
                isDragging = false;
                window.removeEventListener('mousemove', onMouseMove);
                window.removeEventListener('mouseup', onMouseUp);
            };

            window.addEventListener('mousemove', onMouseMove);
            window.addEventListener('mouseup', onMouseUp);
        };

        // Clicking on Bonzi sprite directly
        wrap.querySelector('.bonzi-sprite').onclick = (e) => {
            if (Math.abs(e.clientX - startX) > 5 || Math.abs(e.clientY - startY) > 5) return; // ignore drag release
            window.retroAudio.playDing();
            if (window.gameEngine) {
                window.gameEngine.addReward(250, 'Bonzi', { clientX: e.clientX, clientY: e.clientY });
            }
            this.showRandomBonziQuote();
        };

        // Speech bubble buttons
        wrap.querySelector('#bonzi-btn-close').onclick = () => {
            this.hideBonziBubble();
        };

        wrap.querySelector('#bonzi-btn-joke').onclick = () => {
            window.retroAudio.playAsterisk();
            const jokes = [
                "Que dit un modem 56k quand il a trop mangé ? 'Je compresse V.90 !'",
                "Pourquoi Bouzedows porte-t-il des lunettes ? Parce qu'il ne voit pas ses erreurs KERNEL32 !",
                "Combien de techniciens Microbouze faut-il pour changer une ampoule ? Aucun, ils décrètent que l'obscurité est le nouveau standard."
            ];
            const joke = jokes[Math.floor(Math.random() * jokes.length)];
            this.showBonziBubble(`🎭 ${joke}`, 6000);
            if (window.gameEngine) {
                window.gameEngine.addReward(300, 'Blague Bonzi');
            }
        };

        wrap.querySelector('#bonzi-btn-sing').onclick = () => {
            window.retroAudio.playQuack();
            this.showBonziBubble(`🎵 "Dale a tu cuerpo alegría Macarena, hey Macarena ! AY ! (En RealAudio 8-bit)"`, 5000);
            if (window.gameEngine) {
                window.gameEngine.addReward(450, 'Chanson Bonzi');
            }
        };
    }

    showRandomBonziQuote() {
        const q = this.bonziQuotes[Math.floor(Math.random() * this.bonziQuotes.length)];
        this.showBonziBubble(q, 7000);
    }

    showBonziBubble(text, autoHideMs = 6000) {
        if (!this.bonziBubbleEl) return;
        const txtEl = this.bonziBubbleEl.querySelector('#bonzi-bubble-text');
        if (txtEl) txtEl.textContent = text;
        this.bonziBubbleEl.classList.remove('hidden');

        if (this.bonziHideTimer) clearTimeout(this.bonziHideTimer);
        if (autoHideMs > 0) {
            this.bonziHideTimer = setTimeout(() => this.hideBonziBubble(), autoHideMs);
        }
    }

    hideBonziBubble() {
        if (this.bonziBubbleEl) {
            this.bonziBubbleEl.classList.add('hidden');
        }
    }

    // =========================================================================
    // 3. PENTIUM II SANS VENTILATEUR (Overclock & Fan Noise)
    // =========================================================================
    updatePentiumFan(count, isNewPurchase) {
        if (count > 0) {
            if (window.retroAudio) {
                window.retroAudio.startFanNoise(count);
                this.fanRunning = true;
            }
            this.showFanHeatVisuals(true);

            if (isNewPurchase && window.gameEngine) {
                window.gameEngine.showNotification('🔥 Pentium II sans ventilateur', 'Le ventilateur hurle à 12 000 RPM ! Le chewing-gum thermique commence à fondre.');
            }
        } else {
            if (window.retroAudio) {
                window.retroAudio.stopFanNoise();
                this.fanRunning = false;
            }
            this.showFanHeatVisuals(false);
        }
    }

    showFanHeatVisuals(enable) {
        const desktop = document.getElementById('desktop');
        if (!desktop) return;

        let haze = document.getElementById('pentium-heat-haze');
        let smoke = document.getElementById('pentium-fan-smoke');

        if (enable) {
            if (!haze) {
                haze = document.createElement('div');
                haze.id = 'pentium-heat-haze';
                haze.className = 'pentium-heat-haze';
                desktop.appendChild(haze);
            }
            if (!smoke) {
                smoke = document.createElement('div');
                smoke.id = 'pentium-fan-smoke';
                smoke.className = 'pentium-fan-smoke';
                smoke.textContent = '💨';
                desktop.appendChild(smoke);
            }
            // Update clock with fire icon
            const clock = document.getElementById('taskbar-clock-text');
            if (clock && !clock.textContent.includes('🔥')) {
                clock.textContent = '🔥 ' + clock.textContent;
            }
        } else {
            if (haze) haze.remove();
            if (smoke) smoke.remove();
        }
    }

    // =========================================================================
    // 4. MODEM 56K EN SURCHAUFFE (External US Robotics widget)
    // =========================================================================
    updateModem56k(count, isNewPurchase) {
        if (!this.modemEl) {
            this.createModemWidget();
        }

        if (isNewPurchase && window.gameEngine) {
            window.gameEngine.showNotification('📞 Modem 56k actif', 'Le modem US Robotics chauffe. La ligne du salon est occupée.');
        }
    }

    createModemWidget() {
        const desktop = document.getElementById('desktop');
        if (!desktop) return;

        const widget = document.createElement('div');
        widget.className = 'modem-box-widget';
        widget.id = 'modem-56k-box';
        widget.title = "Modem US Robotics 56k Sportster - Cliquez pour écouter les paquets";

        widget.innerHTML = `
            <span>📞 USR 56k</span>
            <div class="modem-leds-row">
                <span class="modem-led on-red" title="Power"></span>
                <span class="modem-led on-green" id="led-rd" title="Receive Data"></span>
                <span class="modem-led on-green" id="led-sd" title="Send Data"></span>
                <span class="modem-led on-green" id="led-cd" title="Carrier Detect"></span>
            </div>
        `;

        widget.onclick = () => {
            window.retroAudio.playClick();
            if (window.retroAudio.playStaticBurst) window.retroAudio.playStaticBurst();
            if (window.gameEngine) {
                window.gameEngine.addReward(150, 'Modem 56k', { clientX: window.innerWidth - 180, clientY: window.innerHeight - 60 });
            }
        };

        desktop.appendChild(widget);
        this.modemEl = widget;

        // Frantic LED blinking
        setInterval(() => {
            const rd = document.getElementById('led-rd');
            const sd = document.getElementById('led-sd');
            if (rd) rd.className = Math.random() < 0.6 ? 'modem-led on-green' : 'modem-led';
            if (sd) sd.className = Math.random() < 0.5 ? 'modem-led on-green' : 'modem-led';
        }, 180);
    }

    // =========================================================================
    // 5. TROJAN SUB7 & BACK ORIFICE (CD-ROM Tray Pop-out)
    // =========================================================================
    updateSub7(count, isNewPurchase) {
        if (isNewPurchase) {
            this.triggerCdEjectAnimation();
            if (window.gameEngine) {
                window.gameEngine.showNotification('💿 Trojan Sub7', 'Un pirate distant a éjecté votre tiroir de lecteur CD-ROM !');
            }
        }
    }

    triggerCdEjectAnimation() {
        if (this.cdTrayEl) return;
        window.retroAudio.playCdEject();

        const tray = document.createElement('div');
        tray.className = 'sub7-cd-tray';
        tray.id = 'sub7-cd-tray';
        tray.innerHTML = `
            <span>💿</span>
            <div>
                <div>LECTEUR (D:) ÉJECTÉ PAR SUB7</div>
                <div style="font-size:9px; color:#555; font-weight:normal;">Port 27374 ouvert • Fermeture automatique...</div>
            </div>
        `;
        document.body.appendChild(tray);
        this.cdTrayEl = tray;

        setTimeout(() => {
            window.retroAudio.playCdClose();
            tray.style.animation = 'slideInRight 0.3s reverse';
            setTimeout(() => {
                tray.remove();
                this.cdTrayEl = null;
            }, 300);
        }, 4000);
    }

    // =========================================================================
    // 6. VER BLASTER MS03-026 (60s RPC Shutdown Countdown Dialog)
    // =========================================================================
    updateBlaster(count, isNewPurchase) {
        if (isNewPurchase && !this.blasterDialogEl) {
            this.spawnBlasterDialog();
        }
    }

    spawnBlasterDialog() {
        if (this.blasterDialogEl) return;
        this.blasterTimeLeft = 60;

        window.retroAudio.playError();

        const dialog = document.createElement('div');
        dialog.className = 'blaster-dialog';
        dialog.id = 'blaster-dialog';

        dialog.innerHTML = `
            <div class="blaster-title-bar">
                <span>Arrêt du système</span>
                <span style="font-size:10px;">✕</span>
            </div>
            <div class="blaster-body">
                <p>Cet arrêt a été initié par <strong>NT AUTHORITY\\SYSTEM</strong>.</p>
                <p>Le processus système KERNEL32/RPC s'est terminé de façon inattendue avec le code d'état <strong>-1073741819</strong>.</p>
                <p>Le système va maintenant redémarrer. Veuillez enregistrer tout travail en cours.</p>
                <div class="blaster-timer-big" id="blaster-timer-text">00:59</div>
                <div style="display:flex; justify-content:flex-end; gap:6px; margin-top:8px;">
                    <button class="win-btn" id="btn-blaster-abort" style="font-weight:bold; color:#000080;">💻 shutdown -a (Annuler l'arrêt)</button>
                </div>
            </div>
        `;

        document.body.appendChild(dialog);
        this.blasterDialogEl = dialog;

        const timerText = dialog.querySelector('#blaster-timer-text');
        const abortBtn = dialog.querySelector('#btn-blaster-abort');

        this.blasterTimerInterval = setInterval(() => {
            this.blasterTimeLeft--;
            if (timerText) {
                const s = this.blasterTimeLeft < 10 ? '0' + this.blasterTimeLeft : this.blasterTimeLeft;
                timerText.textContent = `00:${s}`;
            }

            if (this.blasterTimeLeft <= 0) {
                clearInterval(this.blasterTimerInterval);
                this.closeBlasterDialog();
                if (window.glitchController) {
                    window.glitchController.triggerScreenShake();
                }
                if (window.windowManager) {
                    window.windowManager.spawnErrorDialog('Arrêt RPC', 'Le système a miraculeusement redémarré sur ses secteurs défectueux.');
                }
            }
        }, 1000);

        if (abortBtn) {
            abortBtn.onclick = () => {
                window.retroAudio.playAsterisk();
                if (window.gameEngine) {
                    window.gameEngine.addReward(10000, 'shutdown -a', { clientX: window.innerWidth / 2, clientY: window.innerHeight / 2 });
                    window.gameEngine.showNotification('🛡️ shutdown -a exécuté !', 'Le ver Blaster a été temporairement neutralisé par la commande MS-DOS.');
                }
                this.closeBlasterDialog();
            };
        }
    }

    closeBlasterDialog() {
        if (this.blasterTimerInterval) {
            clearInterval(this.blasterTimerInterval);
            this.blasterTimerInterval = null;
        }
        if (this.blasterDialogEl) {
            this.blasterDialogEl.remove();
            this.blasterDialogEl = null;
        }
    }

    // =========================================================================
    // 7. VER ILOVEYOU.VBS (Floating envelopes & .vbs desktop shortcuts)
    // =========================================================================
    updateIloveYou(count, isNewPurchase) {
        if (isNewPurchase) {
            window.retroAudio.playDing();
            if (window.gameEngine) {
                window.gameEngine.showNotification('💌 Ver ILOVEYOU.vbs', 'Vous avez reçu un courrier d\'amour anonyme. Vos fichiers ont été infectés.');
            }
            this.spawnLoveEnvelopes();
            this.renameShortcutsToVbs();
        }
    }

    spawnLoveEnvelopes() {
        const desktop = document.getElementById('desktop');
        if (!desktop) return;

        for (let i = 0; i < 3; i++) {
            const env = document.createElement('div');
            env.className = 'iloveyou-envelope';
            env.textContent = '💌';
            env.style.left = `${100 + Math.random() * (window.innerWidth - 250)}px`;
            env.style.top = `${60 + Math.random() * (window.innerHeight - 200)}px`;
            env.title = "LOVE-LETTER-FOR-YOU.TXT.vbs - Cliquez pour ouvrir l'amour";

            env.onclick = () => {
                window.retroAudio.playError();
                if (window.gameEngine) {
                    window.gameEngine.addReward(500, 'Love Letter', { clientX: parseInt(env.style.left, 10), clientY: parseInt(env.style.top, 10) });
                }
                env.remove();
            };

            desktop.appendChild(env);
        }
    }

    renameShortcutsToVbs() {
        const labels = document.querySelectorAll('.desktop-icon-label');
        labels.forEach(l => {
            if (!l.textContent.endsWith('.vbs')) {
                l.textContent += '.vbs';
            }
        });
    }

    // =========================================================================
    // 8. DISQUETTE 3.5" INFECTÉE (Floppy seek noise & drive badge)
    // =========================================================================
    updateFloppy(count, isNewPurchase) {
        if (isNewPurchase && window.retroAudio) {
            window.retroAudio.playFloppyDrive();
        }
    }

    // =========================================================================
    // 9. BUG DE L'AN 2000 (Y2K - Clock rewinds to 1900)
    // =========================================================================
    updateY2K(count, isNewPurchase) {
        const clock = document.getElementById('taskbar-clock-text');
        if (clock) {
            clock.textContent = '01/01/1900 00:00';
            clock.style.color = '#ff0000';
        }
        if (isNewPurchase && window.gameEngine) {
            window.gameEngine.showNotification('⏳ Bug de l\'An 2000 (Y2K)', 'L\'horloge du BIOS a basculé en 1900 ! Les banques et cafetières sont en panique.');
            if (window.glitchController) {
                window.glitchController.triggerScreenShake();
            }
        }
    }

    // =========================================================================
    // 10. SUPPRIMER C:\BOUZEDOWS\SYSTEM32 (Start button panic)
    // =========================================================================
    updateDelSystem32(count, isNewPurchase) {
        const startText = document.querySelector('.start-text');
        if (startText) {
            startText.textContent = 'AU SECOURS !';
            startText.style.color = '#ff0000';
            startText.style.fontWeight = 'bold';
        }
        if (isNewPurchase && window.gameEngine) {
            window.gameEngine.showNotification('🗑️ SYSTEM32 SUPPRIMÉ', 'Les fichiers vitaux du système ont disparu. Le bureau vacille sur ses fondations.');
        }
    }

    // =========================================================================
    // Periodic Tick Loop (Bonzi jokes, Sub7, Fan speed tuning)
    // =========================================================================
    onPeriodicTick() {
        if (!window.gameEngine || !window.gameEngine.upgrades) return;

        const bonziUp = window.gameEngine.upgrades.find(u => u.id === 'bonzi');
        if (bonziUp && bonziUp.count > 0 && Math.random() < 0.25) {
            this.showRandomBonziQuote();
        }

        const sub7Up = window.gameEngine.upgrades.find(u => u.id === 'subseven');
        if (sub7Up && sub7Up.count > 0 && Math.random() < 0.12) {
            this.triggerCdEjectAnimation();
        }

        const fanUp = window.gameEngine.upgrades.find(u => u.id === 'overclock');
        if (fanUp && fanUp.count > 0 && window.retroAudio) {
            window.retroAudio.setFanSpeed(fanUp.count + (window.gameEngine.systemDamage / 80));
        }

        const floppyUp = window.gameEngine.upgrades.find(u => u.id === 'disquette');
        if (floppyUp && floppyUp.count > 0 && Math.random() < 0.18) {
            if (window.retroAudio && !window.retroAudio.isMuted) {
                window.retroAudio.playFloppyDrive();
            }
        }
    }

    resetAll() {
        if (window.retroAudio) {
            window.retroAudio.stopFanNoise();
        }
        this.showFanHeatVisuals(false);
        this.closeBlasterDialog();

        if (this.bonziEl) {
            this.bonziEl.remove();
            this.bonziEl = null;
            this.bonziBubbleEl = null;
        }

        if (this.modemEl) {
            this.modemEl.remove();
            this.modemEl = null;
        }

        const startText = document.querySelector('.start-text');
        if (startText) {
            startText.textContent = 'Démarrer';
            startText.style.color = '';
            startText.style.fontWeight = '';
        }

        document.querySelectorAll('.iloveyou-envelope').forEach(e => e.remove());
    }
}

// Global instance
window.virusEffects = new VirusEffectsController();
