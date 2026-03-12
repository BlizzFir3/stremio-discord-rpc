@echo off
title Stremio-Discord RPC Service Installation
color 0B

echo ===================================================
echo     Configuring Automatic Startup
echo ===================================================
echo.

set "EXE_NAME=stremio-rpc.exe"
set "EXE_PATH=%~dp0%EXE_NAME%"
set "REG_KEY_NAME=StremioDiscordRPC"

if not exist "%EXE_PATH%" (
    color 0C
    echo [CRITICAL ERROR] Could not find '%EXE_NAME%'.
    echo Make sure this .bat script is in the same folder as the executable.
    echo.
    pause
    exit /b 1
)

if not exist "%~dp0.env" (
    color 0E
    echo [WARNING] The '.env' file is missing in this folder.
    echo The daemon will start on boot, but will crash without credentials.
    echo.
)

echo [Action] Registering service in user registry...
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Run" /v "%REG_KEY_NAME%" /t REG_SZ /d "\"%EXE_PATH%\"" /f >nul

if %errorlevel% equ 0 (
    color 0A
    echo.
    echo [SUCCESS] The daemon will now start automatically in the background!
    echo Registered path: "%EXE_PATH%"
    echo.
    echo IMPORTANT: If you move this 'bin' folder elsewhere on your PC, 
    echo you must double-click this script again to update the path.
) else (
    color 0C
    echo.
    echo [ERROR] Failed to write to the registry. 
    echo Try running this script as Administrator if the issue persists.
)

echo.
pause