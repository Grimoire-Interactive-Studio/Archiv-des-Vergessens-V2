# Archiv des Vergessens (Singleplayer Reboot) - Agent Configuration & Guidelines

Willkommen im neugestalteten Singleplayer-Projekt **Archiv des Vergessens**.
Diese Datei dient als zentrale, stets gültige Projekt-Übersicht für alle KI-Agenten (Antigravity).

## Tech-Stack-Überblick
Dieses Projekt ist ein reines **Singleplayer Idle-RPG**:
*   **Client:** Vite & Preact / Vanilla JS.
*   **Desktop:** Tauri (optional als Desktop-Launcher).
*   **Persistenz:** Rein lokales Speichern (IndexedDB / LocalStorage / Tauri File System).
*   **Architektur:** Modularer State Store (Single Source of Truth), Unidirektionaler Datenfluss, Delta-Time Loop.

## Spezialisierte Skills
Unter `.agents/skills/` existieren themenspezifische Skills für dieses Projekt.
Konsultiere bei Arbeiten an entsprechenden Systemen die jeweiligen `SKILL.md`-Dateien:
*   `idle-progression-mechanics` (Tick-Loops, Offline-Progress)
*   `game-balancing-tuning` (Formeln, Preis-Skalierung)
*   `persistence-data` & `debugging-persistence-saves` (Lokale Savegames & Migrations)
*   `ui-frontend-components` & `canvas-rendering-lifecycle` (UI & Render-Performance)
*   `build-release-tauri` (Builds & Cross-Platform Packaging)

## Absolute, Nicht-Verhandelbare Regeln
1.  **Reiner Singleplayer:** Keine WebSockets, kein Node.js WebSocket-Server, keine Passwörter/Auth-Tokens, keine Multiplayer-Sync-Logik.
2.  **Unidirektionaler State:** Der Game State ist die einzige Wahrheitsquelle ("Single Source of Truth"). Mutationen geschehen ausschließlich über definierte Actions/Reductions.
3.  **Delta-Time & Determinismus:** Alle zeitbasierten Berechnungen basieren auf Delta-Time (`dt`), um Framerate-Unabhängigkeit und genaue Offline-Progression zu gewährleisten.
4.  **Tech-Stack-Treue:** Keine schwerfälligen neuen Frameworks ohne Rücksprache.
5.  **Response-Format:** Antworten sollen kurz und prägnant sein, geänderte Dateien mit Pfaden auflisten und neu vs. erweitert trennen.
