import { createLogger, transports, format } from 'winston';
import { MongoDB } from 'winston-mongodb';

const mongoTransport = new MongoDB({
    level: 'info',
    db: "mongodb://localhost:27017/Node",
    options: {
        useUnifiedTopology: true
    },
    collection: 'logs', // MongoDB collection name
    format: format.combine(
        format.timestamp(),
        format.json()
    )
});

// Create a logger instance
const logger = createLogger({
    transports: [
        mongoTransport
    ]
});

console.log("HHHHHHH",logger)

export { logger };