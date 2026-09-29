/**
 * Windows 95 / 2000 Popup Storm & Parody Ads Manager
 * Generates authentic late 90s / early 2000s spam and pop-up ads with retro visual banners & parody images:
 * Singles in your area, lotteries, virility boosters, miracle diets, psychics, casinos, Nigerian prince, etc.
 * (Zero computer or tech references in the ad texts - 100% SFW Parodies!)
 */

class PopupManager {
    constructor() {
        this.popups = new Map(); // id -> element
        this.counter = 0;
        this.maxPopups = 18;
        this.lastAutoSpawn = 0;

        this.adTemplates = [
            {
                id: 'hot_singles',
                title: '🔥 FEMMES CHAUDES CÉLIBATAIRES DANS TA VILLE !',
                tag: 'RENCONTRE DISCRÈTE SANS LENDEMAIN',
                ageBadge: 'INTERDIT AUX -18 ANS',
                photoTag: 'PHOTO VÉRIFIÉE',
                flame: '🔥',
                marquee: 'Magali et Sophie sont seules ce soir à moins de 2 kilomètres de ton domicile ! Réponds vite avant qu\'elles ne se déconnectent !',
                msg: '« Magali (28 ans) et Sophie (34 ans) sont seules ce soir à quelques rues de chez toi. Elles recherchent un homme charmant sans prise de tête. Réponds vite avant qu\'elles ne partent ! »',
                btnText: '💬 VOIR LES PROFILS DES VOISINES',
                reward: 1800,
                theme: 'hot'
            },
            {
                id: 'male_enlarge',
                title: '🍆 AUGMENTEZ VOTRE VIRILITÉ DE +8 CM EN 14 JOURS !',
                tag: 'SECRET DES ACTEURS DU CINÉMA',
                ageBadge: 'SECRET MÉDICAL',
                photoTag: 'AVIS DOCTEUR',
                flame: '🍆',
                marquee: 'Formule exclusive à base de plantes rares d\'Amazonie ! Résultats garantis dès la première semaine ! 100% naturel !',
                msg: '« Vous manquez d\'assurance dans l\'intimité ? Découvrez la formule exclusive à base de plantes rares d\'Amazonie qui transforme n\'importe quel homme en bête d\'endurance toute la nuit ! »',
                btnText: '💪 OBTENIR MON FLACON D\'ESSAI',
                reward: 2200,
                theme: 'growth'
            },
            {
                id: 'lottery_winner',
                title: '🎰 FÉLICITATIONS ! VOUS AVEZ GAGNÉ 50 000 € !',
                tag: 'TIRAGE AU SORT OFFICIEL CERTIFIÉ',
                ageBadge: 'OFFICIEL HUISSIER',
                photoTag: 'CHÈQUE PRÊT',
                flame: '🎰',
                marquee: 'Vous êtes le 1 000 000e visiteur certifié ! Votre chèque de cinquante mille euros vous attend immédiatement !',
                msg: '« Votre code postal a été sélectionné pour le grand tirage exceptionnel ! Un chèque de cinquante mille euros vous attend. Confirmez vos coordonnées immédiatement pour l\'encaissement ! »',
                btnText: '🎁 RÉCLAMER MON CHÈQUE DE 50 000 €',
                reward: 2500,
                theme: 'gold'
            },
            {
                id: 'psychic_irma',
                title: '🔮 MADAME IRMA : VOTRE AVENIR AMOUREUX DÉVOILÉ !',
                tag: 'VOYANCE ET CLAIRVOYANCE 24H/24',
                ageBadge: 'RÉVÉLATIONS',
                photoTag: 'EN DIRECT',
                flame: '🔮',
                marquee: 'Une personne du passé pense à vous nuit et jour ! Découvrez son prénom et ses sentiments cachés dès maintenant !',
                msg: '« Je ressens une puissante énergie autour de vous... Une personne secrète pense à vous nuit et jour et s\'apprête à vous faire une déclaration passionnée très bientôt ! »',
                btnText: '👁️ DÉCOUVRIR QUI VOUS AIME EN SECRET',
                reward: 1700,
                theme: 'pink'
            },
            {
                id: 'miracle_diet',
                title: '💊 PERDEZ 14 KG EN DORMANT SANS AUCUN EFFORT !',
                tag: 'LE REMÈDE QUE LES NUTRITIONNISTES CACHENT',
                ageBadge: '14 JOURS CHRONO',
                photoTag: 'AVANT / APRÈS',
                flame: '💊',
                marquee: 'Finis les régimes épuisants et le sport à la salle ! Brûlez les graisses pendant votre sommeil avec l\'extrait d\'ananas sauvage !',
                msg: '« Finis les régimes épuisants et les heures de sport à la salle ! Cette formule exclusive brûle les graisses pendant votre sommeil grâce à l\'extrait concentré d\'ananas sauvage. »',
                btnText: '👙 COMMENCER MA TRANSFORMATION MINCEUR',
                reward: 1900,
                theme: 'growth'
            },
            {
                id: 'caribbean_trip',
                title: '✈️ GAGNEZ UN VOYAGE DE RÊVE AUX CARAÏBES POUR 2 !',
                tag: 'SÉJOUR TOUT COMPRIS HÔTEL 5 ÉTOILES',
                ageBadge: 'TOUT COMPRIS',
                photoTag: 'SÉJOUR VIP',
                flame: '✈️',
                marquee: 'Plages de sable blanc, mer turquoise et cocktails à volonté sous les tropiques ! Vos billets d\'avion première classe sont réservés !',
                msg: '« Plages paradisiaques, soleil tropical et service tout compris sous les cocotiers ! Votre billet d\'avion aller-retour en première classe est pré-réservé. Validez vite ! »',
                btnText: '🏖️ S\'ENVOLER SOUS LES TROPIQUES',
                reward: 2400,
                theme: 'cyan'
            },
            {
                id: 'strip_club',
                title: '👙 VIP CLUB : STRIPTEASE PRIVÉ EN DIRECT !',
                tag: 'ENTRÉE GRATUITE AVANT MINUIT',
                ageBadge: 'CARRÉ VIP',
                photoTag: 'PARODIE SFW',
                flame: '👙',
                marquee: 'Ambiance feutrée, champagne à discrétion et show exclusif ! Les plus belles créatures réunies dans le salon VIP ce soir !',
                msg: '« Les plus belles créatures sont réunies ce soir dans le carré VIP ! Entrée libre et vestiaire offert aux 50 premiers arrivés. Ambiance feutrée et champagne à discrétion toute la soirée ! »',
                btnText: '💃 ENTRER DANS LE SALON VIP',
                reward: 2600,
                theme: 'strip'
            },
            {
                id: 'married_discreet',
                title: '🥵 FEMMES MARIÉES EN QUÊTE D\'AVENTURES DISCRÈTES',
                tag: '100% ANONYME ET SANS ENGAGEMENT',
                ageBadge: 'DISCRET',
                photoTag: 'CONFIDENTIEL',
                flame: '🥵',
                marquee: 'Elles s\'ennuient le soir et recherchent un complice charmant pour pimenter leur quotidien sans laisser la moindre trace !',
                msg: '« Elles ont une vie bien rangée mais s\'ennuient le soir... Rejoignez notre club privé d\'adultes consentants pour pimenter votre quotidien sans jamais laisser de traces ! »',
                btnText: '💋 ACCÉDER AUX ANNONCES SECRÈTES',
                reward: 2300,
                theme: 'hot'
            },
            {
                id: 'prince_heritage',
                title: '💰 HÉRITAGE MILLIONNAIRE D\'UN PRINCE ÉTRANGER',
                tag: 'TRANSFERT DE FONDS CONFIDENTIEL URGENT',
                ageBadge: 'SCEAU ROYAL',
                photoTag: 'OFFICIEL',
                flame: '💰',
                marquee: 'Fortune de 4 500 000 USD en attente de transfert ! Vous percevrez une commission de 30% dès validation de vos coordonnées !',
                msg: '« Cher ami, j\'ai besoin d\'une personne de confiance pour transférer la fortune de feu mon oncle. Vous toucherez 30% de la somme totale en retour de votre assistance immédiate. »',
                btnText: '💳 ENCAISSER MA PART DU VIREMENT',
                reward: 3000,
                theme: 'gold'
            },
            {
                id: 'fidelity_test',
                title: '🚨 TEST DE FIDÉLITÉ : TON PARTENAIRE TE TROMPE-T-IL ?',
                tag: 'DÉCOUVREZ LA VÉRITÉ DÈS CE SOIR',
                ageBadge: 'ALERTE COUPLE',
                photoTag: 'PREUVE N°1',
                flame: '🚨',
                marquee: 'Des retards suspects ? Des appels tardifs ? Répondez à 3 questions confidentielles et découvrez la vérité immédiatement !',
                msg: '« Des retards inexpliqués ? Des appels secrets en pleine nuit ? Répondez à 3 questions simples et découvrez immédiatement si votre conjoint mène une double vie secrète ! »',
                btnText: '🔍 DÉCOUVRIR LA VÉRITÉ MAINTENANT',
                reward: 1600,
                theme: 'alert'
            },
            {
                id: 'las_vegas_casino',
                title: '🎲 CASINO ROYAL : 500 TOURS DE ROULETTE OFFERTS !',
                tag: 'JACKPOT DE 1 000 000 $ EN JEU',
                ageBadge: '100% GRATUIT',
                photoTag: 'JACKPOT !',
                flame: '🎲',
                marquee: 'Aucun dépôt requis ! 500 tours gratuits sur nos machines à sous et roulette royale ! Les gains sont payés comptant !',
                msg: '« Aucun dépôt d\'argent requis ! Jouez gratuitement à la roulette, au blackjack et aux machines à sous. Les gains sont réels et virés directement sur votre compte ! »',
                btnText: '🎲 DÉCROCHER LE GROS LOT DU CASINO',
                reward: 2700,
                theme: 'gold'
            },
            {
                id: 'luxury_car',
                title: '🚗 GAGNEZ UNE BERLINE DE LUXE TOUT CONFORT !',
                tag: 'JEU CONCOURS AUTOMOBILE DE L\'ANNÉE',
                ageBadge: 'VÉHICULE NEUF',
                photoTag: 'CLÉS EN MAIN',
                flame: '🚗',
                marquee: 'Climatisation automatique, intérieur cuir, moteur V8 et jantes chromées ! Votre ticket gagnant est prêt à être validé !',
                msg: '« Climatisation automatique, sièges chauffants en cuir et jantes en alliage. Le véhicule de prestige est prêt pour la livraison chez votre concessionnaire. Validez votre ticket ! »',
                btnText: '🏎️ MONTER AU VOLANT DU VÉHICULE',
                reward: 2800,
                theme: 'orange'
            },
            {
                id: 'private_chat',
                title: '💋 CHAT DIRECT : CÉLINE EST SEULE DANS SA CHAMBRE',
                tag: 'DIALOGUE PRIVÉ EN TÊTE-À-TÊTE CE SOIR',
                ageBadge: 'EN DIRECT',
                photoTag: 'WEBCAM 23:42',
                flame: '💋',
                marquee: 'Céline est connectée sur sa webcam et attend ton message ! Conversation privée en tête-à-tête jusqu\'au bout de la nuit !',
                msg: '« Céline (24 ans) n\'arrive pas à dormir et cherche un homme passionné pour une conversation intime jusqu\'au petit matin. Envoie-lui un mot doux dès maintenant ! »',
                btnText: '💌 LUI ENVOYER UN MESSAGE COQUIN',
                reward: 2100,
                theme: 'strip'
            },
            {
                id: 'villa_auction',
                title: '🏡 VILLAS DE LUXE AUX ENCHÈRES À PARTIR DE 1 € !',
                tag: 'SAISIES IMMOBILIÈRES EXCEPTIONNELLES',
                ageBadge: 'SOLDE FLASH',
                photoTag: 'PISCINE PRIVÉE',
                flame: '🏡',
                marquee: 'Des propriétés de rêve avec piscine olympique, vue mer et jardin paysager bradées pour une bouchée de pain ! Consultez la liste !',
                msg: '« Des propriétés de grand standing avec jardin paysager et piscine olympique cédées pour une bouchée de pain ! Consultez sans attendre la liste des biens disponibles. »',
                btnText: '🔑 VISITER MA FUTURE VILLA',
                reward: 2000,
                theme: 'cyan'
            },
            {
                id: 'hot_camera',
                title: '📹 WEBCAM COQUINE : LA VOISINE DU 3e EN DIRECT !',
                tag: 'CAMÉRA EN DIRECT DU QUARTIER',
                ageBadge: 'PARODIE SFW',
                photoTag: 'CAM EN DIRECT',
                flame: '📹',
                marquee: 'Mireille arrose ses géraniums en peignoir léopard sans savoir que sa webcam tourne ! Regardez le flux 160x120 en direct !',
                msg: '« Mireille (45 ans) arrose ses géraniums en peignoir léopard et chaussons roses ! Clique vite pour ouvrir le flux vidéo en direct de la webcam du salon ! »',
                btnText: '📹 OUVRIR LE FLUX WEBCAM DU SALON',
                reward: 2250,
                theme: 'hot'
            },
            {
                id: 'love_calculator',
                title: '💘 TEST D\'AMOUR SCIENTIFIQUE 100% INFAILLIBLE !',
                tag: 'CALCUL DE COMPATIBILITÉ PASSIONNÉE',
                ageBadge: '100% FIABLE',
                photoTag: 'COUP DE FOUDRE',
                flame: '💘',
                marquee: 'Découvrez si votre flamme secrète ressent la même passion ardente que vous ! Entrez vos deux prénoms pour le résultat !',
                msg: '« Entre ton prénom et celui de ton coup de cœur secret pour savoir si c\'est le grand amour éternel ou juste une passion passagère d\'un été brûlant ! »',
                btnText: '💘 CALCULER NOTRE COMPATIBILITÉ',
                reward: 1950,
                theme: 'pink'
            }
        ];
    }

