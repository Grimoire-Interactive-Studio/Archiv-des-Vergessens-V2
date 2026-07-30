@echo off
chcp 65001 > nul
title Archiv des Vergessens V2 - Setup

echo ================================================================
echo   🌌 Archiv des Vergessens V2 - Einrichtungs-Assistent
echo ================================================================
echo.

echo ℹ Überprüfe Node.js und npm...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ✖ Node.js wurde nicht gefunden! Bitte installiere Node.js ^(v18+^) von https://nodejs.org
    pause
    exit /b 1
)

where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo ✖ npm wurde nicht gefunden! Bitte stelle sicher, dass npm installiert ist.
    pause
    exit /b 1
)

echo ✔ Node.js und npm sind verfügbar.
echo.

echo 📦 Installiere Projekt-Abhängigkeiten (npm install)...
call npm install
if %errorlevel% neq 0 (
    echo ✖ Fehler bei der Installation!
    pause
    exit /b 1
)
echo ✔ Abhängigkeiten erfolgreich installiert.
echo.

echo 🧪 Führe Tests aus (npm test)...
call npm test
echo.

echo 🚀 Setup erfolgreich abgeschlossen!
set /p START_DEV="Möchtest du den Dev-Server jetzt starten? (J/n): "

if /i "%START_DEV%"=="n" (
    echo Einrichtung abgeschlossen. Du kannst das Spiel jederzeit mit 'npm run dev' starten.
    pause
    exit /b 0
)

echo.
echo Starte Entwicklungsserver (http://localhost:5173)...
call npm run dev
