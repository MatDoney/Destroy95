/**
 * Windows 95 / 2000 Popup Storm & Parody Ads Manager
 * Generates retro 90s/2000s popups (funny SFW parody ads & clickbaits).
 */

class PopupManager {
    constructor() {
        this.popups = new Map(); // id -> element
        this.counter = 0;
        this.maxPopups = 16;
        this.lastAutoSpawn = 0;

        this.adTemplates = [
            {
                id: 'hot_motherboards',
                title: '🔥 RENCONTRE DES CARTES MÈRES CHAUDES !',
                tag: 'CÉLIBATAIRES DU 56K',
                msg: 'Socket 7 célibataire sans cavalier cherche processeur Pentium vigoureux avec bus 66MHz ! Veux-tu voir ses connecteurs IDE dénudés ?',
                btnText: '👉 VOIR LES PINS DÉNUDÉS',
                reward: 650,
                theme: 'hot'
            },
            {
                id: 'hard_drive_enlarge',
                title: '🍆 AUGMENTEZ LA TAILLE DE VOTRE DISQUE DUR !',
                tag: 'MÉTHODE NATURELLE',
                msg: 'Votre disque dur fait moins de 850 Mo ? Gagnez +20 Go en 3 jours grâce à notre aspiration magnétique des plateaux ! Garanti sans chirurgie.',
                btnText: '🚀 AGRANDIR MON LECTEUR C:',
                reward: 850,
                theme: 'growth'
            },
            {
                id: 'nicole_56k',
                title: '👩‍💻 NICOLE ATTEND VOTRE MESSAGE SUR ICQ !',
                tag: 'CHAT EN DIRECT 1999',
                msg: '« Salut beau brun ! Mon modem US Robotics fait un bruit torride quand je télécharge ta photo... Rejoins-moi sur Caramail ! »',
                btnText: '💌 RÉPONDRE À NICOLE',
                reward: 700,
                theme: 'pink'
            },
            {
                id: 'millionth_visitor',
                title: '🎰 1 000 000ème VISITEUR DÉTECTÉ !',
                tag: 'PRIX OFFICIEL',
                msg: 'FÉLICITATIONS ! Vous avez remporté un SCANNER À PLAT SCSI et un pack de 50 disquettes vierges ! Cliquez vite pour confirmer !',
                btnText: '🎁 RÉCLAMER MON SCANNER',
                reward: 1200,
                theme: 'gold'
            },
            {
                id: 'viagra_pentium',
                title: '💊 VIAGRA POUR PROCESSEUR FATIGUÉ',
                tag: 'PERFORMANCE MAX',
                msg: 'Votre CPU mollit sous Word 97 ? Des pannes de virgule flottante ? Une seule gélule de silicium et il tourne à 1500 MHz pendant 4 heures !',
                btnText: '⚡ SURBOOSTER LE CHIPSET',
                reward: 950,
                theme: 'cyan'
            },
            {
                id: 'voisine_history',
                title: '⚠️ VOTRE VOISINE A VU VOTRE HISTORIQUE !',
                tag: 'ALERTE DISCRÉTION',
                msg: 'Elle sait que vous avez cherché « Lara Croft sans vêtements » sur AltaVista hier soir. Téléchargez Effaceur-Pro pour éviter la honte !',
                btnText: '🧹 EFFACER LES TRACES',
                reward: 800,
                theme: 'alert'
            },
            {
                id: 'banana_fun',
                title: '🍌 BANANORAMA 2000 : JEU FLASH CHAUD !',
                tag: 'WANADOO EXCLUSIF',
                msg: 'Cliquez sur la banane pour tester votre agilité de souris ! Les 100 meilleurs joueurs recevront un tapis de souris en mousse.',
                btnText: '🍌 CLIQUER SUR LA BANANE',
                reward: 900,
                theme: 'banana'
            },
            {
                id: 'bonzi_beach',
                title: '🦧 BONZIBUDDY VEUT VOUS MONTRER SON MAILLOT !',
                tag: 'COMPAGNON SECRET',
                msg: '« Hé l\'ami ! Tu as l\'air stressé par tous ces virus. Veux-tu que j\'enfile mon slip de bain léopard et que je te chante la Macarena ? »',
                btnText: '🐵 DANSER AVEC BONZI',
                reward: 1100,
                theme: 'purple'
            },
            {
                id: 'twingo_fax',
                title: '🚗 GAGNEZ UNE RENAULT TWINGO 1996 !',
                tag: 'GRAND JEU CONCOURS',
                msg: 'Envoyez « WINDOWS » par minitel au 3615 GAGNER ! Tirage au sort sous le contrôle de Maître Capello (Frais : 3,50 Francs/min).',
                btnText: '🏎️ ENVOYER LE FAX',
                reward: 1000,
                theme: 'orange'
            },
            {
                id: 'minitel_ulla',
                title: '📟 3615 ULLA : DIALOGUE DIRECT 1200 BAUDS',
                tag: 'RENCONTRE MINITEL',
                msg: '« CHERCHE COMPAGNON CONNECTÉ POUR ÉCHANGER DES FICHIERS TEXTES ET DES ÉMOTICÔNES EN ASCII :-) ENVOIE UN BIP ! »',
                btnText: '📟 ENVOYER UN BIP',
                reward: 750,
                theme: 'minitel'
            },
            {
                id: 'free_mp3_kazaa',
                title: '🎵 MP3 GRATUIT : EIFFEL 65 - BLUE (REAL CRACK)',
                tag: 'KAZAA FASTTRACK',
                msg: 'Téléchargez ce fichier de 18 Ko qui n\'est absolument PAS un cheval de Troie qui fait clignoter le voyant de votre clavier Num Lock !',
                btnText: '📥 TÉLÉCHARGER LE MP3',
                reward: 1300,
                theme: 'gold'
            },
            {
                id: 'y2k_bunker',
                title: '☢️ BUG DE L\'AN 2000 : RÉSERVEZ VOTRE BUNKER !',
                tag: 'SURVIE MILLENIUM',
                msg: 'Le 31 décembre à minuit, tous les micro-ondes exploseront ! Achetez notre guide de survie imprimé sur papier listing perforé.',
                btnText: '🛡️ REJOINDRE LE BUNKER',
                reward: 1400,
                theme: 'alert'
            }
        ];
    }

