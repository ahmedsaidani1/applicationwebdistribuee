# 🚀 GUIDE D'INSTALLATION COMPLET - WINDOWS

## ⚠️ IMPORTANT
Ce guide vous accompagne **ÉTAPE PAR ÉTAPE** pour installer et configurer TOUT ce qui est nécessaire pour ce projet.

---

## 📋 TABLE DES MATIÈRES

1. [Installation Docker Desktop](#1-installation-docker-desktop)
2. [Installation Java 17](#2-installation-java-17)
3. [Installation Maven](#3-installation-maven)
4. [Installation Node.js](#4-installation-nodejs)
5. [Installation MongoDB](#5-installation-mongodb)
6. [Installation Git](#6-installation-git)
7. [Vérification des Installations](#7-vérification-des-installations)
8. [Configuration du Projet](#8-configuration-du-projet)
9. [Démarrage des Services](#9-démarrage-des-services)
10. [Résolution des Problèmes](#10-résolution-des-problèmes)

---

## 1. INSTALLATION DOCKER DESKTOP

Docker va nous permettre d'exécuter Keycloak, RabbitMQ, MongoDB, et tous les services.

### Étape 1.1 : Télécharger Docker Desktop

1. Allez sur : https://www.docker.com/products/docker-desktop
2. Cliquez sur **"Download for Windows"**
3. Le fichier `Docker Desktop Installer.exe` va se télécharger (environ 500MB)

### Étape 1.2 : Installer Docker Desktop

1. **Double-cliquez** sur `Docker Desktop Installer.exe`
2. Cochez **"Use WSL 2 instead of Hyper-V"** (recommandé)
3. Cliquez sur **"OK"**
4. Attendez l'installation (5-10 minutes)
5. Cliquez sur **"Close and restart"**

### Étape 1.3 : Premier démarrage de Docker

1. **Redémarrez votre PC** (important !)
2. Cherchez **"Docker Desktop"** dans le menu démarrer
3. **Lancez Docker Desktop**
4. Acceptez les conditions d'utilisation
5. Attendez que Docker démarre (vous verrez "Docker Desktop is running" en bas)

### Étape 1.4 : Vérifier Docker

Ouvrez **PowerShell** (clic droit sur Windows → PowerShell) :

```powershell
docker --version
docker-compose --version
```

✅ **Résultat attendu** :
```
Docker version 24.0.x
Docker Compose version v2.x.x
```

❌ **Si ça ne marche pas** :
- Redémarrez Docker Desktop
- Redémarrez votre PC
- Vérifiez que Docker Desktop est bien lancé (icône dans la barre des tâches)

---

## 2. INSTALLATION JAVA 17

Java est nécessaire pour les microservices Spring Boot (Book Service, Gateway, Eureka, Config Server).

### Étape 2.1 : Télécharger Java 17

1. Allez sur : https://adoptium.net/
2. Cliquez sur **"Download"**
3. Choisissez :
   - **Version** : 17 (LTS)
   - **Operating System** : Windows
   - **Architecture** : x64
4. Cliquez sur **".msi"** pour télécharger

### Étape 2.2 : Installer Java 17

1. **Double-cliquez** sur le fichier `.msi` téléchargé
2. Cliquez sur **"Next"**
3. **IMPORTANT** : Cochez **"Set JAVA_HOME variable"**
4. **IMPORTANT** : Cochez **"Add to PATH"**
5. Cliquez sur **"Next"** puis **"Install"**
6. Attendez la fin de l'installation
7. Cliquez sur **"Finish"**

### Étape 2.3 : Vérifier Java

Ouvrez une **NOUVELLE fenêtre PowerShell** :

```powershell
java -version
```

✅ **Résultat attendu** :
```
openjdk version "17.0.x"
```

❌ **Si ça ne marche pas** :
- Fermez et rouvrez PowerShell
- Redémarrez votre PC

---

## 3. INSTALLATION MAVEN

Maven compile et construit les projets Spring Boot.

### Étape 3.1 : Télécharger Maven

1. Allez sur : https://maven.apache.org/download.cgi
2. Trouvez **"Binary zip archive"**
3. Cliquez sur `apache-maven-3.9.x-bin.zip`

### Étape 3.2 : Installer Maven

1. **Extrayez** le zip dans `C:\Program Files\`
2. Vous devriez avoir : `C:\Program Files\apache-maven-3.9.x\`
3. **Renommez** le dossier en : `C:\Program Files\Maven`

### Étape 3.3 : Ajouter Maven au PATH

1. Appuyez sur **Windows + Pause** (ou clic droit sur "Ce PC" → Propriétés)
2. Cliquez sur **"Paramètres système avancés"**
3. Cliquez sur **"Variables d'environnement"**
4. Dans **"Variables système"**, trouvez **"Path"**, cliquez sur **"Modifier"**
5. Cliquez sur **"Nouveau"**
6. Ajoutez : `C:\Program Files\Maven\bin`
7. Cliquez sur **"OK"** partout

### Étape 3.4 : Vérifier Maven

Ouvrez une **NOUVELLE fenêtre PowerShell** :

```powershell
mvn -version
```

✅ **Résultat attendu** :
```
Apache Maven 3.9.x
```

---

## 4. INSTALLATION NODE.JS

Node.js est nécessaire pour le Loan Service et le Frontend.

### Étape 4.1 : Télécharger Node.js

1. Allez sur : https://nodejs.org/
2. Téléchargez la version **LTS** (18.x ou 20.x)
3. Choisissez le fichier `.msi` pour Windows

### Étape 4.2 : Installer Node.js

1. **Double-cliquez** sur le fichier `.msi`
2. Cliquez sur **"Next"** plusieurs fois
3. **Acceptez** les conditions
4. **Laissez** toutes les options par défaut
5. Cliquez sur **"Install"**
6. Attendez la fin de l'installation
7. Cliquez sur **"Finish"**

### Étape 4.3 : Vérifier Node.js

Ouvrez une **NOUVELLE fenêtre PowerShell** :

```powershell
node --version
npm --version
```

✅ **Résultat attendu** :
```
v18.x.x (ou v20.x.x)
9.x.x (ou 10.x.x)
```

---

## 5. INSTALLATION MONGODB (Optionnel pour développement local)

⚠️ **Note** : MongoDB sera déjà disponible via Docker, mais vous pouvez installer MongoDB Compass pour visualiser la base de données.

### Étape 5.1 : Télécharger MongoDB Compass

1. Allez sur : https://www.mongodb.com/try/download/compass
2. Cliquez sur **"Download"**

### Étape 5.2 : Installer MongoDB Compass

1. **Double-cliquez** sur le fichier téléchargé
2. Attendez l'installation automatique
3. MongoDB Compass se lance automatiquement

---

## 6. INSTALLATION GIT

Git est nécessaire pour cloner et gérer le code.

### Étape 6.1 : Télécharger Git

1. Allez sur : https://git-scm.com/download/win
2. Le téléchargement démarre automatiquement

### Étape 6.2 : Installer Git

1. **Double-cliquez** sur le fichier téléchargé
2. Cliquez sur **"Next"** plusieurs fois
3. **Laissez** toutes les options par défaut
4. Cliquez sur **"Install"**
5. Cliquez sur **"Finish"**

### Étape 6.3 : Vérifier Git

Ouvrez une **NOUVELLE fenêtre PowerShell** :

```powershell
git --version
```

✅ **Résultat attendu** :
```
git version 2.x.x
```

---

## 7. VÉRIFICATION DES INSTALLATIONS

### Vérification Complète

Copiez et collez ces commandes dans **PowerShell** :

```powershell
Write-Host "=== VÉRIFICATION DES INSTALLATIONS ===" -ForegroundColor Green
Write-Host ""

Write-Host "1. Docker:" -ForegroundColor Yellow
docker --version
docker-compose --version
Write-Host ""

Write-Host "2. Java:" -ForegroundColor Yellow
java -version
Write-Host ""

Write-Host "3. Maven:" -ForegroundColor Yellow
mvn -version
Write-Host ""

Write-Host "4. Node.js:" -ForegroundColor Yellow
node --version
npm --version
Write-Host ""

Write-Host "5. Git:" -ForegroundColor Yellow
git --version
Write-Host ""

Write-Host "=== FIN DE LA VÉRIFICATION ===" -ForegroundColor Green
```

✅ **Toutes les commandes doivent afficher une version**

❌ **Si une commande ne fonctionne pas** :
1. Fermez et rouvrez PowerShell
2. Redémarrez votre PC
3. Réinstallez le logiciel concerné

---

## 8. CONFIGURATION DU PROJET

### Étape 8.1 : Naviguer vers le dossier du projet

Ouvrez **PowerShell** et naviguez vers votre projet :

```powershell
cd "C:\Users\ahmed\Desktop\application web distribuée"
```

### Étape 8.2 : Vérifier la structure du projet

```powershell
dir
```

✅ **Vous devriez voir** :
- book-service
- loan-service
- api-gateway
- eureka-server
- config-server
- docker-compose.yml
- README.md

### Étape 8.3 : Créer le fichier .env pour Loan Service

```powershell
cd loan-service
Copy-Item .env.example .env
cd ..
```

### Étape 8.4 : Vérifier Docker Desktop

1. **Ouvrez Docker Desktop**
2. Vérifiez qu'il affiche **"Docker Desktop is running"**
3. Augmentez les ressources si nécessaire :
   - Cliquez sur **⚙️ Settings**
   - Allez dans **"Resources"**
   - **Memory** : Minimum 4GB (recommandé 6GB)
   - **CPUs** : Minimum 2 (recommandé 4)
   - Cliquez sur **"Apply & Restart"**

---

## 9. DÉMARRAGE DES SERVICES

### 🎯 OPTION A : Démarrage avec Docker (RECOMMANDÉ)

C'est la méthode la plus simple - tout démarre automatiquement !

#### Étape 9.1 : Démarrer tous les services

```powershell
# Assurez-vous d'être dans le dossier racine du projet
cd "C:\Users\ahmed\Desktop\application web distribuée"

# Démarrer tous les services
docker-compose up -d
```

⏱️ **Temps d'attente** : 10-15 minutes la première fois (téléchargement des images)

#### Étape 9.2 : Suivre les logs

```powershell
# Voir tous les logs
docker-compose logs -f

# Voir les logs d'un service spécifique
docker-compose logs -f book-service
docker-compose logs -f loan-service
```

Pour arrêter les logs : **Ctrl + C**

#### Étape 9.3 : Vérifier l'état des services

```powershell
docker-compose ps
```

✅ **Tous les services doivent être "Up" et "healthy"**

#### Étape 9.4 : Accéder aux interfaces

Attendez 2-3 minutes que tous les services démarrent, puis ouvrez :

| Service | URL | Login |
|---------|-----|-------|
| **Frontend** | http://localhost:3000 | - |
| **API Gateway** | http://localhost:8080 | - |
| **Swagger** | http://localhost:8080/swagger-ui.html | - |
| **Eureka** | http://localhost:8761 | - |
| **Keycloak** | http://localhost:8180 | admin/admin |
| **RabbitMQ** | http://localhost:15672 | guest/guest |
| **H2 Console** | http://localhost:8081/h2-console | sa/(vide) |
| **Prometheus** | http://localhost:9090 | - |
| **Grafana** | http://localhost:3001 | admin/admin |

### 🎯 OPTION B : Démarrage Manuel (Pour Développement)

Si vous voulez développer et tester en local sans Docker :

#### Étape B.1 : Démarrer l'infrastructure avec Docker

```powershell
# Démarrer uniquement MongoDB, RabbitMQ, et Keycloak
docker-compose up -d mongodb rabbitmq keycloak
```

#### Étape B.2 : Démarrer Config Server

Ouvrez un **nouveau terminal PowerShell** :

```powershell
cd "C:\Users\ahmed\Desktop\application web distribuée\config-server"
mvn clean install
mvn spring-boot:run
```

Attendez que vous voyiez : `Started ConfigServerApplication`

#### Étape B.3 : Démarrer Eureka Server

Ouvrez un **nouveau terminal PowerShell** :

```powershell
cd "C:\Users\ahmed\Desktop\application web distribuée\eureka-server"
mvn clean install
mvn spring-boot:run
```

Attendez que vous voyiez : `Started EurekaServerApplication`

#### Étape B.4 : Démarrer Book Service

Ouvrez un **nouveau terminal PowerShell** :

```powershell
cd "C:\Users\ahmed\Desktop\application web distribuée\book-service"
mvn clean install
mvn spring-boot:run
```

Attendez que vous voyiez : `Started BookServiceApplication`

#### Étape B.5 : Démarrer Loan Service

Ouvrez un **nouveau terminal PowerShell** :

```powershell
cd "C:\Users\ahmed\Desktop\application web distribuée\loan-service"
npm install
npm start
```

Attendez que vous voyiez : `🚀 Loan Service running on port 8082`

#### Étape B.6 : Démarrer API Gateway

Ouvrez un **nouveau terminal PowerShell** :

```powershell
cd "C:\Users\ahmed\Desktop\application web distribuée\api-gateway"
mvn clean install
mvn spring-boot:run
```

Attendez que vous voyiez : `Started ApiGatewayApplication`

---

## 10. RÉSOLUTION DES PROBLÈMES

### Problème 1 : "Docker daemon is not running"

**Solution** :
1. Ouvrez **Docker Desktop**
2. Attendez qu'il démarre complètement
3. Réessayez la commande

### Problème 2 : "Port already in use"

**Solution** :
```powershell
# Voir quel processus utilise le port (exemple: 8080)
netstat -ano | findstr :8080

# Tuer le processus (remplacez PID par le numéro affiché)
taskkill /PID [PID] /F
```

### Problème 3 : "Cannot connect to MongoDB"

**Solution** :
```powershell
# Vérifier que MongoDB tourne dans Docker
docker-compose ps mongodb

# Redémarrer MongoDB
docker-compose restart mongodb
```

### Problème 4 : Les services ne s'enregistrent pas dans Eureka

**Solution** :
1. Attendez 1-2 minutes (l'enregistrement prend du temps)
2. Vérifiez Eureka Dashboard : http://localhost:8761
3. Redémarrez les services :
```powershell
docker-compose restart book-service loan-service
```

### Problème 5 : Erreur "JAVA_HOME is not defined"

**Solution** :
```powershell
# Définir JAVA_HOME temporairement
$env:JAVA_HOME = "C:\Program Files\Eclipse Adoptium\jdk-17.x.x"

# Ou ajoutez-le dans les variables d'environnement système
```

### Problème 6 : Maven "command not found"

**Solution** :
1. Vérifiez que Maven est dans le PATH
2. Fermez et rouvrez PowerShell
3. Redémarrez votre PC

### Problème 7 : Docker prend trop de ressources

**Solution** :
1. Ouvrez **Docker Desktop**
2. Allez dans **Settings → Resources**
3. Réduisez **Memory** à 4GB si votre PC a peu de RAM
4. Cliquez sur **Apply & Restart**

### Problème 8 : Keycloak ne démarre pas

**Solution** :
```powershell
# Supprimer le conteneur et redémarrer
docker-compose rm -f keycloak
docker-compose up -d keycloak

# Suivre les logs
docker-compose logs -f keycloak
```

---

## 🎉 FÉLICITATIONS !

Si vous êtes arrivé ici, votre environnement est prêt !

### Prochaines étapes :

1. **Tester l'application** :
   ```powershell
   # Accédez à Swagger
   start http://localhost:8080/swagger-ui.html
   ```

2. **Lire la documentation** :
   - `docs/GETTING_STARTED.md` - Guide de démarrage
   - `docs/API_TESTING.md` - Tests des APIs
   - `docs/ARCHITECTURE.md` - Architecture du système

3. **Créer votre premier emprunt** :
   - Ouvrez Keycloak : http://localhost:8180
   - Connectez-vous avec : user/user123
   - Testez les APIs via Swagger

---

## 📞 AIDE SUPPLÉMENTAIRE

### Commandes Utiles

```powershell
# Voir l'état de tous les services
docker-compose ps

# Voir les logs d'un service
docker-compose logs -f [nom-service]

# Redémarrer un service
docker-compose restart [nom-service]

# Arrêter tous les services
docker-compose down

# Arrêter et supprimer les données
docker-compose down -v

# Reconstruire les images
docker-compose build --no-cache

# Redémarrer tout
docker-compose down && docker-compose up -d
```

### Ressources

- **Docker Desktop** : https://docs.docker.com/desktop/
- **Spring Boot** : https://spring.io/projects/spring-boot
- **Keycloak** : https://www.keycloak.org/documentation
- **RabbitMQ** : https://www.rabbitmq.com/tutorials

---

## ✅ CHECKLIST FINALE

Avant de commencer à développer, vérifiez que :

- [ ] Docker Desktop est installé et en cours d'exécution
- [ ] Java 17 est installé (`java -version`)
- [ ] Maven est installé (`mvn -version`)
- [ ] Node.js est installé (`node --version`)
- [ ] Git est installé (`git --version`)
- [ ] Tous les services Docker sont "Up" (`docker-compose ps`)
- [ ] Eureka Dashboard fonctionne (http://localhost:8761)
- [ ] Keycloak fonctionne (http://localhost:8180)
- [ ] Swagger UI fonctionne (http://localhost:8080/swagger-ui.html)
- [ ] RabbitMQ Management fonctionne (http://localhost:15672)

**Si tout est coché, vous êtes prêt ! 🚀**
