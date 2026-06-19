@echo off
echo Stopping services...
docker-compose down

echo Rebuilding API Gateway and Loan Service...
docker-compose build api-gateway loan-service

echo Starting all services...
docker-compose up -d

echo Waiting for services to start...
timeout /t 30

echo Checking service status...
docker ps --filter "name=api-gateway" --filter "name=loan-service"

echo Done! Services should be ready.
