# 🌌 Archiv des Vergessens V2

[![Vite](https://img.shields.io/badge/Vite-5.0+-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Preact](https://img.shields.io/badge/Preact-10.19+-673AB8?style=for-the-badge&logo=preact&logoColor=white)](https://preactjs.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

> **Die Macht der Mneme** — Ein atmosphärisches Idle- & Inkremental-Webspiel um Erinnerungen, magische Generatoren und kosmische Resonanz.

---

## 📜 Über das Projekt

**Archiv des Vergessens V2** ist ein modernes Singleplayer-Idle-Game. Spieler sammeln wertvolle **Mneme-Partikel** (Erinnerungsfragmente), um verlassene Gedanken-Archive, Seelen-Quellen und kosmische Orakel zu reaktivieren. Mit fortschreitendem Spielverlauf entfaltet sich ein immer tieferes Netzwerk mystischer Generatoren und gewaltiger Produktionsraten.

---

## ✨ Hauptfeatures

- ✦ **Manuelles Mneme-Sammeln**: Interaktives Ernten von Erinnerungs-Partikeln mit dynamischem visuellem Feedback.
- 🔮 **15 Mystische Generatoren**: Vom *Gedanken-Archiv* bis zum *Transzendenz-Nexus* und *Absoluten Chronoskop*.
- ⚡ **Meilenstein-System**: Verdopplung der Erträge alle 25 Generator-Stufen mit visuellen Fortschrittsbalken.
- 🛒 **Smart Bulk-Buying**: Multi-Kauf-Optionen (`x1`, `x10`, `x100`, `MAX`) mit exakter Kosten- und Bezahlbarkeits-Berechnung.
- 💫 **Atmosphärische UI & Visuals**:
  - Dynamisches **Ambient Particle System**
  - **Floating Text Overlay** bei Interaktionen
  - Modernes Glassmorphism-Design mit responsivem Layout
- 💾 **Automatisches Speichersystem**: Nahtlose Speicherung im `LocalStorage` sowie **Offline-Progression** beim Wiederkommen.
- ⚙️ **Pausenmenü & Einstellungen**: Erreichbar über `ESC` oder Menü-Button. Anpassbare Partikeleffekte, Texte und Sound/Volume-Settings.

---

## 🛠️ Technologie-Stack

- **Frontend Framework**: [Preact](https://preactjs.com/) (Leichtgewichtige Alternative zu React)
- **Build Tool / Dev Server**: [Vite](https://vitejs.dev/)
- **Templating**: `htm`
- **State Management**: Custom Event-based Reactive Store
- **Styling**: Vanilla CSS3 (Custom Design System mit HSL-Farbpalette & Animationen)
- **Testing**: Node.js Native Test Runner (`node --test`)

---

## 🚀 Schnellstart & Lokale Entwicklung

### Voraussetzungen
- **Node.js** (v18.0.0 oder höher empfohlen)
- **npm** (v9.0.0 oder höher)

### Automatische Einrichtung (Setup Scripts)

Für eine schnelle und einfache Einrichtung stehen plattformspezifische Einrichtungs-Skripte zur Verfügung:

- **Windows (PowerShell)**: `./setup.ps1`
- **Windows (Batch / Doppelklick)**: `setup.bat`
- **Linux / macOS (Bash)**: `./setup.sh`
- **Cross-Platform (npm)**: `npm run setup`

Diese Skripte überprüfen deine Node.js/npm-Umgebung, installieren alle Abhängigkeiten, führen die Test-Suite aus und bieten die Möglichkeit, den Dev-Server direkt zu starten.

### Manuelle Installation & Start

1. **Repository klonen & in das Hauptverzeichnis wechseln**:
   ```bash
   git clone https://github.com/Grimoire-Interactive-Studio/Archiv-des-Vergessens-V2.git
   cd Archiv-des-Vergessens-V2
   ```

2. **Abhängigkeiten installieren**:
   ```bash
   npm install
   ```

3. **Entwicklungsserver starten**:
   ```bash
   npm run dev
   ```
   Öffne danach `http://localhost:5173` im Browser.

4. **Production Build erstellen**:
   ```bash
   npm run build
   ```

5. **Tests ausführen**:
   ```bash
   npm test
   ```

---

## 📁 Projektstruktur

```
Archiv-des-Vergessens-V2/
├── .gitignore              # Repository-Ausschlussregeln
├── README.md               # Projektdokumentation
└── game_app/               # Haupt-Anwendung (Web Game)
    ├── index.html          # HTML-Einstiegspunkt
    ├── package.json        # Paketkonfiguration & Scripts
    ├── vite.config.js      # Vite Bundler Konfiguration
    └── src/
        ├── main.jsx        # App-Initialisierung & Bootstrapping
        ├── style.css       # Zentrales CSS Design System & Theme
        ├── engine/         # Mathematische Formeln & Game-Loop
        ├── persistence/    # LocalStorage & SaveManager
        ├── state/          # Central Store & Reducer Actions
        └── ui/             # Preact UI-Komponenten (App, Menü, Partikel, Floats)
```

---

## 📜 Lizenz

Dieses Projekt steht unter der **MIT-Lizenz**. Details findest du in der [LICENSE](LICENSE)-Datei.
