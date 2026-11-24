@echo off
echo ========================================================
echo Starting VayuSaathi - Urban Air Quality Assistant
echo ========================================================

where python >nul 2>&1
if %ERRORLEVEL% equ 0 (
    echo Python detected. Starting backend application server...
    python run_server.py
    pause
    exit /b
)

where py >nul 2>&1
if %ERRORLEVEL% equ 0 (
    echo Python launcher (py) detected. Starting backend server...
    py run_server.py
    pause
    exit /b
)

echo Python is not detected in system PATH.
echo Launching VayuSaathi frontend directly in your default browser...
start "" "%~dp0frontend\index.html"
echo.
echo Application loaded. To enable full GenAI backend capabilities,
echo install Python 3.10+ from python.org or Microsoft Store.
pause
