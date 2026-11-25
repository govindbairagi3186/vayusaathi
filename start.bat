@echo off
echo ========================================================
echo Starting VayuSaathi - Urban Air Quality Assistant
echo ========================================================

python -c "import uvicorn, fastapi" >nul 2>&1
if %ERRORLEVEL% equ 0 (
    echo Python and FastAPI detected. Starting backend server...
    python run_server.py
    pause
    exit /b
)

py -c "import uvicorn, fastapi" >nul 2>&1
if %ERRORLEVEL% equ 0 (
    echo Python launcher detected. Starting backend server...
    py run_server.py
    pause
    exit /b
)

echo Launching VayuSaathi standalone interface in your default browser...
start "" "%~dp0frontend\index.html"
