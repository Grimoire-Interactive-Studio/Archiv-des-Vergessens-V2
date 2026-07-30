import { execSync, spawn } from 'child_process';
import readline from 'readline';
import process from 'process';

// ANSI Color Helpers
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  magenta: '\x1b[35m',
};

function logHeader(text) {
  console.log(`\n${colors.bright}${colors.cyan}════════════════════════════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}  ${text}${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}════════════════════════════════════════════════════════════════${colors.reset}\n`);
}

function logSuccess(text) {
  console.log(`${colors.green}✔ ${text}${colors.reset}`);
}

function logInfo(text) {
  console.log(`${colors.cyan}ℹ ${text}${colors.reset}`);
}

function logWarn(text) {
  console.log(`${colors.yellow}⚠ ${text}${colors.reset}`);
}

function logError(text) {
  console.log(`${colors.red}✖ ${text}${colors.reset}`);
}

async function main() {
  logHeader('🌌 Archiv des Vergessens V2 - Setup Wizard');

  // 1. Check Node.js Version
  logInfo('Überprüfe Node.js und npm Umgebung...');
  const nodeVersion = process.version;
  const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0], 10);

  if (majorVersion < 18) {
    logWarn(`Node.js Version ${nodeVersion} erkannt. Empfohlen wird v18.0.0 oder neuer.`);
  } else {
    logSuccess(`Node.js Version ${nodeVersion} erfüllt die Anforderungen.`);
  }

  // 2. Install Dependencies
  logHeader('📦 Installiere Abhängigkeiten (npm install)');
  try {
    execSync('npm install', { stdio: 'inherit' });
    logSuccess('Abhängigkeiten erfolgreich installiert.');
  } catch (err) {
    logError('Fehler bei der Installation der Abhängigkeiten.');
    process.exit(1);
  }

  // 3. Run Test Suite
  logHeader('🧪 Führe Test-Suite aus (npm test)');
  try {
    execSync('npm test', { stdio: 'inherit' });
    logSuccess('Alle Tests wurden erfolgreich bestanden!');
  } catch (err) {
    logError('Einige Tests sind fehlgeschlagen. Bitte prüfe die Fehlermeldungen.');
  }

  // 4. Ask to start Dev Server
  logHeader('🚀 Setup abgeschlossen!');
  
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question(`${colors.bright}${colors.magenta}Möchtest du den Entwicklungsserver jetzt starten? (J/n): ${colors.reset}`, (answer) => {
    rl.close();
    const cleanAnswer = answer.trim().toLowerCase();
    if (cleanAnswer === '' || cleanAnswer === 'y' || cleanAnswer === 'ja' || cleanAnswer === 'j') {
      console.log(`\n${colors.green}Starte Dev Server... (http://localhost:5173)${colors.reset}\n`);
      const devProcess = spawn('npm', ['run', 'dev'], { stdio: 'inherit', shell: true });
      devProcess.on('error', (err) => {
        logError(`Fehler beim Starten des Dev Servers: ${err.message}`);
      });
    } else {
      console.log(`\n${colors.cyan}Setup beendet. Du kannst den Dev-Server jederzeit mit 'npm run dev' starten.${colors.reset}\n`);
    }
  });
}

main().catch((err) => {
  logError(`Unerwarteter Fehler: ${err}`);
  process.exit(1);
});
