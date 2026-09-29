/**
 * Windows 95 Sample Pictures Gallery (Galerie d'images système)
 * Faithful vintage bitmaps with 256-color dithering & wallpaper changer.
 */

class GalleryApp {
    constructor() {
        this.winId = 'app-gallery';
        this.currentIndex = 0;
        this.images = [
            {
                name: 'NUAGES.BMP',
                title: 'Nuages dorés (Ciel de Windows)',
                desc: 'Le fond d\'écran officiel et mythique de Windows 95.',
                res: '640 x 480',
                colors: '256 Couleurs',
                size: '307 Ko',
                draw: (ctx, w, h) => this.drawClouds(ctx, w, h)
            },
            {
                name: 'COLLINE.BMP',
                title: 'Colline verdoyante (Bliss)',
                desc: 'Pâturage de Sonoma County par Chuck O\'Rear.',
                res: '800 x 600',
                colors: '16 Millions (24 bits)',
                size: '1.40 Mo',
                draw: (ctx, w, h) => this.drawBliss(ctx, w, h)
            },
            {
                name: 'LABYRINTHE3D.BMP',
                title: 'Écran de veille Labyrinthe 3D',
                desc: 'Murs de briques rouges, rats et smiley psychédélique.',
                res: '640 x 480',
                colors: '256 Couleurs',
                size: '300 Ko',
                draw: (ctx, w, h) => this.drawMaze(ctx, w, h)
            },
            {
                name: 'DESERT_ROUGE.BMP',
                title: 'Roches Rouges d\'Arizona',
                desc: 'Monument Valley sous un soleil de plomb.',
                res: '640 x 480',
                colors: '256 Couleurs',
                size: '302 Ko',
                draw: (ctx, w, h) => this.drawDesert(ctx, w, h)
            },
            {
                name: 'AUTO_SPORT.BMP',
                title: 'Bolide V8 Jaune 1995',
                desc: 'Image d\'exemple du dossier C:\\WINDOWS\\SYSTEM.',
                res: '640 x 480',
                colors: '256 Couleurs',
                size: '315 Ko',
                draw: (ctx, w, h) => this.drawCar(ctx, w, h)
            },
            {
                name: 'CHATON_PC.BMP',
                title: 'Chaton sur clavier beige',
                desc: 'Il dort sur la touche Entrée.',
                res: '640 x 480',
                colors: '256 Couleurs',
                size: '298 Ko',
                draw: (ctx, w, h) => this.drawKitten(ctx, w, h)
            }
        ];
    }

    open() {
        const content = `
            <div class="gallery-app">
                <div class="gallery-toolbar">
                    <button class="win-btn" id="gal-prev">◄ Précédent</button>
                    <button class="win-btn" id="gal-next">Suivant ►</button>
                    <button class="win-btn gal-btn-wall" id="gal-set-wall">Définir comme papier peint</button>
                    <button class="win-btn" id="gal-corrupt-btn">Corrompre (+Bits)</button>
                </div>
                <div class="gallery-view-area">
                    <canvas id="gal-canvas" width="400" height="260"></canvas>
                </div>
                <div class="gallery-meta-bar">
                    <div class="gal-info-item"><strong>Fichier :</strong> <span id="gal-filename">NUAGES.BMP</span></div>
                    <div class="gal-info-item"><strong>Taille :</strong> <span id="gal-size">307 Ko</span></div>
                    <div class="gal-info-item"><strong>Palette :</strong> <span id="gal-colors">256 Couleurs</span></div>
                    <div class="gal-info-item"><strong>Description :</strong> <span id="gal-desc">Ciel de Windows</span></div>
                </div>
            </div>
        `;

        window.windowManager.createWindow({
            id: this.winId,
            title: 'Visionneuse d\'images Windows 95',
            icon: 'gallery',
            width: 440,
            height: 410,
            content,
            resizable: false
        });

        this.initGallery();
    }

    initGallery() {
        const prevBtn = document.getElementById('gal-prev');
        const nextBtn = document.getElementById('gal-next');
        const wallBtn = document.getElementById('gal-set-wall');
        const corruptBtn = document.getElementById('gal-corrupt-btn');

        if (prevBtn) {
            prevBtn.onclick = () => {
                window.retroAudio.playClick();
                this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
                this.renderCurrent();
            };
        }
        if (nextBtn) {
            nextBtn.onclick = () => {
                window.retroAudio.playClick();
                this.currentIndex = (this.currentIndex + 1) % this.images.length;
                this.renderCurrent();
            };
        }
        if (wallBtn) {
            wallBtn.onclick = () => {
                window.retroAudio.playAsterisk();
                this.applyAsWallpaper();
            };
        }
        if (corruptBtn) {
            corruptBtn.onclick = () => {
                window.retroAudio.playError();
                this.corruptCurrentImage();
            };
        }

        this.renderCurrent();
    }

