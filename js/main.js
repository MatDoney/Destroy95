/**
 * Main Application Orchestrator for Bouzedows 95 Destruction Simulator
 * Handles desktop icons, start menu, tray controls, audio toggles, and game loop.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Window Manager & Glitch Controller
    window.windowManager.init();
    window.glitchController.init();

    // 2. Setup Desktop Shortcuts
    setupDesktopShortcuts();

    // 3. Setup Start Menu
    setupStartMenu();

    // 4. Setup System Tray & Clock
    setupSystemTray();

    // 5. Initialize Clippy
    window.clippyCompanion.init();

    // 6. Audio First Gesture Listener
    const onFirstInteraction = () => {
        window.retroAudio.ensureContext();
        window.removeEventListener('click', onFirstInteraction);
        window.removeEventListener('keydown', onFirstInteraction);
    };
    window.addEventListener('click', onFirstInteraction);
    window.addEventListener('keydown', onFirstInteraction);

    // 7. Initialize Bouzedows XP Login Screen
    if (window.xpLoginScreen) {
        window.xpLoginScreen.init(() => {
            // Callback executed after user logs in through Bouzedows XP Welcome Screen
            setTimeout(() => {
                if (window.chaosApp) window.chaosApp.open();
            }, 300);
        });
    } else {
        setTimeout(() => {
            if (window.chaosApp) window.chaosApp.open();
        }, 400);
    }

    // 8. Main Game Loop (60 FPS)
    let lastTime = performance.now();
    let saveAccumulator = 0;

    function gameLoop(now) {
        const dtSec = Math.min(0.2, (now - lastTime) / 1000);
        lastTime = now;

        // Engine tick
        window.gameEngine.tick(dtSec);

        // Update UI
        if (window.chaosApp) {
            window.chaosApp.updateUi();
        }

        // Glitch update
        if (window.glitchController) {
            window.glitchController.update(window.gameEngine.systemDamage);
        }

        // Auto save every 5 seconds
        saveAccumulator += dtSec;
        if (saveAccumulator >= 5) {
            saveAccumulator = 0;
            window.gameEngine.save();
        }

        requestAnimationFrame(gameLoop);
    }
    requestAnimationFrame(gameLoop);
});

// Setup Desktop Shortcuts
function setupDesktopShortcuts() {
    const desktop = document.getElementById('desktop');
    if (!desktop) return;

    const shortcuts = [
        {
            id: 'sc-chaos',
            name: 'Destructeur de Bouzedows',
            icon: RetroIcons.chaosEngine,
            action: () => window.chaosApp.open()
        },
        {
            id: 'sc-flipper',
            name: '3D Pinball Flipper',
            icon: RetroIcons.pinball,
            action: () => window.pinballApp.open()
        },
        {
            id: 'sc-minesweeper',
            name: 'Démineur',
            icon: RetroIcons.minesweeper,
            action: () => window.minesweeperApp.open()
        },
        {
            id: 'sc-paint',
            name: 'Paint',
            icon: RetroIcons.paint,
            action: () => window.paintApp.open()
        },
        {
            id: 'sc-defrag',
            name: 'Défragmenteur',
            icon: RetroIcons.defrag,
            action: () => window.defragApp.open()
        },
        {
            id: 'sc-gallery',
            name: 'Galerie Photos 95',
            icon: RetroIcons.gallery,
            action: () => window.galleryApp.open()
        },
        {
            id: 'sc-notepad',
            name: 'Bloc-notes',
            icon: RetroIcons.notepad,
            action: () => window.notepadApp.open()
        },
        {
            id: 'sc-ie',
            name: 'Internet Explorer',
            icon: RetroIcons.internetExplorer,
            action: () => window.browserApp.open()
        },
        {
            id: 'sc-computer',
            name: 'Poste de travail',
            icon: RetroIcons.computer,
            action: () => openComputerWindow()
        },
        {
            id: 'sc-recycle',
            name: 'Corbeille',
            icon: RetroIcons.recycleBin,
            action: () => openRecycleBinWindow()
        }
    ];

    const grid = document.getElementById('desktop-icons-grid');
    if (!grid) return;

    shortcuts.forEach(sc => {
        const item = document.createElement('div');
        item.className = 'desktop-shortcut';
        item.id = sc.id;
        item.tabIndex = 0;
        item.innerHTML = `
            <div class="shortcut-icon">${sc.icon}</div>
            <div class="shortcut-label">${sc.name}</div>
        `;

        // Click selection
        item.addEventListener('click', (e) => {
            e.stopPropagation();
            document.querySelectorAll('.desktop-shortcut').forEach(el => el.classList.remove('selected'));
            item.classList.add('selected');
        });

        // Double click launches app (with crash chance if system damage is high!)
        item.addEventListener('dblclick', (e) => {
            e.stopPropagation();
            window.retroAudio.playClick();

            // At high damage, chance to crash instead of opening smoothly!
            if (window.gameEngine && window.gameEngine.systemDamage >= 60 && Math.random() < 0.35) {
                window.windowManager.spawnErrorDialog(
                    "Défaillance de l'application",
                    `L'application "${sc.name}" a causé une faute de protection générale dans le module KERNEL32.DLL à 015F:BFF85D72.`
                );
                return;
            }

            sc.action();
        });

        // Also allow Enter key
        item.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                sc.action();
            }
        });

        grid.appendChild(item);
    });

    // Deselect icons when clicking empty desktop + smash desktop for corruption!
    desktop.addEventListener('click', (e) => {
        document.querySelectorAll('.desktop-shortcut').forEach(el => el.classList.remove('selected'));
        if (e.target === desktop || e.target.id === 'desktop') {
            window.gameEngine.click(null, e.clientX, e.clientY);
        }
    });
}

// Poste de travail (My Computer) Window
function openComputerWindow() {
    const content = `
        <div class="computer-app">
            <div class="drive-item" id="drive-a">
                <div class="drive-icon">${RetroIcons.floppy}</div>
                <div class="drive-lbl">Lecteur 3½ (A:)</div>
            </div>
            <div class="drive-item" id="drive-c">
                <div class="drive-icon">${RetroIcons.computer}</div>
                <div class="drive-lbl">(C:) Disque dur (1.2 Go)</div>
            </div>
            <div class="drive-item" id="drive-d">
                <div class="drive-icon">${RetroIcons.cdrom}</div>
                <div class="drive-lbl">Lecteur CD-ROM (D:)</div>
            </div>
        </div>
        <div class="computer-status">
            <span>3 objet(s) | Espace libre sur C: <strong>${Math.max(0, 1200 - Math.floor(window.gameEngine.totalBytes / 100000))} Mo</strong></span>
        </div>
    `;

    const win = window.windowManager.createWindow({
        id: 'app-my-computer',
        title: 'Poste de travail',
        icon: 'computer',
        width: 380,
        height: 220,
        content,
        resizable: true
    });

    win.el.querySelector('#drive-a').ondblclick = () => {
        window.retroAudio.playError();
        window.windowManager.spawnErrorDialog('Lecteur A: non prêt', 'Le lecteur de disquette A: n\'est pas accessible. Le disque est soit manquant, soit couvert de poussière.');
    };

    win.el.querySelector('#drive-c').ondblclick = () => {
        window.retroAudio.playClick();
        window.defragApp.open();
    };

    win.el.querySelector('#drive-d').ondblclick = () => {
        window.retroAudio.playDing();
        window.windowManager.spawnErrorDialog('Tiroir CD-ROM', 'Le CD-ROM "Encyclopédie Encarta 95 (Disque 2)" est rayé.');
    };
}

// Corbeille (Recycle Bin) Window
function openRecycleBinWindow() {
    const files = [
        { name: 'backup_system32.zip', size: '42 Mo', date: '1998-04-12' },
        { name: 'lettre_de_motivation.doc', size: '18 Ko', date: '1997-11-03' },
        { name: 'diablo1_crack_nocd.nfo', size: '4 Ko', date: '1998-01-20' },
        { name: 'clippy_murder_plan.txt', size: '2 Ko', date: '1998-09-14' }
    ];

    const content = `
        <div class="recycle-app">
            <div class="recycle-toolbar">
                <button class="win-btn" id="rb-empty-btn">Vider la Corbeille</button>
                <button class="win-btn" id="rb-restore-btn">Restaurer tous les fichiers</button>
            </div>
            <div class="recycle-list" id="rb-list">
                ${files.map(f => `
                    <div class="recycle-item">
                        <span class="rec-icon">📄</span>
                        <span class="rec-name">${f.name}</span>
                        <span class="rec-size">${f.size}</span>
                        <span class="rec-date">${f.date}</span>
                    </div>
                `).join('')}
            </div>
            <div class="recycle-status" id="rb-status">4 fichier(s) dans la corbeille (42.02 Mo)</div>
        </div>
    `;

    const win = window.windowManager.createWindow({
        id: 'app-recycle-bin',
        title: 'Corbeille',
        icon: 'recycleBin',
        width: 420,
        height: 280,
        content,
        resizable: true
    });

    const emptyBtn = win.el.querySelector('#rb-empty-btn');
    if (emptyBtn) {
        emptyBtn.onclick = () => {
            window.retroAudio.playAsterisk();
            win.el.querySelector('#rb-list').innerHTML = '<div class="empty-bin-msg">La Corbeille est vide.</div>';
            win.el.querySelector('#rb-status').textContent = '0 fichier(s)';
            if (window.gameEngine) {
                const bonus = 500;
                window.gameEngine.bytes += bonus;
                window.gameEngine.totalBytes += bonus;
                window.gameEngine.updateDamage();
                window.gameEngine.showNotification('🗑️ Corbeille vidée', `Vous avez récupéré ${bonus} octets d'espace corrompu !`);
            }
        };
    }
}

// Setup Start Menu
function setupStartMenu() {
    const startBtn = document.getElementById('start-button');
    const startMenu = document.getElementById('start-menu');
    if (!startBtn || !startMenu) return;

    startBtn.onclick = (e) => {
        e.stopPropagation();
        window.retroAudio.playClick();
        const isOpen = !startMenu.classList.contains('hidden');
        if (isOpen) {
            startMenu.classList.add('hidden');
            startBtn.classList.remove('active');
        } else {
            startMenu.classList.remove('hidden');
            startBtn.classList.add('active');
        }
    };

    // Close when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('#start-menu') && !e.target.closest('#start-button')) {
            startMenu.classList.add('hidden');
            startBtn.classList.remove('active');
        }
    });

    // Start menu item clicks
    const bindMenu = (selector, action) => {
        const el = startMenu.querySelector(selector);
        if (el) {
            el.onclick = () => {
                window.retroAudio.playClick();
                startMenu.classList.add('hidden');
                startBtn.classList.remove('active');
                action();
            };
        }
    };

    bindMenu('#sm-item-chaos', () => window.chaosApp.open());
    bindMenu('#sm-item-pinball', () => window.pinballApp.open());
    bindMenu('#sm-item-minesweeper', () => window.minesweeperApp.open());
    bindMenu('#sm-item-paint', () => window.paintApp.open());
    bindMenu('#sm-item-defrag', () => window.defragApp.open());
    bindMenu('#sm-item-gallery', () => window.galleryApp.open());
    bindMenu('#sm-item-notepad', () => window.notepadApp.open());
    bindMenu('#sm-item-ie', () => window.browserApp.open());
    bindMenu('#sm-item-clippy', () => window.clippyCompanion.showRandomQuote());
    bindMenu('#sm-item-test-popup', () => window.popupManager.spawnPopup());
    bindMenu('#sm-item-popups', () => window.popupManager.closeAllPopups());
    bindMenu('#sm-item-lock', () => {
        if (window.xpLoginScreen) window.xpLoginScreen.lock();
    });
    bindMenu('#sm-item-restart', () => {
        if (confirm("Voulez-vous redémarrer le système d'exploitation Bouzedows 95 ?")) {
            window.location.reload();
        }
    });
    bindMenu('#sm-item-shutdown', () => triggerShutDownScreen());
}

// Famous Shutdown Screen
function triggerShutDownScreen() {
    window.triggerShutDownScreen = triggerShutDownScreen;
    const shutScreen = document.getElementById('shutdown-screen');
    if (!shutScreen) return;

    if (confirm("Voulez-vous vraiment éteindre l'ordinateur ?")) {
        shutScreen.classList.remove('hidden');
        window.retroAudio.playAsterisk();

        // Clicking anywhere on shutdown screen restarts
        shutScreen.onclick = () => {
            shutScreen.classList.add('hidden');
            window.retroAudio.playStartup();
        };
    }
}

// Setup System Tray
function setupSystemTray() {
    // Pop-ups closer button
    const popupsBtn = document.getElementById('tray-popups-btn');
    if (popupsBtn) {
        popupsBtn.onclick = () => {
            if (window.popupManager) window.popupManager.closeAllPopups();
        };
    }

    // Sound Mute Toggle
    const soundBtn = document.getElementById('tray-sound-btn');
    if (soundBtn) {
        soundBtn.innerHTML = RetroIcons.speaker;
        soundBtn.onclick = () => {
            const isMuted = window.retroAudio.toggleMute();
            soundBtn.innerHTML = isMuted ? RetroIcons.speakerMute : RetroIcons.speaker;
            if (!isMuted) window.retroAudio.playDing();
        };
    }

    // Degauss Button on Monitor Frame
    const degaussBtn = document.getElementById('tray-degauss-btn');
    if (degaussBtn) {
        degaussBtn.onclick = () => {
            window.glitchController.triggerDegauss();
        };
    }

    // CRT Scanlines Toggle
    const crtBtn = document.getElementById('tray-crt-btn');
    if (crtBtn) {
        crtBtn.onclick = () => {
            const crtOverlay = document.getElementById('crt-overlay');
            if (crtOverlay) {
                crtOverlay.classList.toggle('disabled');
                window.retroAudio.playClick();
            }
        };
    }
}
