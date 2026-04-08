@echo off
cd /d "%~dp0.."

echo === Installing frontend dependencies ===
cd frontend
call npm install
cd ..

echo.
echo === Setting up Python virtual environment ===
cd backend
python -m venv .venv
call .venv\Scripts\activate.bat
pip install -r requirements.txt
call deactivate
cd ..

echo.
echo === Done! Run scripts\run.bat to start ===
pause
