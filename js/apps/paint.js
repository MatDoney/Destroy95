/**
 * Windows 95 MS Paint (Paintbrush)
 * Classic drawing canvas with pencil, brush, spray can, bucket fill, eraser, and 16-color palette.
 */

class PaintApp {
    constructor() {
        this.winId = 'app-paint';
        this.canvas = null;
        this.ctx = null;
        this.currentTool = 'pencil'; // pencil, brush, spray, eraser, bucket
        this.currentColor = '#000000';
        this.currentSize = 2;
        this.isDrawing = false;
        this.lastX = 0;
        this.lastY = 0;

        this.palette = [
            '#000000', '#808080', '#800000', '#808000', '#008000', '#008080', '#000080', '#800080',
            '#ffffff', '#c0c0c0', '#ff0000', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#ff00ff'
        ];
    }

    open() {
        const paletteHtml = this.palette.map((c, i) => `
            <div class="paint-color-swatch ${i === 0 ? 'selected' : ''}" style="background-color: ${c};" data-color="${c}"></div>
        `).join('');

        const content = `
            <div class="paint-app">
                <div class="paint-menu-bar">
                    <span>Fichier</span>
                    <span>Édition</span>
                    <span>Affichage</span>
                    <span>Image</span>
                    <span>Couleurs</span>
                    <span>Aide</span>
                </div>
                <div class="paint-main">
                    <div class="paint-tools-panel">
                        <button class="win-btn tool-btn active" data-tool="pencil" title="Crayon">✏️</button>
                        <button class="win-btn tool-btn" data-tool="brush" title="Pinceau">🖌️</button>
                        <button class="win-btn tool-btn" data-tool="spray" title="Aérographe (Spray)">💨</button>
                        <button class="win-btn tool-btn" data-tool="eraser" title="Gomme">🧼</button>
                        <button class="win-btn tool-btn" data-tool="bucket" title="Remplissage (Pot de peinture)">🪣</button>
                    </div>
                    <div class="paint-canvas-wrapper">
                        <canvas id="paint-canvas" width="380" height="240"></canvas>
                    </div>
                </div>
                <div class="paint-bottom-bar">
                    <div class="paint-palette">
                        <div class="paint-current-preview" id="paint-current-swatch" style="background-color: #000000;"></div>
                        <div class="paint-swatches-grid">
                            ${paletteHtml}
                        </div>
                    </div>
                    <div class="paint-actions">
                        <button class="win-btn" id="paint-clear-btn">Effacer</button>
                        <button class="win-btn" id="paint-glitch-btn">Dégât GDI (+Bits)</button>
                    </div>
                </div>
            </div>
        `;

        window.windowManager.createWindow({
            id: this.winId,
            title: 'Sans titre - Paint',
            icon: 'paint',
            width: 440,
            height: 380,
            content,
            resizable: false
        });

        this.initCanvas();
    }

