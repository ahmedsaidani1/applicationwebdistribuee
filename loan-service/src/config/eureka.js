const Eureka = require('eureka-js-client').Eureka;

const eurekaClient = new Eureka({
    instance: {
        app: process.env.SERVICE_NAME || 'loan-service',
        hostName: process.env.SERVICE_HOST || 'localhost',
        ipAddr: process.env.SERVICE_HOST || '127.0.0.1',
        statusPageUrl: `http://${process.env.SERVICE_HOST || 'localhost'}:${process.env.SERVICE_PORT || 8082}/health`,
        healthCheckUrl: `http://${process.env.SERVICE_HOST || 'localhost'}:${process.env.SERVICE_PORT || 8082}/health`,
        port: {
            '$': parseInt(process.env.SERVICE_PORT || 8082),
            '@enabled': true,
        },
        vipAddress: process.env.SERVICE_NAME || 'loan-service',
        dataCenterInfo: {
            '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
            name: 'MyOwn',
        },
        registerWithEureka: true,
        fetchRegistry: true,
    },
    eureka: {
        host: process.env.EUREKA_HOST || 'localhost',
        port: parseInt(process.env.EUREKA_PORT || 8761),
        servicePath: '/eureka/apps/',
        maxRetries: 10,
        requestRetryDelay: 2000,
    },
});

module.exports = eurekaClient;
