/**
 * Bouzedows Destruction Simulator - Main Clicker & Virus Workshop Window
 */

class ChaosApp {
    constructor() {
        this.winId = 'app-chaos-engine';
        this.currentTab = 'viruses'; // 'viruses' | 'clickers' | 'stats'
        this.buyMultiplier = '1'; // '1' | '5' | '10' | 'max'
    }

    open() {
        const content = `
            <div class="chaos-app">
                <div class="chaos-top-status">
                    <div class="chaos-metric-box">
                        <span class="chaos-metric-lbl">OCTETS CORROMPUS</span>
                        <span class="chaos-metric-val" id="chaos-bytes-val">0 Octets</span>
                    </div>
                    <div class="chaos-metric-box">
                        <span class="chaos-metric-lbl">VITESSE DE PANNE (CPS)</span>
                        <span class="chaos-metric-val" id="chaos-cps-val">0 Octets/s</span>
                    </div>
                    <div class="chaos-metric-box">
                        <span class="chaos-metric-lbl">PUISSANCE DE CLIC</span>
                        <span class="chaos-metric-val" id="chaos-click-val">1 Octet/clic</span>
                    </div>
                </div>

                <div class="chaos-damage-bar-section">
                    <div class="damage-label-row">
                        <span>💥 INTÉGRITÉ : <strong id="chaos-integrity-pct">100%</strong></span>
                        <span>DÉGÂTS : <strong id="chaos-damage-val" style="color: #aa0000;">0%</strong></span>
                        <span>CPU : <strong id="chaos-temp-val">36°C</strong></span>
                    </div>
                    <div class="damage-bar-track">
                        <div class="damage-bar-fill" id="chaos-damage-fill" style="width: 0%;"></div>
                    </div>
                    <div class="damage-status-alert" id="chaos-status-alert">Statut : Système stable (Bouzedows OSR2)</div>
                </div>

                <div class="chaos-click-zone">
                    <button class="chaos-big-target-btn" id="chaos-main-click-btn">
                        <div class="target-icon">${RetroIcons.chaosEngine}</div>
                        <div class="target-text">
                            <span class="target-title">DÉTRUIRE Bouzedows</span>
                            <span class="target-sub">[ CLIQUEZ POUR CORROMPRE LE SYSTÈME ]</span>
                        </div>
                    </button>
                </div>

                <div class="chaos-tabs-bar">
                    <button class="win-btn tab-btn active" data-tab="viruses">🦠 Virus & Failles (${window.gameEngine.upgrades.length})</button>
                    <button class="win-btn tab-btn" data-tab="clickers">🖱️ Améliorations de Clic</button>
                    <button class="win-btn tab-btn" data-tab="prestige">⚡ Réinstallation / Format C:</button>
                </div>

                <div class="chaos-tab-content" id="chaos-tab-container">
                    <!-- Dynamic shop injected here -->
                </div>
            </div>
        `;

        window.windowManager.createWindow({
            id: this.winId,
            title: 'Générateur de Chaos - Destructeur de Bouzedows',
            icon: 'chaosEngine',
            width: 530,
            height: 520,
            x: 200,
            y: 40,
            content,
            resizable: true
        });

        this.initEvents();
        this.renderTab(this.currentTab);
    }

    initEvents() {
        const clickBtn = document.getElementById('chaos-main-click-btn');
        if (clickBtn) {
            clickBtn.onclick = (e) => {
                const rect = clickBtn.getBoundingClientRect();
                const clickX = e.clientX || (rect.left + rect.width / 2);
                const clickY = e.clientY || (rect.top + rect.height / 2);
                window.gameEngine.click(clickBtn, clickX, clickY);

                // Button press wobble animation
                clickBtn.classList.remove('pressed-pulse');
                void clickBtn.offsetWidth;
                clickBtn.classList.add('pressed-pulse');

                // Visual screen shake on higher damage
                if (window.gameEngine.systemDamage >= 45 && Math.random() < 0.25) {
                    if (window.glitchController) window.glitchController.triggerScreenShake();
                }

                this.updateUi();
            };
        }

        const tabs = document.querySelectorAll('.chaos-tabs-bar .tab-btn');
        tabs.forEach(t => {
            t.onclick = () => {
                tabs.forEach(x => x.classList.remove('active'));
                t.classList.add('active');
                this.currentTab = t.dataset.tab;
                window.retroAudio.playClick();
                this.renderTab(this.currentTab);
            };
        });
    }

