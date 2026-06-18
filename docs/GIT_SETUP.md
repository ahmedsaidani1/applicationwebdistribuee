# 🔄 Guide Git - Push vers GitHub

## Étapes pour pusher le projet vers GitHub

### 1. Configuration initiale de Git (si pas déjà fait)

```bash
git config --global user.name "Votre Nom"
git config --global user.email "votre.email@example.com"
```

### 2. Initialiser le repository

```bash
git init
git add .
git commit -m "Initial commit: Library Microservices Application"
```

### 3. Ajouter le remote GitHub

```bash
git remote add origin https://github.com/ahmedsaidani1/applicationwebdistribuee.git
```

### 4. Push vers GitHub

```bash
git branch -M main
git push -u origin main
```

## Commits réguliers recommandés

Pour respecter la consigne du projet (commits réguliers), faites des commits pour chaque partie :

```bash
# Configuration initiale
git add config-server/ eureka-server/
git commit -m "feat: Add Config Server and Eureka Server"

# Book Service
git add book-service/
git commit -m "feat: Add Book Service with H2 database"

# Loan Service
git add loan-service/
git commit -m "feat: Add Loan Service with MongoDB"

# API Gateway
git add api-gateway/
git commit -m "feat: Add API Gateway with Keycloak security"

# Configuration
git add keycloak/ monitoring/ docker-compose.yml
git commit -m "feat: Add Keycloak, RabbitMQ, and monitoring setup"

# Documentation
git add docs/ README.md
git commit -m "docs: Add comprehensive documentation"

# Scripts
git add *.bat scripts/
git commit -m "chore: Add utility scripts for Windows"

# Push all commits
git push origin main
```

## Structure des commits recommandée

Pour montrer un bon historique Git :

1. **Infrastructure** : Config Server, Eureka
2. **Microservices** : Book Service, Loan Service
3. **Gateway & Security** : API Gateway, Keycloak
4. **Communication** : RabbitMQ, Feign Client
5. **Monitoring** : Prometheus, Grafana
6. **Documentation** : README, guides, API docs
7. **Deployment** : Docker, docker-compose
8. **Frontend** : React application (si créé)

## Messages de commit selon les conventions

Utilisez des préfixes pour clarifier le type de changement :

- `feat:` - Nouvelle fonctionnalité
- `fix:` - Correction de bug
- `docs:` - Documentation
- `style:` - Formatage, pas de changement de code
- `refactor:` - Refactoring du code
- `test:` - Ajout de tests
- `chore:` - Maintenance, configuration

## Vérifier le remote

```bash
git remote -v
```

Résultat attendu :
```
origin  https://github.com/ahmedsaidani1/applicationwebdistribuee.git (fetch)
origin  https://github.com/ahmedsaidani1/applicationwebdistribuee.git (push)
```
