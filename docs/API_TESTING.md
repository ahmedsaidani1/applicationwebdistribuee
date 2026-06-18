# Guide de Test des APIs

Ce document contient des exemples de requêtes pour tester tous les endpoints de l'application.

## 🔐 Authentification

### 1. Obtenir un Token JWT

```bash
# User Token
export USER_TOKEN=$(curl -s -X POST "http://localhost:8180/realms/library-realm/protocol/openid-connect/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=user" \
  -d "password=user123" \
  -d "grant_type=password" \
  -d "client_id=library-frontend" | jq -r '.access_token')

# Librarian Token
export LIBRARIAN_TOKEN=$(curl -s -X POST "http://localhost:8180/realms/library-realm/protocol/openid-connect/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=librarian" \
  -d "password=librarian123" \
  -d "grant_type=password" \
  -d "client_id=library-frontend" | jq -r '.access_token')

# Admin Token
export ADMIN_TOKEN=$(curl -s -X POST "http://localhost:8180/realms/library-realm/protocol/openid-connect/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=admin" \
  -d "password=admin123" \
  -d "grant_type=password" \
  -d "client_id=library-frontend" | jq -r '.access_token')

echo "Tokens obtained successfully!"
```

## 📚 Book Service APIs

### Obtenir tous les livres

```bash
curl -X GET "http://localhost:8080/api/books" \
  -H "Authorization: Bearer $USER_TOKEN" | jq
```

### Obtenir un livre par ID

```bash
curl -X GET "http://localhost:8080/api/books/1" \
  -H "Authorization: Bearer $USER_TOKEN" | jq
```

### Rechercher des livres

```bash
curl -X GET "http://localhost:8080/api/books/search?keyword=clean" \
  -H "Authorization: Bearer $USER_TOKEN" | jq
```

### Obtenir les livres disponibles

```bash
curl -X GET "http://localhost:8080/api/books/available" \
  -H "Authorization: Bearer $USER_TOKEN" | jq
```

### Vérifier la disponibilité d'un livre

```bash
curl -X GET "http://localhost:8080/api/books/1/availability" \
  -H "Authorization: Bearer $USER_TOKEN" | jq
```

### Créer un nouveau livre (LIBRARIAN/ADMIN)

```bash
curl -X POST "http://localhost:8080/api/books" \
  -H "Authorization: Bearer $LIBRARIAN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Microservices Patterns",
    "author": "Chris Richardson",
    "isbn": "978-1-617-29424-2",
    "publisher": "Manning",
    "publicationDate": "2018-11-20",
    "category": "Technologie",
    "totalCopies": 5,
    "description": "Design patterns pour microservices",
    "imageUrl": "https://via.placeholder.com/150"
  }' | jq
```

### Mettre à jour un livre (LIBRARIAN/ADMIN)

```bash
curl -X PUT "http://localhost:8080/api/books/1" \
  -H "Authorization: Bearer $LIBRARIAN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Le Petit Prince - Édition Spéciale",
    "author": "Antoine de Saint-Exupéry",
    "isbn": "978-0-156-01219-1",
    "publisher": "Gallimard",
    "publicationDate": "1943-04-06",
    "category": "Fiction",
    "totalCopies": 10,
    "description": "Un conte philosophique et poétique - Édition spéciale",
    "imageUrl": "https://via.placeholder.com/150",
    "status": "AVAILABLE"
  }' | jq
```

### Supprimer un livre (ADMIN)

```bash
curl -X DELETE "http://localhost:8080/api/books/6" \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

## 🏷️ Category APIs

### Obtenir toutes les catégories

```bash
curl -X GET "http://localhost:8080/api/books/categories" \
  -H "Authorization: Bearer $USER_TOKEN" | jq
```

### Créer une catégorie

```bash
curl -X POST "http://localhost:8080/api/books/categories" \
  -H "Authorization: Bearer $LIBRARIAN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Biographie",
    "description": "Livres biographiques"
  }' | jq
```

## 📖 Loan Service APIs

### Créer un emprunt (Communication Synchrone)

```bash
curl -X POST "http://localhost:8080/api/loans" \
  -H "Authorization: Bearer $USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "bookId": 1,
    "userId": "user-001",
    "userName": "John Doe",
    "userEmail": "john.doe@example.com",
    "notes": "Premier emprunt"
  }' | jq
