Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "Launching VayuSaathi - Clean Air Companion" -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Cyan

$pythonCmd = Get-Command python, py -ErrorAction SilentlyContinue | Select-Object -First 1

if ($pythonCmd) {
    Write-Host "Starting Python FastAPI Server..." -ForegroundColor Yellow
    python run_server.py
} else {
    Write-Host "Python not detected in PATH. Launching frontend directly in default browser..." -ForegroundColor Yellow
    Start-Process "$PSScriptRoot\frontend\index.html"
}
