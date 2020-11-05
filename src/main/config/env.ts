export default {
    mongoUri: process.env.MONGO_URL || 'mongodb://localhost:27017/node-tdd-api',
    port: process.env.port || 3333
}