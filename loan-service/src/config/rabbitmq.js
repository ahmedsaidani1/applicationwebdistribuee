const amqp = require('amqplib');

let connection = null;
let channel = null;

const EXCHANGE = 'library.exchange';
const LOAN_QUEUE = 'loan.queue';
const NOTIFICATION_QUEUE = 'notification.queue';

async function setupRabbitMQ() {
    try {
        connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost:5672');
        channel = await connection.createChannel();

        // Create exchange
        await channel.assertExchange(EXCHANGE, 'topic', { durable: true });

        // Create queues
        await channel.assertQueue(LOAN_QUEUE, { durable: true });
        await channel.assertQueue(NOTIFICATION_QUEUE, { durable: true });

        // Bind queues to exchange
        await channel.bindQueue(LOAN_QUEUE, EXCHANGE, 'loan.*');
        await channel.bindQueue(NOTIFICATION_QUEUE, EXCHANGE, 'loan.created');
        await channel.bindQueue(NOTIFICATION_QUEUE, EXCHANGE, 'loan.overdue');

        console.log('✅ RabbitMQ setup completed');

        // Start consuming messages
        consumeMessages();

        return channel;
    } catch (error) {
        console.error('❌ RabbitMQ setup error:', error);
        throw error;
    }
}

function consumeMessages() {
    if (!channel) return;

    // Listen for book events
    channel.consume(LOAN_QUEUE, (msg) => {
        if (msg) {
            const event = JSON.parse(msg.content.toString());
            console.log('📩 Received event:', event);
            
            // Process event based on type
            handleEvent(event);
            
            channel.ack(msg);
        }
    });
}

function handleEvent(event) {
    switch (event.eventType) {
        case 'BOOK_BORROWED':
            console.log(`📚 Book borrowed: ${event.title}`);
            break;
        case 'BOOK_RETURNED':
            console.log(`📚 Book returned: ${event.title}`);
            break;
        default:
            console.log('Unknown event type:', event.eventType);
    }
}

async function publishEvent(routingKey, message) {
    if (!channel) {
        throw new Error('RabbitMQ channel not initialized');
    }

    try {
        const content = Buffer.from(JSON.stringify(message));
        channel.publish(EXCHANGE, routingKey, content, { persistent: true });
        console.log(`📤 Published event: ${routingKey}`, message);
    } catch (error) {
        console.error('❌ Error publishing event:', error);
        throw error;
    }
}

async function closeConnection() {
    try {
        if (channel) await channel.close();
        if (connection) await connection.close();
        console.log('✅ RabbitMQ connection closed');
    } catch (error) {
        console.error('❌ Error closing RabbitMQ connection:', error);
    }
}

module.exports = {
    setupRabbitMQ,
    publishEvent,
    closeConnection,
    getChannel: () => channel
};
