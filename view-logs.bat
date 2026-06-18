@echo off
echo ========================================
echo   VISUALISATION DES LOGS
echo ========================================
echo.
echo Choisissez le service:
echo.
echo 1. Tous les services
echo 2. Config Server
echo 3. Eureka Server
echo 4. Book Service
echo 5. Loan Service
echo 6. API Gateway
echo 7. Keycloak
echo 8. RabbitMQ
echo 9. MongoDB
echo 0. Quitter
echo.

set /p choice="Votre choix (1-9): "

if "%choice%"=="1" docker-compose logs -f
if "%choice%"=="2" docker-compose logs -f config-server
if "%choice%"=="3" docker-compose logs -f eureka-server
if "%choice%"=="4" docker-compose logs -f book-service
if "%choice%"=="5" docker-compose logs -f loan-service
if "%choice%"=="6" docker-compose logs -f api-gateway
if "%choice%"=="7" docker-compose logs -f keycloak
if "%choice%"=="8" docker-compose logs -f rabbitmq
if "%choice%"=="9" docker-compose logs -f mongodb
if "%choice%"=="0" exit

pause
