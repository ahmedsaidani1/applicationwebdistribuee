# 📊 Grafana & Prometheus Setup Guide

## ✅ What is Grafana?

**Grafana** is a visualization and monitoring platform that displays real-time metrics from your microservices.

**Think of it like a car dashboard**: Just like a dashboard shows speed, fuel, temperature, etc., Grafana shows your application's health, performance, and usage metrics.

---

## 🎯 What Does It Monitor?

### 1. **Service Health**
- Is the service UP or DOWN?
- Are all microservices running?

### 2. **Performance Metrics**
- How many requests per second?
- How fast are responses? (Response time)
- Are requests failing? (Error rates)

### 3. **Resource Usage**
- CPU usage per service
- Memory (RAM) consumption
- JVM heap memory for Java services

### 4. **Business Metrics**
- How many books were searched?
- How many loans were created?
- Which endpoints are most used?

---

## 🏗️ Architecture

```
Your Microservices (Book, Loan, Gateway)
    ↓ (expose metrics)
Prometheus (collects & stores metrics)
    ↓ (queries data)
Grafana (visualizes metrics in dashboards)
```

### Components:

1. **Spring Boot Actuator**: Exposes metrics from Java services
2. **Micrometer**: Converts metrics to Prometheus format
3. **Prometheus**: Scrapes and stores time-series data
4. **Grafana**: Creates beautiful dashboards

---

## 🚀 Setup Instructions

### Step 1: Verify Configuration Files

All configuration files have been created:

```
monitoring/
├── prometheus/
│   └── prometheus.yml          # Prometheus scrape config
└── grafana/
    ├── datasources/
    │   └── datasource.yml      # Connects Grafana to Prometheus
    └── dashboards/
        ├── dashboard.yml       # Dashboard provider config
        └── microservices-dashboard.json  # Pre-built dashboard
```

### Step 2: Start the Monitoring Stack

```bash
# Start all services including Prometheus and Grafana
docker-compose up -d

# Check if Prometheus and Grafana are running
docker ps | findstr "prometheus\|grafana"

# View logs
docker logs prometheus
docker logs grafana
```

**Wait 30-60 seconds** for services to fully start.

---

## 🌐 Access the Dashboards

### Prometheus UI
**URL**: http://localhost:9090

**What it does**: Raw metrics viewer and query interface

**Try this**:
1. Open http://localhost:9090
2. Go to Status → Targets
3. You should see all services (book-service, loan-service, etc.)
4. Status should be "UP" (green)

### Grafana UI
**URL**: http://localhost:3001

**Login credentials**:
- Username: `admin`
- Password: `admin`

**First login**: It will ask you to change the password (you can skip this)

---

## 📊 View the Pre-Built Dashboard

### Step 1: Open Grafana
1. Go to http://localhost:3001
2. Login with admin/admin

### Step 2: Find the Dashboard
1. Click the **menu icon** (☰) on the left
2. Click **"Dashboards"**
3. You should see **"Library Microservices Dashboard"**
4. Click on it

### Step 3: Explore the Panels

The dashboard shows:

1. **Service Status** (top row)
   - Book Service Status: 1 = UP, 0 = DOWN
   - Loan Service Status
   - API Gateway Status

2. **HTTP Requests per Second**
   - Real-time request rate
   - Shows which service is handling more traffic

3. **Response Time (95th Percentile)**
   - How fast your APIs respond
   - Lower is better
   - p95 means 95% of requests are faster than this

4. **JVM Memory Usage**
   - Heap memory consumption
   - Watch for memory leaks (continuously increasing)

5. **CPU Usage**
   - System CPU usage per service
   - High CPU might indicate performance issues

---

## 🧪 Generate Some Load (Test the Dashboard)

### Method 1: Use Swagger UI

1. Open Swagger: http://localhost:8080/webjars/swagger-ui/index.html
2. Test several endpoints:
   - GET /books
   - GET /books/{id}
   - POST /books
   - GET /loans
3. Refresh Grafana dashboard
4. Watch the metrics change in real-time!

### Method 2: Use PowerShell Script

```powershell
# Run multiple requests to generate load
for ($i=1; $i -le 100; $i++) {
    Write-Host "Request $i"
    curl http://localhost:8080/api/books -UseBasicParsing
    Start-Sleep -Milliseconds 100
}
```

**Watch Grafana**: You'll see:
- Request rate increase
- Response time change
- CPU usage spike

---

## 🔍 Useful Prometheus Queries

