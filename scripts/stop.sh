#!/bin/bash

echo "🛑 Stopping Library Microservices Application..."
echo ""

docker-compose down

echo ""
echo "✅ All services stopped"
echo ""
echo "To remove volumes (delete data), run: docker-compose down -v"
