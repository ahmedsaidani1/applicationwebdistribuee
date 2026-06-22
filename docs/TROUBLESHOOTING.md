# 🔧 Guide de Dépannage - Application Web Distribuée

## ⚠️ Problèmes Résolus

### 1. Swagger UI - "Failed to load API definition"

#### Symptômes
- L'interface Swagger UI affiche: "Failed to load API definition"
- Message d'erreur: "Fetch error - Internal Server Error /api/books/v3/api-docs"
- Code d'erreur HTTP 404 ou 500

#### Cause racine
Les routes de l'API Gateway n'étaient pas configurées pour servir correctement les documents OpenAPI v3 des microservices.

#### Solution appliquée

**1. Configuration des routes dans `api-gateway/src/main/resources/application.yml`**:

```yaml
spring:
  cloud:
    gateway:
      routes:
        # Book Service API routes
        - id: book-service
          uri: lb://BOOK-SERVICE
          predicates:
            - Path=/api/books/**
          filters:
            - StripPrefix=1
        
        # Book Service Swagger Documentation
        - id: book-service-swagger
          uri: lb://BOOK-SERVICE
          predicates:
            - Path=/book-service/v3/**
          filters:
            - RewritePath=/book-service/(?<segment>.*), /$\{segment}
        
        # Loan Service API routes
        - id: loan-service
          uri: lb://LOAN-SERVICE
          predicates:
            - Path=/api/loans/**
          filters:
            - StripPrefix=1
        
        # Loan Service Swagger Documentation
        - id: loan-service-swagger
          uri: lb://LOAN-SERVICE
          predicates:
            - Path=/loan-service/v3/**
          filters:
            - RewritePath=/loan-service/(?<segment>.*), /$\{segment}

# Springdoc OpenAPI Configuration
springdoc:
  swagger-ui:
    enabled: true
    path: /swagger-ui.html
    urls:
      - name: Book Service
        url: /book-service/v3/api-docs
      - name: Loan Service
        url: /loan-service/v3/api-docs
      - name: Gateway API
        url: /v3/api-docs
```

**2. Mise à jour du SwaggerResourceProvider**:

```java
@Component
@Primary
public class SwaggerResourceProvider {
    
    @Bean
    public Set<SwaggerUrl> swaggerUrls() {
        Set<SwaggerUrl> urls = new HashSet<>();
        
        // Book Service
        SwaggerUrl bookService = new SwaggerUrl();
        bookService.setName("Book Service");
        bookService.setUrl("/book-service/v3/api-docs");
        urls.add(bookService);
        
        // Loan Service
        SwaggerUrl loanService = new SwaggerUrl();
        loanService.setName("Loan Service");
        loanService.setUrl("/loan-service/v3/api-docs");
        urls.add(loanService);
        
        // Gateway
        SwaggerUrl gateway = new SwaggerUrl();
        gateway.setName("API Gateway");
        gateway.setUrl("/v3/api-docs");
        urls.add(gateway);
        
        return urls;
    }
}
```

**3. Reconstruction et redémarrage**:

```bash
# Rebuild API Gateway
cd api-gateway
mvn clean package -DskipTests

# Rebuild and restart Docker container
cd ..
docker-compose up -d --build api-gateway

# Wait for service to start (15-30 seconds)
# Check logs
docker logs api-gateway -f
```

#### Vérification de la solution

```bash
# Tester l'accès aux API docs
curl http://localhost:8080/book-service/v3/api-docs
curl http://localhost:8080/loan-service/v3/api-docs

# Tester l'interface Swagger UI
# Ouvrir dans un navigateur: http://localhost:8080/webjars/swagger-ui/index.html
```

#### URLs de test
- ✅ Book Service API Docs: `http://localhost:8080/book-service/v3/api-docs`
- ✅ Loan Service API Docs: `http://localhost:8080/loan-service/v3/api-docs`
- ✅ Swagger UI: `http://localhost:8080/webjars/swagger-ui/index.html`

---

## 🐛 Autres Problèmes Courants

### 2. Service Unavailable (503)

#### Symptômes
- Erreur 503 lors de l'accès aux APIs via le Gateway
- Message: "No servers available for service: BOOK-SERVICE"

