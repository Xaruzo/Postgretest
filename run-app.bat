@echo off
TITLE PostgreSQL Node.js Website
echo Starting PostgreSQL Node.js Website...
echo.
echo 1. Checking for node_modules...
if not exist "node_modules\" (
    echo node_modules not found. Installing dependencies...
    call npm install
)

echo 2. Starting the server...
echo Access your website at http://localhost:3000
echo Press Ctrl+C to stop the server.
echo.

npm start
pause