Open Prometheus (http://localhost:9090) and try these queries:

### 1. Check Service Status
```promql
up{job="book-service"}
```
Result: 1 (UP) or 0 (DOWN)

### 2. Total HTTP Requests
```promql
http_server_requests_seconds_count{job="book-service"}
```

### 3. Request Rate (per second)
```promql
rate(http_server_requests_seconds_count{job="book-service"}[1m])
```

### 4. Average Response Time
```promql
rate(http_server_requests_seconds_sum{job="book-service"}[1m])
/
rate(http_server_requests_seconds_count{job="book-service"}[1m])
```

### 5. Memory Usage
```promql
jvm_memory_used_bytes{job="book-service", area="heap"}
```

### 6. HTTP Errors (Status 5xx)
```promql
http_server_requests_seconds_count{job="book-service", status=~"5.."}
```

---

## 🎓 Explaining to Your Professor

### Simple Explanation (30 seconds)

> "J'ai implémenté **Grafana et Prometheus** pour le monitoring en temps réel de l'application. Prometheus collecte automatiquement les métriques de tous les microservices (requêtes HTTP, temps de réponse, usage CPU/mémoire). Grafana affiche ces métriques dans des dashboards visuels. Cela permet de détecter rapidement les problèmes de performance et de surveiller la santé du système."

### Show the Dashboard (1 minute)

1. **Open Grafana**: http://localhost:3001
2. **Open the dashboard**: "Library Microservices Dashboard"
3. **Point out**:
   - "Ici on voit que tous les services sont UP"
   - "Ce graphique montre les requêtes par seconde en temps réel"
   - "Celui-ci montre les temps de réponse - actuellement X millisecondes"
   - "On peut voir l'usage mémoire et CPU de chaque service"

4. **Generate load**: Open Swagger and make a few requests
5. **Show real-time update**: "Regardez, les métriques changent en temps réel!"

### Technical Points

- ✅ **Spring Boot Actuator** exposes metrics endpoints
- ✅ **Micrometer** converts metrics to Prometheus format
- ✅ **Prometheus** scrapes metrics every 15 seconds
- ✅ **Grafana** queries Prometheus and visualizes data
- ✅ **Pre-configured dashboard** with key metrics
- ✅ **Auto-refresh** every 5 seconds

---

## 📈 What Metrics Are Available?

### HTTP Metrics
- `http_server_requests_seconds_count` - Total requests
- `http_server_requests_seconds_sum` - Total response time
- `http_server_requests_seconds_max` - Slowest request

Labels: method, uri, status, outcome

### JVM Metrics
- `jvm_memory_used_bytes` - Memory usage
- `jvm_memory_max_bytes` - Max memory
- `jvm_threads_live` - Active threads
- `jvm_gc_pause_seconds` - Garbage collection time

### System Metrics
- `system_cpu_usage` - CPU usage
- `system_cpu_count` - Number of CPUs
- `process_uptime_seconds` - Service uptime

### Custom Metrics (If Added)
- `books_created_total` - Counter for books created
- `loans_active` - Number of active loans
- `book_search_duration` - Search performance

---

## 🎨 Create Custom Dashboards

### Add a New Panel

1. Click **"+ Add"** → **"Visualization"**
2. Select **Prometheus** as data source
3. Enter a query, e.g.:
   ```promql
   rate(http_server_requests_seconds_count{job="book-service"}[5m])
   ```
4. Choose visualization type (Graph, Stat, Gauge, etc.)
5. Click **"Apply"**

### Example: Books Endpoint Performance

**Query**:
```promql
histogram_quantile(0.95, 
  rate(http_server_requests_seconds_bucket{
    job="book-service",
    uri="/books"
  }[5m])
)
```

**Title**: "GET /books Response Time (p95)"

---

## 🔧 Troubleshooting

### Prometheus Shows "Targets Down"

**Problem**: Services show as DOWN in Prometheus (http://localhost:9090/targets)

**Solution**:
1. Check if services are running:
   ```bash
   docker ps
   ```

2. Check actuator endpoint is accessible:
   ```bash
   curl http://localhost:8081/actuator/prometheus
   ```

3. If "404 Not Found", rebuild the service:
   ```bash
   cd book-service
   mvn clean package -DskipTests
   cd ..
   docker-compose up -d --build book-service
   ```

### Grafana Shows "No Data"

**Problem**: Dashboard panels show "No data"

**Solutions**:
1. **Check data source connection**:
   - Go to Configuration → Data Sources
   - Click "Prometheus"
   - Click "Save & Test"
   - Should see "Data source is working"

2. **Check time range**: 
   - Dashboard might be showing wrong time period
   - Click time picker (top right)
   - Select "Last 15 minutes"

3. **Generate some traffic**:
   - Make API requests via Swagger
   - Metrics need data to display

### Grafana Dashboard Not Showing

**Problem**: Dashboard not visible in Grafana

**Solutions**:
1. **Import manually**:
   - Click "+" → "Import"
   - Click "Upload JSON file"
   - Select `monitoring/grafana/dashboards/microservices-dashboard.json`
   - Click "Load" → "Import"

2. **Check provisioning**:
   ```bash
   docker exec grafana ls /etc/grafana/provisioning/dashboards
   ```

---

## 📊 Advanced: Add Business Metrics

Want to track business events? Add custom metrics to your code.

### Example: Count Books Created

**In BookService.java**:

```java
import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.MeterRegistry;

@Service
public class BookService {
    
    private final Counter booksCreatedCounter;
    
    public BookService(MeterRegistry meterRegistry) {
        this.booksCreatedCounter = Counter.builder("books.created")
            .description("Total books created")
            .tag("service", "book-service")
            .register(meterRegistry);
    }
    
    public Book createBook(BookDTO bookDTO) {
        Book book = // ... save book
        booksCreatedCounter.increment();
        return book;
    }
}
```

**Query in Grafana**:
```promql
rate(books_created_total[5m])
```

---

## 🎯 Key Takeaways

### Why Monitoring Matters

1. **Detect Issues Early**: See problems before users complain
2. **Performance Optimization**: Identify slow endpoints
3. **Capacity Planning**: Know when to scale
4. **Debugging**: Correlate errors with resource usage
5. **Professionalism**: Shows production-ready thinking

### What Makes This Impressive

✅ **Industry Standard**: Prometheus + Grafana used by Google, Uber, etc.
✅ **Real-time Monitoring**: Live data, not logs
✅ **Pre-configured**: Dashboard ready to use
✅ **All Services**: Monitoring entire microservices stack
✅ **Visual**: Beautiful charts, not just numbers

---

## 📸 Screenshots for Your Report

### Must-Have Screenshots

1. **Grafana Dashboard Overview**
   - URL: http://localhost:3001
   - Shows all panels with data

2. **Service Status Panel**
   - Shows Book Service, Loan Service, Gateway all UP

3. **Request Rate Graph**
   - With visible traffic (after load test)

4. **Prometheus Targets**
   - URL: http://localhost:9090/targets
   - Shows all services UP (green)

5. **Metrics Endpoint**
   - Screenshot of http://localhost:8081/actuator/prometheus
   - Shows raw metrics data

---

## 🚀 Quick Start Summary

```bash
# 1. Start everything
docker-compose up -d

# 2. Wait 60 seconds

# 3. Check Prometheus targets
# Open: http://localhost:9090/targets
# All should be UP

# 4. Open Grafana
# URL: http://localhost:3001
# Login: admin / admin

# 5. View dashboard
# Navigate to Dashboards → Library Microservices Dashboard

# 6. Generate traffic
# Use Swagger UI: http://localhost:8080/webjars/swagger-ui/index.html
# Make several API calls

# 7. Watch metrics update in real-time!
```

---

## 🔗 Useful URLs

| Service | URL | Purpose |
|---------|-----|---------|
| **Grafana** | http://localhost:3001 | Dashboards & Visualization |
| **Prometheus** | http://localhost:9090 | Metrics Database & Query |
| Prometheus Targets | http://localhost:9090/targets | Service Health Check |
| Book Service Metrics | http://localhost:8081/actuator/prometheus | Raw Metrics |
| API Gateway Metrics | http://localhost:8080/actuator/prometheus | Raw Metrics |
| Eureka Metrics | http://localhost:8761/actuator/prometheus | Raw Metrics |

---

## 💡 Bonus: Alert Rules (Advanced)

Want to get notified of issues? Add alert rules to Prometheus.

**Example**: Alert when service is down

```yaml
# monitoring/prometheus/alert.rules.yml
groups:
  - name: services
    interval: 30s
    rules:
      - alert: ServiceDown
        expr: up == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "Service {{ $labels.job }} is down"
```

---

**Status**: ✅ READY TO USE

**Access Grafana**: http://localhost:3001 (admin/admin)

**Pre-built Dashboard**: "Library Microservices Dashboard"

**Refresh**: Auto-refresh every 5 seconds 🎉
