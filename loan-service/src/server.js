require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const eurekaClient = require('./config/eureka');
const { setupRabbitMQ } = require('./config/rabbitmq');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const { register } = require('./config/prometheus');

const loanRoutes = require('./routes/loan.routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 8082;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger Documentation
app.use('/v3/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Prometheus metrics
app.get('/metrics', async (req, res) => {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
});

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'UP', 
        service: 'loan-service',
        timestamp: new Date().toISOString()
    });
});

// Routes
app.use('/loans', loanRoutes);

// Error handling
app.use(errorHandler);

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('✅ Connected to MongoDB');
    
    // Setup RabbitMQ
    setupRabbitMQ()
        .then(() => console.log('✅ RabbitMQ connected'))
        .catch(err => console.error('❌ RabbitMQ connection error:', err));
    
    // Start server
    app.listen(PORT, () => {
        console.log(`🚀 Loan Service running on port ${PORT}`);
        console.log(`📚 Swagger docs available at http://localhost:${PORT}/v3/api-docs`);
        
        // Register with Eureka
        eurekaClient.start((error) => {
            if (error) {
                console.error('❌ Eureka registration failed:', error);
            } else {
                console.log('✅ Registered with Eureka');
            }
        });
    });
})
.catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down gracefully...');
    eurekaClient.stop(() => {
        mongoose.connection.close(() => {
            console.log('👋 Server stopped');
            process.exit(0);
        });
    });
});

module.exports = app;
