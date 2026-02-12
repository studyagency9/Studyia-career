@echo off
chcp 65001 >nul
title Studyia Career - Build + EXE
mode con: cols=80 lines=30
color 0B

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║              Studyia Career - Build + EXE                    ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

echo 🔨 Étape 1: Build de l'application...
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
echo ✅ Build réussi !
echo.
echo 🚀 Étape 2: Création et lancement de l'EXE...
echo.
echo 📋 Identifiants de connexion :
echo    ┌─────────────────────────────────┐
echo    │ Email:    admin@studyia.net     │
echo    │ Password: admin123              │
echo    └─────────────────────────────────┘
echo.
echo ⏳ Démarrage dans 2 secondes...
timeout /t 2 /nobreak >nul

echo.
echo 🌐 Lancement de l'EXE...
call StudyiaCareer.exe

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║              ✅ Processus terminé !                        ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
pause
