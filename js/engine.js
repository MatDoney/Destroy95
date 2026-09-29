/**
 * Bouzedows Destruction Simulator - Clicker Engine
 */

class ClickerEngine {
    constructor() {
        this.bytes = 0;
        this.totalBytes = 0;
        this.clickPower = 1;
        this.cps = 0;
        this.systemDamage = 0; // 0 to 100%
        this.prestigeCount = 0;
        this.rebootPoints = 0; // Silicon chips
        this.lastTick = Date.now();
        this.lastHddSound = 0;
        this.cpuTemp = 36;
        this.bsodTriggered = false;

        // Upgrades (Passive Virus / Hardware Failures)
        this.upgrades = [
            {
                id: 'disquette',
                name: 'Disquette 3.5" infectée',
                desc: 'Virus de boot secteur "Brain" échangé dans la cour de récré.',
                baseCost: 15,
                cost: 15,
                cps: 1,
                count: 0,
                icon: 'floppy'
            },
            {
                id: 'macroWord',
                name: 'Macro Word 97',
                desc: 'Un mystérieux document "LISEZ-MOI.DOC" avec macro malveillante.',
                baseCost: 100,
                cost: 100,
                cps: 6,
                count: 0,
                icon: 'notepad'
            },
            {
                id: 'modem56k',
                name: 'Modem 56k en surchauffe',
                desc: 'Télécharge des MP3s sur Napster tout en bloquant la ligne téléphonique.',
                baseCost: 600,
                cost: 600,
                cps: 26,
                count: 0,
                icon: 'computer'
            },
            {
                id: 'bonzi',
                name: 'BonziBuddy v1.0',
                desc: 'Le gorille violet interactif qui installe 14 adwares en arrière-plan.',
                baseCost: 2800,
                cost: 2800,
                cps: 110,
                count: 0,
                icon: 'clippy'
            },
            {
                id: 'iloveyou',
                name: 'Ver ILOVEYOU.vbs',
                desc: 'Email d\'amour anonyme qui remplace tous vos fichiers par des scripts.',
                baseCost: 12000,
                cost: 12000,
                cps: 450,
                count: 0,
                icon: 'warningBadge'
            },
            {
                id: 'subseven',
                name: 'Trojan Sub7 & Back Orifice',
                desc: 'Un pirate ouvre et ferme votre tiroir de CD-ROM à distance.',
                baseCost: 55000,
                cost: 55000,
                cps: 1800,
                count: 0,
                icon: 'cdrom'
            },
            {
                id: 'kazaa',
                name: 'Téléchargement Kazaa P2P',
                desc: '"Linkin_Park_Numb.mp3.exe" (32 Ko). Totalement légitime.',
                baseCost: 240000,
                cost: 240000,
                cps: 7500,
                count: 0,
                icon: 'chaosEngine'
            },
            {
                id: 'overclock',
                name: 'Pentium II sans ventilateur',
                desc: 'Overclocké de 233 à 450 MHz avec un chewing-gum en guise de pâte thermique.',
                baseCost: 1100000,
                cost: 1100000,
                cps: 32000,
                count: 0,
                icon: 'computer'
            },
            {
                id: 'blaster',
                name: 'Ver Blaster (MS03-026)',
                desc: '"Arrêt du système dans 60 secondes initié par NT AUTHORITY\\SYSTEM".',
                baseCost: 5500000,
                cost: 5500000,
                cps: 140000,
                count: 0,
                icon: 'errorBadge'
            },
            {
                id: 'chernobyl',
                name: 'Tchernobyl CIH v1.4',
                desc: 'Le virus ultime qui écrase le Flash BIOS et détruit la carte mère.',
                baseCost: 28000000,
                cost: 28000000,
                cps: 650000,
                count: 0,
                icon: 'chaosEngine'
            },
            {
                id: 'toolbars',
                name: '16 Toolbars Internet Explorer',
                desc: 'Yahoo, AskJeeves, Bonzi, SmileyCentral. Il reste 2 cm d\'écran pour naviguer.',
                baseCost: 150000000,
                cost: 150000000,
                cps: 3200000,
                count: 0,
                icon: 'internetExplorer'
            },
            {
                id: 'del_system32',
                name: 'Supprimer C:\\BOUZEDOWS\\SYSTEM32',
                desc: '"Voulez-vous vraiment supprimer les 1 842 fichiers vitaux du système ?" -> OUI',
                baseCost: 900000000,
                cost: 900000000,
                cps: 18000000,
                count: 0,
                icon: 'recycleBin'
            },
            {
                id: 'y2k',
                name: 'Bug de l\'An 2000 (Y2K)',
                desc: 'L\'horloge bascule en 1900. Chaos boursier et cafetières en panique.',
                baseCost: 5000000000,
                cost: 5000000000,
                cps: 95000000,
                count: 0,
                icon: 'warningBadge'
            }
        ];

        // Click Enhancers - Scaling up to endgame (with % of total CPS synergy)
        this.clickUpgrades = [
            {
                id: 'ball_mouse',
                name: 'Nettoyer la boule de souris',
                desc: 'Retirer les moutons de poussière et la crasse collée sur les rouleaux en plastique.',
                cost: 30,
                power: 1,
                percentCps: 0,
                icon: 'computer',
                count: 0,
                purchased: false
            },
            {
                id: 'ps2_speed',
                name: 'Port PS/2 cadencé à 200Hz',
                desc: 'Overclocker le port PS/2 pour une réponse de clic ultra-nerveuse sous Bouzedows.',
                cost: 250,
                power: 5,
                percentCps: 0,
                icon: 'computer',
                count: 0,
                purchased: false
            },
            {
                id: 'double_click',
                name: 'Double-clic rageur',
                desc: 'Cliquer 5 fois d\'affilée comme un forcené en pensant que l\'application va s\'ouvrir plus vite.',
                cost: 2000,
                power: 30,
                percentCps: 0,
                icon: 'warningBadge',
                count: 0,
                purchased: false
            },
            {
                id: 'crt_whack',
                name: 'Taper sur le côté du moniteur CRT',
                desc: 'La technique universelle des années 90 qui réaligne instantanément le faisceau d\'électrons.',
                cost: 15000,
                power: 150,
                percentCps: 0,
                icon: 'errorBadge',
                count: 0,
                purchased: false
            },
            {
                id: 'clippy_bribe',
                name: 'Corrompre Clippy le trombone',
                desc: 'Un pot-de-vin en agrafes pour débloquer les privilèges administrateur masqués.',
                cost: 120000,
                power: 800,
                percentCps: 0,
                icon: 'clippy',
                count: 0,
                purchased: false
            },
            {
                id: 'quick_format',
                name: 'Clic droit "Formatage rapide"',
                desc: 'Chaque clic de souris efface physiquement une table d\'allocation FAT32.',
                cost: 950000,
                power: 4500,
                percentCps: 0,
                icon: 'floppy',
                count: 0,
                purchased: false
            },
            {
                id: 'macro_rec',
                name: 'Macro logicielle AutoClick 95',
                desc: 'Enregistreur de frappe bricolé en Turbo Pascal qui simule des milliers d\'impulsions.',
                cost: 7500000,
                power: 25000,
                percentCps: 0.005, // +0.5% CPS
                icon: 'notepad',
                count: 0,
                purchased: false
            },
            {
                id: 'voodoo_click',
                name: 'Accélérateur 3D 3dfx Glide Clic',
                desc: 'Faire calculer la trajectoire du pointeur par une carte 3dfx Voodoo 2 12Mo voodoo.dll.',
                cost: 60000000,
                power: 150000,
                percentCps: 0.010, // +1.0% CPS
                icon: 'pinball',
                count: 0,
                purchased: false
            },
            {
                id: 'directx_strike',
                name: 'Injection DLL DirectX 6.0',
                desc: 'Remplacer directx.dll par une boucle infinie de clics injectée directement en mémoire vive.',
                cost: 480000000,
                power: 900000,
                percentCps: 0.015, // +1.5% CPS
                icon: 'chaosEngine',
                count: 0,
                purchased: false
            },
            {
                id: 'irq_conflict',
                name: 'Court-circuit manuel IRQ 12',
                desc: 'Forcer un conflit matériel entre la souris et la carte son Sound Blaster 16.',
                cost: 3800000000,
                power: 5500000,
                percentCps: 0.020, // +2.0% CPS
                icon: 'speaker',
                count: 0,
                purchased: false
            },
            {
                id: 'kernel32_override',
                name: 'Court-circuiter KERNEL32.DLL',
                desc: 'Chaque clic écrase directement l\'espace noyau de Bouzedows sans passer par l\'OS.',
                cost: 30000000000,
                power: 35000000,
                percentCps: 0.025, // +2.5% CPS
                icon: 'warningBadge',
                count: 0,
                purchased: false
            },
            {
                id: 'lan_spam',
                name: 'Tempête Broadcast Token Ring 16Mbps',
                desc: 'Envoyer un paquet broadcast Corrupt95 sur tout le sous-réseau Ethernet coaxial 10BASE2.',
                cost: 250000000000,
                power: 220000000,
                percentCps: 0.030, // +3.0% CPS
                icon: 'internetExplorer',
                count: 0,
                purchased: false
            },
            {
                id: 'ring0_click',
                name: 'Privilège Noyau Ring 0 Absolu',
                desc: 'Contourner toute protection matérielle du microprocesseur x86 pour un impact dévastateur.',
                cost: 2000000000000,
                power: 1500000000,
                percentCps: 0.040, // +4.0% CPS
                icon: 'errorBadge',
                count: 0,
                purchased: false
            },
            {
                id: 'defrag_shockwave',
                name: 'Onde de choc Défragmenteur Brutal',
                desc: 'Chaque pression déclenche une réorganisation violente des têtes de lecture sur les plateaux.',
                cost: 16000000000000,
                power: 10000000000,
                percentCps: 0.045, // +4.5% CPS
                icon: 'defrag',
                count: 0,
                purchased: false
            },
            {
                id: 'singularity_click',
                name: 'Clic Quantique à Singularité Bouzedows',
                desc: 'L\'ultime clic d\'agonie numérique : fusionne instantanément chaque clic avec l\'ensemble des virus.',
                cost: 120000000000000,
                power: 80000000000,
                percentCps: 0.050, // +5.0% CPS
                icon: 'chaosEngine',
                count: 0,
                purchased: false
            }
        ];

        // Achievements
        this.achievements = [
            { id: 'first_click', name: 'Premier Bug', desc: 'Cliquer une première fois sur le système.', unlocked: false },
            { id: 'dmg_25', name: 'Instabilité Système', desc: 'Atteindre 25% de dégâts système.', unlocked: false },
            { id: 'bonzi_unlocked', name: 'Mon Ami le Singe', desc: 'Adopter BonziBuddy.', unlocked: false },
            { id: 'dmg_50', name: 'GDI Cascade', desc: 'Atteindre 50% de dégâts système.', unlocked: false },
            { id: 'millionaire', name: 'Mégaoctet Corrompu', desc: 'Accumuler 1 000 000 d\'octets corrompus.', unlocked: false },
            { id: 'dmg_75', name: 'Écran Agonisant', desc: 'Atteindre 75% de dégâts système.', unlocked: false },
            { id: 'first_bsod', name: 'L\'Écran Bleu de la Mort', desc: 'Provoquer le crash fatal (BSOD 100%).', unlocked: false },
            { id: 'reboot_os', name: 'Format C: /U', desc: 'Réinstaller Bouzedows et obtenir un bonus permanent.', unlocked: false }
        ];

        this.loadSave();
        this.recalcTotals();
    }

