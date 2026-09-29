/**
 * Windows 95 / 98 Disk Defragmenter (Défragmenteur de disque)
 * Watch clusters organize... while computer viruses infect and corrupt the sectors!
 */

class DefragApp {
    constructor() {
        this.winId = 'app-defrag';
        this.rows = 14;
        this.cols = 28;
        this.blocks = [];
        this.interval = null;
        this.running = false;
        this.progress = 0;
        this.activeHead = 0;
    }

    open() {
        const content = `
            <div class="defrag-app">
                <div class="defrag-top-info">
                    <span>Défragmentation du lecteur C:</span>
                    <span id="defrag-pct">12% effectué</span>
                </div>
                <div class="defrag-progress-outer">
                    <div class="defrag-progress-inner" id="defrag-bar"></div>
                </div>
                <div class="defrag-cluster-grid" id="defrag-grid"></div>
                <div class="defrag-legend">
                    <div class="legend-item"><span class="legend-box col-alloc"></span> Utilisé</div>
                    <div class="legend-item"><span class="legend-box col-free"></span> Libre</div>
                    <div class="legend-item"><span class="legend-box col-read"></span> Lecture</div>
                    <div class="legend-item"><span class="legend-box col-write"></span> Écriture</div>
                    <div class="legend-item"><span class="legend-box col-bad"></span> Corrompu (Virus)</div>
                </div>
                <div class="defrag-controls">
                    <button class="win-btn" id="defrag-toggle-btn">Démarrer</button>
                    <button class="win-btn" id="defrag-infect-btn">Infecter un cluster (+Bits)</button>
                    <button class="win-btn" id="defrag-reset-btn">Réinitialiser</button>
                </div>
            </div>
        `;

        window.windowManager.createWindow({
            id: this.winId,
            title: 'Défragmenteur de disque - Lecteur C: (FAT32)',
            icon: 'defrag',
            width: 450,
            height: 380,
            content,
            resizable: false,
            onClose: () => this.cleanup()
        });

        this.initGrid();
    }

    cleanup() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
        this.running = false;
    }

    initGrid() {
        this.cleanup();
        this.blocks = [];
        this.progress = 8;
        this.activeHead = 0;

        const total = this.rows * this.cols;
        for (let i = 0; i < total; i++) {
            // Initial distribution
            const r = Math.random();
            let type = 'alloc';
            if (r < 0.28) type = 'free';
            else if (r < 0.33) type = 'bad';
            this.blocks.push(type);
        }

        this.renderGrid();
        this.updateProgressUi();

        const toggleBtn = document.getElementById('defrag-toggle-btn');
        const infectBtn = document.getElementById('defrag-infect-btn');
        const resetBtn = document.getElementById('defrag-reset-btn');

        if (toggleBtn) {
            toggleBtn.onclick = () => {
                window.retroAudio.playClick();
                this.toggle();
            };
        }
        if (infectBtn) {
            infectBtn.onclick = () => {
                this.infectClusterManual();
            };
        }
        if (resetBtn) {
            resetBtn.onclick = () => {
                window.retroAudio.playClick();
                this.initGrid();
            };
        }
    }

    renderGrid() {
        const grid = document.getElementById('defrag-grid');
        if (!grid) return;
        grid.innerHTML = '';

        this.blocks.forEach((type, idx) => {
            const block = document.createElement('div');
            block.className = `cluster-block ${type}`;
            block.id = `clust-${idx}`;
            block.onclick = () => {
                // Clicking directly infects / corrupts cluster!
                this.infectBlock(idx);
            };
            grid.appendChild(block);
        });
    }

    toggle() {
        this.running = !this.running;
        const btn = document.getElementById('defrag-toggle-btn');
        if (btn) btn.textContent = this.running ? 'Pause' : 'Reprendre';

        if (this.running) {
            this.interval = setInterval(() => this.step(), 80);
        } else {
            clearInterval(this.interval);
            this.interval = null;
        }
    }

    step() {
        if (!this.running) return;

        // Move head across clusters
        const prevIdx = this.activeHead;
        this.activeHead = (this.activeHead + 1) % this.blocks.length;

        // Restore previous block visual
        const prevEl = document.getElementById(`clust-${prevIdx}`);
        if (prevEl) {
            prevEl.className = `cluster-block ${this.blocks[prevIdx]}`;
        }

        // Defragment logic
        const curEl = document.getElementById(`clust-${this.activeHead}`);
        if (curEl) {
            if (this.blocks[this.activeHead] === 'free') {
                curEl.className = 'cluster-block write';
                // Pull allocated block forward
                this.blocks[this.activeHead] = 'alloc';
                this.progress = Math.min(99, this.progress + 0.15);
            } else if (this.blocks[this.activeHead] === 'alloc') {
                curEl.className = 'cluster-block read';
            }
        }

        // Virus infection spread from clicker engine
        if (window.gameEngine && window.gameEngine.systemDamage >= 20) {
            if (Math.random() < (window.gameEngine.systemDamage / 400)) {
                const randomIdx = Math.floor(Math.random() * this.blocks.length);
                this.blocks[randomIdx] = 'bad';
                const el = document.getElementById(`clust-${randomIdx}`);
                if (el) el.className = 'cluster-block bad';
            }
        }

        this.updateProgressUi();

        // Occasional HDD seek crunch
        if (Math.random() < 0.12 && window.retroAudio) {
            window.retroAudio.playHddCrunch();
        }
    }

    infectBlock(idx) {
        if (this.blocks[idx] === 'bad') return;

        this.blocks[idx] = 'bad';
        const el = document.getElementById(`clust-${idx}`);
        if (el) el.className = 'cluster-block bad';

        window.retroAudio.playError();

        // Clicker reward
        if (window.gameEngine) {
            const reward = 150;
            window.gameEngine.bytes += reward;
            window.gameEngine.totalBytes += reward;
            window.gameEngine.updateDamage();
            window.gameEngine.spawnFloatText(`+${reward} Octets (Secteur défectueux)`, window.innerWidth / 2, window.innerHeight / 2);
        }
    }

    infectClusterManual() {
        const freeOrAlloc = [];
        this.blocks.forEach((type, idx) => {
            if (type !== 'bad') freeOrAlloc.push(idx);
        });

        if (freeOrAlloc.length > 0) {
            const pick = freeOrAlloc[Math.floor(Math.random() * freeOrAlloc.length)];
            this.infectBlock(pick);
        }
    }

    updateProgressUi() {
        const pctEl = document.getElementById('defrag-pct');
        const barEl = document.getElementById('defrag-bar');
        const pctStr = `${Math.floor(this.progress)}% effectué`;
        if (pctEl) pctEl.textContent = pctStr;
        if (barEl) barEl.style.width = `${this.progress}%`;
    }
}

// Global instance
window.defragApp = new DefragApp();