    spawnPopup(template = null) {
        if (this.popups.size >= this.maxPopups) {
            // Remove oldest popup to make room
            const firstKey = this.popups.keys().next().value;
            this.closePopup(firstKey);
        }

        const ad = template || this.adTemplates[Math.floor(Math.random() * this.adTemplates.length)];
        const id = 'ad_popup_' + (++this.counter);

        // Sound effect
        if (window.retroAudio) {
            if (Math.random() < 0.5) window.retroAudio.playPop();
            else window.retroAudio.playQuack();
        }

        // Random coordinates within visible screen
        const maxW = Math.max(100, window.innerWidth - 340);
        const maxH = Math.max(100, window.innerHeight - 260);
        const posX = Math.floor(20 + Math.random() * maxW);
        const posY = Math.floor(20 + Math.random() * maxH);

        const el = document.createElement('div');
        el.className = `retro-window popup-ad-window theme-${ad.theme}`;
        el.id = id;
        el.style.left = `${posX}px`;
        el.style.top = `${posY}px`;
        el.style.width = '320px';
        el.style.zIndex = ++window.windowManager.highestZ;

        el.innerHTML = `
            <div class="window-title-bar popup-title-bar">
                <div class="window-title-left">
                    <span class="popup-flame">🔥</span>
                    <span class="window-title-text">${ad.title}</span>
                </div>
                <div class="window-controls">
                    <button class="win-btn win-btn-close" data-ad-close="true">✕</button>
                </div>
            </div>
            <div class="popup-ad-body">
                <div class="popup-badge">${ad.tag}</div>
                <div class="popup-marquee"><marquee scrollamount="4">★★★ OFFRE EXCLUSIVE 1998 ★★★ CLIQUEZ AVANT EXPIRATION ★★★</marquee></div>
                <p class="popup-message">${ad.msg}</p>
                <div class="popup-action-row">
                    <button class="win-btn popup-claim-btn" data-ad-claim="true">
                        ${ad.btnText}<br>
                        <span class="popup-reward-badge">+${window.gameEngine.formatNumber(ad.reward)} Octets</span>
                    </button>
                </div>
                <div class="popup-sub-links">
                    <a href="#" class="popup-link-no" data-ad-close="true">[ Non merci, je préfère ramer ]</a>
                </div>
            </div>
        `;

        document.getElementById('desktop').appendChild(el);
        this.popups.set(id, el);

        // Dragging support
        const titleBar = el.querySelector('.window-title-bar');
        this.attachDrag(el, titleBar);

        // Claim button
        el.querySelector('[data-ad-claim="true"]').onclick = (e) => {
            e.stopPropagation();
            window.retroAudio.playGlitchBleep();

            // Reward
            window.gameEngine.bytes += ad.reward;
            window.gameEngine.totalBytes += ad.reward;
            window.gameEngine.updateDamage();

            const rect = el.getBoundingClientRect();
            window.gameEngine.spawnFloatText(`+${window.gameEngine.formatNumber(ad.reward)} Octets !`, rect.left + 80, rect.top + 20);

            this.closePopup(id);
        };

        // Close button
        el.querySelectorAll('[data-ad-close="true"]').forEach(btn => {
            btn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                window.retroAudio.playClick();

                // 20% chance to spawn a baby popup on close! (Classic 2000s popup hydra)
                if (Math.random() < 0.22 && this.popups.size < this.maxPopups) {
                    setTimeout(() => this.spawnPopup(), 150);
                }

                this.closePopup(id);
            };
        });

