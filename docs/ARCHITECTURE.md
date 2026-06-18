# Architecture du Système de Gestion de Bibliothèque

## 🏗️ Vue d'Ensemble

Ce document décrit l'architecture microservices de l'application de gestion de bibliothèque.

## 📐 Diagramme d'Architecture

```
                                    ┌─────────────────┐
                                    │   Frontend      │
                                    │   (React)       │
                                    └────────┬────────┘
                                             │
                                             ▼
                            ┌────────────────────────────────┐
                            │      API Gateway               │
                            │  (Spring Cloud Gateway)        │
                            │  + Keycloak Security          │
                            └───┬────────────────────────┬───┘
                                │                        │
                ┌───────────────┴────────┐      ┌────────┴──────────────┐
                │                        │      │                       │
        ┌───────▼────────┐      ┌────────▼──────────┐         ┌────────▼────────┐
        │ Book Service   │      │  Loan Service     │         │ Eureka Server   │
        │ (Spring Boot)  │◄─────┤   (Node.js)       │         │ (Discovery)     │
        └───────┬────────┘      └────────┬──────────┘         └─────────────────┘
                │                        │
        ┌───────▼────────┐      ┌────────▼──────────┐
        │   H2 Database  │      │    MongoDB        │
        └────────────────┘      └───────────────────┘
                │                        │
                └────────┬───────────────┘
                         │
                  ┌──────▼────────┐
                  │   RabbitMQ    │
                  │ (Message Bus) │
                  └───────────────┘
```

## 🧩 Composants Principaux

### 1. Frontend (React)

**Port** : 3000  
**Technologie** : React 18, Material-UI  
**Responsabilités** :
- Interface utilisateur moderne et responsive
- Intégration Keycloak pour l'authentification
- Appels API via le Gateway
- Gestion des rôles utilisateur

### 2. API Gateway

**Port** : 8080  
**Technologie** : Spring Cloud Gateway  
**Responsabilités** :
- Point d'entrée unique pour tous les clients
- Routage vers les microservices
- Sécurité OAuth2/OpenID Connect avec Keycloak
- Gestion des rôles (ADMIN, LIBRARIAN, USER)
- Documentation Swagger centralisée
- Load balancing via Eureka

**Routes** :
- `/api/books/**` → Book Service
- `/api/loans/**` → Loan Service
- `/eureka/**` → Eureka Dashboard

### 3. Book Service

**Port** : 8081  
**Technologie** : Spring Boot 3.2, JPA, H2  
**Base de données** : H2 (en mémoire)  
**Responsabilités** :
- CRUD des livres
- Gestion des catégories
- Recherche de livres
- Gestion de la disponibilité
- Publication d'événements RabbitMQ

**Endpoints Principaux** :
```
GET    /books              - Liste tous les livres
GET    /books/{id}         - Détails d'un livre
GET    /books/search       - Recherche
POST   /books              - Créer un livre
PUT    /books/{id}         - Mettre à jour
DELETE /books/{id}         - Supprimer
GET    /books/{id}/availability - Disponibilité
PUT    /books/{id}/decrease-availability - Diminuer (emprunt)
PUT    /books/{id}/increase-availability - Augmenter (retour)
```

### 4. Loan Service

**Port** : 8082  
**Technologie** : Node.js 18, Express, Mongoose  
**Base de données** : MongoDB  
**Responsabilités** :
- Gestion des emprunts
- Gestion des retours
- Renouvellement des emprunts
- Détection des retards
- Communication avec Book Service (Feign-like)
- Publication d'événements RabbitMQ

**Endpoints Principaux** :
```
GET    /loans              - Liste des emprunts
GET    /loans/{id}         - Détails d'un emprunt
GET    /loans/user/{userId} - Emprunts d'un utilisateur
POST   /loans              - Créer un emprunt
PUT    /loans/{id}/return  - Retourner un livre
PUT    /loans/{id}/renew   - Renouveler un emprunt
GET    /loans/status/overdue - Emprunts en retard
GET    /loans/statistics   - Statistiques
```

### 5. Eureka Server

**Port** : 8761  
**Technologie** : Spring Cloud Netflix Eureka  
**Responsabilités** :
- Service Discovery
- Health checking
- Load balancing
- Service registration

**Services Enregistrés** :
- book-service
- loan-service
- api-gateway

### 6. Config Server

**Port** : 8888  
**Technologie** : Spring Cloud Config  
**Responsabilités** :
- Configuration centralisée
- Profils d'environnement (dev, docker, prod)
- Refresh dynamique des configurations

### 7. Keycloak

**Port** : 8180  
**Technologie** : Keycloak 23  
**Responsabilités** :
- Authentification (OAuth2/OpenID Connect)
- Gestion des utilisateurs
- Gestion des rôles
- SSO (Single Sign-On)
- Thème personnalisé

**Realm** : library-realm  
**Clients** :
- library-gateway (bearer-only)
- library-frontend (public)

**Rôles** :
- USER : Emprunt et retour de livres
- LIBRARIAN : Gestion des livres et emprunts
- ADMIN : Accès complet

### 8. RabbitMQ

**Ports** : 5672 (AMQP), 15672 (Management)  
**Technologie** : RabbitMQ 3  
**Responsabilités** :
- Message broker
- Communication asynchrone
- Event-driven architecture
- Garantie de livraison

**Exchange** : library.exchange (Topic)  
**Queues** :
- notification.queue
- statistics.queue
- loan.queue

**Événements** :
```
book.created     - Nouveau livre créé
book.updated     - Livre mis à jour
book.deleted     - Livre supprimé
book.borrowed    - Livre emprunté
book.returned    - Livre retourné
loan.created     - Nouvel emprunt
loan.returned    - Retour de livre
loan.overdue     - Emprunt en retard
loan.renewed     - Emprunt renouvelé
```

