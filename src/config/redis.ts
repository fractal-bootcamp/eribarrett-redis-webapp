import { createClient } from 'redis';

import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// create Redis client with URL env variables
const redisClient = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    password: process.env.REDIS_PASSWORD || undefined,
});

// handle Redis connection events
redisClient.on('connect', () => {
    console.log('Connected to Redis server');
});

redisClient.on('error', (err: Error) => {
    console.error('Redis error: ', err);
});

// connect to Redis
(async () => {
    await redisClient.connect().catch(console.error);
})();

export default redisClient;