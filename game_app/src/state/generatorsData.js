/**
 * Generator Metadaten & Visuals
 */

export const GENERATOR_ICONS = {
  gedankenArchiv: '📜',
  seelenQuell: '💧',
  chronoKristall: '🔮',
  astralResonator: '🌌',
  aetherBibliothek: '📚',
  schattenWebstuhl: '🕸️',
  kosmischesOrakel: '👁️',
  traumAltar: '⛩️',
  ewigkeitsSpire: '🏰',
  vergessensRiss: '🕳️',
  urzeitKatalysator: '🧪',
  singularitaetsKern: '⚛️',
  omniscenzMatrix: '🌐',
  transzendenzNexus: '✨',
  absolutesChronoskop: '⏳'
};

export function getGeneratorIcon(key) {
  return GENERATOR_ICONS[key] || '🔮';
}

export default GENERATOR_ICONS;
