@echo off
echo ========================================
echo   RECONSTRUCTION DE TOUS LES SERVICES
echo ========================================
echo.
echo ATTENTION: Cette operation va:
echo - Arreter tous les services
echo - Reconstruire toutes les images Docker
echo - Redemarrer tous les services
echo.
echo Cela peut prendre 10-15 minutes.
echo.
set /p confirm="Continuer? (O/N): "

if /i not "%confirm%"=="O" (
    echo Operation annulee
    pause
    exit /b
)

echo.
echo Arret des services...
docker-compose down

echo.
echo Reconstruction des images (sans cache)...
docker-compose build --no-cache

echo.
echo Demarrage des services...
docker-compose up -d

echo.
echo Attente du demarrage...
timeout /t 15 /nobreak >nul

echo.
echo [OK] Reconstruction terminee!
echo.
docker-compose ps

echo.
pause
