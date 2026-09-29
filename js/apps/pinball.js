/**
 * Windows 95 / Me 3D Pinball: Space Cadet (Retro Canvas Mini-Arcade)
 * Playable pinball with flippers, bumpers, score counters, spring launch, and audio effects.
 */

class PinballApp {
    constructor() {
        this.winId = 'app-pinball';
        this.canvas = null;
        this.ctx = null;
        this.animId = null;

        // Game state
        this.score = 0;
        this.ballsLeft = 3;
        this.gameOver = false;
        this.ball = { x: 285, y: 380, vx: 0, vy: 0, r: 6, active: false };

        // Flippers
        this.leftFlipper = { x: 100, y: 395, length: 45, angle: 0.35, restAngle: 0.35, upAngle: -0.45, active: false };
        this.rightFlipper = { x: 195, y: 395, length: 45, angle: Math.PI - 0.35, restAngle: Math.PI - 0.35, upAngle: Math.PI + 0.45, active: false };

        // Bumpers (Space Cadet style)
        this.bumpers = [
            { x: 110, y: 140, r: 20, color: '#ffcc00', glow: 0, points: 500 },
            { x: 185, y: 140, r: 20, color: '#00ccff', glow: 0, points: 500 },
            { x: 150, y: 200, r: 22, color: '#ff3366', glow: 0, points: 1000 }
        ];

        // Targets & Rollovers
        this.targets = [
            { x: 50, y: 240, w: 10, h: 25, active: true },
            { x: 50, y: 275, w: 10, h: 25, active: true },
            { x: 245, y: 240, w: 10, h: 25, active: true },
            { x: 245, y: 275, w: 10, h: 25, active: true }
        ];

        // Bounds
        this.width = 300;
        this.height = 440;

        // Key listeners
        this.boundKeyDown = this.handleKeyDown.bind(this);
        this.boundKeyUp = this.handleKeyUp.bind(this);
    }

    open() {
        const content = `
            <div class="pinball-app">
                <div class="pinball-top-bar">
                    <div class="pinball-score-box">
                        <span class="pinball-lbl">SCORE</span>
                        <span class="pinball-lcd" id="pb-score">0000000</span>
                    </div>
                    <div class="pinball-balls-box">
                        <span class="pinball-lbl">BALLE</span>
                        <span class="pinball-lcd" id="pb-balls">3</span>
                    </div>
                </div>
                <div class="pinball-canvas-container">
                    <canvas id="pinball-canvas" width="300" height="440"></canvas>
                </div>
                <div class="pinball-controls-bar">
                    <button class="win-btn pb-btn" id="pb-left-btn">◄ Flipper G</button>
                    <button class="win-btn pb-btn" id="pb-launch-btn">Lancer (Espace)</button>
                    <button class="win-btn pb-btn" id="pb-right-btn">Flipper D ►</button>
                </div>
                <div class="pinball-tip">Contrôles : Flèche Gauche (Z) / Flèche Droite (M) / Espace pour lancer</div>
            </div>
        `;

        window.windowManager.createWindow({
            id: this.winId,
            title: '3D Pinball pour Windows - Space Cadet',
            icon: 'pinball',
            width: 324,
            height: 565,
            content,
            resizable: false,
            onClose: () => this.cleanup()
        });

        this.initCanvas();
    }

    initCanvas() {
        this.canvas = document.getElementById('pinball-canvas');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');

        this.score = 0;
        this.ballsLeft = 3;
        this.gameOver = false;
        this.resetBall();

        window.addEventListener('keydown', this.boundKeyDown);
        window.addEventListener('keyup', this.boundKeyUp);

        // Buttons
        const leftBtn = document.getElementById('pb-left-btn');
        const rightBtn = document.getElementById('pb-right-btn');
        const launchBtn = document.getElementById('pb-launch-btn');

        if (leftBtn) {
            leftBtn.onmousedown = () => { this.leftFlipper.active = true; window.retroAudio.playPinballFlipper(); };
            leftBtn.onmouseup = () => { this.leftFlipper.active = false; };
            leftBtn.ontouchstart = (e) => { e.preventDefault(); this.leftFlipper.active = true; window.retroAudio.playPinballFlipper(); };
            leftBtn.ontouchend = () => { this.leftFlipper.active = false; };
        }
        if (rightBtn) {
            rightBtn.onmousedown = () => { this.rightFlipper.active = true; window.retroAudio.playPinballFlipper(); };
            rightBtn.onmouseup = () => { this.rightFlipper.active = false; };
            rightBtn.ontouchstart = (e) => { e.preventDefault(); this.rightFlipper.active = true; window.retroAudio.playPinballFlipper(); };
            rightBtn.ontouchend = () => { this.rightFlipper.active = false; };
        }
        if (launchBtn) {
            launchBtn.onclick = () => this.launchBall();
        }

        this.loop();
    }

