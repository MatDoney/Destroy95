/**
 * Pixel-perfect retro icons for Windows 95/98 desktop and applications.
 * Clean SVGs with authentic 16-color/256-color retro palette.
 */
const RetroIcons = {
    // Windows 95 Start Flag
    startLogo: `
    <svg viewBox="0 0 16 16" width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="1" y="2" width="6" height="5" fill="#ff0000" />
        <rect x="8" y="2" width="6" height="5" fill="#00aa00" />
        <rect x="1" y="8" width="6" height="5" fill="#0000ff" />
        <rect x="8" y="8" width="6" height="5" fill="#ffcc00" />
        <path d="M0 1 L7 1 L7 14 L0 14 Z" fill="none" />
    </svg>`,

    // Poste de travail (My Computer)
    computer: `
    <svg viewBox="0 0 32 32" width="32" height="32" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="3" width="26" height="18" fill="#c0c0c0" stroke="#000000" stroke-width="1"/>
        <rect x="5" y="5" width="22" height="14" fill="#008080" />
        <rect x="7" y="7" width="18" height="10" fill="#000000" />
        <rect x="8" y="8" width="8" height="3" fill="#ffffff" opacity="0.3" />
        <rect x="12" y="21" width="8" height="4" fill="#808080" stroke="#000000"/>
        <rect x="6" y="25" width="20" height="4" fill="#c0c0c0" stroke="#000000"/>
        <rect x="20" y="26" width="3" height="1" fill="#00aa00" />
        <rect x="8" y="26" width="8" height="2" fill="#808080" />
    </svg>`,

    // Corbeille (Recycle Bin)
    recycleBin: `
    <svg viewBox="0 0 32 32" width="32" height="32" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="16" cy="6" rx="10" ry="3" fill="#808080" stroke="#000000"/>
        <path d="M6 6 L9 28 L23 28 L26 6 Z" fill="#c0c0c0" stroke="#000000"/>
        <line x1="11" y1="9" x2="13" y2="25" stroke="#808080" stroke-width="1.5"/>
        <line x1="16" y1="9" x2="16" y2="25" stroke="#808080" stroke-width="1.5"/>
        <line x1="21" y1="9" x2="19" y2="25" stroke="#808080" stroke-width="1.5"/>
        <path d="M12 14 L16 11 L20 14" stroke="#00aa00" stroke-width="2" fill="none"/>
        <path d="M19 16 L20 20 L16 18" stroke="#00aa00" stroke-width="2" fill="none"/>
        <path d="M13 20 L12 16 L15 17" stroke="#00aa00" stroke-width="2" fill="none"/>
    </svg>`,

    // Destructeur / Virus Clicker
    chaosEngine: `
    <svg viewBox="0 0 32 32" width="32" height="32" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="2" width="28" height="28" rx="3" fill="#111111" stroke="#ff0000" stroke-width="2"/>
        <circle cx="16" cy="16" r="10" fill="#220000" stroke="#ff3333" stroke-width="1.5"/>
        <circle cx="16" cy="16" r="3" fill="#ff0000" />
        <path d="M16 6 L16 11 M16 21 L16 26 M6 16 L11 16 M21 16 L26 16" stroke="#ff3333" stroke-width="2"/>
        <path d="M9 9 L12 12 M20 20 L23 23 M9 23 L12 20 M20 12 L23 9" stroke="#ff3333" stroke-width="1.5"/>
        <text x="16" y="29" font-size="6" fill="#ffff00" font-family="monospace" text-anchor="middle" font-weight="bold">VIRUS</text>
    </svg>`,

    // Démineur (Minesweeper)
    minesweeper: `
    <svg viewBox="0 0 32 32" width="32" height="32" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="3" width="26" height="26" fill="#c0c0c0" stroke="#000000"/>
        <rect x="4" y="4" width="24" height="24" fill="#c0c0c0" stroke="#ffffff" stroke-width="1"/>
        <circle cx="16" cy="17" r="7" fill="#000000"/>
        <circle cx="13" cy="14" r="1.5" fill="#ffffff"/>
        <line x1="16" y1="7" x2="16" y2="27" stroke="#000000" stroke-width="2"/>
        <line x1="6" y1="17" x2="26" y2="17" stroke="#000000" stroke-width="2"/>
        <line x1="9" y1="10" x2="23" y2="24" stroke="#000000" stroke-width="2"/>
        <line x1="9" y1="24" x2="23" y2="10" stroke="#000000" stroke-width="2"/>
        <rect x="18" y="6" width="3" height="3" fill="#ff0000" />
    </svg>`,

    // 3D Pinball Space Cadet
    pinball: `
    <svg viewBox="0 0 32 32" width="32" height="32" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="2" width="24" height="28" rx="2" fill="#0b1b3d" stroke="#c0c0c0" stroke-width="1.5"/>
        <circle cx="16" cy="10" r="4" fill="#ffcc00" stroke="#ff3300" stroke-width="1"/>
        <circle cx="10" cy="16" r="3" fill="#00ccff" stroke="#ffffff" stroke-width="0.5"/>
        <circle cx="22" cy="16" r="3" fill="#00ccff" stroke="#ffffff" stroke-width="0.5"/>
        <circle cx="19" cy="22" r="2.5" fill="#ffffff" />
        <polygon points="10,25 15,27 12,28" fill="#ff0000" stroke="#000000"/>
        <polygon points="22,25 17,27 20,28" fill="#ff0000" stroke="#000000"/>
        <line x1="25" y1="5" x2="25" y2="28" stroke="#ffaa00" stroke-width="1"/>
    </svg>`,

    // Paint
    paint: `
    <svg viewBox="0 0 32 32" width="32" height="32" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 14 C4 8 10 3 18 3 C25 3 29 8 29 15 C29 22 25 28 17 28 C12 28 10 26 8 26 C6 26 4 23 4 21 C4 19 6 18 6 16 C6 15 4 15 4 14 Z" fill="#dfdfdf" stroke="#000000"/>
        <circle cx="11" cy="9" r="2.5" fill="#ff0000"/>
        <circle cx="18" cy="7" r="2.5" fill="#ffff00"/>
        <circle cx="24" cy="12" r="2.5" fill="#00aa00"/>
        <circle cx="23" cy="19" r="2.5" fill="#0000ff"/>
        <circle cx="15" cy="23" r="2.5" fill="#aa00aa"/>
        <circle cx="10" cy="22" r="3" fill="#ffffff" stroke="#000000"/>
        <rect x="18" y="10" width="3" height="15" transform="rotate(-35 18 10)" fill="#8b5a2b" stroke="#000000"/>
        <polygon points="27,4 29,8 26,9" fill="#c0c0c0" stroke="#000000"/>
    </svg>`,

    // Défragmenteur de disque
    defrag: `
    <svg viewBox="0 0 32 32" width="32" height="32" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="3" width="28" height="26" fill="#c0c0c0" stroke="#000000"/>
        <rect x="4" y="5" width="24" height="22" fill="#ffffff" stroke="#808080"/>
        <!-- clusters -->
        <rect x="6" y="7" width="4" height="4" fill="#0000aa"/>
        <rect x="11" y="7" width="4" height="4" fill="#0000aa"/>
        <rect x="16" y="7" width="4" height="4" fill="#ff0000"/>
        <rect x="21" y="7" width="4" height="4" fill="#00aa00"/>
        <rect x="6" y="12" width="4" height="4" fill="#0000aa"/>
        <rect x="11" y="12" width="4" height="4" fill="#ffffff" stroke="#d0d0d0"/>
        <rect x="16" y="12" width="4" height="4" fill="#0000aa"/>
        <rect x="21" y="12" width="4" height="4" fill="#ff0000"/>
        <rect x="6" y="17" width="4" height="4" fill="#00aa00"/>
        <rect x="11" y="17" width="4" height="4" fill="#0000aa"/>
        <rect x="16" y="17" width="4" height="4" fill="#ffffff" stroke="#d0d0d0"/>
        <rect x="21" y="17" width="4" height="4" fill="#0000aa"/>
        <rect x="6" y="22" width="20" height="3" fill="#808080"/>
        <rect x="6" y="22" width="12" height="3" fill="#0000aa"/>
    </svg>`,

    // Internet Explorer 5
    internetExplorer: `
    <svg viewBox="0 0 32 32" width="32" height="32" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="12" fill="#1e73be" />
        <ellipse cx="16" cy="16" rx="14" ry="7" fill="none" stroke="#ffcc00" stroke-width="3" transform="rotate(-30 16 16)"/>
        <path d="M7 16 C7 11 12 7 17 7 C22 7 25 10 25 14 L11 14 C11 20 18 21 23 18 L24 21 C19 25 10 24 7 16 Z" fill="#ffffff"/>
        <path d="M12 12 L22 12 C21 9 18 9 16 9 C13 9 12 10 12 12 Z" fill="#1e73be"/>
    </svg>`,

    // Bloc-notes (Notepad)
    notepad: `
    <svg viewBox="0 0 32 32" width="32" height="32" xmlns="http://www.w3.org/2000/svg">
        <rect x="5" y="3" width="20" height="26" fill="#fdfdfd" stroke="#000000"/>
        <rect x="7" y="1" width="18" height="4" fill="#0080ff" stroke="#000000"/>
        <line x1="8" y1="8" x2="22" y2="8" stroke="#808080" stroke-width="1.5"/>
        <line x1="8" y1="12" x2="22" y2="12" stroke="#808080" stroke-width="1.5"/>
        <line x1="8" y1="16" x2="20" y2="16" stroke="#808080" stroke-width="1.5"/>
        <line x1="8" y1="20" x2="22" y2="20" stroke="#808080" stroke-width="1.5"/>
        <line x1="8" y1="24" x2="16" y2="24" stroke="#808080" stroke-width="1.5"/>
        <polygon points="18,21 27,27 25,29 17,23" fill="#ffcc00" stroke="#000000"/>
        <polygon points="17,23 18,21 16,21" fill="#000000"/>
    </svg>`,

    // Galerie Photos (Sample Pictures)
    gallery: `
    <svg viewBox="0 0 32 32" width="32" height="32" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="4" width="26" height="24" fill="#c0c0c0" stroke="#000000" stroke-width="1"/>
        <rect x="5" y="6" width="22" height="18" fill="#5c94fc" stroke="#808080"/>
        <circle cx="10" cy="11" r="3" fill="#ffff00"/>
        <polygon points="5,24 13,15 19,22 21,19 27,24" fill="#008000"/>
        <polygon points="14,24 19,18 27,24" fill="#00aa00"/>
        <rect x="5" y="24" width="22" height="2" fill="#808080"/>
    </svg>`,

    // Haut-parleur / Son
    speaker: `
    <svg viewBox="0 0 16 16" width="16" height="16" xmlns="http://www.w3.org/2000/svg">
        <polygon points="1,6 4,6 8,2 8,14 4,10 1,10" fill="#000000"/>
        <path d="M10 5 C12 6.5 12 9.5 10 11" stroke="#000000" stroke-width="1.5" fill="none"/>
        <path d="M12 3 C15 5.5 15 10.5 12 13" stroke="#000000" stroke-width="1.5" fill="none"/>
    </svg>`,

    // Haut-parleur muet
    speakerMute: `
    <svg viewBox="0 0 16 16" width="16" height="16" xmlns="http://www.w3.org/2000/svg">
        <polygon points="1,6 4,6 8,2 8,14 4,10 1,10" fill="#808080"/>
        <line x1="10" y1="5" x2="15" y2="11" stroke="#ff0000" stroke-width="2"/>
        <line x1="15" y1="5" x2="10" y2="11" stroke="#ff0000" stroke-width="2"/>
    </svg>`,

    // Erreur critique (Red X circle)
    errorBadge: `
    <svg viewBox="0 0 32 32" width="32" height="32" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="14" fill="#cc0000" stroke="#000000" stroke-width="1.5"/>
        <line x1="9" y1="9" x2="23" y2="23" stroke="#ffffff" stroke-width="4" stroke-linecap="round"/>
        <line x1="23" y1="9" x2="9" y2="23" stroke="#ffffff" stroke-width="4" stroke-linecap="round"/>
    </svg>`,

    // Avertissement (Yellow Warning Triangle)
    warningBadge: `
    <svg viewBox="0 0 32 32" width="32" height="32" xmlns="http://www.w3.org/2000/svg">
        <polygon points="16,3 30,28 2,28" fill="#ffcc00" stroke="#000000" stroke-width="2"/>
        <line x1="16" y1="11" x2="16" y2="20" stroke="#000000" stroke-width="3" stroke-linecap="round"/>
        <circle cx="16" cy="24" r="1.8" fill="#000000"/>
    </svg>`,

    // Information (Blue 'i' circle)
    infoBadge: `
    <svg viewBox="0 0 32 32" width="32" height="32" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="14" fill="#0000aa" stroke="#000000" stroke-width="1.5"/>
        <circle cx="16" cy="10" r="2" fill="#ffffff"/>
        <rect x="14" y="14" width="4" height="10" fill="#ffffff"/>
        <rect x="12" y="14" width="3" height="2" fill="#ffffff"/>
        <rect x="12" y="22" width="8" height="2" fill="#ffffff"/>
    </svg>`,

    // Disquette 3.5" (Floppy)
    floppy: `
    <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="2" width="20" height="20" rx="1" fill="#1a1a5a" stroke="#000000"/>
        <rect x="5" y="2" width="14" height="9" fill="#dcdcdc" stroke="#808080"/>
        <rect x="7" y="4" width="3" height="5" fill="#000000"/>
        <rect x="5" y="14" width="14" height="7" fill="#ffffff"/>
        <line x1="7" y1="16" x2="17" y2="16" stroke="#0000aa" stroke-width="1.5"/>
        <line x1="7" y1="18" x2="14" y2="18" stroke="#ff0000" stroke-width="1.5"/>
    </svg>`,

    // CD-ROM
    cdrom: `
    <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" fill="#c0c0d0" stroke="#000000"/>
        <circle cx="12" cy="12" r="6" fill="#a0a0c0"/>
        <circle cx="12" cy="12" r="3" fill="#ffffff" stroke="#808080"/>
        <circle cx="12" cy="12" r="1.5" fill="#000000"/>
        <path d="M12 2 A10 10 0 0 1 20 6" stroke="#ffaa00" stroke-width="1" fill="none"/>
        <path d="M4 18 A10 10 0 0 1 8 21" stroke="#00aaff" stroke-width="1" fill="none"/>
    </svg>`,

    // Clippy Le Trombone
    clippy: `
    <svg viewBox="0 0 40 50" width="40" height="50" xmlns="http://www.w3.org/2000/svg">
        <!-- Paperclip wire body -->
        <path d="M22 45 L14 45 C8 45 4 40 4 33 L4 16 C4 8 10 2 19 2 C28 2 34 8 34 17 L34 35 C34 40 30 44 25 44 C20 44 16 40 16 35 L16 19 C16 16 18 14 21 14 C24 14 26 16 26 19 L26 33" 
              fill="none" stroke="#777777" stroke-width="3.5" stroke-linecap="round"/>
        <path d="M22 45 L14 45 C8 45 4 40 4 33 L4 16 C4 8 10 2 19 2 C28 2 34 8 34 17 L34 35 C34 40 30 44 25 44 C20 44 16 40 16 35 L16 19 C16 16 18 14 21 14 C24 14 26 16 26 19 L26 33" 
              fill="none" stroke="#dcdcdc" stroke-width="2" stroke-linecap="round"/>
        <!-- Big Googly Eyes -->
        <ellipse cx="14" cy="14" rx="5" ry="6" fill="#ffffff" stroke="#000000" stroke-width="1.5"/>
        <ellipse cx="24" cy="14" rx="5" ry="6" fill="#ffffff" stroke="#000000" stroke-width="1.5"/>
        <!-- Pupils looking down-right -->
        <circle cx="15" cy="15" r="2.5" fill="#000000"/>
        <circle cx="25" cy="15" r="2.5" fill="#000000"/>
        <!-- Expressive Eyebrows -->
        <path d="M10 7 Q14 5 18 8" stroke="#000000" stroke-width="2" fill="none"/>
        <path d="M20 8 Q24 5 28 7" stroke="#000000" stroke-width="2" fill="none"/>
    </svg>`
};
