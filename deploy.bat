@echo off
:: 2025-11-29 uni
title simticket deployment
color 03
echo ---- Pulling from git repo ----
git pull

echo ---- Building the project ----
call _deploy.bat

echo ---- Restarting the app ----
pm2 delete simticket-app
pm2 start ecosystem.config.js

echo ---- Done ----
pause>nul