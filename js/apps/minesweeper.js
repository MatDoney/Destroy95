/**
 * Authentic Windows 95 Minesweeper (Démineur)
 * Fully playable 9x9 grid with 10 mines, timer, smiley face, and retro sounds.
 */

class MinesweeperApp {
    constructor() {
        this.rows = 9;
        this.cols = 9;
        this.totalMines = 10;
        this.grid = [];
        this.revealed = [];
        this.flagged = [];
        this.gameOver = false;
        this.gameWon = false;
        this.timer = 0;
        this.timerInterval = null;
        this.started = false;
        this.minesLeft = 10;
        this.container = null;
        this.winId = 'app-minesweeper';
    }

    open() {
        const content = `
            <div class="minesweeper-app">
                <div class="minesweeper-header-menu">
                    <span>Partie</span>
                    <span>Options</span>
                    <span>Aide</span>
                </div>
                <div class="minesweeper-frame">
                    <div class="minesweeper-panel">
                        <div class="led-display" id="ms-mines-count">010</div>
                        <button class="ms-face-btn" id="ms-face">🙂</button>
                        <div class="led-display" id="ms-timer">000</div>
                    </div>
                    <div class="minesweeper-board" id="ms-board"></div>
                </div>
            </div>
        `;

        window.windowManager.createWindow({
            id: this.winId,
            title: 'Démineur',
            icon: 'minesweeper',
            width: 250,
            height: 330,
            content,
            resizable: false,
            onClose: () => this.cleanup()
        });

        this.initGame();
    }

    cleanup() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    initGame() {
        this.cleanup();
        this.gameOver = false;
        this.gameWon = false;
        this.started = false;
        this.timer = 0;
        this.minesLeft = this.totalMines;

        const face = document.getElementById('ms-face');
        if (face) face.textContent = '🙂';

        this.updateLed('ms-mines-count', this.minesLeft);
        this.updateLed('ms-timer', 0);

        this.grid = Array(this.rows).fill(null).map(() => Array(this.cols).fill(0));
        this.revealed = Array(this.rows).fill(null).map(() => Array(this.cols).fill(false));
        this.flagged = Array(this.rows).fill(null).map(() => Array(this.cols).fill(false));

        this.renderBoard();

        if (face) {
            face.onclick = () => {
                window.retroAudio.playClick();
                this.initGame();
            };
        }
    }

