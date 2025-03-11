import express from 'express';
import { clickCounter, getClickCount } from '../middleware/clickCounter';
import { RouteHandler } from '../types';

const router = express.Router();

// home route with click counter 
router.get('/', clickCounter('home'), ((req, res) => {
    res.json({
        status: 'success',
        message: 'Welcome to your Redis-powered TypeScript web app!'
    });
}) as RouteHandler);

// click counter route 
router.get('/click-me', clickCounter('click-me'), ((req, res) => {
    res.json({
        status: 'success',
        message: 'Click recorded successfully',
    });
}) as RouteHandler);

// retrieve click statistics
router.get('/stats', (async (req, res) => {
    try {
        // Get click counts for different routes
        const homeClicks = await getClickCount('home');
        const clickMeClicks = await getClickCount('click-me');

        res.json({
            status: 'success',
            data: {
                totalClicks: homeClicks + clickMeClicks,
                routes: {
                    home: homeClicks,
                    clickMe: clickMeClicks
                }
            }
        });
    } catch (error) {
        console.error('Stats route error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to retrieve click statistics'
        });
    }
}) as RouteHandler);

// Test route for rate limiting
router.get('/test-rate-limit', ((req, res) => {
    res.json({
        status: 'success',
        message: 'This route is rate limited. Try making multiple requests quickly to see the rate limiting in action.'
    });
}) as RouteHandler);

export default router;