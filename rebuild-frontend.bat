@echo off
echo Stopping frontend...
docker compose stop library-frontend

echo Rebuilding Frontend...
docker compose build library-frontend

echo Starting frontend...
docker compose up -d library-frontend

echo Done! Wait 20 seconds then refresh your browser at http://localhost:3000
pause