    // Returns a retro 90s-style illustrated banner SVG (320x80) for each parody ad
    getBannerIllustration(adId) {
        switch (adId) {
            case 'hot_singles':
                return `
                <svg viewBox="0 0 320 80" width="100%" height="80" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <linearGradient id="b_singles" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stop-color="#4a0022"/>
                            <stop offset="50%" stop-color="#a0003c"/>
                            <stop offset="100%" stop-color="#ff0055"/>
                        </linearGradient>
                    </defs>
                    <rect width="320" height="80" fill="url(#b_singles)"/>
                    <!-- 90s scanlines -->
                    <line x1="0" y1="20" x2="320" y2="20" stroke="#000" stroke-width="0.5" opacity="0.3"/>
                    <line x1="0" y1="40" x2="320" y2="40" stroke="#000" stroke-width="0.5" opacity="0.3"/>
                    <line x1="0" y1="60" x2="320" y2="60" stroke="#000" stroke-width="0.5" opacity="0.3"/>
                    <!-- Silhouette party girls -->
                    <circle cx="35" cy="28" r="13" fill="#ffccaa"/>
                    <path d="M22 45 C22 36 48 36 48 45 L52 80 L18 80 Z" fill="#ff007f"/>
                    <path d="M26 18 C18 18 18 36 24 40" stroke="#440022" stroke-width="4" fill="none"/>
                    <!-- Girl 2 -->
                    <circle cx="75" cy="30" r="12" fill="#ffd5b5"/>
                    <path d="M62 48 C62 38 88 38 88 48 L92 80 L58 80 Z" fill="#9900ff"/>
                    <!-- Cocktails -->
                    <polygon points="98,38 112,38 105,50" fill="#ffff00"/>
                    <line x1="105" y1="50" x2="105" y2="62" stroke="#ffffff" stroke-width="2"/>
                    <line x1="99" y1="62" x2="111" y2="62" stroke="#ffffff" stroke-width="2"/>
                    <!-- Live webcam badge -->
                    <rect x="125" y="8" width="185" height="18" rx="3" fill="#000000" stroke="#ff0055" stroke-width="1"/>
                    <circle cx="135" cy="17" r="4" fill="#ff0000"/>
                    <text x="145" y="21" font-family="'Arial Black', sans-serif" font-size="9" fill="#00ffcc">● EN DIRECT : À MOINS DE 2 KM !</text>
                    <!-- Slogan -->
                    <text x="125" y="44" font-family="'Arial Black', sans-serif" font-weight="900" font-size="15" fill="#ffff00" stroke="#000" stroke-width="0.5">FEMMES SEULES CE SOIR !</text>
                    <text x="125" y="61" font-family="Arial, sans-serif" font-weight="bold" font-size="11" fill="#ffffff">Magali (28 ans) &amp; Sophie (34 ans)</text>
                    <text x="125" y="74" font-family="Arial, sans-serif" font-size="9" fill="#ffddaa">★ 100% Anonyme &amp; Gratuit pour hommes ★</text>
                </svg>`;

            case 'male_enlarge':
                return `
                <svg viewBox="0 0 320 80" width="100%" height="80" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <linearGradient id="b_growth" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stop-color="#002b0c"/>
                            <stop offset="50%" stop-color="#006622"/>
                            <stop offset="100%" stop-color="#11aa33"/>
                        </linearGradient>
                    </defs>
                    <rect width="320" height="80" fill="url(#b_growth)"/>
                    <!-- Muscular cartoon aubergine -->
                    <ellipse cx="40" cy="45" rx="16" ry="26" fill="#660099" stroke="#440066" stroke-width="1.5"/>
                    <polygon points="35,18 45,18 40,8" fill="#00aa00"/>
                    <!-- Bicep arms flexing -->
                    <path d="M26 40 C14 36 10 26 20 22 C26 20 30 30 26 36" fill="#ffccaa" stroke="#aa6644" stroke-width="1.5"/>
                    <path d="M54 40 C66 36 70 26 60 22 C54 20 50 30 54 36" fill="#ffccaa" stroke="#aa6644" stroke-width="1.5"/>
                    <!-- Sunglasses on eggplant -->
                    <rect x="28" y="32" width="11" height="6" rx="2" fill="#000000"/>
                    <rect x="41" y="32" width="11" height="6" rx="2" fill="#000000"/>
                    <line x1="39" y1="34" x2="41" y2="34" stroke="#000" stroke-width="1.5"/>
                    <!-- Measuring tape ruler -->
                    <rect x="85" y="10" width="225" height="18" fill="#ffea00" stroke="#000000" stroke-width="1.5"/>
                    <line x1="95" y1="10" x2="95" y2="20" stroke="#000" stroke-width="2"/>
                    <text x="92" y="26" font-size="7" font-weight="bold" fill="#000">4cm</text>
                    <line x1="145" y1="10" x2="145" y2="18" stroke="#000" stroke-width="1"/>
                    <line x1="205" y1="10" x2="205" y2="18" stroke="#000" stroke-width="1"/>
                    <line x1="285" y1="10" x2="285" y2="22" stroke="#ff0000" stroke-width="3"/>
                    <text x="268" y="26" font-size="8" font-weight="bold" fill="#ff0000">+32cm !</text>
                    <!-- Text banner -->
                    <text x="85" y="47" font-family="'Arial Black', sans-serif" font-size="15" fill="#66ff66" stroke="#000" stroke-width="0.5">+8 CM EN 14 JOURS !</text>
                    <text x="85" y="63" font-family="Arial, sans-serif" font-weight="bold" font-size="11" fill="#ffffff">SECRET NATUREL D'AMAZONIE</text>
                    <text x="85" y="75" font-family="Arial, sans-serif" font-size="9" fill="#ffff88">★ Approuvé par 9/10 spécialistes masculins ★</text>
                </svg>`;

            case 'lottery_winner':
                return `
                <svg viewBox="0 0 320 80" width="100%" height="80" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <linearGradient id="b_gold" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stop-color="#7a5500"/>
                            <stop offset="50%" stop-color="#ffd700"/>
                            <stop offset="100%" stop-color="#b8860b"/>
                        </linearGradient>
                    </defs>
                    <rect width="320" height="80" fill="#151515"/>
                    <rect x="3" y="3" width="314" height="74" fill="url(#b_gold)" stroke="#ffffff" stroke-width="1.5"/>
                    <!-- Novelty bank check -->
                    <rect x="12" y="14" width="85" height="52" fill="#fffdf0" stroke="#333" stroke-width="1"/>
                    <rect x="16" y="18" width="77" height="6" fill="#cc0000"/>
                    <text x="54" y="23" font-family="Arial, sans-serif" font-size="5" font-weight="bold" fill="#ffffff" text-anchor="middle">CHÈQUE GAGNANT</text>
                    <text x="54" y="38" font-family="'Arial Black', sans-serif" font-size="11" fill="#2e7d32" text-anchor="middle">50 000 €</text>
                    <text x="54" y="48" font-family="'Courier New', monospace" font-size="5" fill="#333" text-anchor="middle">PAYABLE AU PORTEUR</text>
                    <line x1="20" y1="56" x2="80" y2="56" stroke="#b8860b" stroke-width="1"/>
                    <!-- Headline banner -->
                    <rect x="110" y="10" width="195" height="22" fill="#cc0000" rx="3"/>
                    <text x="207" y="26" font-family="'Arial Black', sans-serif" font-size="14" fill="#ffffff" text-anchor="middle">GAGNANT DU JOUR !</text>
                    <text x="110" y="47" font-family="Arial, sans-serif" font-weight="bold" font-size="12" fill="#000000">CHÈQUE DE 50 000 € EN ATTENTE</text>
                    <text x="110" y="62" font-family="Arial, sans-serif" font-size="10" fill="#222222">Tirage certifié officiel par huissier de justice</text>
                    <text x="110" y="74" font-family="Arial, sans-serif" font-weight="bold" font-size="9" fill="#880000">▶ Cliquez pour confirmer vos coordonnées !</text>
                </svg>`;

            case 'psychic_irma':
                return `
                <svg viewBox="0 0 320 80" width="100%" height="80" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <radialGradient id="b_crystal" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stop-color="#ffffff"/>
                            <stop offset="40%" stop-color="#00ffff"/>
                            <stop offset="80%" stop-color="#6600cc"/>
                            <stop offset="100%" stop-color="#15002a"/>
                        </radialGradient>
                    </defs>
                    <rect width="320" height="80" fill="#15002a"/>
                    <!-- Crystal ball -->
                    <circle cx="50" cy="40" r="28" fill="url(#b_crystal)"/>
                    <ellipse cx="50" cy="70" rx="20" ry="5" fill="#888888"/>
                    <!-- Glowing eye & lightning inside ball -->
                    <ellipse cx="50" cy="40" rx="10" ry="6" fill="#ffffff" opacity="0.85"/>
                    <circle cx="50" cy="40" r="4" fill="#ff00aa"/>
                    <path d="M35 30 L45 38 L42 42 L55 50" stroke="#ffff00" stroke-width="1.5" fill="none"/>
                    <!-- Sparkles -->
                    <text x="18" y="22" fill="#ffff00" font-size="12">✦</text>
                    <text x="78" y="24" fill="#ffff00" font-size="10">★</text>
                    <!-- Text banner -->
                    <text x="100" y="26" font-family="'Georgia', serif" font-weight="bold" font-size="15" fill="#ff77ff">MADAME IRMA : CLAIRVOYANCE</text>
                    <text x="100" y="46" font-family="Arial, sans-serif" font-weight="bold" font-size="12" fill="#00ffff">« IL PENSE À VOUS CE SOIR... »</text>
                    <text x="100" y="62" font-family="Arial, sans-serif" font-size="10" fill="#e0c0ff">Une déclaration d'amour secrète imminente !</text>
                    <text x="100" y="74" font-family="Arial, sans-serif" font-weight="bold" font-size="9" fill="#ffff00">★ 1ère consultation 100% offerte en direct ★</text>
                </svg>`;

            case 'miracle_diet':
                return `
                <svg viewBox="0 0 320 80" width="100%" height="80" xmlns="http://www.w3.org/2000/svg">
                    <rect width="320" height="80" fill="#1e4620"/>
                    <!-- Cartoon pineapple smiling -->
                    <ellipse cx="45" cy="48" rx="20" ry="26" fill="#ffaa00" stroke="#cc7700" stroke-width="1.5"/>
                    <polygon points="45,12 38,28 52,28" fill="#00aa00"/>
                    <polygon points="32,16 38,28 45,28" fill="#008800"/>
                    <polygon points="58,16 52,28 45,28" fill="#008800"/>
                    <!-- Sunglasses on pineapple -->
                    <rect x="33" y="38" width="10" height="7" rx="2" fill="#000000"/>
                    <rect x="47" y="38" width="10" height="7" rx="2" fill="#000000"/>
                    <line x1="43" y1="41" x2="47" y2="41" stroke="#000" stroke-width="2"/>
                    <path d="M38 56 Q45 62 52 56" stroke="#990000" stroke-width="2.5" fill="none"/>
                    <!-- Tape measure badge -->
                    <rect x="80" y="12" width="95" height="56" rx="4" fill="#ffffff" stroke="#ffaa00" stroke-width="1.5"/>
                    <text x="127" y="34" font-family="'Arial Black', sans-serif" font-size="18" fill="#cc0000" text-anchor="middle">-14 KG</text>
                    <text x="127" y="52" font-family="Arial, sans-serif" font-weight="bold" font-size="10" fill="#222" text-anchor="middle">EN DORMANT !</text>
                    <text x="127" y="63" font-family="Arial, sans-serif" font-size="8" fill="#008800" text-anchor="middle">100% ANANAS</text>
                    <!-- Features -->
                    <text x="190" y="28" font-family="Arial, sans-serif" font-weight="bold" font-size="12" fill="#66ff66">✓ 0% D'EFFORT</text>
                    <text x="190" y="46" font-family="Arial, sans-serif" font-weight="bold" font-size="12" fill="#ffff00">✓ SANS SPORT</text>
                    <text x="190" y="64" font-family="Arial, sans-serif" font-size="10" fill="#ffffff">Formule exclusive de nuit</text>
                </svg>`;

            case 'caribbean_trip':
                return `
                <svg viewBox="0 0 320 80" width="100%" height="80" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <linearGradient id="b_carib" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stop-color="#ff6600"/>
                            <stop offset="45%" stop-color="#ffbb00"/>
                            <stop offset="70%" stop-color="#00aaff"/>
                            <stop offset="100%" stop-color="#005588"/>
                        </linearGradient>
                    </defs>
                    <rect width="320" height="80" fill="url(#b_carib)"/>
                    <!-- Tropical sun & island -->
                    <circle cx="70" cy="35" r="16" fill="#ffffff" opacity="0.9"/>
                    <path d="M40 75 Q45 50 42 28" stroke="#552b00" stroke-width="4" fill="none"/>
                    <path d="M42 28 Q30 20 15 28" stroke="#007700" stroke-width="3" fill="none"/>
                    <path d="M42 28 Q50 16 65 22" stroke="#007700" stroke-width="3" fill="none"/>
                    <path d="M42 28 Q42 14 35 6" stroke="#00aa00" stroke-width="3" fill="none"/>
                    <!-- Airplane -->
                    <polygon points="105,18 122,14 116,23" fill="#ffffff"/>
                    <!-- Text banner -->
                    <rect x="130" y="8" width="175" height="64" fill="rgba(0,0,0,0.65)" rx="4"/>
                    <text x="217" y="27" font-family="'Arial Black', sans-serif" font-size="14" fill="#ffff00" text-anchor="middle">SÉJOUR CARAÏBES</text>
                    <text x="217" y="45" font-family="Arial, sans-serif" font-weight="bold" font-size="11" fill="#ffffff" text-anchor="middle">HÔTEL 5 ÉTOILES POUR 2</text>
                    <text x="217" y="60" font-family="Arial, sans-serif" font-size="10" fill="#00ffcc" text-anchor="middle">★ Plage privée &amp; Cocktails ★</text>
                </svg>`;

            case 'strip_club':
                return `
                <svg viewBox="0 0 320 80" width="100%" height="80" xmlns="http://www.w3.org/2000/svg">
                    <rect width="320" height="80" fill="#0d001a"/>
                    <!-- Neon disco ball -->
                    <circle cx="45" cy="36" r="18" fill="#331144" stroke="#ff00ff" stroke-width="2"/>
                    <line x1="45" y1="0" x2="45" y2="18" stroke="#ff00ff" stroke-width="1.5"/>
                    <path d="M35 30 L55 30 M30 36 L60 36 M35 42 L55 42" stroke="#00ffff" stroke-width="1"/>
                    <!-- Dancing silhouette with bunny ears -->
                    <circle cx="85" cy="22" r="7" fill="#ff00aa"/>
                    <polygon points="82,15 84,6 87,15" fill="#ff00aa"/>
                    <polygon points="86,15 88,6 91,15" fill="#ff00aa"/>
                    <path d="M85 29 C85 24 95 24 95 29 C95 36 88 40 88 48 L88 75" stroke="#ff00aa" stroke-width="4" stroke-linecap="round" fill="none"/>
                    <path d="M78 38 L98 32" stroke="#00ffff" stroke-width="3" stroke-linecap="round"/>
                    <!-- Neon Sign -->
                    <text x="125" y="32" font-family="'Arial Black', sans-serif" font-size="17" fill="#ff00aa" stroke="#ffffff" stroke-width="0.5">VIP NIGHT CLUB</text>
                    <text x="125" y="52" font-family="Arial, sans-serif" font-weight="bold" font-size="12" fill="#00ffff">STRIPTEASE EN DIRECT</text>
                    <text x="125" y="69" font-family="Arial, sans-serif" font-size="10" fill="#ffff00">★ 100% SFW PARODY • Entrée gratuite ★</text>
                </svg>`;

            case 'married_discreet':
                return `
                <svg viewBox="0 0 320 80" width="100%" height="80" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <linearGradient id="b_mask" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stop-color="#330010"/>
                            <stop offset="100%" stop-color="#770020"/>
                        </linearGradient>
                    </defs>
                    <rect width="320" height="80" fill="url(#b_mask)"/>
                    <!-- Venetian masks -->
                    <path d="M25 38 C25 24 55 24 55 38 C55 48 42 51 40 43 C38 51 25 48 25 38 Z" fill="#b8860b" stroke="#ffd700" stroke-width="1.5"/>
                    <circle cx="33" cy="36" r="4" fill="#110005"/>
                    <circle cx="47" cy="36" r="4" fill="#110005"/>
                    <path d="M55 43 C55 29 85 29 85 43 C85 53 72 56 70 48 C68 56 55 53 55 43 Z" fill="#cc0033" stroke="#ff4466" stroke-width="1.5"/>
                    <circle cx="63" cy="41" r="4" fill="#110005"/>
                    <circle cx="77" cy="41" r="4" fill="#110005"/>
                    <!-- Text banner -->
                    <text x="110" y="28" font-family="'Georgia', serif" font-weight="bold" font-size="14" fill="#ffd700">RENCONTRES DISCRÈTES</text>
                    <text x="110" y="47" font-family="Arial, sans-serif" font-weight="bold" font-size="12" fill="#ffffff">FEMMES MARIÉES DU COIN</text>
                    <text x="110" y="65" font-family="Arial, sans-serif" font-size="10" fill="#ff99aa">100% Anonyme &amp; Sans lendemain</text>
                </svg>`;

            case 'prince_heritage':
                return `
                <svg viewBox="0 0 320 80" width="100%" height="80" xmlns="http://www.w3.org/2000/svg">
                    <rect width="320" height="80" fill="#002b11"/>
                    <!-- Royal crown -->
                    <polygon points="25,50 25,27 35,37 45,22 55,37 65,27 65,50" fill="#ffd700" stroke="#b8860b" stroke-width="1.5"/>
                    <rect x="25" y="50" width="40" height="7" fill="#cc0000"/>
                    <circle cx="35" cy="53" r="2" fill="#ffffff"/>
                    <circle cx="45" cy="53" r="2" fill="#00ffff"/>
                    <circle cx="55" cy="53" r="2" fill="#ffffff"/>
                    <!-- Dollar stack -->
                    <rect x="20" y="60" width="50" height="14" fill="#388e3c" stroke="#1b5e20"/>
                    <text x="45" y="70" font-family="'Arial Black', sans-serif" font-size="9" fill="#ffffff" text-anchor="middle">$$$$</text>
                    <!-- Text banner -->
                    <text x="85" y="27" font-family="'Arial Black', sans-serif" font-size="14" fill="#ffd700">HÉRITAGE DE 4 500 000 $</text>
                    <text x="85" y="46" font-family="Arial, sans-serif" font-weight="bold" font-size="11" fill="#ffffff">TRANSFERT BANCAIRE URGENT</text>
                    <text x="85" y="65" font-family="Arial, sans-serif" font-size="10" fill="#88ff88">Vous touchez 30% immédiatement !</text>
                </svg>`;

            case 'fidelity_test':
                return `
                <svg viewBox="0 0 320 80" width="100%" height="80" xmlns="http://www.w3.org/2000/svg">
                    <rect width="320" height="80" fill="#1c1c1c"/>
                    <!-- Broken heart -->
                    <path d="M40 24 C30 12 15 24 25 38 L40 57 L55 38 C65 24 50 12 40 24 Z" fill="#cc0000"/>
                    <path d="M39 22 L35 34 L44 40 L38 54" stroke="#ffffff" stroke-width="2.5" fill="none"/>
                    <!-- Magnifying glass -->
                    <circle cx="68" cy="38" r="15" fill="rgba(255,255,255,0.3)" stroke="#ffd700" stroke-width="3"/>
                    <line x1="79" y1="49" x2="94" y2="64" stroke="#ffd700" stroke-width="5" stroke-linecap="round"/>
                    <!-- Text banner -->
                    <text x="110" y="27" font-family="'Arial Black', sans-serif" font-size="14" fill="#ff3333">TEST DE FIDÉLITÉ</text>
                    <text x="110" y="47" font-family="Arial, sans-serif" font-weight="bold" font-size="12" fill="#ffffff">TE TROMPE-T-IL CE SOIR ?</text>
                    <text x="110" y="65" font-family="Arial, sans-serif" font-size="10" fill="#ffcc00">Découvre la vérité en 3 questions</text>
                </svg>`;

            case 'las_vegas_casino':
                return `
                <svg viewBox="0 0 320 80" width="100%" height="80" xmlns="http://www.w3.org/2000/svg">
                    <rect width="320" height="80" fill="#240000"/>
                    <!-- Slot machine window -->
                    <rect x="15" y="18" width="80" height="46" fill="#000000" stroke="#ffd700" stroke-width="2" rx="4"/>
                    <!-- 7 7 7 -->
                    <text x="28" y="48" font-family="'Arial Black', sans-serif" font-size="22" fill="#ff0000">7</text>
                    <text x="54" y="48" font-family="'Arial Black', sans-serif" font-size="22" fill="#ff0000">7</text>
                    <text x="80" y="48" font-family="'Arial Black', sans-serif" font-size="22" fill="#ff0000">7</text>
                    <!-- Text banner -->
                    <text x="115" y="28" font-family="'Arial Black', sans-serif" font-size="15" fill="#ffd700">JACKPOT 1 000 000 $</text>
                    <text x="115" y="48" font-family="Arial, sans-serif" font-weight="bold" font-size="12" fill="#ffffff">500 TOURS DE ROULETTE</text>
                    <text x="115" y="66" font-family="Arial, sans-serif" font-size="10" fill="#ff6666">100% Gratuit sans dépôt requis !</text>
                </svg>`;

            case 'luxury_car':
                return `
                <svg viewBox="0 0 320 80" width="100%" height="80" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <linearGradient id="b_car" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stop-color="#880000"/>
                            <stop offset="100%" stop-color="#ff2200"/>
                        </linearGradient>
                    </defs>
                    <rect width="320" height="80" fill="#151520"/>
                    <!-- Luxury Car drawing -->
                    <path d="M15 50 L30 36 L68 36 L84 46 L98 48 L98 60 L15 60 Z" fill="url(#b_car)"/>
                    <polygon points="34,38 64,38 61,46 34,46" fill="#aaddff"/>
                    <circle cx="34" cy="60" r="10" fill="#111" stroke="#ccc" stroke-width="2"/>
                    <circle cx="82" cy="60" r="10" fill="#111" stroke="#ccc" stroke-width="2"/>
                    <!-- Text banner -->
                    <text x="115" y="28" font-family="'Arial Black', sans-serif" font-size="14" fill="#ffcc00">BERLINE DE LUXE !</text>
                    <text x="115" y="48" font-family="Arial, sans-serif" font-weight="bold" font-size="11" fill="#ffffff">CLIMATISATION &amp; CUIR</text>
                    <text x="115" y="66" font-family="Arial, sans-serif" font-size="10" fill="#88ccff">Tirage au sort automobile annuel</text>
                </svg>`;

            case 'private_chat':
                return `
                <svg viewBox="0 0 320 80" width="100%" height="80" xmlns="http://www.w3.org/2000/svg">
                    <rect width="320" height="80" fill="#380024"/>
                    <!-- Vintage telephone & webcam -->
                    <rect x="22" y="38" width="45" height="26" rx="4" fill="#ff66aa"/>
                    <ellipse cx="44" cy="51" rx="11" ry="9" fill="#ffffff"/>
                    <path d="M16 28 C16 18 72 18 72 28 L64 34 C56 26 34 26 26 34 Z" fill="#ff0066"/>
                    <!-- Speech bubble -->
                    <polygon points="80,20 102,20 90,30" fill="#ffffff"/>
                    <rect x="75" y="9" width="90" height="19" rx="4" fill="#ffffff"/>
                    <text x="120" y="22" font-family="Arial, sans-serif" font-weight="bold" font-size="9" fill="#cc0066" text-anchor="middle">« Tu viens ? »</text>
                    <!-- Text banner -->
                    <text x="135" y="44" font-family="'Arial Black', sans-serif" font-size="14" fill="#ff99cc">CÉLINE EST SEULE</text>
                    <text x="135" y="63" font-family="Arial, sans-serif" font-size="11" fill="#ffffff">Dans sa chambre... Discutez !</text>
                </svg>`;

            case 'villa_auction':
                return `
                <svg viewBox="0 0 320 80" width="100%" height="80" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <linearGradient id="b_sky" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stop-color="#0088cc"/>
                            <stop offset="55%" stop-color="#88ddff"/>
                            <stop offset="55%" stop-color="#2e7d32"/>
                            <stop offset="100%" stop-color="#1b5e20"/>
                        </linearGradient>
                    </defs>
                    <rect width="320" height="80" fill="url(#b_sky)"/>
                    <!-- Modern villa -->
                    <rect x="22" y="26" width="50" height="26" fill="#ffffff" stroke="#333" stroke-width="1"/>
                    <rect x="28" y="32" width="13" height="11" fill="#66ccff"/>
                    <rect x="52" y="32" width="13" height="20" fill="#8d6e63"/>
                    <ellipse cx="50" cy="62" rx="30" ry="9" fill="#00e5ff" stroke="#00b0ff" stroke-width="1.5"/>
                    <!-- Price tag -->
                    <polygon points="90,16 128,16 118,37 80,37" fill="#ff0000"/>
                    <text x="104" y="31" font-family="'Arial Black', sans-serif" font-size="12" fill="#ffffff" text-anchor="middle">1 € !</text>
                    <!-- Text banner -->
                    <text x="135" y="28" font-family="'Arial Black', sans-serif" font-size="13" fill="#ffffff" stroke="#000" stroke-width="0.5">VILLAS DE LUXE</text>
                    <text x="135" y="47" font-family="Arial, sans-serif" font-weight="bold" font-size="11" fill="#ffff00">SAISIES IMMOBILIÈRES</text>
                    <text x="135" y="65" font-family="Arial, sans-serif" font-size="10" fill="#ffffff">Piscine &amp; vue sur mer bradées</text>
                </svg>`;

            case 'hot_camera':
                return `
                <svg viewBox="0 0 320 80" width="100%" height="80" xmlns="http://www.w3.org/2000/svg">
                    <rect width="320" height="80" fill="#200018"/>
                    <!-- Video Camcorder frame -->
                    <rect x="15" y="14" width="85" height="52" fill="#000000" stroke="#ff00aa" stroke-width="1.5" rx="3"/>
                    <circle cx="28" cy="26" r="4" fill="#ff0000"/>
                    <text x="36" y="29" font-family="'Courier New', monospace" font-size="8" fill="#ff0000">REC</text>
                    <!-- Funny neighbor cartoon with curlers -->
                    <circle cx="58" cy="42" r="14" fill="#ffccaa"/>
                    <circle cx="48" cy="32" r="4" fill="#ff66cc"/>
                    <circle cx="58" cy="28" r="4" fill="#ff66cc"/>
                    <circle cx="68" cy="32" r="4" fill="#ff66cc"/>
                    <path d="M50 56 Q58 64 66 56" stroke="#990033" stroke-width="2" fill="none"/>
                    <!-- Text banner -->
                    <text x="115" y="28" font-family="'Arial Black', sans-serif" font-size="14" fill="#ff00aa">CAMÉRA DE LA VOISINE !</text>
                    <text x="115" y="47" font-family="Arial, sans-serif" font-weight="bold" font-size="11" fill="#ffff00">MIREILLE ARROSE SES FLEURS</text>
                    <text x="115" y="64" font-family="Arial, sans-serif" font-size="10" fill="#ffffff">Flux direct 160x120 en 14.4K</text>
                </svg>`;

            case 'love_calculator':
                return `
                <svg viewBox="0 0 320 80" width="100%" height="80" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <linearGradient id="b_love" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stop-color="#4a001a"/>
                            <stop offset="100%" stop-color="#990033"/>
                        </linearGradient>
                    </defs>
                    <rect width="320" height="80" fill="url(#b_love)"/>
                    <!-- Pierced Heart -->
                    <path d="M48 25 C40 14 25 24 35 38 L48 55 L61 38 C71 24 56 14 48 25 Z" fill="#ff0055"/>
                    <!-- Arrow -->
                    <line x1="20" y1="55" x2="75" y2="25" stroke="#ffff00" stroke-width="3"/>
                    <polygon points="75,25 68,23 71,31" fill="#ffff00"/>
                    <!-- 100% Love thermometer -->
                    <rect x="85" y="16" width="12" height="48" rx="6" fill="#ffffff"/>
                    <rect x="87" y="20" width="8" height="42" rx="4" fill="#ff0000"/>
                    <circle cx="91" cy="62" r="7" fill="#ff0000"/>
                    <!-- Text banner -->
                    <text x="115" y="28" font-family="'Arial Black', sans-serif" font-size="14" fill="#ffff00">TEST D'AMOUR 100% FIABLE !</text>
                    <text x="115" y="48" font-family="Arial, sans-serif" font-weight="bold" font-size="11" fill="#ffffff">COMPATIBILITÉ PASSIONNÉE</text>
                    <text x="115" y="65" font-family="Arial, sans-serif" font-size="10" fill="#ff99cc">Calculez vos prénoms en 1 clic</text>
                </svg>`;

            default:
                return `<div class="popup-preview-box">★★★ OFFRE EXCLUSIVE 1999 ★★★</div>`;
        }
    }