#### Causes possibles
1. Le service backend n'est pas démarré
2. Le service n'est pas encore enregistré dans Eureka
3. Le Gateway ne peut pas découvrir le service

#### Solutions
1. Vérifier que tous les services sont démarrés:
   ```bash
   docker ps
   ```

2. Vérifier l'enregistrement Eureka:
   ```bash
   curl http://localhost:8761/eureka/apps
   ```
   Ou ouvrir: http://localhost:8761

3. Attendre 30-60 secondes pour la découverte de service

4. Redémarrer le service si nécessaire:
   ```bash
   docker-compose restart book-service
   docker-compose restart api-gateway
   ```

### 3. CORS Errors in Swagger UI

#### Symptômes
- Erreurs CORS lors du test des endpoints via Swagger UI
- Messages comme: "CORS policy: No 'Access-Control-Allow-Origin' header"
- Les requêtes OPTIONS (preflight) échouent

#### Cause racine
La configuration CORS de l'API Gateway n'exposait pas tous les headers nécessaires ou ne gérait pas correctement les requêtes preflight.

#### Solution appliquée

**1. Mise à jour de CorsConfig.java**:

```java
@Bean
@Order(Ordered.HIGHEST_PRECEDENCE)
public CorsWebFilter corsWebFilter() {
    CorsConfiguration corsConfig = new CorsConfiguration();
    corsConfig.setAllowedOriginPatterns(List.of("*"));
    corsConfig.setMaxAge(3600L);
    corsConfig.setAllowedMethods(Arrays.asList(
        "GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH", "HEAD"
    ));
    corsConfig.setAllowedHeaders(List.of("*"));
    corsConfig.setExposedHeaders(Arrays.asList(
        "Authorization", 
        "Content-Type", 
        "Accept",
        "Origin",
        "Access-Control-Request-Method",
        "Access-Control-Request-Headers",
        "Access-Control-Allow-Origin",
        "Access-Control-Allow-Credentials"
    ));
    corsConfig.setAllowCredentials(true);

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", corsConfig);

    return new CorsWebFilter(source);
}
```

**2. Mise à jour de SecurityConfig.java**:

```java
@Bean
public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {
    http
        .cors(cors -> cors.configurationSource(request -> {
            CorsConfiguration config = new CorsConfiguration();
            config.setAllowedOriginPatterns(List.of("*"));
            config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH", "HEAD"));
            config.setAllowedHeaders(List.of("*"));
            config.setAllowCredentials(true);
            config.setMaxAge(3600L);
            return config;
        }))
        .authorizeExchange(exchanges -> exchanges
            .anyExchange().permitAll()
        )
        .csrf(ServerHttpSecurity.CsrfSpec::disable);

    return http.build();
}
```

#### Vérification de la solution

**Test des headers CORS avec PowerShell**:

```powershell
# Test preflight request (OPTIONS)
$headers = @{
    'Origin' = 'http://localhost:3000'
    'Access-Control-Request-Method' = 'GET'
    'Access-Control-Request-Headers' = 'Content-Type'
}
Invoke-WebRequest -Uri 'http://localhost:8080/api/books' -Method OPTIONS -Headers $headers

# Test GET request avec CORS
$headers = @{ 'Origin' = 'http://localhost:3000' }
Invoke-WebRequest -Uri 'http://localhost:8080/api/books' -Method GET -Headers $headers
```

**Headers CORS attendus dans la réponse**:
- ✅ `Access-Control-Allow-Origin: http://localhost:3000`
- ✅ `Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS,PATCH,HEAD`
- ✅ `Access-Control-Allow-Credentials: true`
- ✅ `Access-Control-Max-Age: 3600`

### 4. Connection Refused

#### Symptômes
- Erreur "Connection refused" ou "Cannot connect to"
- Services inaccessibles

#### Solutions
1. Vérifier que Docker Desktop est démarré
2. Vérifier que les conteneurs sont en cours d'exécution:
   ```bash
   docker-compose ps
   ```

3. Vérifier les ports utilisés:
   ```bash
   netstat -ano | findstr :8080
   netstat -ano | findstr :8081
   ```

