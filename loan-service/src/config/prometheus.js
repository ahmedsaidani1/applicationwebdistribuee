const client = require('prom-client');

// Create a Registry
const register = new client.Registry();

// Add default metrics
client.collectDefaultMetrics({ register });

// Custom metrics
const httpRequestDuration = new client.Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'route', 'status_code'],
    registers: [register]
});

const loansCounter = new client.Counter({
    name: 'loans_total',
    help: 'Total number of loans',
    labelNames: ['status'],
    registers: [register]
});

const activeLoansGauge = new client.Gauge({
    name: 'active_loans',
    help: 'Number of currently active loans',
    registers: [register]
});

module.exports = {
    register,
    httpRequestDuration,
    loansCounter,
    activeLoansGauge
};
