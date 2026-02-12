@echo off
title Studyia Career - Mode Offline Simple
echo.
echo ========================================
echo  Studyia Career - Mode Offline Simple
echo ========================================
echo.

echo 🔍 Verification du build...
if not exist "dist\index.html" (
    echo.
    echo ❌ Build non trouve !
    echo.
    echo 📋 Etapes necessaires :
    echo    1. Ouvrir un terminal dans ce dossier
    echo    2. Lancer : npm run build
    echo    3. Relancer ce fichier
    echo.
    pause
    exit /b 1
)

echo ✅ Build trouve !
echo.
echo 🌐 Lancement en mode offline...
echo.
echo 📋 Identifiants de connexion :
echo    Email: admin@studyia.net
echo    Mot de passe: admin123
echo.
echo 💡 Astuce : Si l'ecran est blanc, attendez 10-15 secondes
echo    L'application charge les ressources en local...
echo.
echo ⏳ Demarrage dans 3 secondes...
timeout /t 3 /nobreak >nul

echo.
echo 🚀 Ouverture de l'application...
start "" "http://localhost:3000" --new-window --incognito

echo.
echo ✅ Application lancee !
echo.
echo 🔍 Si probleme :
echo    1. Attendez 15 secondes
echo    2. Essayez de rafraichir la page (F5)
echo    3. Verifiez la console (F12) pour les erreurs
echo.
pause
