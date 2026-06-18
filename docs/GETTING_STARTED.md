# Guide de Démarrage - Système de Gestion de Bibliothèque

## 🎯 Objectif

Ce guide vous aidera à démarrer l'application de gestion de bibliothèque basée sur une architecture microservices.

## 📋 Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- **Docker Desktop** : [Télécharger ici](https://www.docker.com/products/docker-desktop)
- **Docker Compose** : Inclus avec Docker Desktop
- **Git** : [Télécharger ici](https://git-scm.com/downloads)

Optionnel pour le développement local :
- Java 17+ et Maven 3.8+
- Node.js 18+ et npm
- MongoDB Compass (pour visualiser la base de données)

## 🚀 Démarrage Rapide avec Docker

### 1. Cloner le Repository

```bash
git clone <votre-repo-url>
cd library-microservices
```

### 2. Démarrer tous les services

```bash
docker-compose up -d
```

Cette commande va :
- Télécharger toutes les images nécessaires
- Construire les microservices
- Démarrer tous les conteneurs
- Configurer le réseau

⏱️ **Temps estimé** : 5-10 minutes lors du premier démarrage

### 3. Vérifier le statut des services

```bash
docker-compose ps
```

Tous les services doivent être dans l'état "Up" et "healthy".

### 4. Accéder aux interfaces

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:3000 | Interface utilisateur React |
| **API Gateway** | http://localhost:8080 | Point d'entrée des APIs |
| **Swagger UI** | http://localhost:8080/swagger-ui.html | Documentation API centralisée |
| **Eureka Dashboard** | http://localhost:8761 | Service Discovery |
| **Keycloak** | http://localhost:8180 | Authentification (admin/admin) |
| **RabbitMQ Management** | http://localhost:15672 | Message Broker (guest/guest) |
| **Prometheus** | http://localhost:9090 | Métriques |
| **Grafana** | http://localhost:3001 | Dashboards (admin/admin) |
| **H2 Console** | http://localhost:8081/h2-console | Base de données Book Service |

## 👥 Comptes de Test

### Keycloak Users

| Username | Password | Rôles | Description |
|----------|----------|-------|-------------|
| admin | admin123 | ADMIN, LIBRARIAN, USER | Accès complet |
| librarian | librarian123 | LIBRARIAN, USER | Gestion des livres et emprunts |
| user | user123 | USER | Emprunt et retour de livres |

## 🧪 Tester l'Application

### Scénario 1 : Communication Synchrone (Feign Client)

**Objectif** : Créer un emprunt (Loan Service → Book Service)

1. Obtenir un token d'authentification :

```bash
curl -X POST "http://localhost:8180/realms/library-realm/protocol/openid-connect/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=user" \
  -d "password=user123" \
  -d "grant_type=password" \
  -d "client_id=library-frontend"
```

2. Créer un emprunt :

```bash
curl -X POST "http://localhost:8080/api/loans" \
  -H "Authorization: Bearer <YOUR_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "bookId": 1,
    "userId": "user-001",
    "userName": "John Doe",
    "userEmail": "john@example.com"
  }'
```

**Ce qui se passe** :
- Loan Service vérifie la disponibilité via Book Service (appel synchrone)
- Si disponible, crée l'emprunt
- Diminue la disponibilité du livre (appel synchrone)

### Scénario 2 : Communication Asynchrone (RabbitMQ)

**Objectif** : Notification lors d'un nouvel emprunt

1. Créer un emprunt (comme ci-dessus)

2. Vérifier les événements dans RabbitMQ :
   - Ouvrir http://localhost:15672
   - Login: guest/guest
   - Aller dans "Queues"
   - Observer les messages dans `notification.queue`

**Ce qui se passe** :
- Loan Service publie un événement `loan.created`
- RabbitMQ achemine l'événement vers les queues appropriées
- Les consommateurs peuvent traiter l'événement de manière asynchrone

### Scénario 3 : Vérification des Retards

```bash
curl -X POST "http://localhost:8080/api/loans/check-overdue" \
  -H "Authorization: Bearer <YOUR_TOKEN>"
```

**Ce qui se passe** :
- Identifie tous les emprunts en retard
- Publie des événements `loan.overdue` via RabbitMQ
- Peut déclencher des notifications par email

### Scénario 4 : Retour de Livre

```bash
curl -X PUT "http://localhost:8080/api/loans/{loanId}/return" \
  -H "Authorization: Bearer <YOUR_TOKEN>"
```

**Ce qui se passe** :
- Marque l'emprunt comme retourné
- Augmente la disponibilité du livre (synchrone via Feign)
- Publie un événement `loan.returned` (asynchrone via RabbitMQ)

## 📊 Monitoring

### Prometheus

1. Accéder à http://localhost:9090
2. Exemples de requêtes :
   - `loans_total` : Total des emprunts
   - `active_loans` : Emprunts actifs
   - `http_request_duration_seconds` : Durée des requêtes

### Grafana

1. Accéder à http://localhost:3001
2. Login : admin/admin
3. Ajouter un dashboard pour visualiser les métriques

## 🔍 Vérifier les Logs

### Voir les logs d'un service

```bash
docker-compose logs -f book-service
docker-compose logs -f loan-service
docker-compose logs -f api-gateway
```

### Voir tous les logs

```bash
docker-compose logs -f
```

## 🛑 Arrêter l'Application

### Arrêter tous les services

```bash
docker-compose down
```

### Arrêter et supprimer les volumes (données)

```bash
docker-compose down -v
```

## 🔧 Développement Local

### Démarrer uniquement l'infrastructure

```bash
docker-compose up -d mongodb rabbitmq eureka-server config-server keycloak
```

### Démarrer Book Service en local

```bash
cd book-service
mvn spring-boot:run
```

### Démarrer Loan Service en local

```bash
cd loan-service
npm install
npm run dev
```

## ❓ Problèmes Courants

### Les services ne démarrent pas

1. Vérifier que Docker est en cours d'exécution
2. Vérifier les ports disponibles
3. Augmenter les ressources Docker (Memory: 4GB minimum)

### Erreur de connexion Eureka

- Attendre 1-2 minutes pour que tous les services s'enregistrent
- Vérifier le dashboard Eureka : http://localhost:8761

### Erreur d'authentification

- Vérifier que Keycloak est démarré : http://localhost:8180
- Réimporter le realm si nécessaire

## 📚 Ressources Supplémentaires

- [Documentation Docker](https://docs.docker.com/)
- [Spring Cloud Documentation](https://spring.io/projects/spring-cloud)
- [Keycloak Documentation](https://www.keycloak.org/documentation)
- [RabbitMQ Tutorials](https://www.rabbitmq.com/tutorials)

## 🎓 Prochaines Étapes

1. Explorer la documentation Swagger
2. Tester différents scénarios d'emprunts
3. Personnaliser le thème Keycloak
4. Ajouter des dashboards Grafana
5. Déployer sur le cloud (AWS, Azure, etc.)