    // Returns a retro 70x70 square illustrated parody photo/avatar for each popup
    getThumbnailPhoto(adId) {
        switch (adId) {
            case 'hot_singles':
                return `
                <svg viewBox="0 0 70 70" width="70" height="70" xmlns="http://www.w3.org/2000/svg">
                    <rect width="70" height="70" fill="#3a0022"/>
                    <!-- Blonde 90s girl with curly hair -->
                    <circle cx="35" cy="35" r="16" fill="#ffd2b2"/>
                    <path d="M18 28 C14 12 56 12 52 28 C56 42 48 50 48 50 L22 50 C22 50 14 42 18 28 Z" fill="#ffea77" stroke="#ccaa22" stroke-width="1"/>
                    <!-- Retro heart sunglasses -->
                    <polygon points="26,30 30,26 34,30 30,36" fill="#ff0077"/>
                    <polygon points="36,30 40,26 44,30 40,36" fill="#ff0077"/>
                    <!-- Red lipstick smile -->
                    <path d="M30 42 Q35 46 40 42" stroke="#cc0022" stroke-width="2.5" fill="none"/>
                    <!-- Humorous pixel censor bar over eyes -->
                    <rect x="18" y="28" width="34" height="9" fill="#000000" stroke="#ff0077" stroke-width="0.5"/>
                    <text x="35" y="35" font-family="Arial, sans-serif" font-weight="bold" font-size="5" fill="#ffff00" text-anchor="middle">CHAUDE</text>
                    <!-- Live indicator -->
                    <circle cx="8" cy="8" r="3" fill="#ff0000"/>
                    <text x="14" y="10" font-family="'Courier New', monospace" font-size="5" font-weight="bold" fill="#66ff66">LIVE</text>
                </svg>`;

            case 'male_enlarge':
                return `
                <svg viewBox="0 0 70 70" width="70" height="70" xmlns="http://www.w3.org/2000/svg">
                    <rect width="70" height="70" fill="#002b0c"/>
                    <!-- Muscular eggplant avatar -->
                    <ellipse cx="35" cy="40" rx="14" ry="22" fill="#660099" stroke="#330055" stroke-width="1.5"/>
                    <polygon points="30,18 40,18 35,8" fill="#00bb00"/>
                    <!-- Sunglasses -->
                    <rect x="25" y="28" width="9" height="5" rx="1" fill="#000000"/>
                    <rect x="36" y="28" width="9" height="5" rx="1" fill="#000000"/>
                    <line x1="34" y1="30" x2="36" y2="30" stroke="#000" stroke-width="1.5"/>
                    <!-- Flexing muscular arm -->
                    <path d="M48 38 C58 34 60 22 52 20 C46 18 44 26 48 32" fill="#ffccaa" stroke="#aa6644" stroke-width="1.5"/>
                    <!-- Sweat droplet -->
                    <path d="M22 28 C20 28 20 25 22 23 C24 25 24 28 22 28 Z" fill="#00ffff"/>
                    <!-- Stamp -->
                    <rect x="4" y="55" width="62" height="11" fill="#00aa00" rx="2"/>
                    <text x="35" y="63" font-family="'Arial Black', sans-serif" font-size="7" fill="#ffffff" text-anchor="middle">+8 CM</text>
                </svg>`;

            case 'lottery_winner':
                return `
                <svg viewBox="0 0 70 70" width="70" height="70" xmlns="http://www.w3.org/2000/svg">
                    <rect width="70" height="70" fill="#1a1400"/>
                    <!-- Green money bag -->
                    <circle cx="35" cy="42" r="20" fill="#2e7d32" stroke="#1b5e20" stroke-width="1.5"/>
                    <polygon points="28,24 42,24 35,20" fill="#2e7d32"/>
                    <rect x="31" y="22" width="8" height="4" fill="#ffd700"/>
                    <text x="35" y="48" font-family="'Arial Black', sans-serif" font-size="14" fill="#ffd700" text-anchor="middle">50K€</text>
                    <!-- Golden coins fanning out -->
                    <ellipse cx="20" cy="58" rx="8" ry="4" fill="#ffd700" stroke="#b8860b"/>
                    <ellipse cx="50" cy="58" rx="8" ry="4" fill="#ffd700" stroke="#b8860b"/>
                    <!-- Confetti sparkles -->
                    <text x="12" y="16" fill="#ffff00" font-size="9">★</text>
                    <text x="54" y="18" fill="#ff0055" font-size="8">✦</text>
                </svg>`;

            case 'psychic_irma':
                return `
                <svg viewBox="0 0 70 70" width="70" height="70" xmlns="http://www.w3.org/2000/svg">
                    <rect width="70" height="70" fill="#15002a"/>
                    <!-- Madame Irma face -->
                    <circle cx="35" cy="36" r="15" fill="#f5c29e"/>
                    <!-- Purple turban with ruby -->
                    <path d="M18 28 C18 10 52 10 52 28 C54 34 50 36 50 36 L20 36 Z" fill="#660099" stroke="#aa00ff" stroke-width="1"/>
                    <circle cx="35" cy="22" r="3.5" fill="#ff0000" stroke="#ffd700" stroke-width="1"/>
                    <!-- Golden hoop earrings -->
                    <circle cx="18" cy="38" r="4" fill="none" stroke="#ffd700" stroke-width="1.5"/>
                    <circle cx="52" cy="38" r="4" fill="none" stroke="#ffd700" stroke-width="1.5"/>
                    <!-- Spiral eyes -->
                    <circle cx="29" cy="34" r="2.5" fill="#00ffff"/>
                    <circle cx="41" cy="34" r="2.5" fill="#00ffff"/>
                    <!-- Glowing crystal ball -->
                    <circle cx="35" cy="56" r="11" fill="#00e5ff" opacity="0.9" stroke="#ffffff" stroke-width="1"/>
                </svg>`;

            case 'miracle_diet':
                return `
                <svg viewBox="0 0 70 70" width="70" height="70" xmlns="http://www.w3.org/2000/svg">
                    <rect width="70" height="70" fill="#2d572c"/>
                    <!-- Happy pineapple flexing -->
                    <ellipse cx="35" cy="42" rx="16" ry="22" fill="#ffaa00" stroke="#cc7700" stroke-width="1.5"/>
                    <polygon points="35,12 30,24 40,24" fill="#00aa00"/>
                    <polygon points="25,15 28,24 35,24" fill="#008800"/>
                    <polygon points="45,15 42,24 35,24" fill="#008800"/>
                    <!-- Sunglasses & smile -->
                    <rect x="25" y="34" width="8" height="5" rx="1" fill="#000000"/>
                    <rect x="37" y="34" width="8" height="5" rx="1" fill="#000000"/>
                    <line x1="33" y1="36" x2="37" y2="36" stroke="#000" stroke-width="1.5"/>
                    <path d="M30 48 Q35 53 40 48" stroke="#990000" stroke-width="2" fill="none"/>
                    <!-- Measuring tape belt -->
                    <rect x="20" y="44" width="30" height="4" fill="#ffea00" stroke="#000000" stroke-width="0.5"/>
                    <!-- Badge -->
                    <text x="35" y="65" font-family="'Arial Black', sans-serif" font-size="8" fill="#ffff00" text-anchor="middle">-14 KG</text>
                </svg>`;

            case 'caribbean_trip':
                return `
                <svg viewBox="0 0 70 70" width="70" height="70" xmlns="http://www.w3.org/2000/svg">
                    <rect width="70" height="70" fill="#0088cc"/>
                    <!-- Island with palm tree -->
                    <ellipse cx="35" cy="58" rx="28" ry="9" fill="#ffdd77"/>
                    <path d="M30 56 Q35 38 32 20" stroke="#552b00" stroke-width="3" fill="none"/>
                    <path d="M32 20 Q22 14 10 20" stroke="#008800" stroke-width="2.5" fill="none"/>
                    <path d="M32 20 Q40 10 52 15" stroke="#008800" stroke-width="2.5" fill="none"/>
                    <!-- Tropical drink -->
                    <polygon points="46,46 54,46 50,56" fill="#ff0055"/>
                    <line x1="50" y1="56" x2="50" y2="62" stroke="#fff" stroke-width="1.5"/>
                    <!-- Sun -->
                    <circle cx="56" cy="18" r="8" fill="#ffea00"/>
                </svg>`;

            case 'strip_club':
                return `
                <svg viewBox="0 0 70 70" width="70" height="70" xmlns="http://www.w3.org/2000/svg">
                    <rect width="70" height="70" fill="#150022"/>
                    <!-- Neon bunny girl silhouette -->
                    <circle cx="35" cy="30" r="10" fill="#ff00aa"/>
                    <!-- Bunny ears -->
                    <polygon points="31,21 33,6 36,21" fill="#ff00aa"/>
                    <polygon points="36,21 39,6 41,21" fill="#ff00aa"/>
                    <path d="M35 38 C35 32 45 32 45 38 C45 46 36 50 36 60 L36 68" stroke="#ff00aa" stroke-width="3.5" stroke-linecap="round" fill="none"/>
                    <!-- Feather boa in cyan -->
                    <path d="M26 38 C34 44 38 44 46 38" stroke="#00ffff" stroke-width="3" fill="none"/>
                    <!-- Neon stamp -->
                    <text x="35" y="65" font-family="'Arial Black', sans-serif" font-size="6" fill="#ffff00" text-anchor="middle">100% SFW</text>
                </svg>`;

            case 'married_discreet':
                return `
                <svg viewBox="0 0 70 70" width="70" height="70" xmlns="http://www.w3.org/2000/svg">
                    <rect width="70" height="70" fill="#330010"/>
                    <!-- Golden Venetian carnival mask -->
                    <path d="M15 32 C15 18 55 18 55 32 C55 42 38 45 35 37 C32 45 15 42 15 32 Z" fill="#b8860b" stroke="#ffd700" stroke-width="1.5"/>
                    <circle cx="25" cy="30" r="4.5" fill="#00ffcc"/>
                    <circle cx="45" cy="30" r="4.5" fill="#00ffcc"/>
                    <!-- Finger to lips "shhh" -->
                    <rect x="33" y="44" width="5" height="15" rx="2" fill="#ffccaa"/>
                    <path d="M30 46 Q35 49 40 46" stroke="#ff0033" stroke-width="2" fill="none"/>
                    <text x="35" y="66" font-family="'Arial Black', sans-serif" font-size="6" fill="#ffd700" text-anchor="middle">DISCRET</text>
                </svg>`;

            case 'prince_heritage':
                return `
                <svg viewBox="0 0 70 70" width="70" height="70" xmlns="http://www.w3.org/2000/svg">
                    <rect width="70" height="70" fill="#002b11"/>
                    <!-- Prince face -->
                    <circle cx="35" cy="38" r="14" fill="#8d5524"/>
                    <!-- Royal crown -->
                    <polygon points="22,26 22,12 28,19 35,8 42,19 48,12 48,26" fill="#ffd700" stroke="#b8860b" stroke-width="1"/>
                    <rect x="22" y="26" width="26" height="4" fill="#cc0000"/>
                    <!-- Regal mustache & smile with gold tooth -->
                    <path d="M28 42 Q35 48 42 42" stroke="#111" stroke-width="2.5" fill="none"/>
                    <circle cx="34" cy="44" r="1.5" fill="#ffd700"/>
                    <!-- Royal cape -->
                    <path d="M18 50 C26 48 44 48 52 50 L56 70 L14 70 Z" fill="#660099" stroke="#ffd700" stroke-width="1"/>
                </svg>`;

            case 'fidelity_test':
                return `
                <svg viewBox="0 0 70 70" width="70" height="70" xmlns="http://www.w3.org/2000/svg">
                    <rect width="70" height="70" fill="#1c1c1c"/>
                    <!-- Detective hat -->
                    <ellipse cx="35" cy="24" rx="22" ry="5" fill="#553311"/>
                    <path d="M22 24 C22 14 48 14 48 24 Z" fill="#664422"/>
                    <!-- Dark sunglasses -->
                    <rect x="23" y="28" width="10" height="6" rx="1" fill="#000"/>
                    <rect x="37" y="28" width="10" height="6" rx="1" fill="#000"/>
                    <line x1="33" y1="30" x2="37" y2="30" stroke="#000" stroke-width="1.5"/>
                    <!-- Lipstick mark on collar -->
                    <polygon points="30,42 40,42 35,50" fill="#ffffff"/>
                    <ellipse cx="38" cy="46" rx="4" ry="2.5" fill="#cc0000"/>
                    <!-- Magnifying glass -->
                    <circle cx="48" cy="46" r="10" fill="rgba(255,255,255,0.2)" stroke="#ffd700" stroke-width="2"/>
                    <line x1="55" y1="53" x2="65" y2="63" stroke="#ffd700" stroke-width="3.5" stroke-linecap="round"/>
                </svg>`;

            case 'las_vegas_casino':
                return `
                <svg viewBox="0 0 70 70" width="70" height="70" xmlns="http://www.w3.org/2000/svg">
                    <rect width="70" height="70" fill="#0f401b"/>
                    <!-- Slot reels display -->
                    <rect x="8" y="16" width="54" height="32" fill="#000000" stroke="#ffd700" stroke-width="1.5" rx="3"/>
                    <text x="17" y="38" font-family="'Arial Black', sans-serif" font-size="16" fill="#ff0000">7</text>
                    <text x="35" y="38" font-family="'Arial Black', sans-serif" font-size="16" fill="#ff0000">7</text>
                    <text x="53" y="38" font-family="'Arial Black', sans-serif" font-size="16" fill="#ff0000">7</text>
                    <!-- Pair of dice -->
                    <rect x="15" y="52" width="14" height="14" rx="2" fill="#ffffff" stroke="#cc0000" stroke-width="1"/>
                    <circle cx="22" cy="59" r="2" fill="#cc0000"/>
                    <rect x="35" y="52" width="14" height="14" rx="2" fill="#ffffff" stroke="#cc0000" stroke-width="1"/>
                    <circle cx="39" cy="56" r="1.5" fill="#cc0000"/>
                    <circle cx="45" cy="62" r="1.5" fill="#cc0000"/>
                </svg>`;

            case 'luxury_car':
                return `
                <svg viewBox="0 0 70 70" width="70" height="70" xmlns="http://www.w3.org/2000/svg">
                    <rect width="70" height="70" fill="#151520"/>
                    <!-- Front view sports car -->
                    <path d="M12 44 L20 28 L50 28 L58 44 L62 50 L8 50 Z" fill="#cc0000"/>
                    <polygon points="22,30 48,30 45,40 25,40" fill="#88ccff"/>
                    <!-- Headlights -->
                    <ellipse cx="18" cy="46" rx="4" ry="2.5" fill="#ffffaa"/>
                    <ellipse cx="52" cy="46" rx="4" ry="2.5" fill="#ffffaa"/>
                    <rect x="26" y="46" width="18" height="4" fill="#333"/>
                    <!-- Wheels -->
                    <rect x="8" y="48" width="6" height="10" fill="#111"/>
                    <rect x="56" y="48" width="6" height="10" fill="#111"/>
                    <!-- Floating golden key -->
                    <circle cx="35" cy="16" r="5" fill="#ffd700" stroke="#b8860b" stroke-width="1"/>
                    <rect x="33" y="21" width="4" height="8" fill="#ffd700"/>
                </svg>`;

            case 'private_chat':
                return `
                <svg viewBox="0 0 70 70" width="70" height="70" xmlns="http://www.w3.org/2000/svg">
                    <rect width="70" height="70" fill="#2d001e"/>
                    <!-- Webcam avatar: Céline with headset -->
                    <circle cx="35" cy="34" r="14" fill="#ffcca8"/>
                    <!-- Brown hair with pink ribbon -->
                    <path d="M20 30 C18 16 52 16 50 30 C50 40 46 44 46 44 L24 44 Z" fill="#663300"/>
                    <circle cx="46" cy="24" r="3" fill="#ff00aa"/>
                    <!-- Gaming headset -->
                    <path d="M18 32 C18 16 52 16 52 32" stroke="#333333" stroke-width="3" fill="none"/>
                    <circle cx="18" cy="34" r="4" fill="#ff00aa"/>
                    <circle cx="52" cy="34" r="4" fill="#ff00aa"/>
                    <line x1="20" y1="36" x2="30" y2="42" stroke="#333" stroke-width="1.5"/>
                    <circle cx="30" cy="42" r="2" fill="#000"/>
                    <!-- Cute smile -->
                    <path d="M31 40 Q35 44 39 40" stroke="#cc0033" stroke-width="2" fill="none"/>
                    <!-- Webcam scanline & rec dot -->
                    <circle cx="8" cy="8" r="3" fill="#ff0000"/>
                    <text x="14" y="10" font-family="'Courier New', monospace" font-size="5" fill="#66ff66">23:42</text>
                </svg>`;

            case 'villa_auction':
                return `
                <svg viewBox="0 0 70 70" width="70" height="70" xmlns="http://www.w3.org/2000/svg">
                    <rect width="70" height="70" fill="#00aaff"/>
                    <!-- Villa poolside -->
                    <rect x="10" y="15" width="50" height="26" fill="#ffffff" stroke="#333" stroke-width="1"/>
                    <rect x="15" y="20" width="12" height="10" fill="#88ddff"/>
                    <rect x="35" y="20" width="12" height="18" fill="#8d6e63"/>
                    <!-- Pool with flamingo float -->
                    <ellipse cx="35" cy="54" rx="28" ry="11" fill="#00e5ff" stroke="#00b0ff" stroke-width="1.5"/>
                    <!-- Pink flamingo -->
                    <circle cx="35" cy="52" r="5" fill="#ff66aa"/>
                    <path d="M37 52 Q40 45 42 47" stroke="#ff66aa" stroke-width="2" fill="none"/>
                    <!-- 1 Euro badge -->
                    <circle cx="56" cy="18" r="9" fill="#ff0000"/>
                    <text x="56" y="21" font-family="'Arial Black', sans-serif" font-size="8" fill="#ffffff" text-anchor="middle">1 €</text>
                </svg>`;

            case 'hot_camera':
                return `
                <svg viewBox="0 0 70 70" width="70" height="70" xmlns="http://www.w3.org/2000/svg">
                    <rect width="70" height="70" fill="#200018"/>
                    <!-- Funny neighbor avatar -->
                    <circle cx="35" cy="38" r="14" fill="#ffcca8"/>
                    <!-- Pink curlers in hair -->
                    <circle cx="26" cy="24" r="4.5" fill="#ff66cc" stroke="#cc0066" stroke-width="1"/>
                    <circle cx="35" cy="20" r="4.5" fill="#ff66cc" stroke="#cc0066" stroke-width="1"/>
                    <circle cx="44" cy="24" r="4.5" fill="#ff66cc" stroke="#cc0066" stroke-width="1"/>
                    <!-- Cat-eye retro glasses -->
                    <polygon points="24,32 32,32 30,37 24,35" fill="#000000"/>
                    <polygon points="38,32 46,32 46,35 40,37" fill="#000000"/>
                    <line x1="32" y1="33" x2="38" y2="33" stroke="#000" stroke-width="1.5"/>
                    <!-- Winking eye & red lips -->
                    <circle cx="28" cy="34" r="1.5" fill="#ffffff"/>
                    <path d="M31 44 Q35 48 39 44" stroke="#cc0033" stroke-width="2" fill="none"/>
                    <!-- Leopard collar robe -->
                    <path d="M18 52 C26 50 44 50 52 52 L56 70 L14 70 Z" fill="#ffcc66"/>
                    <circle cx="28" cy="60" r="1.5" fill="#663300"/>
                    <circle cx="42" cy="58" r="1.5" fill="#663300"/>
                </svg>`;

            case 'love_calculator':
                return `
                <svg viewBox="0 0 70 70" width="70" height="70" xmlns="http://www.w3.org/2000/svg">
                    <rect width="70" height="70" fill="#4a001a"/>
                    <!-- Cartoon Cupid with sunglasses -->
                    <circle cx="35" cy="34" r="13" fill="#ffcca8"/>
                    <!-- Angel wings -->
                    <ellipse cx="18" cy="30" rx="8" ry="12" fill="#ffffff" opacity="0.85"/>
                    <ellipse cx="52" cy="30" rx="8" ry="12" fill="#ffffff" opacity="0.85"/>
                    <!-- Sunglasses on Cupid -->
                    <rect x="25" y="30" width="8" height="5" rx="1" fill="#000000"/>
                    <rect x="37" y="30" width="8" height="5" rx="1" fill="#000000"/>
                    <line x1="33" y1="32" x2="37" y2="32" stroke="#000" stroke-width="1.5"/>
                    <!-- Bow with heart arrow -->
                    <path d="M22 46 Q26 54 22 62" stroke="#ffd700" stroke-width="2" fill="none"/>
                    <line x1="20" y1="54" x2="42" y2="54" stroke="#ff0055" stroke-width="2"/>
                    <polygon points="42,54 36,51 38,54 36,57" fill="#ff0055"/>
                    <text x="52" y="62" font-family="'Arial Black', sans-serif" font-size="8" fill="#ffff00">100%</text>
                </svg>`;

            default:
                return `
                <svg viewBox="0 0 70 70" width="70" height="70" xmlns="http://www.w3.org/2000/svg">
                    <rect width="70" height="70" fill="#222222"/>
                    <circle cx="35" cy="35" r="22" fill="#ff0055"/>
                    <text x="35" y="42" font-family="Arial, sans-serif" font-size="20" fill="#ffffff" text-anchor="middle">★</text>
                </svg>`;
        }
    }