    renderTab(tabName) {
        const container = document.getElementById('chaos-tab-container');
        if (!container) return;

        if (tabName === 'viruses') {
            container.innerHTML = `
                <div class="shop-multiplier-bar">
                    <span class="mult-bar-title">QUANTITÉ D'ACHAT :</span>
                    <div class="mult-btn-group">
                        <button class="win-btn mult-btn ${this.buyMultiplier === '1' ? 'active' : ''}" data-mult="1">x1</button>
                        <button class="win-btn mult-btn ${this.buyMultiplier === '5' ? 'active' : ''}" data-mult="5">x5</button>
                        <button class="win-btn mult-btn ${this.buyMultiplier === '10' ? 'active' : ''}" data-mult="10">x10</button>
                        <button class="win-btn mult-btn ${this.buyMultiplier === 'max' ? 'active' : ''}" data-mult="max">MAX</button>
                    </div>
                </div>
                <div class="shop-list">
                    ${window.gameEngine.upgrades.map(u => {
                const costInfo = window.gameEngine.getUpgradeCostFor(u.id, this.buyMultiplier);
                const iconSvg = RetroIcons[u.icon] || RetroIcons.chaosEngine;
                const labelText = this.buyMultiplier === 'max'
                    ? (costInfo.canAfford ? `Acheter x${costInfo.count}` : 'Acheter x1 (Max 0)')
                    : (this.buyMultiplier === '1' ? 'Acheter' : `Acheter x${this.buyMultiplier}`);

                return `
                            <div class="shop-item ${costInfo.canAfford ? 'affordable' : 'locked'}">
                                <div class="shop-item-icon">${iconSvg}</div>
                                <div class="shop-item-details">
                                    <div class="shop-item-header">
                                        <span class="shop-item-name">${u.name}</span>
                                        <span class="shop-item-count">Niv. ${u.count}</span>
                                    </div>
                                    <div class="shop-item-desc">${u.desc}</div>
                                    <div class="shop-item-sub">Production : +${window.gameEngine.formatNumber(u.cps * (costInfo.count || 1))}/s ${costInfo.count > 1 ? `(+${costInfo.count} niv.)` : ''}</div>
                                </div>
                                <div class="shop-item-action">
                                    <button class="win-btn shop-buy-btn" data-upgrade-id="${u.id}" ${costInfo.canAfford ? '' : 'disabled'}>
                                        ${labelText}<br><strong>${window.gameEngine.formatNumber(costInfo.totalCost)}</strong>
                                    </button>
                                    <div class="shop-quick-btns">
                                        <button class="win-btn quick-buy-btn" data-upgrade-id="${u.id}" data-mult="1" title="Acheter 1 niveau">+1</button>
                                        <button class="win-btn quick-buy-btn" data-upgrade-id="${u.id}" data-mult="5" title="Acheter 5 niveaux">+5</button>
                                        <button class="win-btn quick-buy-btn" data-upgrade-id="${u.id}" data-mult="10" title="Acheter 10 niveaux">+10</button>
                                        <button class="win-btn quick-buy-btn" data-upgrade-id="${u.id}" data-mult="max" title="Acheter le maximum possible">MAX</button>
                                    </div>
                                </div>
                            </div>
                        `;
            }).join('')}
                </div>
            `;

            // Bind multiplier selector buttons
            container.querySelectorAll('.mult-btn').forEach(mb => {
                mb.onclick = () => {
                    this.buyMultiplier = mb.dataset.mult;
                    window.retroAudio.playClick();
                    this.renderTab('viruses');
                };
            });

            // Bind upgrade main buy buttons
            container.querySelectorAll('.shop-buy-btn').forEach(b => {
                b.onclick = () => {
                    const upId = b.dataset.upgradeId;
                    if (window.gameEngine.buyUpgrade(upId, this.buyMultiplier)) {
                        this.renderTab('viruses');
                        this.updateUi();
                    }
                };
            });

            // Bind quick buy buttons (+1, +5, +10, MAX)
            container.querySelectorAll('.quick-buy-btn').forEach(qb => {
                qb.onclick = (e) => {
                    e.stopPropagation();
                    const upId = qb.dataset.upgradeId;
                    const mult = qb.dataset.mult;
                    if (window.gameEngine.buyUpgrade(upId, mult)) {
                        this.renderTab('viruses');
                        this.updateUi();
                    }
                };
            });

        } else if (tabName === 'clickers') {
            container.innerHTML = `
                <div class="shop-list">
                    ${window.gameEngine.clickUpgrades.map(u => {
                const canAfford = window.gameEngine.bytes >= u.cost;
                return `
                            <div class="shop-item ${u.purchased ? 'purchased' : (canAfford ? 'affordable' : 'locked')}">
                                <div class="shop-item-icon">${RetroIcons.computer}</div>
                                <div class="shop-item-details">
                                    <div class="shop-item-header">
                                        <span class="shop-item-name">${u.name}</span>
                                        <span class="shop-item-count">${u.purchased ? '✓ ACQUIS' : 'DISPONIBLE'}</span>
                                    </div>
                                    <div class="shop-item-desc">${u.desc}</div>
                                    <div class="shop-item-sub">Bonus de clic : +${window.gameEngine.formatNumber(u.power)} octet(s)</div>
                                </div>
                                <div class="shop-item-action">
                                    <button class="win-btn shop-click-btn" data-click-id="${u.id}" ${u.purchased ? 'disabled' : (canAfford ? '' : 'disabled')}>
                                        ${u.purchased ? 'Acquis' : `Acheter<br><strong>${window.gameEngine.formatNumber(u.cost)}</strong>`}
                                    </button>
                                </div>
                            </div>
                        `;
            }).join('')}
                </div>
            `;

            container.querySelectorAll('.shop-click-btn').forEach(b => {
                b.onclick = () => {
                    const id = b.dataset.clickId;
                    if (window.gameEngine.buyClickUpgrade(id)) {
                        this.renderTab('clickers');
                        this.updateUi();
                    }
                };
            });

        } else if (tabName === 'prestige') {
            const canReboot = window.gameEngine.canReboot();
            const bonusChips = Math.max(1, Math.floor(Math.sqrt((window.gameEngine.totalBytes || 1) / 100000)));

            container.innerHTML = `
                <div class="prestige-panel">
                    <h3>⚡ FORMAT C: /U & RÉINSTALLATION BOUZEDOWS</h3>
                    <p>Lorsque le système atteint une corruption critique (95%+ ou Écran Bleu BSOD), vous pouvez formater l'intégralité du disque pour réinstaller une version plus résistante et destructrice de Bouzedows.</p>
                    
                    <div class="prestige-stats-box">
                        <div>Réinstallations effectuées : <strong>${window.gameEngine.prestigeCount} fois</strong></div>
                        <div>Multiplicateur permanent de destruction : <strong>+${(window.gameEngine.prestigeCount * 25)}%</strong></div>
                        <div>Processeurs Surchauffés en stock : <strong>${window.gameEngine.rebootPoints}</strong></div>
                    </div>

                    <div class="prestige-action-box">
                        <div class="prestige-gain-label">
                            Récompense estimée du prochain formatage : 
                            <strong>+${bonusChips} Processeur(s) Surchauffé(s)</strong> (+${bonusChips * 25}% DPS permanent)
                        </div>
                        <button class="win-btn prestige-big-btn" id="btn-do-prestige" ${canReboot ? '' : 'disabled'}>
                            💾 Formater le disque dur et Réinstaller Bouzedows
                        </button>
                        <div class="prestige-req-hint">
                            ${canReboot ? '✅ Défaillance critique atteinte ! Formatage disponible.' : '⚠️ Nécessite au moins 95% de dégâts système ou un écran bleu BSOD.'}
                        </div>
                    </div>
                </div>
            `;

            const prestBtn = container.querySelector('#btn-do-prestige');
            if (prestBtn) {
                prestBtn.onclick = () => {
                    if (confirm("ATTENTION : Cela va réinitialiser vos octets et virus, mais vous octroiera un multiplicateur de destruction PERMANENT. Continuer ?")) {
                        window.gameEngine.rebootSystem();
                        this.renderTab('prestige');
                        this.updateUi();
                    }
                };
            }
        }
    }

