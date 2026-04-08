@echo off
cd /d "%~dp0.."

echo === Starting Next.js frontend (with Flask backend via concurrently) ===
cd frontend
call npm run dev

pause