    spawnPopup(template = null) {
        if (this.popups.size >= this.maxPopups) {
            // Remove oldest popup to make room
            const firstKey = this.popups.keys().next().value;
            this.closePopup(firstKey);
        }

        const ad = template || this.adTemplates[Math.floor(Math.random() * this.adTemplates.length)];
        const id = 'ad_popup_' + (++this.counter);

        // Play audio effect
        if (window.retroAudio) {
            const r = Math.random();
            if (r < 0.45 && window.retroAudio.playSexySynth) {
                window.retroAudio.playSexySynth();
            } else if (r < 0.75) {
                window.retroAudio.playPop();
            } else {
                window.retroAudio.playQuack();
            }
        }

        // Random coordinates within visible screen
        const maxW = Math.max(100, window.innerWidth - 370);
        const maxH = Math.max(100, window.innerHeight - 340);
        const posX = Math.floor(15 + Math.random() * maxW);
        const posY = Math.floor(15 + Math.random() * maxH);

        const el = document.createElement('div');
        el.className = `retro-window popup-ad-window theme-${ad.theme}`;
        el.id = id;
        el.style.left = `${posX}px`;
        el.style.top = `${posY}px`;
        el.style.width = '350px';
        el.style.zIndex = ++window.windowManager.highestZ;

        el.innerHTML = `
            <div class="window-title-bar popup-title-bar">
                <div class="window-title-left">
                    <span class="popup-flame">${ad.flame || '🔥'}</span>
                    <span class="window-title-text">${ad.title}</span>
                </div>
                <div class="window-controls">
                    <button class="win-btn win-btn-close" data-ad-close="true" title="Fermer la pub">✕</button>
                </div>
            </div>
            <div class="popup-ad-body">
                <div class="popup-header-row">
                    <span class="popup-badge">${ad.tag}</span>
                    <span class="popup-age-badge">${ad.ageBadge || '100% PARODIE SFW'}</span>
                </div>
                <!-- Retro Illustrated Banner Image -->
                <div class="popup-banner-image">
                    ${this.getBannerIllustration(ad.id)}
                </div>
                <div class="popup-marquee"><marquee scrollamount="5">★★★ ${ad.marquee || 'OFFRE EXCLUSIVE ET LIMITÉE ★★★ NE MANQUEZ PAS CETTE OCCASION'} ★★★</marquee></div>
                <!-- Middle Split: Photo/Avatar on left + Message on right -->
                <div class="popup-main-content">
                    <div class="popup-photo-frame">
                        ${this.getThumbnailPhoto(ad.id)}
                        <span class="popup-photo-tag">${ad.photoTag || 'PHOTO VÉRIFIÉE'}</span>
                    </div>
                    <p class="popup-message">${ad.msg}</p>
                </div>
                <div class="popup-action-row">
                    <button class="win-btn popup-claim-btn" data-ad-claim="true">
                        ${ad.btnText}<br>
                        <span class="popup-reward-badge">+${window.gameEngine.formatNumber(ad.reward)} Octets bonus !</span>
                    </button>
                </div>
                <div class="popup-sub-links">
                    <a href="#" class="popup-link-no" data-ad-close="true">[ Non merci, je ne suis pas intéressé ]</a>
                </div>
            </div>
        `;

        document.getElementById('desktop').appendChild(el);
        this.popups.set(id, el);

        // Dragging support
        const titleBar = el.querySelector('.window-title-bar');
        this.attachDrag(el, titleBar);

        // Claim button
        el.querySelector('[data-ad-claim="true"]').onclick = (e) => {
            e.stopPropagation();
            if (window.retroAudio) {
                if (window.retroAudio.playSexySynth && Math.random() < 0.6) {
                    window.retroAudio.playSexySynth();
                } else {
                    window.retroAudio.playGlitchBleep();
                }
            }

            // Reward
            window.gameEngine.bytes += ad.reward;
            window.gameEngine.totalBytes += ad.reward;
            window.gameEngine.updateDamage();

            const rect = el.getBoundingClientRect();
            window.gameEngine.spawnFloatText(`+${window.gameEngine.formatNumber(ad.reward)} Octets ! 🎁`, rect.left + 70, rect.top + 10);

            this.closePopup(id);
        };

        // Close button
        el.querySelectorAll('[data-ad-close="true"]').forEach(btn => {
            btn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                window.retroAudio.playClick();

                // 25% chance to spawn another popup on close (classic 2000s popup hydra)
                if (Math.random() < 0.25 && this.popups.size < this.maxPopups) {
                    setTimeout(() => this.spawnPopup(), 150);
                }

                this.closePopup(id);
            };
        });