    placeMines(firstRow, firstCol) {
        let placed = 0;
        while (placed < this.totalMines) {
            const r = Math.floor(Math.random() * this.rows);
            const c = Math.floor(Math.random() * this.cols);

            // Avoid first clicked tile and its neighbors
            if (Math.abs(r - firstRow) <= 1 && Math.abs(c - firstCol) <= 1) continue;

            if (this.grid[r][c] !== -1) {
                this.grid[r][c] = -1; // -1 represents a mine
                placed++;
            }
        }

        // Calculate neighbor numbers
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                if (this.grid[r][c] === -1) continue;
                let count = 0;
                for (let dr = -1; dr <= 1; dr++) {
                    for (let dc = -1; dc <= 1; dc++) {
                        const nr = r + dr;
                        const nc = c + dc;
                        if (nr >= 0 && nr < this.rows && nc >= 0 && nc < this.cols) {
                            if (this.grid[nr][nc] === -1) count++;
                        }
                    }
                }
                this.grid[r][c] = count;
            }
        }
    }

    renderBoard() {
        const board = document.getElementById('ms-board');
        if (!board) return;
        board.innerHTML = '';

        for (let r = 0; r < this.rows; r++) {
            const rowEl = document.createElement('div');
            rowEl.className = 'ms-row';
            for (let c = 0; c < this.cols; c++) {
                const cell = document.createElement('button');
                cell.className = 'ms-cell';
                cell.dataset.row = r;
                cell.dataset.col = c;

                cell.addEventListener('mousedown', (e) => {
                    if (this.gameOver || this.gameWon) return;
                    const face = document.getElementById('ms-face');
                    if (e.button === 0 && face) face.textContent = '😮';
                });

                cell.addEventListener('mouseup', () => {
                    if (this.gameOver || this.gameWon) return;
                    const face = document.getElementById('ms-face');
                    if (face) face.textContent = '🙂';
                });

                cell.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.handleLeftClick(r, c);
                });

                cell.addEventListener('contextmenu', (e) => {
                    e.preventDefault();
                    this.handleRightClick(r, c);
                });

                rowEl.appendChild(cell);
            }
            board.appendChild(rowEl);
        }
    }

    handleLeftClick(r, c) {
        if (this.gameOver || this.gameWon) return;
        if (this.flagged[r][c] || this.revealed[r][c]) return;

        if (!this.started) {
            this.started = true;
            this.placeMines(r, c);
            this.startTimer();
        }

        window.retroAudio.playClick();

        if (this.grid[r][c] === -1) {
            // Hit a mine!
            this.explode(r, c);
            return;
        }

        this.reveal(r, c);
        this.checkWin();
    }

    handleRightClick(r, c) {
        if (this.gameOver || this.gameWon || this.revealed[r][c]) return;

        window.retroAudio.playClick();
        this.flagged[r][c] = !this.flagged[r][c];
        this.minesLeft += this.flagged[r][c] ? -1 : 1;
        this.updateLed('ms-mines-count', this.minesLeft);

        const cell = document.querySelector(`.ms-cell[data-row="${r}"][data-col="${c}"]`);
        if (cell) {
            if (this.flagged[r][c]) {
                cell.classList.add('flagged');
                cell.textContent = '🚩';
            } else {
                cell.classList.remove('flagged');
                cell.textContent = '';
            }
        }
    }

    reveal(r, c) {
        if (r < 0 || r >= this.rows || c < 0 || c >= this.cols) return;
        if (this.revealed[r][c] || this.flagged[r][c]) return;

        this.revealed[r][c] = true;
        const cell = document.querySelector(`.ms-cell[data-row="${r}"][data-col="${c}"]`);
        if (!cell) return;

        cell.classList.add('revealed');
        const val = this.grid[r][c];

        if (val > 0) {
            cell.textContent = val;
            cell.classList.add(`num-${val}`);
        } else if (val === 0) {
            cell.textContent = '';
            // Flood fill empty neighbors
            for (let dr = -1; dr <= 1; dr++) {
                for (let dc = -1; dc <= 1; dc++) {
                    if (dr !== 0 || dc !== 0) {
                        this.reveal(r + dr, c + dc);
                    }
                }
            }
        }
    }

    explode(hitR, hitC) {
        this.gameOver = true;
        this.cleanup();

        window.retroAudio.playExplosion();
        if (window.glitchController) {
            window.glitchController.triggerScreenShake();
        }

        const face = document.getElementById('ms-face');
        if (face) face.textContent = '😵';

        // Reveal all mines
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                const cell = document.querySelector(`.ms-cell[data-row="${r}"][data-col="${c}"]`);
                if (!cell) continue;

                if (this.grid[r][c] === -1) {
                    cell.classList.add('revealed', 'mine');
                    cell.textContent = '💣';
                    if (r === hitR && c === hitC) {
                        cell.classList.add('hit');
                    }
                } else if (this.flagged[r][c]) {
                    cell.classList.add('revealed', 'wrong-flag');
                    cell.textContent = '❌';
                }
            }
        }

        // Destruction game tie-in: Exploding a mine corrupts the system slightly!
        if (window.gameEngine) {
            const bonusDmg = 250;
            window.gameEngine.bytes += bonusDmg;
            window.gameEngine.totalBytes += bonusDmg;
            window.gameEngine.updateDamage();
            window.gameEngine.spawnFloatText(`+${bonusDmg} Octets (BOOM!)`, window.innerWidth / 2, window.innerHeight / 2);
        }
    }

    checkWin() {
        let unrevealedSafe = 0;
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                if (this.grid[r][c] !== -1 && !this.revealed[r][c]) {
                    unrevealedSafe++;
                }
            }
        }

        if (unrevealedSafe === 0) {
            this.gameWon = true;
            this.cleanup();
            window.retroAudio.playAsterisk();

            const face = document.getElementById('ms-face');
            if (face) face.textContent = '😎';

            // Auto flag remaining mines
            for (let r = 0; r < this.rows; r++) {
                for (let c = 0; c < this.cols; c++) {
                    if (this.grid[r][c] === -1) {
                        const cell = document.querySelector(`.ms-cell[data-row="${r}"][data-col="${c}"]`);
                        if (cell) {
                            cell.classList.add('flagged');
                            cell.textContent = '🚩';
                        }
                    }
                }
            }

            this.updateLed('ms-mines-count', 0);

            if (window.gameEngine) {
                const reward = 5000;
                window.gameEngine.bytes += reward;
                window.gameEngine.totalBytes += reward;
                window.gameEngine.showNotification('🎉 Victoire au Démineur !', `Vous avez nettoyé le champ de mines et récupéré ${reward} octets !`);
            }
        }
    }

    startTimer() {
        this.timer = 0;
        this.timerInterval = setInterval(() => {
            this.timer = Math.min(999, this.timer + 1);
            this.updateLed('ms-timer', this.timer);
        }, 1000);
    }

    updateLed(id, val) {
        const el = document.getElementById(id);
        if (!el) return;
        const str = String(Math.max(-99, Math.min(999, val))).padStart(3, '0');
        el.textContent = str;
    }
}

// Global instance
window.minesweeperApp = new MinesweeperApp();
