# ==============================================================================
# Archiv des Vergessens V2 - PowerShell Setup Script
# ==============================================================================

$ErrorActionPreference = "Stop"

function Write-Banner {
    Write-Host ""
    Write-Host "════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
    Write-Host "  🌌 Archiv des Vergessens V2 - Einrichtungs-Assistent" -ForegroundColor Cyan
    Write-Host "════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
    Write-Host ""
}

Write-Banner

# 1. Check Node.js
Write-Host "ℹ Überprüfe Node.js Installation..." -ForegroundColor Yellow
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "✖ Node.js wurde nicht gefunden! Bitte installiere Node.js (v18+) von https://nodejs.org" -ForegroundColor Red
    exit 1
}

$nodeVer = node -v
Write-Host "✔ Node.js $nodeVer gefunden." -ForegroundColor Green

# 2. Check npm
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Host "✖ npm wurde nicht gefunden! Bitte stelle sicher, dass npm installiert ist." -ForegroundColor Red
    exit 1
}

$npmVer = npm -v
Write-Host "✔ npm $npmVer gefunden." -ForegroundColor Green

# 3. Install Dependencies
Write-Host ""
Write-Host "📦 Installiere Projekt-Abhängigkeiten (npm install)..." -ForegroundColor Cyan
try {
    npm install
    Write-Host "✔ Abhängigkeiten wurden erfolgreich installiert." -ForegroundColor Green
} catch {
    Write-Host "✖ Fehler beim Installieren der Abhängigkeiten!" -ForegroundColor Red
    exit 1
}

# 4. Run Test Suite
Write-Host ""
Write-Host "🧪 Führe Test-Suite aus (npm test)..." -ForegroundColor Cyan
try {
    npm test
    Write-Host "✔ Alle Tests wurden erfolgreich bestanden." -ForegroundColor Green
} catch {
    Write-Host "⚠ Einige Tests konnten nicht ausgeführt werden oder sind fehlgeschlagen." -ForegroundColor Yellow
}

# 5. Launch Option
Write-Host ""
Write-Host "🚀 Setup abgeschlossen!" -ForegroundColor Green
$response = Read-Host "Möchtest du den Dev-Server jetzt starten? (J/n)"

if ($response -eq "" -or $response -eq "j" -or $response -eq "ja" -or $response -eq "y") {
    Write-Host ""
    Write-Host "Starte Entwicklungsserver unter http://localhost:5173 ..." -ForegroundColor Cyan
    npm run dev
} else {
    Write-Host ""
    Write-Host "Einrichtung abgeschlossen. Starte das Spiel jederzeit mit: npm run dev" -ForegroundColor Cyan
}