    initCanvas() {
        this.canvas = document.getElementById('paint-canvas');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });

        // Fill white canvas background
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Tool buttons
        const toolBtns = document.querySelectorAll('.paint-tools-panel .tool-btn');
        toolBtns.forEach(btn => {
            btn.onclick = () => {
                toolBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentTool = btn.dataset.tool;
                window.retroAudio.playClick();
            };
        });

        // Palette swatches
        const swatches = document.querySelectorAll('.paint-color-swatch');
        const preview = document.getElementById('paint-current-swatch');
        swatches.forEach(sw => {
            sw.onclick = () => {
                swatches.forEach(s => s.classList.remove('selected'));
                sw.classList.add('selected');
                this.currentColor = sw.dataset.color;
                if (preview) preview.style.backgroundColor = this.currentColor;
                window.retroAudio.playClick();
            };
        });

        // Clear button
        const clearBtn = document.getElementById('paint-clear-btn');
        if (clearBtn) {
            clearBtn.onclick = () => {
                window.retroAudio.playClick();
                this.ctx.fillStyle = '#ffffff';
                this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            };
        }

        // Glitch button
        const glitchBtn = document.getElementById('paint-glitch-btn');
        if (glitchBtn) {
            glitchBtn.onclick = () => {
                window.retroAudio.playError();
                this.corruptCanvas();
            };
        }

        // Mouse events on canvas
        this.canvas.onmousedown = (e) => this.startDraw(e);
        this.canvas.onmousemove = (e) => this.draw(e);
        window.addEventListener('mouseup', () => { this.isDrawing = false; });
    }

    getCoords(e) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: Math.floor(e.clientX - rect.left),
            y: Math.floor(e.clientY - rect.top)
        };
    }

    startDraw(e) {
        const { x, y } = this.getCoords(e);
        this.isDrawing = true;
        this.lastX = x;
        this.lastY = y;

        if (this.currentTool === 'bucket') {
            this.floodFill(x, y, this.currentColor);
            window.retroAudio.playClick();
        } else {
            this.draw(e);
        }
    }

    draw(e) {
        if (!this.isDrawing) return;
        const { x, y } = this.getCoords(e);

        this.ctx.fillStyle = this.currentColor;
        this.ctx.strokeStyle = this.currentTool === 'eraser' ? '#ffffff' : this.currentColor;

        if (this.currentTool === 'pencil') {
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();
            this.ctx.moveTo(this.lastX, this.lastY);
            this.ctx.lineTo(x, y);
            this.ctx.stroke();
        } else if (this.currentTool === 'brush') {
            this.ctx.lineWidth = 5;
            this.ctx.lineCap = 'round';
            this.ctx.beginPath();
            this.ctx.moveTo(this.lastX, this.lastY);
            this.ctx.lineTo(x, y);
            this.ctx.stroke();
        } else if (this.currentTool === 'eraser') {
            this.ctx.lineWidth = 12;
            this.ctx.lineCap = 'square';
            this.ctx.beginPath();
            this.ctx.moveTo(this.lastX, this.lastY);
            this.ctx.lineTo(x, y);
            this.ctx.stroke();
        } else if (this.currentTool === 'spray') {
            // Retro spray can effect
            const density = 20;
            const radius = 10;
            for (let i = 0; i < density; i++) {
                const angle = Math.random() * Math.PI * 2;
                const r = Math.random() * radius;
                const sx = Math.floor(x + Math.cos(angle) * r);
                const sy = Math.floor(y + Math.sin(angle) * r);
                this.ctx.fillRect(sx, sy, 1, 1);
            }
        }

        this.lastX = x;
        this.lastY = y;
    }

    floodFill(startX, startY, fillHex) {
        const imgData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const data = imgData.data;
        const w = this.canvas.width;
        const h = this.canvas.height;

        const targetIdx = (startY * w + startX) * 4;
        const tr = data[targetIdx];
        const tg = data[targetIdx + 1];
        const tb = data[targetIdx + 2];

        // Convert hex to rgb
        const r = parseInt(fillHex.slice(1, 3), 16);
        const g = parseInt(fillHex.slice(3, 5), 16);
        const b = parseInt(fillHex.slice(5, 7), 16);

        if (tr === r && tg === g && tb === b) return;

        const queue = [[startX, startY]];
        const visited = new Uint8Array(w * h);

        while (queue.length > 0 && queue.length < 50000) {
            const [cx, cy] = queue.pop();
            const idx = (cy * w + cx) * 4;

            if (cx < 0 || cx >= w || cy < 0 || cy >= h) continue;
            if (visited[cy * w + cx]) continue;
            visited[cy * w + cx] = 1;

            if (data[idx] === tr && data[idx + 1] === tg && data[idx + 2] === tb) {
                data[idx] = r;
                data[idx + 1] = g;
                data[idx + 2] = b;
                data[idx + 3] = 255;

                queue.push([cx + 1, cy], [cx - 1, cy], [cx, cy + 1], [cx, cy - 1]);
            }
        }
        this.ctx.putImageData(imgData, 0, 0);
    }

    corruptCanvas() {
        const imgData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const data = imgData.data;

        // Shift rows like a broken VRAM DAC
        for (let y = 0; y < this.canvas.height; y++) {
            if (Math.random() < 0.2) {
                const shift = Math.floor((Math.random() - 0.5) * 40);
                for (let x = 0; x < this.canvas.width; x++) {
                    const srcX = (x + shift + this.canvas.width) % this.canvas.width;
                    const idx1 = (y * this.canvas.width + x) * 4;
                    const idx2 = (y * this.canvas.width + srcX) * 4;
                    data[idx1] = data[idx2] ^ 0x33;
                }
            }
        }
        this.ctx.putImageData(imgData, 0, 0);

        if (window.gameEngine) {
            const bonus = 400;
            window.gameEngine.bytes += bonus;
            window.gameEngine.totalBytes += bonus;
            window.gameEngine.updateDamage();
            window.gameEngine.spawnFloatText(`+${bonus} Octets (Buffer Corrompu)`, window.innerWidth / 2, window.innerHeight / 2);
        }
    }
}

// Global instance
window.paintApp = new PaintApp();
