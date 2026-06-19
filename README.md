# Library Management System - Microservices Architecture

Application web distribuée de gestion de bibliothèque basée sur une architecture microservices.

## 📋 Architecture

### Microservices
- **Book Service** (Spring Boot + H2) - Gestion des livres
- **Loan Service** (Node.js + MongoDB) - Gestion des emprunts
- **API Gateway** (Spring Cloud Gateway) - Point d'entrée unique
- **Config Server** (Spring Cloud Config) - Configuration centralisée
- **Eureka Server** - Service Discovery

### Infrastructure
- **Keycloak** - Authentification OAuth2/OIDC
- **RabbitMQ** - Communication asynchrone
- **MongoDB** - Base de données pour Loan Service
- **H2** - Base de données pour Book Service
- **Prometheus + Grafana** - Monitoring

### Frontend
- **React** + Material-UI - Interface utilisateur

## 🚀 Démarrage Rapide

### Prérequis
- Docker Desktop
- Git

### Lancement
```bash
docker compose up -d
```

### Accès aux Services
- **Frontend**: http://localhost:3000
- **Keycloak Admin**: http://localhost:8180/admin (admin/admin)
- **Book Service**: http://localhost:8081
- **Loan Service**: http://localhost:8082
- **H2 Console**: http://localhost:8081/h2-console
- **Eureka Dashboard**: http://localhost:8761
- **Prometheus**: http://localhost:9090
- **Grafana**: http://localhost:3001 (admin/admin)
- **RabbitMQ Management**: http://localhost:15672 (guest/guest)

## 👥 Utilisateurs de Test

| Username | Password | Roles |
|----------|----------|-------|
| admin | admin123 | ADMIN, LIBRARIAN, USER |
| librarian | librarian123 | LIBRARIAN, USER |
| user | user123 | USER |

## ✨ Fonctionnalités

### Gestion des Livres (Book Service)
- ✅ Créer, lire, modifier, supprimer des livres
- ✅ Recherche de livres
- ✅ Vérification de disponibilité
- ✅ H2 Console pour inspection de la BD
- ✅ Swagger Documentation: http://localhost:8081/swagger-ui.html

### Gestion des Emprunts (Loan Service)
- ✅ Emprunter un livre
- ✅ Retourner un livre
- ✅ Renouveler un emprunt
- ✅ Historique des emprunts par utilisateur
- ✅ Statistiques
- ✅ Swagger Documentation: http://localhost:8082/v3/api-docs

### Communication
- **Synchrone**: Book Service ↔ Loan Service (vérification disponibilité)
- **Asynchrone**: RabbitMQ (événements loan.created, loan.returned)

### Sécurité
- **Keycloak**: Authentification et autorisation
- **Rôles**: ADMIN, LIBRARIAN, USER
- **JWT Tokens**: Validation côté services

## 🏗️ Architecture Technique

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │
       ├─→ http://localhost:8180 (Keycloak Auth)
       │
       └─→ http://localhost:3000 (Frontend)
              │
              ├─→ http://localhost:8081 (Book Service)
              │      │
              │      ├─→ H2 Database
              │      └─→ RabbitMQ Publisher
              │
              └─→ http://localhost:8082 (Loan Service)
                     │
                     ├─→ MongoDB
                     └─→ RabbitMQ Consumer
```

## 📊 Service Discovery

Tous les services s'enregistrent automatiquement auprès d'Eureka:
- BOOK-SERVICE
- LOAN-SERVICE  
- API-GATEWAY

Voir le dashboard: http://localhost:8761

## 🔧 Configuration H2 Console

- **JDBC URL**: `jdbc:h2:mem:bookdb`
- **Username**: `sa`
- **Password**: _(laisser vide)_

## 📦 Structure du Projet

```
.
├── api-gateway/           # Spring Cloud Gateway
├── book-service/          # Service de gestion des livres
├── config-server/         # Configuration centralisée
├── eureka-server/         # Service Discovery
├── loan-service/          # Service de gestion des emprunts
├── library-frontend/      # Application React
├── keycloak/             # Configuration Keycloak
├── monitoring/           # Prometheus + Grafana
└── docker-compose.yml    # Orchestration Docker
```

## 🔄 Communication Asynchrone (RabbitMQ)

### Événements
- `loan.created` - Publié lors de la création d'un emprunt
- `loan.returned` - Publié lors du retour d'un livre

### Queues
- `loan.queue` - Traitement des événements d'emprunt

## 📝 Technologies Utilisées

### Backend
- Spring Boot 3.2.0
- Spring Cloud (Gateway, Config, Netflix Eureka)
- Node.js + Express
- Spring Security OAuth2 Resource Server
- Spring Data JPA
- Mongoose (MongoDB ODM)

### Frontend
- React 18
- Material-UI (MUI)
- Keycloak.js
- Axios

### Infrastructure
- Docker & Docker Compose
- Keycloak 23.0
- RabbitMQ 3
- MongoDB 6.0
- H2 Database
- Prometheus
- Grafana

## 🎯 Points Clés du Projet

1. **Architecture Microservices** - Services découplés et indépendants
2. **Service Discovery** - Enregistrement automatique avec Eureka
3. **Configuration Centralisée** - Config Server
4. **Sécurité** - Authentification Keycloak avec gestion des rôles
5. **Communication Synchrone** - REST APIs
6. **Communication Asynchrone** - RabbitMQ pour événements
7. **Monitoring** - Prometheus + Grafana
8. **Containerisation** - Déploiement Docker complet
9. **Documentation API** - Swagger/OpenAPI

## 🐛 Dépannage

### Services ne démarrent pas
```bash
docker compose down
docker compose up -d
```

### RabbitMQ non connecté
```bash
docker compose restart rabbitmq loan-service
```

### H2 Console inaccessible
- Vérifier que le Book Service est démarré
- Attendre 30 secondes après le démarrage
- URL: http://localhost:8081/h2-console

## 📚 Documentation API

- **Book Service**: http://localhost:8081/swagger-ui.html
- **Loan Service**: http://localhost:8082/v3/api-docs

## 🔐 Note sur la Sécurité

L'API Gateway est configuré mais la validation JWT se fait directement au niveau de chaque microservice pour garantir la sécurité. Chaque service valide les tokens JWT émis par Keycloak.

## 📄 Licence

Projet académique - Application Web Distribuée

---
**Développé avec**: Spring Boot, Node.js, React, Keycloak, RabbitMQ, Docker
