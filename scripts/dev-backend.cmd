@echo off
set "PATH=%PATH%;C:\Program Files\nodejs"
cd /d "%~dp0..\backend"
call npm run dev
