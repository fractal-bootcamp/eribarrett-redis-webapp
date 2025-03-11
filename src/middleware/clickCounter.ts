import { MiddlewareFunction, ClickCounterMiddleware } from '../types';
import redisClient from '../config/redis';

/**
 * Click counter middleware using Redis
 * Tracks clicks on specific routes or endpoints
 */

const clickCounter: ClickCounterMiddleware = (routeName: string) => {
    return async (req, res, next) => {
        try {
            // Check if Redis is connected before proceeding
            if (!redisClient.isOpen) {
                console.warn('Redis connection not available for click counting');
                return next(); // Continue without counting
            }

            // create a Redis key for this route
            const key = `clicks:${routeName || req.path}`;

            // increment click count in Redis
            await redisClient.incr(key);

            // Optionally, add timestamp info for analytics
            const timestampKey = `clicks:${routeName || req.path}:timestamps`;
            const timestamp = new Date().toISOString();
            await redisClient.lPush(timestampKey, timestamp);

            // limit the size of timestamp list to prevent unbounded growth
            await redisClient.lTrim(timestampKey, 0, 9999); // keep prev 10,000 timestamps

            next();
        } catch (error) {
            console.error('Click counter error:', error);
            // if redis fails, we let request go through without counting
            next();
        }
    };
};

/**
 * get click count for specific route
 */

const getClickCount = async (routeName: string): Promise<number> => {
    try {
        // Check if Redis is connected before proceeding
        if (!redisClient.isOpen) {
            console.warn('Redis connection not available for getting click count');
            return 0;
        }

        const key = `clicks:${routeName}`;
        const count = await redisClient.get(key);
        return count ? parseInt(count, 10) : 0;
    } catch (error) {
        console.error('Get click count error:', error);
        return 0;
    }
};

export { clickCounter, getClickCount };