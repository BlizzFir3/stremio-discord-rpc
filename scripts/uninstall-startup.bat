@echo off
title Stremio-Discord RPC Service Uninstallation
color 0E

echo ===================================================
echo     Removing Automatic Startup
echo ===================================================
echo.

set "REG_KEY_NAME=StremioDiscordRPC"

echo [Action] Removing registry key...
reg delete "HKCU\Software\Microsoft\Windows\CurrentVersion\Run" /v "%REG_KEY_NAME%" /f >nul 2>&1

if %errorlevel% equ 0 (
    color 0A
    echo.
    echo [SUCCESS] Service successfully removed from Windows startup.
) else (
    echo.
    echo [INFO] Registry key did not exist or was already removed.
)

echo.
pause