/**
 * Skill Tree Definition (Path of Exile style graph)
 * Nodes have types: 'start', 'minor', 'notable', 'keystone'
 * Coordinates (x, y) are relative to canvas center (0,0) or absolute grid.
 */

export const SKILL_TREE_NODES = {
  // Center Hub
  root: {
    id: 'root',
    name: 'Funke des Bewusstseins',
    type: 'start',
    icon: '✨',
    x: 0,
    y: 0,
    description: 'Der Ursprung aller Erinnerungen. Ermöglicht das Beschreiten der Pfade.',
    stats: { clickPower: 0 },
    connections: ['arch_1', 'mnem_1', 'chron_1']
  },

  // --- PFAD DES ARCHIVARS (Oben: Passiv & Generatoren) ---
  arch_1: {
    id: 'arch_1',
    name: 'Ordnung im Geist',
    type: 'minor',
    icon: '📜',
    x: 0,
    y: -100,
    description: '+5% Ertrag aller Generatoren',
    stats: { generatorYieldPct: 5 },
    connections: ['root', 'arch_2']
  },
  arch_2: {
    id: 'arch_2',
    name: 'Inschrift der Ewigkeit',
    type: 'minor',
    icon: '📚',
    x: -80,
    y: -180,
    description: '+8% Ertrag aller Generatoren',
    stats: { generatorYieldPct: 8 },
    connections: ['arch_1', 'arch_notable_1']
  },
  arch_notable_1: {
    id: 'arch_notable_1',
    name: 'Meister-Archivar',
    type: 'notable',
    icon: '🏛️',
    x: 0,
    y: -260,
    description: '+20% Ertrag aller Generatoren & -5% Generator-Baukosten',
    stats: { generatorYieldPct: 20, buildingCostDiscountPct: 5 },
    connections: ['arch_2', 'arch_3']
  },
  arch_3: {
    id: 'arch_3',
    name: 'Seelen-Verflechtung',
    type: 'minor',
    icon: '🔮',
    x: 80,
    y: -340,
    description: '+15% Ertrag aller Generatoren',
    stats: { generatorYieldPct: 15 },
    connections: ['arch_notable_1', 'arch_keystone']
  },
  arch_keystone: {
    id: 'arch_keystone',
    name: 'Ahnenresonanz',
    type: 'keystone',
    icon: '👑',
    x: 0,
    y: -420,
    description: 'KEYSTONE: +50% Ertrag aller Generatoren & Verdoppelt Meilenstein-Boni.',
    stats: { generatorYieldPct: 50, doubleMilestoneBonus: true },
    connections: ['arch_3']
  },

  // --- PFAD DES MNEMONIKERS (Unten Rechts: Aktive Klicks & Krits) ---
  mnem_1: {
    id: 'mnem_1',
    name: 'Schärfung der Gedanken',
    type: 'minor',
    icon: '⚡',
    x: 120,
    y: 70,
    description: '+25% Klick-Ertrag',
    stats: { clickYieldPct: 25 },
    connections: ['root', 'mnem_2']
  },
  mnem_2: {
    id: 'mnem_2',
    name: 'Synapsen-Impuls',
    type: 'minor',
    icon: '💥',
    x: 210,
    y: 130,
    description: '+3% Kritische Klick-Chance & +25% Krit-Schaden',
    stats: { critChancePct: 3, critDamagePct: 25 },
    connections: ['mnem_1', 'mnem_notable_1']
  },
  mnem_notable_1: {
    id: 'mnem_notable_1',
    name: 'Eindringlicher Blitz',
    type: 'notable',
    icon: '🧠',
    x: 280,
    y: 220,
    description: '+50% Klick-Ertrag & +5% Krit-Chance',
    stats: { clickYieldPct: 50, critChancePct: 5 },
    connections: ['mnem_2', 'mnem_3']
  },
  mnem_3: {
    id: 'mnem_3',
    name: 'Erinnerungs-Strom',
    type: 'minor',
    icon: '🌊',
    x: 320,
    y: 320,
    description: '+50% Krit-Schaden',
    stats: { critDamagePct: 50 },
    connections: ['mnem_notable_1', 'mnem_keystone']
  },
  mnem_keystone: {
    id: 'mnem_keystone',
    name: 'Gedankenblitz',
    type: 'keystone',
    icon: '⚡',
    x: 360,
    y: 420,
    description: 'KEYSTONE: Klicks gewähren 10-fachen Ertrag bei Kritischen Treffern und verdoppeln EXP-Gewinn.',
    stats: { superCritEnabled: true, expBoostPct: 30 },
    connections: ['mnem_3']
  },

  // --- PFAD DES CHRONANTEN (Unten Links: Kosten & EXP) ---
  chron_1: {
    id: 'chron_1',
    name: 'Fluss der Zeit',
    type: 'minor',
    icon: '⏳',
    x: -120,
    y: 70,
    description: '-3% Generator-Baukosten',
    stats: { buildingCostDiscountPct: 3 },
    connections: ['root', 'chron_2']
  },
  chron_2: {
    id: 'chron_2',
    name: 'Echos der Vergangenheit',
    type: 'minor',
    icon: '🌀',
    x: -210,
    y: 130,
    description: '+15% EXP-Gewinn',
    stats: { expBoostPct: 15 },
    connections: ['chron_1', 'chron_notable_1']
  },
  chron_notable_1: {
    id: 'chron_notable_1',
    name: 'Zeitverzerrung',
    type: 'notable',
    icon: '🌌',
    x: -280,
    y: 220,
    description: '-8% Generator-Baukosten & +25% EXP-Gewinn',
    stats: { buildingCostDiscountPct: 8, expBoostPct: 25 },
    connections: ['chron_2', 'chron_3']
  },
  chron_3: {
    id: 'chron_3',
    name: 'Chrono-Ernte',
    type: 'minor',
    icon: '🕒',
    x: -320,
    y: 320,
    description: '+20% EXP-Gewinn',
    stats: { expBoostPct: 20 },
    connections: ['chron_notable_1', 'chron_keystone']
  },
  chron_keystone: {
    id: 'chron_keystone',
    name: 'Zeitraffer-Matrize',
    type: 'keystone',
    icon: '⏱️',
    x: -360,
    y: 420,
    description: 'KEYSTONE: Jeder Stufenaufstieg gewährt sofort 60 Sekunden Mneme-Produktion.',
    stats: { levelUpBurstSeconds: 60 },
    connections: ['chron_3']
  }
};
