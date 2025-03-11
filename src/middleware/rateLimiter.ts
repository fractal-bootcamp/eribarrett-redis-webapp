import { MiddlewareFunction, TypedRequest, TypedResponse } from '../types';
import redisClient from '../config/redis';
import { NextFunction } from 'express';

/**
 * Rate Limiter Middleware
 * Limits the number of requests from an IP within time window
 */

const rateLimiter: MiddlewareFunction = async (
    req: TypedRequest,
    res: TypedResponse,
    next: NextFunction
) => {
    try {
        // get client IP address
        const ip = req.ip || req.socket.remoteAddress || 'unknown';

        // create a REdis key to this IP
        const key = `rate_limit:${ip}`;

        // get current request count from REdis for this IP
        const requestCount = await redisClient.get(key);

        // get rate limit settings from env variables
        const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000', 10); // 1 min default
        const maxRequests = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10);

        // set headers to inform client about rate limiting
        res.setHeader('X-RateLimit-Limit', maxRequests.toString());

        if (requestCount === null) {
            // after first request, init an expiration time (1) 
            await redisClient.setEx(key, Math.floor(windowMs / 1000), '1');
            // set header to inform client about remaining requests
            res.setHeader('X-RateLimit-Remaining', (maxRequests - 1).toString());
            return next();
        }

        // convert request count to number 
        const count = parseInt(requestCount, 10);

        if (count < maxRequests) {

            await redisClient.incr(key);
            res.setHeader('X-RateLimit-Remaining', (maxRequests - count - 1).toString());
            return next();
        }

        //Rate Limit exceeded 
        res.setHeader('X-RateLimit-Remaining', '0');
        res.status(429).json({
            status: 'error',
            message: 'Too many requests, please try again later.'
        });
    } catch (error) {
        console.error('Rate Limiter Error: ', error);
        next();
    }
};

export default rateLimiter;
