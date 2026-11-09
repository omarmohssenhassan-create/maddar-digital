@echo off
setlocal
cd /d "%~dp0"
set "MADDAR_NODE="
for /d %%D in (".tools\node-v*-win-x64") do (
  if exist "%%~fD\node.exe" set "MADDAR_NODE=%%~fD\node.exe"
)
if defined MADDAR_NODE goto run
where node >nul 2>nul
if errorlevel 1 goto missing_node
set "MADDAR_NODE=node"

:run
"%MADDAR_NODE%" scripts\start-local.mjs %*
set "MADDAR_EXIT=%errorlevel%"
if not "%MADDAR_EXIT%"=="0" pause
exit /b %MADDAR_EXIT%

:missing_node
echo Node.js was not found. Install Node.js 22 or restore the bundled .tools folder.
pause
exit /b 1
