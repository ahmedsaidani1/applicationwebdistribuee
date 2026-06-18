#!/bin/bash

echo "🚀 Starting Library Microservices Application..."
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop first."
    exit 1
fi

# Start all services
echo "📦 Starting all services..."
docker-compose up -d

echo ""
echo "⏳ Waiting for services to be healthy..."
echo ""

# Wait for services to be ready
sleep 10

# Check service health
check_service() {
    local service=$1
    local url=$2
    local max_attempts=30
    local attempt=0

    while [ $attempt -lt $max_attempts ]; do
        if curl -s "$url" > /dev/null 2>&1; then
            echo -e "${GREEN}✅ $service is ready${NC}"
            return 0
        fi
        attempt=$((attempt + 1))
        sleep 2
    done
    echo -e "${YELLOW}⚠️  $service is taking longer than expected${NC}"
    return 1
}

# Check each service
check_service "Config Server" "http://localhost:8888/actuator/health"
check_service "Eureka Server" "http://localhost:8761/actuator/health"
check_service "Book Service" "http://localhost:8081/actuator/health"
check_service "Loan Service" "http://localhost:8082/health"
check_service "API Gateway" "http://localhost:8080/actuator/health"
check_service "Keycloak" "http://localhost:8180/health/ready"
check_service "RabbitMQ" "http://localhost:15672"

echo ""
echo "🎉 All services are up and running!"
echo ""
echo "📚 Access points:"
echo "  - Frontend:       http://localhost:3000"
echo "  - API Gateway:    http://localhost:8080"
echo "  - Swagger:        http://localhost:8080/swagger-ui.html"
echo "  - Eureka:         http://localhost:8761"
echo "  - Keycloak:       http://localhost:8180 (admin/admin)"
echo "  - RabbitMQ:       http://localhost:15672 (guest/guest)"
echo "  - Prometheus:     http://localhost:9090"
echo "  - Grafana:        http://localhost:3001 (admin/admin)"
echo ""
echo "👥 Test users:"
echo "  - admin/admin123 (ADMIN)"
echo "  - librarian/librarian123 (LIBRARIAN)"
echo "  - user/user123 (USER)"
echo ""
echo "📖 See docs/GETTING_STARTED.md for more information"