## 🔄 Patterns de Communication

### Communication Synchrone (Feign Client Pattern)

**Utilisé pour** : Opérations transactionnelles nécessitant une réponse immédiate

**Exemples** :

1. **Création d'emprunt** :
```
Client → API Gateway → Loan Service
                ↓
        Vérification disponibilité
                ↓
        Book Service (GET /books/{id}/availability)
                ↓
        Création emprunt
                ↓
        Book Service (PUT /books/{id}/decrease-availability)
```

2. **Retour de livre** :
```
Client → API Gateway → Loan Service
                ↓
        Mise à jour emprunt
                ↓
        Book Service (PUT /books/{id}/increase-availability)
```

**Avantages** :
- Cohérence transactionnelle
- Réponse immédiate
- Simplicité

**Inconvénients** :
- Couplage fort
- Point de défaillance unique

### Communication Asynchrone (RabbitMQ)

**Utilisé pour** : Notifications, statistiques, opérations non-bloquantes

**Exemples** :

1. **Notification d'emprunt** :
```
Loan Service → RabbitMQ (loan.created)
                    ↓
            Notification Queue
                    ↓
        Email Service (hypothétique)
```

2. **Statistiques** :
```
Book Service → RabbitMQ (book.borrowed)
                    ↓
            Statistics Queue
                    ↓
        Analytics Service (hypothétique)
```

3. **Rappels de retard** :
```
Loan Service → RabbitMQ (loan.overdue)
                    ↓
            Notification Queue
                    ↓
        Reminder Service (hypothétique)
```

**Avantages** :
- Découplage
- Scalabilité
- Résilience
- Traitement asynchrone

**Inconvénients** :
- Complexité accrue
- Cohérence éventuelle

## 🔐 Sécurité

### Architecture de Sécurité

```
Client → Frontend → API Gateway → Microservices
           ↓           ↓
       Keycloak ←─────┘
```

### Flux d'Authentification

1. **Login** :
   - Frontend → Keycloak (credentials)
   - Keycloak → Frontend (JWT token)

2. **Appel API** :
   - Frontend → Gateway (JWT token in header)
   - Gateway valide le token avec Keycloak
   - Gateway vérifie les rôles
   - Gateway route vers le microservice

### Règles d'Autorisation

| Endpoint | USER | LIBRARIAN | ADMIN |
|----------|------|-----------|-------|
| GET /books | ✅ | ✅ | ✅ |
| POST /books | ❌ | ✅ | ✅ |
| PUT/DELETE /books | ❌ | ✅ | ✅ |
| GET /loans (own) | ✅ | ✅ | ✅ |
| GET /loans (all) | ❌ | ✅ | ✅ |
| POST /loans | ✅ | ✅ | ✅ |
| PUT /loans/return | ✅ | ✅ | ✅ |

## 📊 Monitoring & Observabilité

### Prometheus

**Métriques collectées** :
- JVM metrics (Book Service, Gateway)
- Node.js metrics (Loan Service)
- HTTP request duration
- Business metrics (loans count, active loans)

### Grafana

**Dashboards** :
- System metrics (CPU, Memory, Disk)
- Application metrics (requests, latency)
- Business metrics (loans, books)

### Health Checks

Tous les services exposent :
- `/health` : Health check endpoint
- `/actuator/health` (Spring Boot)

## 🐳 Docker & Deployment

### Stratégie de Build

**Multi-stage builds** :
- Build stage : Compilation (Maven/npm)
- Runtime stage : Image légère (JRE/Node Alpine)

### Network

**Network** : library-network (Bridge)  
Permet la communication entre conteneurs

### Volumes

- mongodb-data : Persistance MongoDB
- prometheus-data : Métriques Prometheus
- grafana-data : Dashboards Grafana

### Health Checks

Tous les conteneurs ont des health checks :
```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:8081/actuator/health"]
  interval: 10s
  timeout: 5s
  retries: 5
```

### Ordre de Démarrage

```
1. Config Server
2. Eureka Server, RabbitMQ, MongoDB, Keycloak
3. Book Service, Loan Service
4. API Gateway
5. Frontend
6. Monitoring (Prometheus, Grafana)
```

## 🚀 Scalabilité

### Horizontal Scaling

Possibilité de scaler les microservices :
```bash
docker-compose up -d --scale book-service=3
docker-compose up -d --scale loan-service=2
```

Le Gateway fait automatiquement du load balancing via Eureka.

### Vertical Scaling

Ajuster les ressources dans docker-compose.yml :
```yaml
deploy:
  resources:
    limits:
      cpus: '1'
      memory: 1G
```

## 🔮 Extensions Possibles

1. **Circuit Breaker** : Resilience4j pour gérer les pannes
2. **Distributed Tracing** : Zipkin/Jaeger
3. **API Rate Limiting** : Redis + Spring Cloud Gateway
4. **Caching** : Redis pour les données fréquemment consultées
5. **CQRS** : Séparation lecture/écriture pour Loan Service
6. **Event Sourcing** : Historique complet des événements
7. **Kubernetes** : Orchestration en production

## 📝 Best Practices Appliquées

✅ Microservices indépendants  
✅ Service Discovery  
✅ API Gateway pattern  
✅ Configuration centralisée  
✅ Authentication & Authorization  
✅ Asynchronous messaging  
✅ Health checks  
✅ Monitoring & Metrics  
✅ Containerization  
✅ Documentation API (Swagger)  
✅ Error handling  
✅ Logging  