    updateUi() {
        const bytesEl = document.getElementById('chaos-bytes-val');
        const cpsEl = document.getElementById('chaos-cps-val');
        const clickEl = document.getElementById('chaos-click-val');
        const integrityEl = document.getElementById('chaos-integrity-pct');
        const damageFill = document.getElementById('chaos-damage-fill');
        const tempEl = document.getElementById('chaos-temp-val');
        const alertEl = document.getElementById('chaos-status-alert');

        if (bytesEl) bytesEl.textContent = window.gameEngine.formatNumber(window.gameEngine.bytes);
        if (cpsEl) cpsEl.textContent = `+${window.gameEngine.formatBytesPerSec()}`;
        if (clickEl) clickEl.textContent = `+${window.gameEngine.formatNumber(window.gameEngine.getEffectiveClickPower())} /clic`;

        const integrity = (100 - window.gameEngine.systemDamage).toFixed(1);
        if (integrityEl) {
            if (window.gameEngine.systemDamage > 100) {
                integrityEl.textContent = `${integrity}% [DÉPASSEMENT CRITIQUE]`;
                integrityEl.style.color = '#cc0000';
            } else {
                integrityEl.textContent = `${integrity}%`;
                integrityEl.style.color = 'inherit';
            }
        }

        const dmgValEl = document.getElementById('chaos-damage-val');
        if (dmgValEl) {
            dmgValEl.textContent = `${window.gameEngine.systemDamage}%`;
        }

        if (damageFill) {
            damageFill.style.width = `${Math.min(100, window.gameEngine.systemDamage)}%`;
            if (window.gameEngine.systemDamage < 30) {
                damageFill.style.backgroundColor = '#00aa00';
            } else if (window.gameEngine.systemDamage < 65) {
                damageFill.style.backgroundColor = '#ffaa00';
            } else if (window.gameEngine.systemDamage <= 100) {
                damageFill.style.backgroundColor = '#ff0000';
            } else {
                damageFill.style.backgroundColor = '#8800cc'; // Ultra-corruption purple
            }
        }

        if (tempEl) {
            tempEl.textContent = `${window.gameEngine.cpuTemp}°C`;
            tempEl.style.color = window.gameEngine.cpuTemp > 90 ? '#ff0000' : 'inherit';
        }

        if (alertEl) {
            const d = window.gameEngine.systemDamage;
            if (d < 20) {
                alertEl.textContent = 'Statut : Système nominal (Bouzedows OSR2)';
            } else if (d < 50) {
                alertEl.textContent = 'Alerte : Instabilité registre détectée. Fuites GDI.';
            } else if (d < 100) {
                alertEl.textContent = 'DANGER : Pilotes corrompus. Surchauffe de la mémoire swap !';
            } else if (d < 250) {
                alertEl.textContent = '💥 KERNEL ANÉANTI : La carte mère fume, pop-ups incontrôlables !';
            } else if (d < 800) {
                alertEl.textContent = '☢️ FUSION THERMONUCLÉAIRE : Le boîtier en plastique coule sur la moquette !';
            } else if (d < 2500) {
                alertEl.textContent = '⚡ DISTORSION SPATIO-TEMPORELLE : Bouzedows refuse de mourir !';
            } else {
                alertEl.textContent = '🌌 TROU NOIR NUMÉRIQUE : Le processeur a atteint la vitesse supraluminique.';
            }
        }

        // Update button states in current tab without full re-render
        if (this.currentTab === 'viruses') {
            const btns = document.querySelectorAll('.shop-buy-btn');
            btns.forEach(b => {
                const u = window.gameEngine.upgrades.find(x => x.id === b.dataset.upgradeId);
                if (u) {
                    const costInfo = window.gameEngine.getUpgradeCostFor(u.id, this.buyMultiplier);
                    b.disabled = !costInfo.canAfford;

                    const labelText = this.buyMultiplier === 'max'
                        ? (costInfo.canAfford ? `Acheter x${costInfo.count}` : 'Acheter x1 (Max 0)')
                        : (this.buyMultiplier === '1' ? 'Acheter' : `Acheter x${this.buyMultiplier}`);

                    b.innerHTML = `${labelText}<br><strong>${window.gameEngine.formatNumber(costInfo.totalCost)}</strong>`;

                    const item = b.closest('.shop-item');
                    if (item) {
                        if (costInfo.canAfford) {
                            item.classList.add('affordable');
                            item.classList.remove('locked');
                        } else {
                            item.classList.remove('affordable');
                            item.classList.add('locked');
                        }
                    }
                }
            });

            const quickBtns = document.querySelectorAll('.quick-buy-btn');
            quickBtns.forEach(qb => {
                const upId = qb.dataset.upgradeId;
                const mult = qb.dataset.mult;
                const costInfo = window.gameEngine.getUpgradeCostFor(upId, mult);
                qb.disabled = !costInfo.canAfford;
            });
        }
    }
}

// Global instance
window.chaosApp = new ChaosApp();
