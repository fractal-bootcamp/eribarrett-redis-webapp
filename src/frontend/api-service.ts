/**
 * API Service for Redis Web App
 */

// API Response interfaces
export interface ApiResponse {
    status: 'success' | 'error';
    message: string;
}

export interface StatsResponse extends ApiResponse {
    data: {
        totalClicks: number;
        routes: {
            home: number;
            clickMe: number;
        }
    }
}

// Rate limit information
export interface RateLimitInfo {
    remaining: number;
    limit: number;
    percentage: number;
}

export class ApiService {
    private baseUrl: string;

    constructor(baseUrl: string = '') {
        this.baseUrl = baseUrl;
    }

    /**
     * Record a click on the click-me endpoint
     */
    public async recordClick(): Promise<ApiResponse> {
        try {
            const response = await fetch(`${this.baseUrl}/click-me`);
            return await response.json() as ApiResponse;
        } catch (error) {
            console.error('API Error (recordClick):', error);
            return {
                status: 'error',
                message: 'Network error occurred'
            };
        }
    }

    /**
     * Test the rate limiter
     */
    public async testRateLimit(): Promise<{
        response: ApiResponse | null;
        rateLimitInfo: RateLimitInfo | null;
        isRateLimited: boolean;
    }> {
        try {
            const response = await fetch(`${this.baseUrl}/test-rate-limit`);

            // Extract rate limit information from headers
            const rateLimitInfo = this.extractRateLimitInfo(response.headers);

            // Check if rate limited
            const isRateLimited = response.status === 429;

            // Parse response body
            const data = await response.json() as ApiResponse;

            return {
                response: data,
                rateLimitInfo,
                isRateLimited
            };
        } catch (error) {
            console.error('API Error (testRateLimit):', error);
            return {
                response: {
                    status: 'error',
                    message: 'Network error occurred'
                },
                rateLimitInfo: null,
                isRateLimited: false
            };
        }
    }

    /**
     * Get statistics about clicks
     */
    public async getStats(): Promise<StatsResponse | null> {
        try {
            const response = await fetch(`${this.baseUrl}/stats`);
            return await response.json() as StatsResponse;
        } catch (error) {
            console.error('API Error (getStats):', error);
            return null;
        }
    }

    /**
     * Extract rate limit information from response headers
     */
    private extractRateLimitInfo(headers: Headers): RateLimitInfo | null {
        const remaining = headers.get('X-RateLimit-Remaining');
        const limit = headers.get('X-RateLimit-Limit');

        if (remaining !== null && limit !== null) {
            const remainingNum = parseInt(remaining);
            const limitNum = parseInt(limit);
            const percentage = (remainingNum / limitNum) * 100;

            return {
                remaining: remainingNum,
                limit: limitNum,
                percentage
            };
        }

        return null;
    }
}