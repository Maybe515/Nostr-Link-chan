@echo off
echo Starting Nostr-Link-chan Bot...

cd /d "%~dp0"
call npm install
call npm start

pause