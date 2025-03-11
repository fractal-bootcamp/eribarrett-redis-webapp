// src/app.ts
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimiter from './middleware/rateLimiter';
import routes from './routes';

// Create Express application
const app = express();

// Apply middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
        },
    }
})); // Security headers
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(express.static('public')); // Serve static files from public directory

// Apply rate limiter to all routes
app.use(rateLimiter);

// Mount routes
app.use('/', routes);

// Error handler middleware
app.use((err: Error, req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({
        status: 'error',
        message: 'Something went wrong!'
    });
});

// 404 handler
app.use((req: express.Request, res: express.Response) => {
    res.status(404).json({
        status: 'error',
        message: 'Resource not found'
    });
});

export default app;