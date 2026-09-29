/**
 * Windows 95 Window Manager
 * Handles dragging, z-index, minimize/maximize/close, taskbar buttons,
 * error dialogue generator, and retro window-trail bugs!
 */

class WindowManager {
    constructor() {
        this.windows = new Map(); // id -> window object
        this.highestZ = 100;
        this.activeWindowId = null;
        this.desktop = null;
        this.taskbarTasks = null;
        this.cascadeOffset = 25;
        this.nextCascadePos = { x: 40, y: 30 };
        this.trailCanvas = null;
        this.trailCtx = null;
    }

    init() {
        this.desktop = document.getElementById('desktop');
        this.taskbarTasks = document.getElementById('taskbar-tasks');
        this.initTrailCanvas();
    }

    initTrailCanvas() {
        this.trailCanvas = document.getElementById('window-trail-canvas');
        if (this.trailCanvas) {
            this.trailCtx = this.trailCanvas.getContext('2d');
            this.resizeTrailCanvas();
            window.addEventListener('resize', () => this.resizeTrailCanvas());
        }
    }

    resizeTrailCanvas() {
        if (!this.trailCanvas) return;
        this.trailCanvas.width = window.innerWidth;
        this.trailCanvas.height = window.innerHeight;
    }

    createWindow(options) {
        const {
            id,
            title,
            icon = 'computer',
            width = 460,
            height = 360,
            x = null,
            y = null,
            content = '',
            isDialog = false,
            resizable = true,
            onClose = null,
            customClass = ''
        } = options;

        if (this.windows.has(id)) {
            const existing = this.windows.get(id);
            if (existing.minimized) {
                this.restoreWindow(id);
            }
            this.bringToFront(id);
            return existing;
        }

        const winEl = document.createElement('div');
        winEl.className = `retro-window ${customClass} ${isDialog ? 'dialog-mode' : ''}`;
        winEl.id = `win-${id}`;

        // Positioning
        let posX = x !== null ? x : this.nextCascadePos.x;
        let posY = y !== null ? y : this.nextCascadePos.y;
        if (x === null) {
            this.nextCascadePos.x = (this.nextCascadePos.x + this.cascadeOffset) % (window.innerWidth - width - 60);
            this.nextCascadePos.y = (this.nextCascadePos.y + this.cascadeOffset) % (window.innerHeight - height - 80);
            if (this.nextCascadePos.x < 30) this.nextCascadePos.x = 40;
            if (this.nextCascadePos.y < 20) this.nextCascadePos.y = 30;
        }

        winEl.style.width = typeof width === 'number' ? `${width}px` : width;
        winEl.style.height = typeof height === 'number' ? `${height}px` : height;
        winEl.style.left = `${posX}px`;
        winEl.style.top = `${posY}px`;
        winEl.style.zIndex = ++this.highestZ;

        // Window Frame HTML
        const iconSvg = RetroIcons[icon] || RetroIcons.computer;
        winEl.innerHTML = `
            <div class="window-title-bar" data-drag-handle="true">
                <div class="window-title-left">
                    <span class="window-title-icon">${iconSvg}</span>
                    <span class="window-title-text">${title}</span>
                </div>
                <div class="window-controls">
                    ${!isDialog ? `
                    <button class="win-btn win-btn-min" title="Réduire" data-action="min">_</button>
                    <button class="win-btn win-btn-max" title="Agrandir" data-action="max">□</button>
                    ` : ''}
                    <button class="win-btn win-btn-close" title="Fermer" data-action="close">✕</button>
                </div>
            </div>
            <div class="window-body">
                ${content}
            </div>
        `;

        this.desktop.appendChild(winEl);

        // Taskbar button
        const taskBtn = document.createElement('button');
        taskBtn.className = 'taskbar-item active';
        taskBtn.id = `task-${id}`;
        taskBtn.innerHTML = `
            <span class="task-icon">${iconSvg}</span>
            <span class="task-label">${title}</span>
        `;
        taskBtn.onclick = () => {
            const w = this.windows.get(id);
            if (w.minimized) {
                this.restoreWindow(id);
            } else if (this.activeWindowId === id) {
                this.minimizeWindow(id);
            } else {
                this.bringToFront(id);
            }
        };
        this.taskbarTasks.appendChild(taskBtn);

        // Dragging & Interaction setup
        const winObj = {
            id,
            el: winEl,
            taskBtn,
            title,
            icon,
            minimized: false,
            maximized: false,
            prevRect: null,
            onClose
        };

        this.windows.set(id, winObj);
        this.setupDragging(winObj);
        this.setupControls(winObj);
        this.bringToFront(id);

        return winObj;
    }