    renderCurrent() {
        const canvas = document.getElementById('gal-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const img = this.images[this.currentIndex];

        img.draw(ctx, canvas.width, canvas.height);

        document.getElementById('gal-filename').textContent = img.name;
        document.getElementById('gal-size').textContent = img.size;
        document.getElementById('gal-colors').textContent = img.colors;
        document.getElementById('gal-desc').textContent = img.desc;
    }

    applyAsWallpaper() {
        const canvas = document.getElementById('gal-canvas');
        if (!canvas) return;
        const desktop = document.getElementById('desktop');
        if (!desktop) return;

        const dataUrl = canvas.toDataURL();
        desktop.style.backgroundImage = `url("${dataUrl}")`;
        desktop.style.backgroundSize = 'cover';
        desktop.style.backgroundPosition = 'center';

        if (window.gameEngine) {
            window.gameEngine.showNotification('Papier peint actualisé', `${this.images[this.currentIndex].name} est désormais le fond d'écran de Windows !`);
        }
    }

    corruptCurrentImage() {
        const canvas = document.getElementById('gal-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;

        // Byte glitch / color channel displacement
        for (let i = 0; i < data.length; i += 4) {
            if (Math.random() < 0.25) {
                data[i] = (data[i] + 70) % 256;      // Red
                data[i + 1] = (data[i + 1] ^ 0x55);  // Green
                data[i + 2] = (data[i + 2] - 30) % 256; // Blue
            }
        }
        ctx.putImageData(imgData, 0, 0);

        // Clicker reward for corrupting pictures
        if (window.gameEngine) {
            const reward = 300;
            window.gameEngine.bytes += reward;
            window.gameEngine.totalBytes += reward;
            window.gameEngine.updateDamage();
            window.gameEngine.spawnFloatText(`+${reward} Octets (Corrompu)`, window.innerWidth / 2, window.innerHeight / 2);
        }
    }

    // Drawing vintage bitmaps
    drawClouds(ctx, w, h) {
        const grad = ctx.createLinearGradient(0, 0, 0, h);
        grad.addColorStop(0, '#1060c0');
        grad.addColorStop(0.5, '#4a90e2');
        grad.addColorStop(1, '#a0c4f8');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        // Soft fluffy cumulus clouds
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        this.drawCloudPuff(ctx, 80, 80, 45);
        this.drawCloudPuff(ctx, 120, 70, 55);
        this.drawCloudPuff(ctx, 160, 85, 40);

        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        this.drawCloudPuff(ctx, 270, 140, 50);
        this.drawCloudPuff(ctx, 310, 130, 60);
        this.drawCloudPuff(ctx, 350, 145, 45);

        // Subtle 90s dither grain
        this.addDitherGrain(ctx, w, h, 0.04);
    }

    drawBliss(ctx, w, h) {
        // Sky
        const skyGrad = ctx.createLinearGradient(0, 0, 0, h * 0.6);
        skyGrad.addColorStop(0, '#0066cc');
        skyGrad.addColorStop(1, '#70b5f5');
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, w, h * 0.6);

        // Clouds in sky
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        this.drawCloudPuff(ctx, 100, 50, 35);
        this.drawCloudPuff(ctx, 140, 45, 45);
        this.drawCloudPuff(ctx, 290, 70, 40);

        // Lush green rolling hill 1
        ctx.fillStyle = '#449e1e';
        ctx.beginPath();
        ctx.moveTo(0, h * 0.55);
        ctx.bezierCurveTo(w * 0.25, h * 0.42, w * 0.75, h * 0.65, w, h * 0.52);
        ctx.lineTo(w, h);
        ctx.lineTo(0, h);
        ctx.fill();

        // Hill 2 in foreground
        ctx.fillStyle = '#64ba24';
        ctx.beginPath();
        ctx.moveTo(0, h * 0.65);
        ctx.bezierCurveTo(w * 0.35, h * 0.55, w * 0.65, h * 0.5, w, h * 0.68);
        ctx.lineTo(w, h);
        ctx.lineTo(0, h);
        ctx.fill();

        this.addDitherGrain(ctx, w, h, 0.05);
    }

    drawMaze(ctx, w, h) {
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, w, h);

        // Floor / ceiling
        ctx.fillStyle = '#333333';
        ctx.fillRect(0, h * 0.5, w, h * 0.5);

        // Brick perspective walls
        ctx.fillStyle = '#8b2500';
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(w * 0.35, h * 0.3);
        ctx.lineTo(w * 0.35, h * 0.7);
        ctx.lineTo(0, h);
        ctx.fill();

        ctx.fillStyle = '#a03000';
        ctx.beginPath();
        ctx.moveTo(w, 0);
        ctx.lineTo(w * 0.65, h * 0.3);
        ctx.lineTo(w * 0.65, h * 0.7);
        ctx.lineTo(w, h);
        ctx.fill();

        // Far wall
        ctx.fillStyle = '#551500';
        ctx.fillRect(w * 0.35, h * 0.3, w * 0.3, h * 0.4);

        // Retro smiley face floating in maze
        ctx.fillStyle = '#ffcc00';
        ctx.beginPath();
        ctx.arc(w * 0.5, h * 0.48, 18, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(w * 0.47, h * 0.45, 2.5, 0, Math.PI * 2);
        ctx.arc(w * 0.53, h * 0.45, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(w * 0.5, h * 0.48, 9, 0.2, Math.PI - 0.2);
        ctx.stroke();

        this.addDitherGrain(ctx, w, h, 0.07);
    }

    drawDesert(ctx, w, h) {
        const sky = ctx.createLinearGradient(0, 0, 0, h * 0.55);
        sky.addColorStop(0, '#d66a27');
        sky.addColorStop(1, '#ffc56e');
        ctx.fillStyle = sky;
        ctx.fillRect(0, 0, w, h * 0.55);

        // Sun
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(w * 0.75, h * 0.25, 24, 0, Math.PI * 2);
        ctx.fill();

        // Red Mesa rocks
        ctx.fillStyle = '#8f2d17';
        ctx.fillRect(w * 0.2, h * 0.35, 60, 60);
        ctx.fillRect(w * 0.55, h * 0.4, 75, 45);

        // Desert ground
        ctx.fillStyle = '#c75620';
        ctx.fillRect(0, h * 0.55, w, h * 0.45);

        this.addDitherGrain(ctx, w, h, 0.05);
    }

    drawCar(ctx, w, h) {
        // Sunset gradient
        const bg = ctx.createLinearGradient(0, 0, 0, h);
        bg.addColorStop(0, '#110033');
        bg.addColorStop(0.5, '#771155');
        bg.addColorStop(1, '#ee6622');
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, w, h);

        // Road
        ctx.fillStyle = '#222222';
        ctx.fillRect(0, h * 0.65, w, h * 0.35);

        // Yellow sports car
        ctx.fillStyle = '#ffdd00';
        ctx.fillRect(w * 0.2, h * 0.6, 180, 25);
        // Roof
        ctx.fillRect(w * 0.32, h * 0.5, 90, 15);
        // Windshield
        ctx.fillStyle = '#4477aa';
        ctx.fillRect(w * 0.34, h * 0.52, 40, 11);
        ctx.fillRect(w * 0.8, h * 0.52, 35, 11);

        // Wheels
        ctx.fillStyle = '#111111';
        ctx.beginPath();
        ctx.arc(w * 0.3, h * 0.73, 14, 0, Math.PI * 2);
        ctx.arc(w * 0.72, h * 0.73, 14, 0, Math.PI * 2);
        ctx.fill();

        // Chrome rims
        ctx.fillStyle = '#cccccc';
        ctx.beginPath();
        ctx.arc(w * 0.3, h * 0.73, 6, 0, Math.PI * 2);
        ctx.arc(w * 0.72, h * 0.73, 6, 0, Math.PI * 2);
        ctx.fill();

        this.addDitherGrain(ctx, w, h, 0.06);
    }

    drawKitten(ctx, w, h) {
        // Cozy carpet
        ctx.fillStyle = '#3a264a';
        ctx.fillRect(0, 0, w, h);

        // Beige vintage keyboard
        ctx.fillStyle = '#dcd5c0';
        ctx.fillRect(w * 0.1, h * 0.45, w * 0.8, h * 0.45);

        // Keyboard keys grid
        ctx.fillStyle = '#f0eade';
        for (let y = h * 0.5; y < h * 0.8; y += 14) {
            for (let x = w * 0.15; x < w * 0.82; x += 18) {
                ctx.fillRect(x, y, 14, 10);
            }
        }

        // Sleeping fluffy kitten
        ctx.fillStyle = '#d48c46';
        ctx.beginPath();
        ctx.ellipse(w * 0.5, h * 0.5, 45, 30, 0, 0, Math.PI * 2);
        ctx.fill();

        // Head
        ctx.beginPath();
        ctx.arc(w * 0.38, h * 0.45, 22, 0, Math.PI * 2);
        ctx.fill();

        // Ears
        ctx.beginPath();
        ctx.moveTo(w * 0.32, h * 0.35);
        ctx.lineTo(w * 0.28, h * 0.23);
        ctx.lineTo(w * 0.38, h * 0.3);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(w * 0.42, h * 0.3);
        ctx.lineTo(w * 0.48, h * 0.23);
        ctx.lineTo(w * 0.47, h * 0.35);
        ctx.fill();

        this.addDitherGrain(ctx, w, h, 0.05);
    }

    drawCloudPuff(ctx, x, y, r) {
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.arc(x + r * 0.6, y - r * 0.2, r * 0.8, 0, Math.PI * 2);
        ctx.arc(x - r * 0.6, y - r * 0.1, r * 0.7, 0, Math.PI * 2);
        ctx.arc(x + r * 1.1, y + r * 0.1, r * 0.6, 0, Math.PI * 2);
        ctx.fill();
    }

    addDitherGrain(ctx, w, h, intensity = 0.05) {
        const imgData = ctx.getImageData(0, 0, w, h);
        const data = imgData.data;
        for (let i = 0; i < data.length; i += 4) {
            const noise = (Math.random() - 0.5) * intensity * 255;
            data[i] = Math.min(255, Math.max(0, data[i] + noise));
            data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
            data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise));
        }
        ctx.putImageData(imgData, 0, 0);
    }
}

// Global instance
window.galleryApp = new GalleryApp();
