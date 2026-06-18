const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Loan Service API',
            version: '1.0.0',
            description: 'API de gestion des emprunts pour la bibliothèque',
            contact: {
                name: 'Library Team',
                email: 'library@example.com'
            }
        },
        servers: [
            {
                url: 'http://localhost:8082',
                description: 'Local Server'
            },
            {
                url: 'http://localhost:8080/api/loans',
                description: 'Docker via Gateway'
            }
        ],
        components: {
            schemas: {
                Loan: {
                    type: 'object',
                    required: ['bookId', 'userId', 'userName'],
                    properties: {
                        bookId: {
                            type: 'number',
                            description: 'ID du livre emprunté'
                        },
                        bookTitle: {
                            type: 'string',
                            description: 'Titre du livre'
                        },
                        userId: {
                            type: 'string',
                            description: 'ID de l\'utilisateur'
                        },
                        userName: {
                            type: 'string',
                            description: 'Nom de l\'utilisateur'
                        },
                        loanDate: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Date d\'emprunt'
                        },
                        dueDate: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Date de retour prévue'
                        },
                        returnDate: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Date de retour réelle'
                        },
                        status: {
                            type: 'string',
                            enum: ['ACTIVE', 'RETURNED', 'OVERDUE'],
                            description: 'Statut de l\'emprunt'
                        }
                    }
                },
                Error: {
                    type: 'object',
                    properties: {
                        message: {
                            type: 'string'
                        },
                        status: {
                            type: 'number'
                        }
                    }
                }
            }
        }
    },
    apis: ['./src/routes/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
