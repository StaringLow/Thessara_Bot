@echo off
title Thessara - Bot Discord + Dashboard
color 0D
echo.
echo  ==========================================
echo   THESSARA - Oracle de la guilde
echo  ==========================================
echo.

node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERREUR] Node.js n'est pas installe !
    echo Telecharge-le sur : https://nodejs.org
    pause
    exit
)

if not exist "node_modules" (
    echo [INFO] Installation des modules...
    npm install
    echo.
)

echo [INFO] Lancement de Thessara + Dashboard...
echo.
echo  Bot Discord    : en cours de connexion...
echo  Dashboard Web  : http://localhost:3000
echo.
node index.js
pause
