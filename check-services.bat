@echo off
echo ========================================
echo   VERIFICATION DES SERVICES
echo ========================================
echo.

echo Etat des conteneurs Docker:
echo.
docker-compose ps

echo.
echo ========================================
echo   TEST DE CONNEXION AUX SERVICES
echo ========================================
echo.

echo Test Config Server (8888)...
curl -s http://localhost:8888/actuator/health >nul 2>&1 && echo [OK] Config Server || echo [ERREUR] Config Server

echo Test Eureka Server (8761)...
curl -s http://localhost:8761/actuator/health >nul 2>&1 && echo [OK] Eureka Server || echo [ERREUR] Eureka Server

echo Test Book Service (8081)...
curl -s http://localhost:8081/actuator/health >nul 2>&1 && echo [OK] Book Service || echo [ERREUR] Book Service

echo Test Loan Service (8082)...
curl -s http://localhost:8082/health >nul 2>&1 && echo [OK] Loan Service || echo [ERREUR] Loan Service

echo Test API Gateway (8080)...
curl -s http://localhost:8080/actuator/health >nul 2>&1 && echo [OK] API Gateway || echo [ERREUR] API Gateway

echo Test Keycloak (8180)...
curl -s http://localhost:8180/health/ready >nul 2>&1 && echo [OK] Keycloak || echo [ERREUR] Keycloak

echo Test RabbitMQ (15672)...
curl -s http://localhost:15672 >nul 2>&1 && echo [OK] RabbitMQ || echo [ERREUR] RabbitMQ

echo.
pause