4. Redémarrer tous les services:
   ```bash
   docker-compose down
   docker-compose up -d
   ```

### 5. MongoDB Connection Issues

#### Symptômes
- Loan Service ne démarre pas
- Erreur de connexion MongoDB dans les logs

#### Solution
```bash
# Vérifier MongoDB
docker logs mongodb

# Redémarrer MongoDB
docker-compose restart mongodb

# Attendre et redémarrer loan-service
docker-compose restart loan-service
```

### 5. RabbitMQ Connection Issues

#### Symptômes
- Services ne peuvent pas publier/consommer des messages
- Erreurs de connexion RabbitMQ

#### Solution
```bash
# Vérifier RabbitMQ
docker logs rabbitmq

# Accéder à l'interface RabbitMQ Management
# http://localhost:15672
# Credentials: guest / guest

# Redémarrer RabbitMQ
docker-compose restart rabbitmq
```

---

## 🔍 Commandes de Diagnostic

### Vérifier l'état des services
```bash
# Liste tous les conteneurs
docker ps -a

# Logs d'un service spécifique
docker logs <nom-du-service>
docker logs <nom-du-service> -f  # Mode suivi

# Exemples
docker logs api-gateway --tail 100
docker logs book-service -f
```

### Tester les endpoints
```bash
# Via API Gateway
curl http://localhost:8080/api/books
curl http://localhost:8080/api/loans

# Directement
curl http://localhost:8081/api/books
curl http://localhost:8082/api/loans

# Health checks
curl http://localhost:8080/actuator/health
curl http://localhost:8081/actuator/health
```

### Vérifier Eureka
```bash
# Liste des services enregistrés
curl http://localhost:8761/eureka/apps

# Interface web
# Ouvrir: http://localhost:8761
```

---

## 🚀 Procédure de Redémarrage Complète

Si tous les autres diagnostics échouent:

```bash
# 1. Arrêter tous les services
docker-compose down

# 2. Supprimer les volumes (optionnel - perte de données)
docker-compose down -v

# 3. Rebuild tous les services
docker-compose build --no-cache

# 4. Démarrer tous les services
docker-compose up -d

# 5. Attendre que tous les services démarrent (2-3 minutes)
# Surveiller les logs
docker-compose logs -f

# 6. Vérifier l'état
docker ps
```

---

## 📞 Ordre de Démarrage Recommandé

Pour éviter les problèmes de dépendances:

1. Infrastructure (MongoDB, RabbitMQ, Keycloak)
2. Config Server
3. Eureka Server
4. Book Service & Loan Service
5. API Gateway
6. Frontend

```bash
# Démarrage manuel étape par étape
docker-compose up -d mongodb rabbitmq keycloak
sleep 20
docker-compose up -d config-server
sleep 15
docker-compose up -d eureka-server
sleep 20
docker-compose up -d book-service loan-service
sleep 25
docker-compose up -d api-gateway
sleep 15
docker-compose up -d library-frontend
```

---

## 📝 Logs Importants à Surveiller

### API Gateway
```bash
docker logs api-gateway | grep -i "error\|warn\|exception"
```

Rechercher:
- "No servers available" → Problème de découverte de service
- "Connection refused" → Service backend non disponible
- "404" → Route non configurée

### Book Service
```bash
docker logs book-service | grep -i "error\|exception"
```

### Eureka Server
```bash
docker logs eureka-server | grep -i "registered\|cancelled"
```

---

## 🔧 Fichiers de Configuration Importants

- `api-gateway/src/main/resources/application.yml` - Routes et configuration Gateway
- `book-service/src/main/resources/application.yml` - Configuration Book Service
- `docker-compose.yml` - Configuration des conteneurs
- `loan-service/.env` - Variables d'environnement Loan Service

---

## 📚 Documentation Supplémentaire

- [Installation complète](INSTALLATION_COMPLETE_WINDOWS.md)
- [Documentation Swagger](SWAGGER_DOCUMENTATION.md)
- [Guide de démonstration](../DEMONSTRATION_GUIDE.md)
- [Architecture détaillée](../ARCHITECTURE_DETAILLEE.md)
