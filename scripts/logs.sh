#!/bin/bash

# Script to view logs of specific services

if [ -z "$1" ]; then
    echo "Usage: ./logs.sh <service-name>"
    echo ""
    echo "Available services:"
    echo "  - all               (all services)"
    echo "  - config-server"
    echo "  - eureka-server"
    echo "  - book-service"
    echo "  - loan-service"
    echo "  - api-gateway"
    echo "  - keycloak"
    echo "  - rabbitmq"
    echo "  - mongodb"
    echo "  - prometheus"
    echo "  - grafana"
    exit 1
fi

if [ "$1" = "all" ]; then
    docker-compose logs -f
else
    docker-compose logs -f "$1"
fi
