@echo off
title Marlowe Dental Studio - local demo
cd /d "%~dp0"
call npm run dev -- --open
pause
