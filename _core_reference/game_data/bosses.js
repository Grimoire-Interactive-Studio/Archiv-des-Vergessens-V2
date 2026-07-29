// ============================================================
// FILE: js/data/bosses.js – Boss-Daten
// ============================================================
import { CONFIG } from './config.js';

export const BOSS_NAMES = [
    'Verlorener Schatten', 'Gedankenwandler', 'Nebelkreatur', 'Staubgeist',
    'Fragment der Erinnerung', 'Phantom des Archivs', 'Rastloser Wächter', 'Dunkles Echo'
];

export const CHAPTER_GENERIC_BOSS_NAMES = {
    1: [
        'Eldorianischer Aschegeist', 'Schatten der Gläsernen Hallen', 'Verblasster Chronist von Eldoria',
        'Kristallsoldat der Trümmer', 'Flüsternder Staubschemen', 'Gedankensplitter von Eldoria',
        'Wächter der zerbrochenen Säulen', 'Nebelkrieger des Verfalls'
    ],
    2: [
        'Gezeiten-Phantom der Tiefe', 'Tiefsee-Koralis der Lethe', 'Strömungs-Echo von Valanis',
        'Nebelträne der Ozeane', 'Kristalline Meeresbestie', 'Versunkener Seelenfänger',
        'Gischt-Schemen der Gezeiten', 'Tragischer Treibgut-Wächter'
    ],
    3: [
        'Protokoll-Drohne Beta', 'Korrupte Code-Einheit 03', 'Rost-Drohne der Endzeit',
        'Datenstrom-Anomalie', 'Cyber-Schemen Alpha', 'Relikt-Prozessor Delta',
        'Verlassener System-Wächter', 'Ketten-Algorithmus der Lethe'
    ],
    4: [
        'Lethe-Schleier der Nacht', 'Diener des Stille-Zirkels', 'Schattenweber des Schmerzes',
        'Einflüsterer der Dunkelheit', 'Vergessener Traumwanderer', 'Nachtmahr der Asche',
        'Barmherziger Auslöschungs-Geist', 'Schwarzflügel der Lethe'
    ],
    5: [
        'Inschriften-Wächter der Dynastie', 'Folianten-Schemen des Schmerzes', 'Wächter des Ur-Zirkels',
        'Gefallener Sklave der Schrift', 'Kettenträger von Valanis', 'Ur-Skelett der Chronisten',
        'Siegelbewahrer der Ersten', 'Qualen-Echo der Dynastie'
    ],
    6: [
        'Aethel-Lichtgestalt', 'Lichtträger der Reue', 'Gedankensammler von Valanis',
        'Ur-Glimmen der Mneme', 'Strahlender Reue-Geist', 'Mneme-Kristall-Schild',
        'Aethel-Krieger des Bundes', 'Ewiger Hüter des Lichtes'
    ],
    7: [
        'Sternenweber-Phantom', 'Ahnengespinst des Kosmos', 'Kosmischer Staubwächter',
        'Sternenstaub-Fragment', 'Ur-Hüter der Ersten Sterne', 'Urahnen-Echo der Galaxie',
        'Schicksals-Sternensoldat', 'Astral-Schemen der Urzeit'
    ],
    8: [
        'Stasis-Kristallist der Sekunde', 'Wächter des Gefrorenen Augenblicks', 'Schatten des Stillstands',
        'Fragment des absoluten Nichts', 'Gefrorener Zeitläufer', 'Kälteschleier der Stasis',
        'Zeit-Phantom des Vakuums', 'Ewiger Eiskristall-Wächter'
    ],
    9: [
        'Konstrukt der Realität', 'Schicksalsfaden-Wächter', 'Geflecht-Phantom des Architekten',
        'Architekten-Projektion', 'Entwurfs-Krieger der Schöpfung', 'Gewebe-Schemen der Welt',
        'Marmorsäulen-Konstrukt', 'Planer-Wächter des Archivs'
    ],
    10: [
        'Götterdämmerungs-Manifestation', 'Relikt des Ur-Glaubens', 'Bewusstseins-Wächter der Krone',
        'Aura der Letzten Mneme', 'Heiliger Schatten der Dämmerung', 'Ur-Gott-Fragment der Schöpfung',
        'Kollektiv-Krieger des Geistes', 'Erhabener Endzeit-Wächter'
    ]
};