    // Main Click Action
    click(targetEl = null, clientX = null, clientY = null) {
        window.retroAudio.ensureContext();
        window.retroAudio.playClick();

        const amount = this.getEffectiveClickPower();
        this.bytes += amount;
        this.totalBytes += amount;

        // Dynamic system damage calculation (infinite scaling)
        this.updateDamage();

        // Higher damage = bug sounds during clicks!
        if (this.systemDamage >= 40 && Math.random() < Math.min(0.5, this.systemDamage / 300)) {
            window.retroAudio.playRandomBugSound();
        }

        // Small floating number animation
        if (clientX !== null && clientY !== null) {
            this.spawnFloatText(`+${this.formatNumber(amount)}`, clientX, clientY);
        }

        // Check first click achievement
        this.unlockAchievement('first_click');

        // Chance to spawn funny parody popups when clicking
        if (window.popupManager) {
            window.popupManager.maybeSpawnOnAction(this.systemDamage);
        }

        return amount;
    }

    getEffectiveClickPower() {
        let p = this.clickPower;
        const pctCps = this.getClickPercentCps();
        if (pctCps > 0 && this.cps > 0) {
            p += Math.floor(this.cps * pctCps);
        }
        const prestigeBonus = 1 + (this.prestigeCount * 0.25);
        return Math.max(1, Math.floor(p * prestigeBonus));
    }

