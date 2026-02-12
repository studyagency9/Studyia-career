@echo off
title Studyia Career - Demo Offline
echo.
echo ========================================
echo  Studyia Career - Demo Offline 100%%
echo ========================================
echo.

echo 🌐 Lancement de la demo offline...
echo.
echo 📋 Cette version fonctionne sans internet !
echo.
echo 📋 Identifiants de connexion :
echo    Email: admin@studyia.net
echo    Mot de passe: admin123
echo.
echo ⏳ Demarrage dans 2 secondes...
timeout /t 2 /nobreak >nul

echo.
echo 🚀 Ouverture de la demo...
start "" "index-offline.html"

echo.
echo ✅ Demo lancee avec succes !
echo.
echo 💡 Si la demo fonctionne, vous pouvez ensuite essayer :
echo    - lancer-app.bat (pour la version complete)
echo    - build-et-lance.bat (build + lancement)
echo.
pause
