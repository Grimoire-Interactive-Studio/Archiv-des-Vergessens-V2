#!/usr/bin/env bash

# Colors
CYAN='\033[1;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
RESET='\033[0m'

echo -e "${CYAN}════════════════════════════════════════════════════════════════${RESET}"
echo -e "${CYAN}  🌌 Archiv des Vergessens V2 - Einrichtungs-Assistent${RESET}"
echo -e "${CYAN}════════════════════════════════════════════════════════════════${RESET}\n"

# 1. Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}✖ Node.js wurde nicht gefunden! Bitte installiere Node.js (v18+) von https://nodejs.org${RESET}"
    exit 1
fi

NODE_VER=$(node -v)
echo -e "${GREEN}✔ Node.js $NODE_VER gefunden.${RESET}"

# 2. Check npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}✖ npm wurde nicht gefunden! Bitte stelle sicher, dass npm installiert ist.${RESET}"
    exit 1
fi

NPM_VER=$(npm -v)
echo -e "${GREEN}✔ npm $NPM_VER gefunden.${RESET}\n"

# 3. Install Dependencies
echo -e "${CYAN}📦 Installiere Projekt-Abhängigkeiten (npm install)...${RESET}"
if npm install; then
    echo -e "${GREEN}✔ Abhängigkeiten wurden erfolgreich installiert.${RESET}\n"
else
    echo -e "${RED}✖ Fehler bei der Installation der Abhängigkeiten.${RESET}"
    exit 1
fi

# 4. Run Test Suite
echo -e "${CYAN}🧪 Führe Test-Suite aus (npm test)...${RESET}"
npm test
echo ""

# 5. Launch Option
echo -e "${GREEN}🚀 Setup abgeschlossen!${RESET}"
read -p "Möchtest du den Dev-Server jetzt starten? (J/n): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Nn]$ ]]; then
    echo -e "${CYAN}Setup beendet. Starte das Spiel jederzeit mit: npm run dev${RESET}"
else
    echo -e "${GREEN}Starte Entwicklungsserver unter http://localhost:5173 ...${RESET}"
    npm run dev
fi