    getClickPercentCps() {
        if (!this.clickUpgrades) return 0;
        let total = 0;
        for (const u of this.clickUpgrades) {
            if (u.purchased && u.percentCps) {
                total += u.percentCps;
            }
        }
        return total;
    }

    getEffectiveCps() {
        let total = 0;
        for (const up of this.upgrades) {
            total += up.count * up.cps;
        }
        const prestigeBonus = 1 + (this.prestigeCount * 0.25);
        return Math.floor(total * prestigeBonus);
    }

    recalcTotals() {
        this.cps = this.getEffectiveCps();
        let basePower = 1;
        if (this.clickUpgrades) {
            for (const u of this.clickUpgrades) {
                if (u.purchased) {
                    basePower += (u.power || 0);
                }
            }
        }
        this.clickPower = basePower;
    }

    // Dynamic Reward Scaling with Player Level & Progression
    // Scales exponentially with CPS, Click Power, Total Corrupted Bytes, System Damage, and Prestige
    scaleReward(baseReward, options = {}) {
        const minReward = Math.max(1, Math.floor(baseReward || 1));
        const cps = this.cps || 0;
        const clickPower = this.getEffectiveClickPower();
        const damage = Math.max(0, this.systemDamage || 0);
        const prestige = this.prestigeCount || 0;
        const total = this.totalBytes || 0;

        // Relative weight of this reward compared to base mini-action (100 octets)
        const weight = Math.max(0.1, minReward / 100);

        // Production scaling:
        // A mini-reward gives ~1.5s of CPS + ~4 clicks
        // A popup / major event gives ~30s of CPS + ~80 clicks
        const secEquivalent = weight * 1.5;
        const clicksEquivalent = weight * 4;

        const cpsBonus = Math.floor(cps * secEquivalent);
        const clickBonus = Math.floor(clickPower * clicksEquivalent);
        const veteranBonus = Math.floor(Math.sqrt(total) * weight * 0.4);

        // Progression multiplier based on system damage and reboots
        const progressMultiplier = (1 + (damage / 100)) * (1 + (prestige * 0.35));

        const scaled = Math.floor((minReward + cpsBonus + clickBonus + veteranBonus) * progressMultiplier);
        return Math.max(minReward, scaled);
    }

