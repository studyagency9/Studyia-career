@echo off
title Studyia Career - Lanceur Offline
echo.
echo ========================================
echo    Studyia Career - Mode Offline
echo ========================================
echo.

echo � Verification du build...
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
echo � Lancement de l'application autonome...
echo.
echo 📋 Identifiants de connexion :
echo    Email: admin@studyia.net
echo    Mot de passe: admin123
echo.
echo ⏳ Demarrage dans 3 secondes...
timeout /t 3 /nobreak >nul

echo.
echo 🌐 Ouverture de l'application...
cd dist
start index.html

echo.
echo ✅ Application lancee !
echo 💡 Cette fenetre peut etre fermee.
echo.
pause