```

**Ce scénario démontre** :
- ✅ Communication synchrone (Loan Service → Book Service)
- ✅ Vérification de disponibilité via Feign-like call
- ✅ Diminution de la disponibilité
- ✅ Publication d'événement RabbitMQ (asynchrone)

### Obtenir tous les emprunts

```bash
curl -X GET "http://localhost:8080/api/loans" \
  -H "Authorization: Bearer $LIBRARIAN_TOKEN" | jq
```

### Obtenir les emprunts d'un utilisateur

```bash
curl -X GET "http://localhost:8080/api/loans/user/user-001" \
  -H "Authorization: Bearer $USER_TOKEN" | jq
```

### Obtenir les emprunts actifs

```bash
curl -X GET "http://localhost:8080/api/loans/status/active" \
  -H "Authorization: Bearer $LIBRARIAN_TOKEN" | jq
```

### Obtenir les emprunts en retard

```bash
curl -X GET "http://localhost:8080/api/loans/status/overdue" \
  -H "Authorization: Bearer $LIBRARIAN_TOKEN" | jq
```

### Retourner un livre (Communication Synchrone)

```bash
# Remplacer {loan_id} par un ID réel
curl -X PUT "http://localhost:8080/api/loans/{loan_id}/return" \
  -H "Authorization: Bearer $USER_TOKEN" | jq
```

**Ce scénario démontre** :
- ✅ Communication synchrone (Loan Service → Book Service)
- ✅ Augmentation de la disponibilité
- ✅ Publication d'événement RabbitMQ (asynchrone)

### Renouveler un emprunt

```bash
# Remplacer {loan_id} par un ID réel
curl -X PUT "http://localhost:8080/api/loans/{loan_id}/renew" \
  -H "Authorization: Bearer $USER_TOKEN" | jq
```

### Vérifier les emprunts en retard (Communication Asynchrone)

```bash
curl -X POST "http://localhost:8080/api/loans/check-overdue" \
  -H "Authorization: Bearer $LIBRARIAN_TOKEN" | jq
```

**Ce scénario démontre** :
- ✅ Publication d'événements `loan.overdue` via RabbitMQ
- ✅ Communication asynchrone pour notifications

### Obtenir les statistiques

```bash
curl -X GET "http://localhost:8080/api/loans/statistics" \
  -H "Authorization: Bearer $LIBRARIAN_TOKEN" | jq
```

## 🔄 Scénarios de Test Complets

### Scénario 1 : Cycle complet d'emprunt et retour

```bash
# 1. Vérifier la disponibilité du livre
echo "1. Vérification de la disponibilité..."
curl -s -X GET "http://localhost:8080/api/books/2/availability" \
  -H "Authorization: Bearer $USER_TOKEN" | jq

# 2. Créer un emprunt
echo -e "\n2. Création de l'emprunt..."
LOAN_RESPONSE=$(curl -s -X POST "http://localhost:8080/api/loans" \
  -H "Authorization: Bearer $USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "bookId": 2,
    "userId": "user-002",
    "userName": "Jane Smith",
    "userEmail": "jane.smith@example.com"
  }')
echo $LOAN_RESPONSE | jq

LOAN_ID=$(echo $LOAN_RESPONSE | jq -r '._id')
echo "Loan ID: $LOAN_ID"

# 3. Vérifier que la disponibilité a diminué
echo -e "\n3. Vérification de la nouvelle disponibilité..."
sleep 2
curl -s -X GET "http://localhost:8080/api/books/2/availability" \
  -H "Authorization: Bearer $USER_TOKEN" | jq

# 4. Attendre un peu et retourner le livre
echo -e "\n4. Retour du livre..."
sleep 2
curl -s -X PUT "http://localhost:8080/api/loans/$LOAN_ID/return" \
  -H "Authorization: Bearer $USER_TOKEN" | jq

# 5. Vérifier que la disponibilité a augmenté
echo -e "\n5. Vérification finale de la disponibilité..."
sleep 2
curl -s -X GET "http://localhost:8080/api/books/2/availability" \
  -H "Authorization: Bearer $USER_TOKEN" | jq
```

### Scénario 2 : Communication Asynchrone avec RabbitMQ

```bash
# 1. Créer plusieurs emprunts (génère des événements)
for i in {1..3}; do
  echo "Creating loan $i..."
  curl -s -X POST "http://localhost:8080/api/loans" \
    -H "Authorization: Bearer $USER_TOKEN" \
    -H "Content-Type: application/json" \
    -d "{
      \"bookId\": $i,
      \"userId\": \"user-00$i\",
      \"userName\": \"Test User $i\",
      \"userEmail\": \"user$i@example.com\"
    }" | jq -c
  sleep 1
