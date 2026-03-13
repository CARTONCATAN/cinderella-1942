@echo off
title Cinderella Website

echo Starting Cinderella Website...
echo.

:: Try Python 3
python --version >nul 2>&1
if %errorlevel% == 0 (
    echo Server running at: http://localhost:8080
    echo Press Ctrl+C to stop the server.
    start "" http://localhost:8080
    python -m http.server 8080
    goto end
)

:: Try Python (py launcher)
py --version >nul 2>&1
if %errorlevel% == 0 (
    echo Server running at: http://localhost:8080
    echo Press Ctrl+C to stop the server.
    start "" http://localhost:8080
    py -m http.server 8080
    goto end
)

:: Try Node.js with npx serve
node --version >nul 2>&1
if %errorlevel% == 0 (
    echo Server running at: http://localhost:8080
    echo Press Ctrl+C to stop the server.
    start "" http://localhost:8080
    npx serve -l 8080
    goto end
)

:: Nothing found
echo ERROR: Python or Node.js is required to run the website.
echo.
echo Please install one of the following:
echo   Python:  https://www.python.org/downloads/
echo   Node.js: https://nodejs.org/
echo.
pause

:end