    // Award bytes with automatic player-level scaling, damage update, and optional float text
    addReward(baseReward, reason = '', options = {}) {
        const finalAmount = this.scaleReward(baseReward, options);
        this.bytes += finalAmount;
        this.totalBytes += finalAmount;
        this.updateDamage();

        if (options.clientX !== undefined && options.clientY !== undefined) {
            const label = reason ? `+${this.formatNumber(finalAmount)} (${reason})` : `+${this.formatNumber(finalAmount)}`;
            this.spawnFloatText(label, options.clientX, options.clientY);
        } else if (options.targetEl) {
            const rect = options.targetEl.getBoundingClientRect();
            const label = reason ? `+${this.formatNumber(finalAmount)} (${reason})` : `+${this.formatNumber(finalAmount)}`;
            this.spawnFloatText(label, rect.left + rect.width / 2, rect.top);
        }

        return finalAmount;
    }

    updateDamage() {
        // Infinite scaling: No upper limit! Damage can exceed 100%, 500%, 25000%!
        const logBase = Math.log10(Math.max(1, this.totalBytes));
        let calculated = (logBase / 3.8) * 45;

        // Upgrades boost damage continuously
        const totalItems = this.upgrades.reduce((sum, u) => sum + u.count, 0);
        calculated += (totalItems * 2.2);

        // Click upgrades also boost damage
        const activeClickUps = this.clickUpgrades.filter(u => u.purchased).length;
        calculated += (activeClickUps * 10);

        this.systemDamage = parseFloat(Math.max(0, calculated).toFixed(1));

        // CPU Temperature rises infinitely with damage & CPS
        this.cpuTemp = Math.floor(36 + (this.systemDamage * 0.85) + (Math.log10(Math.max(1, this.cps)) * 5));

        // Check damage milestones
        if (this.systemDamage >= 25) this.unlockAchievement('dmg_25');
        if (this.systemDamage >= 50) this.unlockAchievement('dmg_50');
        if (this.systemDamage >= 75) this.unlockAchievement('dmg_75');
        if (this.systemDamage >= 100) this.unlockAchievement('first_bsod');
        if (this.totalBytes >= 1000000) this.unlockAchievement('millionaire');
    }