    cleanup() {
        if (this.animId) {
            cancelAnimationFrame(this.animId);
            this.animId = null;
        }
        window.removeEventListener('keydown', this.boundKeyDown);
        window.removeEventListener('keyup', this.boundKeyUp);
    }

    handleKeyDown(e) {
        if (e.key === 'ArrowLeft' || e.key === 'z' || e.key === 'Z' || e.key === 'q' || e.key === 'Q') {
            if (!this.leftFlipper.active) {
                this.leftFlipper.active = true;
                window.retroAudio.playPinballFlipper();
            }
        }
        if (e.key === 'ArrowRight' || e.key === 'm' || e.key === 'M' || e.key === 'd' || e.key === 'D') {
            if (!this.rightFlipper.active) {
                this.rightFlipper.active = true;
                window.retroAudio.playPinballFlipper();
            }
        }
        if (e.key === ' ' || e.key === 'ArrowDown') {
            e.preventDefault();
            this.launchBall();
        }
    }

    handleKeyUp(e) {
        if (e.key === 'ArrowLeft' || e.key === 'z' || e.key === 'Z' || e.key === 'q' || e.key === 'Q') {
            this.leftFlipper.active = false;
        }
        if (e.key === 'ArrowRight' || e.key === 'm' || e.key === 'M' || e.key === 'd' || e.key === 'D') {
            this.rightFlipper.active = false;
        }
    }

    resetBall() {
        this.ball.x = 285;
        this.ball.y = 390;
        this.ball.vx = 0;
        this.ball.vy = 0;
        this.ball.active = false;
    }

    launchBall() {
        if (this.gameOver) {
            this.score = 0;
            this.ballsLeft = 3;
            this.gameOver = false;
            this.updateUi();
            this.resetBall();
        }

        if (!this.ball.active) {
            this.ball.active = true;
            this.ball.vy = -14 - Math.random() * 3;
            this.ball.vx = -0.5;
            window.retroAudio.playPinballLaunch();
        }
    }

