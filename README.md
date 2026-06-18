# Système de Gestion de Bibliothèque - Architecture Microservices

## 📚 Description du Projet

Application de gestion de bibliothèque basée sur une architecture microservices avec Spring Boot, Node.js, et des technologies cloud-native.

## 🏗️ Architecture

### Microservices
1. **book-service** (Spring Boot + H2)
   - Gestion des livres (CRUD)
   - Gestion des catégories
   - Recherche de livres

2. **loan-service** (Node.js + MongoDB)
   - Gestion des emprunts
   - Gestion des retours
   - Historique des emprunts

### Infrastructure
- **eureka-server** : Service Discovery
- **config-server** : Configuration centralisée
- **api-gateway** : Point d'entrée unique avec Spring Cloud Gateway
- **keycloak** : Authentification et autorisation (SSO)
- **rabbitmq** : Message broker pour communication asynchrone

### Frontend
- **library-frontend** : Application React avec interface moderne

## 🔐 Sécurité

- Keycloak pour l'authentification OAuth2/OpenID Connect
- Gestion des rôles : ADMIN, LIBRARIAN, USER
- Sécurisation de la Gateway
- Thème Keycloak personnalisé

## 🔄 Communication

### Synchrone (Feign Client)
1. Gateway → Book Service (recherche de livres)
2. Loan Service → Book Service (vérification disponibilité)
3. Gateway → Loan Service (création emprunt)

### Asynchrone (RabbitMQ)
1. Nouvel emprunt → Notification email
2. Retour de livre → Mise à jour statistiques
3. Livre bientôt en retard → Rappel automatique

## 🐳 Docker

Tous les services sont conteneurisés avec Docker et orchestrés via Docker Compose.

## 📊 Monitoring & Observabilité

- Prometheus : Collecte de métriques
- Grafana : Visualisation
- Swagger : Documentation API centralisée

## 🚀 Déploiement

- Docker Compose pour développement local
- Support Kubernetes pour production
- CI/CD avec GitHub Actions

## 📋 Prérequis

- Java 17+
- Node.js 18+
- Docker & Docker Compose
- Maven 3.8+
- npm/yarn

## 🏃 Démarrage Rapide

```bash
# Cloner le repository
git clone <repo-url>
cd library-microservices

# Démarrer tous les services avec Docker
docker-compose up -d

# Accéder aux interfaces
- Frontend: http://localhost:3000
- Gateway: http://localhost:8080
- Eureka: http://localhost:8761
- Keycloak: http://localhost:8180
- Swagger: http://localhost:8080/swagger-ui.html
```

## 📁 Structure du Projet

```
library-microservices/
├── book-service/           # Microservice Spring Boot
├── loan-service/           # Microservice Node.js
├── eureka-server/          # Service Discovery
├── config-server/          # Configuration Server
├── api-gateway/            # API Gateway
├── library-frontend/       # Frontend React
├── keycloak/              # Configuration Keycloak
├── docker-compose.yml     # Orchestration Docker
├── k8s/                   # Manifestes Kubernetes
└── docs/                  # Documentation
```

## 👥 Auteur

Projet réalisé dans le cadre du cours d'Architecture Microservices.

## 📅 Date de Livraison

Voir calendrier du service examen.
