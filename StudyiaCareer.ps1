# Studyia Career - Lanceur PowerShell
Write-Host "╔══════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                    Studyia Career                           ║" -ForegroundColor Cyan
Write-Host "║                  Application Offline                         ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Vérification du build
if (-not (Test-Path "dist\index.html")) {
    Write-Host "❌ Build non trouvé !" -ForegroundColor Red
    Write-Host ""
    Write-Host "📋 Étapes nécessaires :" -ForegroundColor Yellow
    Write-Host "   1. Ouvrir un terminal dans ce dossier"
    Write-Host "   2. Lancer : npm run build"
    Write-Host "   3. Relancer ce fichier"
    Write-Host ""
    Read-Host "Appuyez sur Entrée pour quitter"
    exit
}

Write-Host "✅ Build trouvé !" -ForegroundColor Green
Write-Host ""
Write-Host "🚀 Lancement de Studyia Career..." -ForegroundColor Yellow
Write-Host ""
Write-Host "📋 Identifiants de connexion :" -ForegroundColor Cyan
Write-Host "   ┌─────────────────────────────────┐" -ForegroundColor Gray
Write-Host "   │ Email:    admin@studyia.net     │" -ForegroundColor White
Write-Host "   │ Password: admin123              │" -ForegroundColor White
Write-Host "   └─────────────────────────────────┘" -ForegroundColor Gray
Write-Host ""
Write-Host "⏳ Démarrage dans 3 secondes..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

Write-Host ""
Write-Host "🌐 Ouverture de l'application..." -ForegroundColor Green

# Lancement de l'application
Set-Location "dist"
Start-Process "index.html"

Write-Host ""
Write-Host "╔══════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║                ✅ Application lancée !                      ║" -ForegroundColor Green
Write-Host "║                                                              ║" -ForegroundColor Green
Write-Host "║  💡 Cette fenêtre peut être fermée                          ║" -ForegroundColor Green
Write-Host "║  🌐 L'application s'ouvre dans votre navigateur             ║" -ForegroundColor Green
Write-Host "╚══════════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""

Start-Sleep -Seconds 5
