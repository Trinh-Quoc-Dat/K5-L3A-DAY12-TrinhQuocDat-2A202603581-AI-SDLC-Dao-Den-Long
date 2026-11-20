@echo off
cd /d "%~dp0"
where py >nul 2>nul
if %errorlevel%==0 (
  py src\run.py
) else (
  python src\run.py
)
pause
