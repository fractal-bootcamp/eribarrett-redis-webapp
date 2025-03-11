import { createClient } from 'redis';

import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// create Redis client with URL env variables and reconnection strategy
const redisClient = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    password: process.env.REDIS_PASSWORD || undefined,
    socket: {
        reconnectStrategy: (retries) => {
            // Exponential backoff with max delay of 10 seconds
            const delay = Math.min(Math.pow(2, retries) * 100, 10000);
            console.log(`Redis reconnecting... attempt ${retries}, next retry in ${delay}ms`);
            return delay;
        },
        connectTimeout: 10000, // 10 seconds
    },
});

// handle Redis connection events
redisClient.on('connect', () => {
    console.log('Connected to Redis server');
});

redisClient.on('ready', () => {
    console.log('Redis client ready and connected');
});

redisClient.on('reconnecting', () => {
    console.log('Redis client reconnecting...');
});

redisClient.on('error', (err: Error) => {
    console.error('Redis error: ', err);
    // Don't crash the application on Redis errors
});

// connect to Redis
(async () => {
    try {
        await redisClient.connect();
    } catch (error) {
        console.error('Failed to connect to Redis:', error);
        // Don't crash the application if initial connection fails
    }
})();

export default redisClient;