export const CHAPTER_BOSSES = [
    { name: 'Rastloses Echo von Eldoria', items: ['Bruchstück der Gläsernen Ära'] },
    { name: 'Malakor, der gefallene Erste (Obsidiantitan)', items: ['Sternenlicht-Klinge des Hüters'] },
    { name: 'Schattenreiter der Seelenfluten', items: ['Seelenfänger-Amulett'] },
    { name: 'Aurelia, das schweigende Meer (Kristallträne)', items: ['Ring der unendlichen Gezeiten'] },
    { name: 'Eisernes Abwehrprogramm Alpha', items: ['Schattenstahl-Klinge'] },
    { name: 'Goliath-7, Die kybernetische Dämmerung', items: ['Rostplatte der Techno-Endzeit'] },
    { name: 'Der Namenlose Archivar', items: ['Zerrissenes Foliantenblatt'] },
    { name: 'Nyx, Herrin des sanften Vergessens', items: ['Dunkler Reif des Nichts'] },
    { name: 'Der Archivar der Ersten Dynastie', items: ['Inschrift-Schwert des Ur-Zirkels'] },
    { name: 'Die Chronistin des Schmerzes', items: ['Gewebte Chronisten-Robe'] },
    { name: 'Wächter der reinen Aethel-Mneme', items: ['Lichtbringer-Amulett'] },
    { name: 'Der Erinnerungssammler von Valanis', items: ['Reif der Ewigen Reue'] },
    { name: 'Der Erste Mnemoniker', items: ['Urahnen-Klinge der Ersten'] },
    { name: 'Die Urerinnerung des Kosmos', items: ['Sterne-Garnierte Ur-Plattenrüstung'] },
    { name: 'Der Ewige Wächter der Stasis', items: ['Amulett der Stillstehenden Zeit'] },
    { name: 'Die Unendliche Leere', items: ['Band der ewigen Stille'] },
    { name: 'Der Große Architekt des Archivs', items: ['Entwurfs-Klinge der Realität'] },
    { name: 'Die Gestalterin des Schicksalsfadens', items: ['Schicksalsweber-Gewand'] },
    { name: 'Der Vergessene Gott (Urahn des Glaubens)', items: ['Heilige Klinge der Götterdämmerung', 'Urmacht-Brustplatte'] },
    { name: 'Die Letzte Mneme (Krone der Schöpfung)', items: ['Krone des Kollektiven Bewusstseins'] }
];

export function generateStoryBosses() {
    const bosses = [];
    let globalId = 1;
    const maxChapters = CONFIG.STORY?.MAX_CHAPTERS || 10;
    const fightsPerChapter = CONFIG.STORY?.FIGHTS_PER_CHAPTER || 10;
    for (let chap = 1; chap <= maxChapters; chap++) {
        const baseHp = 40 * Math.pow(1.6, chap - 1);
        const baseAtk = 6 * Math.pow(1.4, chap - 1);
        const baseDef = 2 * Math.pow(1.4, chap - 1);

        const genericNames = CHAPTER_GENERIC_BOSS_NAMES[chap] || BOSS_NAMES;

        for (let fight = 1; fight <= fightsPerChapter; fight++) {
            const isMidBoss = fight === 5;
            const isEndBoss = fight === 10;
            let items = [];

            // Generischen Namen aus dem Kapitel-Pool wählen (fight 1..4 -> index 0..3, fight 6..9 -> index 4..7)
            const genericIndex = fight < 5 ? (fight - 1) : (fight - 2);
            let name = genericNames[genericIndex % genericNames.length];

            if (isMidBoss) {
                name = CHAPTER_BOSSES[(chap - 1) * 2].name;
                items = CHAPTER_BOSSES[(chap - 1) * 2].items;
            } else if (isEndBoss) {
                name = CHAPTER_BOSSES[(chap - 1) * 2 + 1].name;
                items = CHAPTER_BOSSES[(chap - 1) * 2 + 1].items;
            }

            const multiplier = 1 + (fight * 0.1);
            const chapterExpScaling = Math.pow(1.25, chap - 1);
            bosses.push({
                id: globalId++,
                name,
                chapter: chap,
                hp: Math.floor(baseHp * multiplier * (isEndBoss ? 2 : (isMidBoss ? 1.5 : 1))),
                attack: Math.floor(baseAtk * multiplier * (isEndBoss ? 1.5 : (isMidBoss ? 1.2 : 1))),
                defense: Math.floor(baseDef * multiplier * (isEndBoss ? 1.5 : (isMidBoss ? 1.2 : 1))),
                reward: {
                    exp: Math.floor(20 * chap * chapterExpScaling * multiplier * (isEndBoss ? 3 : 1)),
                    items
                }
            });
        }
    }
    return bosses;
}