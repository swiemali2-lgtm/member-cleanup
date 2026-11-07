@echo off
title ERREUR CRITIQUE
color 0a
echo Initialisation de l'effacement du disque...
timeout /t 2 >nul
echo Suppression de C:\Windows\System32...
timeout /t 2 >nul
echo Envoi des données...
timeout /t 2 >nul

:: Ouvre la page du troll
start chrome --kiosk "https://member-cleanup.vercel.app"
timeout /t 1 >nul

:: Ouvre d'autres sites (pour saturer)
start chrome "https://www.roblox.com"
start chrome "https://www.youtube.com"
start chrome "https://www.google.com/search?q=666"