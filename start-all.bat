@echo off
echo ========================================
echo   DEMARRAGE DES SERVICES BIBLIOTHEQUE
echo ========================================
echo.

echo Verification de Docker...
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERREUR] Docker n'est pas installe ou n'est pas demarre
    echo Veuillez demarrer Docker Desktop et reessayer
    pause
    exit /b 1
)

echo [OK] Docker est pret
echo.

echo Demarrage de tous les services avec Docker Compose...
docker-compose up -d

echo.
echo Attente du demarrage des services...
timeout /t 10 /nobreak >nul

echo.
echo ========================================
echo   VERIFICATION DE L'ETAT DES SERVICES
echo ========================================
docker-compose ps

echo.
echo ========================================
echo   POINTS D'ACCES
echo ========================================
echo.
echo Frontend:       http://localhost:3000
echo API Gateway:    http://localhost:8080
echo Swagger UI:     http://localhost:8080/swagger-ui.html
echo Eureka:         http://localhost:8761
echo Keycloak:       http://localhost:8180 (admin/admin)
echo RabbitMQ:       http://localhost:15672 (guest/guest)
echo H2 Console:     http://localhost:8081/h2-console
echo Prometheus:     http://localhost:9090
echo Grafana:        http://localhost:3001 (admin/admin)
echo.
echo ========================================
echo   UTILISATEURS DE TEST
echo ========================================
echo.
echo Admin:      admin/admin123     (role: ADMIN)
echo Librarian:  librarian/librarian123  (role: LIBRARIAN)
echo User:       user/user123       (role: USER)
echo.
echo Pour voir les logs: docker-compose logs -f
echo Pour arreter: docker-compose down
echo.
pause