    update() {
        // Flipper rotation animation
        const flipSpeed = 0.22;
        if (this.leftFlipper.active) {
            this.leftFlipper.angle = Math.max(this.leftFlipper.upAngle, this.leftFlipper.angle - flipSpeed);
        } else {
            this.leftFlipper.angle = Math.min(this.leftFlipper.restAngle, this.leftFlipper.angle + flipSpeed);
        }

        if (this.rightFlipper.active) {
            this.rightFlipper.angle = Math.min(this.rightFlipper.upAngle, this.rightFlipper.angle + flipSpeed);
        } else {
            this.rightFlipper.angle = Math.max(this.rightFlipper.restAngle, this.rightFlipper.angle - flipSpeed);
        }

        // Bumper glow decay
        this.bumpers.forEach(b => {
            if (b.glow > 0) b.glow -= 0.08;
        });

        if (!this.ball.active) return;

        // Physics: Gravity & Drag
        this.ball.vy += 0.22;
        this.ball.vx *= 0.998;
        this.ball.vy *= 0.998;

        this.ball.x += this.ball.vx;
        this.ball.y += this.ball.vy;

        // Plunger lane wall check
        if (this.ball.x > 270 && this.ball.y > 100) {
            if (this.ball.x + this.ball.r > 295) {
                this.ball.x = 295 - this.ball.r;
                this.ball.vx = -Math.abs(this.ball.vx) * 0.7;
            }
            if (this.ball.x - this.ball.r < 274 && this.ball.y > 110) {
                this.ball.x = 274 + this.ball.r;
                this.ball.vx = Math.abs(this.ball.vx) * 0.7;
            }
        }

        // Top arc curved wall
        if (this.ball.y < 120) {
            const centerX = 150;
            const centerY = 120;
            const dist = Math.hypot(this.ball.x - centerX, this.ball.y - centerY);
            const radius = 135;
            if (dist > radius) {
                const angle = Math.atan2(this.ball.y - centerY, this.ball.x - centerX);
                this.ball.x = centerX + Math.cos(angle) * radius;
                this.ball.y = centerY + Math.sin(angle) * radius;
                // Reflect velocity
                const normalX = -Math.cos(angle);
                const normalY = -Math.sin(angle);
                const dot = this.ball.vx * normalX + this.ball.vy * normalY;
                this.ball.vx = (this.ball.vx - 2 * dot * normalX) * 0.8;
                this.ball.vy = (this.ball.vy - 2 * dot * normalY) * 0.8;
            }
        }

        // Left & Right walls
        if (this.ball.x - this.ball.r < 25) {
            this.ball.x = 25 + this.ball.r;
            this.ball.vx = Math.abs(this.ball.vx) * 0.8;
        }
        if (this.ball.x + this.ball.r > (this.ball.y < 100 ? 295 : 272) && this.ball.y <= 100) {
            this.ball.x = 295 - this.ball.r;
            this.ball.vx = -Math.abs(this.ball.vx) * 0.8;
        }

        // Bumper collisions
        this.bumpers.forEach(b => {
            const dx = this.ball.x - b.x;
            const dy = this.ball.y - b.y;
            const dist = Math.hypot(dx, dy);
            if (dist < b.r + this.ball.r) {
                // Bounce with speed boost!
                const nx = dx / dist;
                const ny = dy / dist;
                const speed = Math.max(9, Math.hypot(this.ball.vx, this.ball.vy) * 1.25);
                this.ball.vx = nx * speed;
                this.ball.vy = ny * speed;
                b.glow = 1.0;
                this.addScore(b.points);
                window.retroAudio.playPinballBumper();
            }
        });

        // Flipper collisions
        this.checkFlipperCollision(this.leftFlipper, true);
        this.checkFlipperCollision(this.rightFlipper, false);

        // Bottom drain
        if (this.ball.y > this.height + 20) {
            this.ballsLeft--;
            window.retroAudio.playError();
            if (this.ballsLeft > 0) {
                this.resetBall();
            } else {
                this.gameOver = true;
                this.ball.active = false;
            }
            this.updateUi();
        }
    }

    checkFlipperCollision(flipper, isLeft) {
        const x1 = flipper.x;
        const y1 = flipper.y;
        const x2 = x1 + Math.cos(flipper.angle) * flipper.length;
        const y2 = y1 + Math.sin(flipper.angle) * flipper.length;

        // Closest point on line segment to ball center
        const l2 = (x2 - x1) ** 2 + (y2 - y1) ** 2;
        let t = ((this.ball.x - x1) * (x2 - x1) + (this.ball.y - y1) * (y2 - y1)) / l2;
        t = Math.max(0, Math.min(1, t));

        const closeX = x1 + t * (x2 - x1);
        const closeY = y1 + t * (y2 - y1);
        const dist = Math.hypot(this.ball.x - closeX, this.ball.y - closeY);

        if (dist < this.ball.r + 5) {
            // Collision with flipper
            const normalAngle = flipper.angle - (isLeft ? Math.PI / 2 : -Math.PI / 2);
            let speed = Math.hypot(this.ball.vx, this.ball.vy) * 0.8;
            if (flipper.active) {
                speed = Math.max(speed, 11); // Flipper slap
            }

            this.ball.vx = Math.cos(normalAngle) * speed + (Math.random() * 2 - 1);
            this.ball.vy = -Math.abs(Math.sin(normalAngle) * speed) - 2;
            this.ball.y = closeY - this.ball.r - 2;

            if (flipper.active) {
                this.addScore(150);
                window.retroAudio.playPinballFlipper();
            }
        }
    }

    addScore(pts) {
        this.score += pts;
        this.updateUi();

        // Pinball also grants corrupted bytes to the main game!
        if (window.gameEngine) {
            const bytesAdded = Math.floor(pts / 5);
            window.gameEngine.bytes += bytesAdded;
            window.gameEngine.totalBytes += bytesAdded;
            window.gameEngine.updateDamage();
        }
    }