    setupControls(winObj) {
        const { id, el, onClose } = winObj;

        el.addEventListener('mousedown', () => {
            this.bringToFront(id);
        });

        const minBtn = el.querySelector('[data-action="min"]');
        if (minBtn) {
            minBtn.onclick = (e) => {
                e.stopPropagation();
                window.retroAudio.playClick();
                this.minimizeWindow(id);
            };
        }

        const maxBtn = el.querySelector('[data-action="max"]');
        if (maxBtn) {
            maxBtn.onclick = (e) => {
                e.stopPropagation();
                window.retroAudio.playClick();
                this.toggleMaximize(id);
            };
        }

        const closeBtn = el.querySelector('[data-action="close"]');
        if (closeBtn) {
            closeBtn.onclick = (e) => {
                e.stopPropagation();
                window.retroAudio.playClick();
                this.closeWindow(id);
            };
        }
    }

    setupDragging(winObj) {
        const { id, el } = winObj;
        const titleBar = el.querySelector('.window-title-bar');
        let isDragging = false;
        let startX, startY, initialX, initialY;

        titleBar.addEventListener('mousedown', (e) => {
            if (e.target.closest('.win-btn')) return;
            if (winObj.maximized) return;

            isDragging = true;
            this.bringToFront(id);

            startX = e.clientX;
            startY = e.clientY;
            initialX = el.offsetLeft;
            initialY = el.offsetTop;

            const onMouseMove = (moveEv) => {
                if (!isDragging) return;
                const dx = moveEv.clientX - startX;
                const dy = moveEv.clientY - startY;

                const newX = Math.max(0, Math.min(window.innerWidth - 60, initialX + dx));
                const newY = Math.max(0, Math.min(window.innerHeight - 70, initialY + dy));

                el.style.left = `${newX}px`;
                el.style.top = `${newY}px`;
            };

            const onMouseUp = () => {
                isDragging = false;
                window.removeEventListener('mousemove', onMouseMove);
                window.removeEventListener('mouseup', onMouseUp);
            };

            window.addEventListener('mousemove', onMouseMove);
            window.addEventListener('mouseup', onMouseUp);
        });
    }

    // Windows 95 GDI Solitaire / Error Dragging Trail Bug!
    drawWindowTrail(el) {
        if (!this.trailCtx) return;
        const rect = el.getBoundingClientRect();
        // Draw title bar stamp
        this.trailCtx.fillStyle = '#000080';
        this.trailCtx.fillRect(rect.left, rect.top, rect.width, 24);
        this.trailCtx.fillStyle = '#c0c0c0';
        this.trailCtx.fillRect(rect.left, rect.top + 24, rect.width, rect.height - 24);
        this.trailCtx.strokeStyle = '#000000';
        this.trailCtx.strokeRect(rect.left, rect.top, rect.width, rect.height);
    }

    clearTrails() {
        if (!this.trailCtx || !this.trailCanvas) return;
        this.trailCtx.clearRect(0, 0, this.trailCanvas.width, this.trailCanvas.height);
    }

    bringToFront(id) {
        const winObj = this.windows.get(id);
        if (!winObj) return;

        this.highestZ++;
        winObj.el.style.zIndex = this.highestZ;
        this.activeWindowId = id;

        // Update active class on all windows
        this.windows.forEach((w, wId) => {
            if (wId === id) {
                w.el.classList.add('active');
                if (w.taskBtn) w.taskBtn.classList.add('active');
            } else {
                w.el.classList.remove('active');
                if (w.taskBtn) w.taskBtn.classList.remove('active');
            }
        });
    }

    minimizeWindow(id) {
        const winObj = this.windows.get(id);
        if (!winObj) return;

        winObj.minimized = true;
        winObj.el.style.display = 'none';
        if (winObj.taskBtn) {
            winObj.taskBtn.classList.remove('active');
        }

        // Focus next highest window
        if (this.activeWindowId === id) {
            let nextWin = null;
            let topZ = -1;
            this.windows.forEach(w => {
                if (!w.minimized && parseInt(w.el.style.zIndex, 10) > topZ) {
                    topZ = parseInt(w.el.style.zIndex, 10);
                    nextWin = w;
                }
            });
            if (nextWin) {
                this.bringToFront(nextWin.id);
            } else {
                this.activeWindowId = null;
            }
        }
    }

    restoreWindow(id) {
        const winObj = this.windows.get(id);
        if (!winObj) return;

        winObj.minimized = false;
        winObj.el.style.display = 'flex';
        this.bringToFront(id);
    }