    triggerBsod() {
        this.unlockAchievement('first_bsod');
        if (window.retroAudio) {
            window.retroAudio.playBsod();
        }
        if (window.glitchController) {
            window.glitchController.showBsod();
        }
    }

    // Passive Loop Tick
    tick(deltaTimeSec) {
        this.cps = this.getEffectiveCps();
        if (this.cps > 0) {
            const added = this.cps * deltaTimeSec;
            this.bytes += added;
            this.totalBytes += added;
            this.updateDamage();

            // Intermittent HDD crunch sound when generating lots of corruption
            const now = Date.now();
            if (now - this.lastHddSound > 1400 && Math.random() < 0.35) {
                this.lastHddSound = now;
                if (window.retroAudio && !window.retroAudio.isMuted) {
                    window.retroAudio.playHddCrunch();
                }
            }
        }

        // Automatic popup ads manager check
        if (window.popupManager) {
            window.popupManager.checkAutoSpawn(this.systemDamage);
        }
    }

    // Calculate total cost and affordable count for multiple upgrade purchases (1, 5, 10, 'max')
    getUpgradeCostFor(upgradeId, amount = 1) {
        const up = this.upgrades.find(u => u.id === upgradeId);
        if (!up) return { totalCost: 0, count: 0, canAfford: false };

        if (amount === 'max') {
            let totalCost = 0;
            let count = 0;
            let currentCount = up.count;
            let nextCost = Math.floor(up.baseCost * Math.pow(1.15, currentCount));

            while (this.bytes >= totalCost + nextCost) {
                totalCost += nextCost;
                count++;
                currentCount++;
                nextCost = Math.floor(up.baseCost * Math.pow(1.15, currentCount));
                if (count >= 10000) break;
            }

            if (count === 0) {
                return {
                    totalCost: Math.floor(up.baseCost * Math.pow(1.15, up.count)),
                    count: 1,
                    canAfford: false
                };
            }

            return {
                totalCost,
                count,
                canAfford: true
            };
        }

        const num = Math.max(1, parseInt(amount, 10) || 1);
        let totalCost = 0;
        for (let i = 0; i < num; i++) {
            totalCost += Math.floor(up.baseCost * Math.pow(1.15, up.count + i));
        }

        return {
            totalCost,
            count: num,
            canAfford: this.bytes >= totalCost
        };
    }

