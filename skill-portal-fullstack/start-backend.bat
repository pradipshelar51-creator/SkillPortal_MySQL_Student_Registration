@echo off
cd /d "%~dp0backend"
if not exist node_modules (
  echo Installing backend packages for the first time...
  call npm install
  if errorlevel 1 pause & exit /b 1
)
echo Starting SkillPortal server...
call npm start
pause
