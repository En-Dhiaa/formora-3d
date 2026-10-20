@echo off
setlocal
echo ========================================================
echo   FORMORA 3D - AI Product Packaging Studio (Windows)
echo ========================================================
echo.

set APP_DIR=%~dp0
cd /d "%APP_DIR%"

echo [1/2] Starting FORMORA 3D Production Engine on http://localhost:3000 ...
start /b "" "C:\Program Files\nodejs\node.exe" "node_modules\next\dist\bin\next" start -p 3000

echo [2/2] Opening browser ...
timeout /t 2 /nobreak >nul
start "" "http://localhost:3000"

echo FORMORA 3D Studio is active! Press Ctrl+C in this console to terminate.
pause
