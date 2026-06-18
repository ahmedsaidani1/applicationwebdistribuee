@echo off
echo ========================================
echo   ARRET DES SERVICES BIBLIOTHEQUE
echo ========================================
echo.

docker-compose down

echo.
echo [OK] Tous les services ont ete arretes
echo.
echo Pour supprimer aussi les donnees: docker-compose down -v
echo.
pause