    // Buy an upgrade (supports amount: 1, 5, 10, 'max')
    buyUpgrade(upgradeId, amount = 1) {
        const up = this.upgrades.find(u => u.id === upgradeId);
        if (!up) return false;

        const info = this.getUpgradeCostFor(upgradeId, amount);
        if (!info.canAfford) {
            window.retroAudio.playError();
            return false;
        }

        this.bytes -= info.totalCost;
        up.count += info.count;
        // Classic 1.15x cost scaling for next single level
        up.cost = Math.floor(up.baseCost * Math.pow(1.15, up.count));
        this.recalcTotals();

        window.retroAudio.ensureContext();
        window.retroAudio.playDing();

        if (up.id === 'bonzi') this.unlockAchievement('bonzi_unlocked');

        this.updateDamage();

        if (window.virusEffects) {
            window.virusEffects.onUpgradePurchased(up.id, up.count);
        }
        return true;
    }

    // Buy a click upgrade
    buyClickUpgrade(id) {
        const up = this.clickUpgrades.find(u => u.id === id);
        if (!up || up.purchased) return false;

        if (this.bytes >= up.cost) {
            this.bytes -= up.cost;
            up.purchased = true;
            this.recalcTotals();
            this.updateDamage();
            this.save();

            window.retroAudio.ensureContext();
            window.retroAudio.playAsterisk();
            return true;
        } else {
            window.retroAudio.playError();
            return false;
        }
    }

    // Prestige / Reboot / Format C:
    canReboot() {
        return this.systemDamage >= 95 || this.bsodTriggered;
    }

    rebootSystem() {
        if (!this.canReboot()) return false;

        this.prestigeCount++;
        const bonusChips = Math.max(1, Math.floor(Math.sqrt(this.totalBytes / 100000)));
        this.rebootPoints += bonusChips;

        this.unlockAchievement('reboot_os');

        // Reset system state
        this.bytes = 0;
        this.totalBytes = 0;
        this.clickPower = 1;
        this.systemDamage = 0;
        this.bsodTriggered = false;

        // Reset upgrades
        this.upgrades.forEach(u => {
            u.count = 0;
            u.cost = u.baseCost;
        });

        // Reset click upgrades
        this.clickUpgrades.forEach(u => {
            u.purchased = false;
        });

        this.recalcTotals();
        this.save();

        if (window.glitchController) {
            window.glitchController.hideBsod();
        }

        if (window.virusEffects) {
            window.virusEffects.resetAll();
        }

        // Return to Bouzedows XP login screen on format
        if (window.xpLoginScreen) {
            window.xpLoginScreen.lock();
        } else if (window.retroAudio) {
            window.retroAudio.playStartup();
        }

        return true;
    }

    unlockAchievement(id) {
        const ach = this.achievements.find(a => a.id === id);
        if (ach && !ach.unlocked) {
            ach.unlocked = true;
            if (window.retroAudio) {
                window.retroAudio.playAsterisk();
            }
            this.showNotification(`🏆 Succès débloqué : ${ach.name}`, ach.desc);
        }
    }

