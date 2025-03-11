import dotenv from 'dotenv';
import app from './app';
import http from 'http';

// Load environment variables
dotenv.config();

// Get port from environment variable or use default
const PORT = process.env.PORT || 3000;

// Create HTTP server
const server = http.createServer(app);

// Start the server
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
});

// Handle server shutdown gracefully
process.on('SIGTERM', () => {
    console.info('SIGTERM signal received. Closing server.');
    server.close(() => {
        console.log('Server closed.');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.info('SIGINT signal received. Closing server.');
    server.close(() => {
        console.log('Server closed.');
        process.exit(0);
    });
});