@echo off
setlocal
cd /d "%~dp0"
title FD Trend - Fashion Design Platform

echo ==============================================
echo   FD TREND - FASHION DESIGN JOURNAL
   echo ==============================================
echo.
echo This launcher checks dependencies, then opens the API and website in separate terminals.
echo First-time setup can take a few minutes.
echo.

if not exist "Backend\node_modules" (
  echo Installing backend dependencies...
  pushd Backend
  call npm.cmd install
  if errorlevel 1 (echo Backend install failed. Check Node.js/npm and try again.& pause & exit /b 1)
  popd
)

if not exist "Frontend\node_modules" (
  echo Installing frontend dependencies...
  pushd Frontend
  call npm.cmd install
  if errorlevel 1 (echo Frontend install failed. Check Node.js/npm and try again.& pause & exit /b 1)
  popd
)

start "FD Trend API - Port 5000" cmd /k "cd /d ""%~dp0Backend"" && npm.cmd run dev"
timeout /t 3 /nobreak >nul
start "FD Trend Website - Port 3000" cmd /k "cd /d ""%~dp0Frontend"" && npm.cmd run dev"
timeout /t 3 /nobreak >nul
start "" "http://localhost:3000/"
echo.
echo Keep both terminal windows open while using FD Trend.
echo Website: http://localhost:3000/
echo API:     http://localhost:5000/
echo.
pause