        // Bring to front on click
        el.onmousedown = () => {
            el.style.zIndex = ++window.windowManager.highestZ;
        };

        return el;
    }

    attachDrag(el, handle) {
        let isDragging = false;
        let startX, startY, initX, initY;

        handle.onmousedown = (e) => {
            if (e.target.closest('.win-btn')) return;
            isDragging = true;
            el.style.zIndex = ++window.windowManager.highestZ;
            startX = e.clientX;
            startY = e.clientY;
            initX = el.offsetLeft;
            initY = el.offsetTop;

            const onMove = (me) => {
                if (!isDragging) return;
                const nx = Math.max(0, Math.min(window.innerWidth - 60, initX + me.clientX - startX));
                const ny = Math.max(0, Math.min(window.innerHeight - 70, initY + me.clientY - startY));
                el.style.left = `${nx}px`;
                el.style.top = `${ny}px`;
            };

            const onUp = () => {
                isDragging = false;
                window.removeEventListener('mousemove', onMove);
                window.removeEventListener('mouseup', onUp);
            };

            window.addEventListener('mousemove', onMove);
            window.addEventListener('mouseup', onUp);
        };
    }

    closePopup(id) {
        const el = this.popups.get(id);
        if (el) {
            el.remove();
            this.popups.delete(id);
        }
    }

    closeAllPopups() {
        this.popups.forEach((el) => {
            el.remove();
        });
        this.popups.clear();
        if (window.retroAudio) {
            window.retroAudio.playAsterisk();
        }
        if (window.gameEngine) {
            window.gameEngine.showNotification('🛡️ AdBlock 95 Activé', 'Tous les pop-ups ont été neutralisés avec succès.');
        }
    }

    // Called on clicks or ticks: chance to spawn popups based on destruction level
    maybeSpawnOnAction(damage) {
        if (damage < 20) return;

        // Chance scales with damage
        // At 50% damage: 2% chance per click
        // At 200% damage: 8% chance per click
        // At 1000% damage: 18% chance per click
        const chance = Math.min(0.22, 0.015 + (damage / 4000));
        if (Math.random() < chance) {
            this.spawnPopup();
        }
    }

    // Called periodically from main game loop
    checkAutoSpawn(damage) {
        if (damage < 25) return;

        const now = Date.now();
        // Higher damage = more frequent auto-spawns
        // 25% damage -> every 35s
        // 100% damage -> every 14s
        // 500% damage -> every 6s
        // 2000% damage -> every 3s
        const interval = Math.max(2800, 38000 / (1 + damage * 0.006));

        if (now - this.lastAutoSpawn > interval) {
            this.lastAutoSpawn = now;
            this.spawnPopup();
        }
    }
}

// Global instance
window.popupManager = new PopupManager();
