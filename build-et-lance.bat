@echo off
title Studyia Career - Build + Lanceur Offline
echo.
echo ========================================
echo  Studyia Career - Build Auto + Lanceur
echo ========================================
echo.

echo 🔨 Etape 1: Build de l'application...
echo.
call npm run build

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ Erreur lors du build !
    echo.
    pause
    exit /b 1
)

echo.
echo ✅ Build reussi !
echo.
echo 🚀 Etape 2: Lancement de l'application...
echo.
echo 📋 Identifiants de connexion :
echo    Email: admin@studyia.net
echo    Mot de passe: admin123
echo.
echo ⏳ Demarrage dans 2 secondes...
timeout /t 2 /nobreak >nul

echo.
echo 🌐 Ouverture de l'application...
cd dist
start index.html

echo.
echo 🎉 Application lancee avec succes !
echo 💡 Cette fenetre peut etre fermee.
echo.
pause