done

# 2. Vérifier les messages dans RabbitMQ
echo -e "\n\nCheck RabbitMQ Management UI:"
echo "http://localhost:15672 (guest/guest)"
echo "Go to Queues → notification.queue to see the messages"
```

### Scénario 3 : Test des Rôles et Permissions

```bash
# Test 1: USER ne peut pas créer de livre
echo "Test 1: USER trying to create a book (should fail)..."
curl -X POST "http://localhost:8080/api/books" \
  -H "Authorization: Bearer $USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Book",
    "author": "Test Author",
    "isbn": "123-456",
    "publisher": "Test",
    "publicationDate": "2024-01-01",
    "category": "Test",
    "totalCopies": 1
  }'

# Test 2: LIBRARIAN peut créer un livre
echo -e "\n\nTest 2: LIBRARIAN creating a book (should succeed)..."
curl -X POST "http://localhost:8080/api/books" \
  -H "Authorization: Bearer $LIBRARIAN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Book",
    "author": "Test Author",
    "isbn": "123-456-789",
    "publisher": "Test Publisher",
    "publicationDate": "2024-01-01",
    "category": "Technologie",
    "totalCopies": 1,
    "description": "Test book"
  }' | jq

# Test 3: USER peut emprunter un livre
echo -e "\n\nTest 3: USER creating a loan (should succeed)..."
curl -X POST "http://localhost:8080/api/loans" \
  -H "Authorization: Bearer $USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "bookId": 3,
    "userId": "user-test",
    "userName": "Test User",
    "userEmail": "test@example.com"
  }' | jq
```

## 📊 Monitoring APIs

### Prometheus Metrics

```bash
# Book Service Metrics
curl -s http://localhost:8081/actuator/prometheus | grep -E "^(jvm|http|book)"

# Loan Service Metrics
curl -s http://localhost:8082/metrics | grep -E "(loans|http)"

# Gateway Metrics
curl -s http://localhost:8080/actuator/prometheus | grep -E "^(gateway|http)"
```

### Health Checks

```bash
# All services
for service in config-server:8888 eureka-server:8761 book-service:8081 api-gateway:8080; do
  IFS=':' read -r name port <<< "$service"
  echo "$name:"
  curl -s "http://localhost:$port/actuator/health" | jq -c
  echo ""
done

# Loan Service
curl -s http://localhost:8082/health | jq
```

## 🐰 RabbitMQ Management

### Vérifier les Queues via API

```bash
# Login to RabbitMQ API
curl -u guest:guest http://localhost:15672/api/queues | jq

# Get specific queue
curl -u guest:guest http://localhost:15672/api/queues/%2F/notification.queue | jq

# Get messages (without removing them)
curl -u guest:guest -X POST http://localhost:15672/api/queues/%2F/notification.queue/get \
  -H "Content-Type: application/json" \
  -d '{"count":10,"ackmode":"ack_requeue_true","encoding":"auto"}' | jq
```

## 📖 Swagger Documentation

Accéder à la documentation interactive :

```bash
# Ouvrir dans le navigateur
open http://localhost:8080/swagger-ui.html

# Ou utiliser curl pour obtenir la spec OpenAPI
curl -s http://localhost:8080/v3/api-docs | jq > openapi-spec.json
```

## 🧪 Scripts de Test Automatisés

Créer un fichier `test-all.sh` :

```bash
#!/bin/bash

echo "🧪 Running API Tests..."
source ./api-test-examples.sh

# Run all test scenarios
test_authentication
test_book_operations
test_loan_operations
test_permissions
test_communication_sync
test_communication_async

echo "✅ All tests completed!"
```

## 💡 Conseils

1. **Tokens expirés** : Les tokens JWT expirent après quelques minutes. Regénérez-les si nécessaire.

2. **IDs dynamiques** : Remplacez `{loan_id}` par des IDs réels obtenus des réponses API.

3. **RabbitMQ** : Utilisez l'interface web pour visualiser les messages en temps réel.

4. **Logs** : Suivez les logs pour voir la communication entre services :
   ```bash
   docker-compose logs -f book-service loan-service
   ```

5. **Base de données** : 
   - H2 Console: http://localhost:8081/h2-console
   - MongoDB: Utilisez MongoDB Compass avec `mongodb://admin:admin123@localhost:27017`