        // Bring to front on click
        el.onmousedown = () => {
            el.style.zIndex = ++window.windowManager.highestZ;
        };

        return el;
    }

    attachDrag(el, handle) {
        let isDragging = false;
        let startX, startY, initX, initY;

        handle.onmousedown = (e) => {
            if (e.target.closest('.win-btn')) return;
            isDragging = true;
            el.style.zIndex = ++window.windowManager.highestZ;
            startX = e.clientX;
            startY = e.clientY;
            initX = el.offsetLeft;
            initY = el.offsetTop;

            const onMove = (me) => {
                if (!isDragging) return;
                const dx = me.clientX - startX;
                const dy = me.clientY - startY;
                el.style.left = `${Math.max(0, Math.min(window.innerWidth - el.offsetWidth, initX + dx))}px`;
                el.style.top = `${Math.max(0, Math.min(window.innerHeight - el.offsetHeight - 30, initY + dy))}px`;
            };

            const onUp = () => {
                isDragging = false;
                window.removeEventListener('mousemove', onMove);
                window.removeEventListener('mouseup', onUp);
            };

            window.addEventListener('mousemove', onMove);
            window.addEventListener('mouseup', onUp);
        };
    }

    closePopup(id) {
        const el = this.popups.get(id);
        if (el) {
            el.remove();
            this.popups.delete(id);
        }
    }

    closeAllPopups() {
        this.popups.forEach((el) => {
            el.remove();
        });
        this.popups.clear();
        if (window.retroAudio) {
            window.retroAudio.playAsterisk();
        }
        if (window.gameEngine) {
            window.gameEngine.showNotification('🛡️ AdBlock 95 Activé', 'Tous les pop-ups et bannières ont été fermés !');
        }
    }

    // Called on clicks or actions: chance to spawn popups based on destruction level
    maybeSpawnOnAction(damage) {
        if (damage < 5) return;

        // Chance scales with damage
        const chance = Math.min(0.28, 0.03 + (damage / 2500));
        if (Math.random() < chance) {
            this.spawnPopup();
        }
    }

    // Called periodically from main game loop
    checkAutoSpawn(damage) {
        if (damage < 8) return;

        const now = Date.now();
        const interval = Math.max(2200, 28000 / (1 + damage * 0.008));

        if (now - this.lastAutoSpawn > interval) {
            this.lastAutoSpawn = now;
            this.spawnPopup();
        }
    }
}

// Global instance
window.popupManager = new PopupManager();