    toggleMaximize(id) {
        const winObj = this.windows.get(id);
        if (!winObj) return;

        if (winObj.maximized) {
            // Restore previous bounds
            const r = winObj.prevRect;
            winObj.el.style.left = `${r.left}px`;
            winObj.el.style.top = `${r.top}px`;
            winObj.el.style.width = `${r.width}px`;
            winObj.el.style.height = `${r.height}px`;
            winObj.el.classList.remove('maximized');
            winObj.maximized = false;
        } else {
            // Maximize
            winObj.prevRect = {
                left: winObj.el.offsetLeft,
                top: winObj.el.offsetTop,
                width: winObj.el.offsetWidth,
                height: winObj.el.offsetHeight
            };
            winObj.el.style.left = '0px';
            winObj.el.style.top = '0px';
            winObj.el.style.width = '100vw';
            winObj.el.style.height = 'calc(100vh - 36px)';
            winObj.el.classList.add('maximized');
            winObj.maximized = true;
        }
    }

    closeWindow(id) {
        const winObj = this.windows.get(id);
        if (!winObj) return;

        if (winObj.onClose) {
            winObj.onClose();
        }

        winObj.el.remove();
        if (winObj.taskBtn) winObj.taskBtn.remove();
        this.windows.delete(id);

        if (this.activeWindowId === id) {
            this.activeWindowId = null;
        }
    }

    // Spawn a classic retro Error / Alert Dialog
    spawnErrorDialog(customTitle = null, customMsg = null) {
        const errorMsgs = [
            "Une erreur fatale est survenue à l'adresse 0028:C0011E36 dans VXD VMM(01) + 00010E36.",
            "EXPLORER.EXE a provoqué une défaillance de page générale dans le module KERNEL32.DLL à 0137:bff7b98d.",
            "Mémoire insuffisante pour afficher le curseur de souris. Veuillez fermer une ou plusieurs applications.",
            "Le composant OLE32.DLL semble s'être désintégré sous l'effet d'une charge thermique anormale.",
            "Impossible d'écrire sur le lecteur C: (Le disque dur émet un bruit de friture suspect).",
            "WINSOCK.DLL a rencontré une surcharge de paquets ICQ non sollicités.",
            "Exception non gérée 0xDEADBEEF : Le Registre de Windows a fondu.",
            "L'ordinateur va maintenant exécuter une opération non autorisée et être arrêté."
        ];

        const titles = [
            "Erreur système critique",
            "Violation d'accès Explorer",
            "Alerte de sécurité Windows",
            "KERNEL32.DLL Défaillance",
            "Pilote d'affichage corrompu",
            "Panique de la mémoire virtuelle"
        ];

        const msg = customMsg || errorMsgs[Math.floor(Math.random() * errorMsgs.length)];
        const title = customTitle || titles[Math.floor(Math.random() * titles.length)];
        const id = 'err_' + Date.now() + '_' + Math.floor(Math.random() * 1000);

        if (window.retroAudio) {
            window.retroAudio.playError();
        }

        // Random jitter position near screen center
        const cx = Math.max(30, Math.floor(window.innerWidth / 2 - 180 + (Math.random() * 200 - 100)));
        const cy = Math.max(30, Math.floor(window.innerHeight / 2 - 120 + (Math.random() * 160 - 80)));

        const html = `
            <div class="retro-error-dialog-content">
                <div class="error-dialog-upper">
                    <div class="error-dialog-icon">
                        ${RetroIcons.errorBadge}
                    </div>
                    <div class="error-dialog-text">
                        <p>${msg}</p>
                    </div>
                </div>
                <div class="error-dialog-buttons">
                    <button class="win-btn retro-btn-action" data-action="cancel">Abandonner</button>
                    <button class="win-btn retro-btn-action" data-action="retry">Recommencer</button>
                    <button class="win-btn retro-btn-action" data-action="ignore">Ignorer</button>
                </div>
            </div>
        `;

        const winObj = this.createWindow({
            id,
            title,
            icon: 'errorBadge',
            width: 380,
            height: 175,
            x: cx,
            y: cy,
            content: html,
            isDialog: true,
            resizable: false
        });

        // Add button actions
        const btns = winObj.el.querySelectorAll('.retro-btn-action');
        btns.forEach(btn => {
            btn.onclick = () => {
                window.retroAudio.playClick();
                // Clicking "Recommencer" might trigger another error!
                if (btn.dataset.action === 'retry' && Math.random() < 0.4) {
                    this.spawnErrorDialog();
                }
                this.closeWindow(id);
            };
        });

        return winObj;
    }
}

// Global window manager instance
window.windowManager = new WindowManager();
