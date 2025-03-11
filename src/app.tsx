import express, { Express, NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimiter from './middleware/rateLimiter';
import routes from './routes';
import { ApiResponse } from './types';

// create express app
const app = express();

// set up middleware 
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// rate limiter middleware
app.use(rateLimiter);

// mount routes
app.use('/', routes);

// error handler
app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
    console.error(err.stack);
    const response: ApiResponse = {
        status: 'error',
        message: 'something went wrong',
    };
    res.status(404).json(response);
});

export default app;