    showNotification(title, text) {
        const container = document.getElementById('retro-notifications');
        if (!container) return;

        const notif = document.createElement('div');
        notif.className = 'retro-dialog notif-box';
        notif.innerHTML = `
            <div class="dialog-title-bar">
                <span class="dialog-title-text">${title}</span>
                <button class="win-btn-close">×</button>
            </div>
            <div class="dialog-body">
                <div class="dialog-icon">${RetroIcons.infoBadge}</div>
                <div class="dialog-message">${text}</div>
            </div>
        `;

        notif.querySelector('.win-btn-close').onclick = () => notif.remove();
        container.appendChild(notif);

        setTimeout(() => {
            if (notif.parentNode) notif.remove();
        }, 5000);
    }

    spawnFloatText(text, x, y) {
        const el = document.createElement('div');
        el.className = 'float-click-text';
        el.textContent = text;
        el.style.left = `${x}px`;
        el.style.top = `${y}px`;
        document.body.appendChild(el);

        setTimeout(() => {
            if (el.parentNode) el.remove();
        }, 1200);
    }

    formatNumber(num) {
        if (num === null || num === undefined || isNaN(num)) return '0';
        if (num < 1000) return Math.floor(num).toLocaleString('fr-FR');
        const suffixes = ['', 'Ko', 'Mo', 'Go', 'To', 'Po', 'Eo'];
        const i = Math.floor(Math.log(num) / Math.log(1024));
        const formatted = (num / Math.pow(1024, i)).toFixed(1);
        return `${formatted} ${suffixes[i] || 'Octets'}`;
    }

    formatBytesPerSec() {
        return this.formatNumber(this.cps) + '/s';
    }

    save() {
        const data = {
            bytes: this.bytes,
            totalBytes: this.totalBytes,
            clickPower: this.clickPower,
            prestigeCount: this.prestigeCount,
            rebootPoints: this.rebootPoints,
            upgrades: this.upgrades.map(u => ({ id: u.id, count: u.count, cost: u.cost })),
            clickUpgrades: this.clickUpgrades.map(u => ({ id: u.id, purchased: u.purchased })),
            achievements: this.achievements.map(a => ({ id: a.id, unlocked: a.unlocked }))
        };
        try {
            localStorage.setItem('win95_destroy_save_v1', JSON.stringify(data));
        } catch (e) {
            console.warn("Could not save to localStorage", e);
        }
    }

    loadSave() {
        try {
            const raw = localStorage.getItem('win95_destroy_save_v1');
            if (!raw) return;
            const data = JSON.parse(raw);
            if (data.bytes !== undefined) this.bytes = data.bytes;
            if (data.totalBytes !== undefined) this.totalBytes = data.totalBytes;
            if (data.clickPower !== undefined) this.clickPower = data.clickPower;
            if (data.prestigeCount !== undefined) this.prestigeCount = data.prestigeCount;
            if (data.rebootPoints !== undefined) this.rebootPoints = data.rebootPoints;

            if (data.upgrades) {
                data.upgrades.forEach(saved => {
                    const u = this.upgrades.find(x => x.id === saved.id);
                    if (u) {
                        u.count = saved.count;
                        u.cost = saved.cost;
                    }
                });
            }

            if (data.clickUpgrades) {
                data.clickUpgrades.forEach(saved => {
                    const u = this.clickUpgrades.find(x => x.id === saved.id);
                    if (u) {
                        u.purchased = saved.purchased;
                    }
                });
            }

            if (data.achievements) {
                data.achievements.forEach(saved => {
                    const a = this.achievements.find(x => x.id === saved.id);
                    if (a) a.unlocked = saved.unlocked;
                });
            }

            this.recalcTotals();

            if (window.virusEffects) {
                window.virusEffects.syncAll(this.upgrades);
            }
        } catch (e) {
            console.warn("Error loading save", e);
        }
    }

    hardReset() {
        localStorage.removeItem('win95_destroy_save_v1');
        window.location.reload();
    }
}

// Global engine instance
window.gameEngine = new ClickerEngine();
