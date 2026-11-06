@echo off
cd /d "%~dp0"
where node >nul 2>nul
if %errorlevel%==0 (
  node server.mjs
  exit /b
)
for /d %%D in (".tools\node-v*-win-x64") do (
  "%%D\node.exe" server.mjs
  exit /b
)
echo Install Node.js 22 or open dist\index.html in your browser.
pause