    updateUi() {
        const scoreEl = document.getElementById('pb-score');
        const ballsEl = document.getElementById('pb-balls');
        if (scoreEl) scoreEl.textContent = String(this.score).padStart(7, '0');
        if (ballsEl) ballsEl.textContent = this.gameOver ? 'FIN' : String(this.ballsLeft);
    }

    render() {
        if (!this.ctx) return;
        const ctx = this.ctx;

        // Background (Deep space navy/purple)
        ctx.fillStyle = '#080820';
        ctx.fillRect(0, 0, this.width, this.height);

        // Grid lines (retro 3D feel)
        ctx.strokeStyle = '#181845';
        ctx.lineWidth = 1;
        for (let y = 50; y < this.height; y += 30) {
            ctx.beginPath();
            ctx.moveTo(25, y);
            ctx.lineTo(275, y);
            ctx.stroke();
        }

        // Space Cadet Table Artwork / Decals
        ctx.fillStyle = '#102060';
        ctx.beginPath();
        ctx.arc(150, 160, 85, 0, Math.PI * 2);
        ctx.fill();

        // Top arch
        ctx.strokeStyle = '#3050c0';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.arc(150, 120, 132, Math.PI, 0);
        ctx.stroke();

        // Plunger lane line
        ctx.strokeStyle = '#5070ff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(275, 110);
        ctx.lineTo(275, 420);
        ctx.stroke();

        // Bumpers
        this.bumpers.forEach(b => {
            ctx.save();
            ctx.beginPath();
            ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
            ctx.fillStyle = b.color;
            ctx.shadowColor = b.glow > 0 ? '#ffffff' : b.color;
            ctx.shadowBlur = b.glow * 25 + 5;
            ctx.fill();

            // Inner ring
            ctx.beginPath();
            ctx.arc(b.x, b.y, b.r * 0.5, 0, Math.PI * 2);
            ctx.fillStyle = b.glow > 0 ? '#ffffff' : '#222244';
            ctx.fill();
            ctx.restore();
        });

        // Flippers
        this.drawFlipper(this.leftFlipper, '#ff2244');
        this.drawFlipper(this.rightFlipper, '#ff2244');

        // Outlane guide walls
        ctx.strokeStyle = '#4060b0';
        ctx.lineWidth = 4;
        // Left guide
        ctx.beginPath();
        ctx.moveTo(25, 260);
        ctx.lineTo(60, 350);
        ctx.lineTo(100, 395);
        ctx.stroke();

        // Right guide
        ctx.beginPath();
        ctx.moveTo(275, 260);
        ctx.lineTo(235, 350);
        ctx.lineTo(195, 395);
        ctx.stroke();

        // Ball
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.ball.x, this.ball.y, this.ball.r, 0, Math.PI * 2);
        ctx.fillStyle = '#f0f0f0';
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 6;
        ctx.fill();

        // Shiny ball reflection
        ctx.beginPath();
        ctx.arc(this.ball.x - 2, this.ball.y - 2, 2, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.restore();

        // Game Over Overlay
        if (this.gameOver) {
            ctx.fillStyle = 'rgba(0,0,0,0.75)';
            ctx.fillRect(0, 0, this.width, this.height);
            ctx.fillStyle = '#ffff00';
            ctx.font = 'bold 20px monospace';
            ctx.textAlign = 'center';
            ctx.fillText('PARTIE TERMINÉE', this.width / 2, this.height / 2 - 15);
            ctx.fillStyle = '#ffffff';
            ctx.font = '12px monospace';
            ctx.fillText('Appuyez sur ESPACE', this.width / 2, this.height / 2 + 15);
            ctx.fillText('pour rejouer', this.width / 2, this.height / 2 + 35);
        }
    }

    drawFlipper(f, color) {
        const x2 = f.x + Math.cos(f.angle) * f.length;
        const y2 = f.y + Math.sin(f.angle) * f.length;

        this.ctx.save();
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 8;
        this.ctx.lineCap = 'round';
        this.ctx.beginPath();
        this.ctx.moveTo(f.x, f.y);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();

        // Pivot cap
        this.ctx.fillStyle = '#ffffff';
        this.ctx.beginPath();
        this.ctx.arc(f.x, f.y, 4, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();
    }

    loop() {
        this.update();
        this.render();
        this.animId = requestAnimationFrame(() => this.loop());
    }
}

// Global instance
window.pinballApp = new PinballApp();
