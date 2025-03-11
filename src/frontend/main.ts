/**
 * Redis Web App - TypeScript Frontend
 */

import { ApiService } from './api-service';
import { UiManager } from './ui-manager';
import { ThemeManager } from './theme';

class RedisWebApp {
    // Services
    private apiService: ApiService;
    private uiManager: UiManager;
    private themeManager: ThemeManager;

    // DOM Elements
    private clickButton: HTMLButtonElement;
    private clickFeedback: HTMLElement;
    private clickCount: HTMLElement;
    private rateLimitButton: HTMLButtonElement;
    private rateLimitFeedback: HTMLElement;
    private requestsRemaining: HTMLElement;
    private rateLimitVisual: HTMLElement;
    private totalClicks: HTMLElement;
    private homeClicks: HTMLElement;
    private clickMeClicks: HTMLElement;
    private refreshStats: HTMLButtonElement;

    constructor() {
        // Initialize services
        this.apiService = new ApiService();
        this.uiManager = new UiManager();
        this.themeManager = new ThemeManager();

        // Initialize DOM elements
        this.clickButton = document.getElementById('clickButton') as HTMLButtonElement;
        this.clickFeedback = document.getElementById('clickFeedback') as HTMLElement;
        this.clickCount = document.getElementById('clickCount') as HTMLElement;
        this.rateLimitButton = document.getElementById('rateLimitButton') as HTMLButtonElement;
        this.rateLimitFeedback = document.getElementById('rateLimitFeedback') as HTMLElement;
        this.requestsRemaining = document.getElementById('requestsRemaining') as HTMLElement;
        this.rateLimitVisual = document.getElementById('rateLimitVisual') as HTMLElement;
        this.totalClicks = document.getElementById('totalClicks') as HTMLElement;
        this.homeClicks = document.getElementById('homeClicks') as HTMLElement;
        this.clickMeClicks = document.getElementById('clickMeClicks') as HTMLElement;
        this.refreshStats = document.getElementById('refreshStats') as HTMLButtonElement;

        // Setup event listeners
        this.initializeEventListeners();

        // Initial data load
        this.fetchStats();
        this.uiManager.updateRateLimitVisual(100);
    }

    /**
     * Initialize all event listeners
     */
    private initializeEventListeners(): void {
        this.clickButton.addEventListener('click', () => this.handleClickButtonClick());
        this.rateLimitButton.addEventListener('click', () => this.handleRateLimitButtonClick());
        this.refreshStats.addEventListener('click', () => this.fetchStats());
    }

    /**
     * Handle click button event
     */
    private async handleClickButtonClick(): Promise<void> {
        try {
            const response = await this.apiService.recordClick();

            if (response.status === 'success') {
                this.uiManager.showFeedback(this.clickFeedback, 'Click recorded!', 'success');
                this.fetchStats();
            } else {
                this.uiManager.showFeedback(this.clickFeedback, 'Failed to record click', 'error');
            }
        } catch (error) {
            console.error('Error handling click:', error);
            this.uiManager.showFeedback(this.clickFeedback, 'Network error', 'error');
        }
    }

    /**
     * Handle rate limit button event
     */
    private async handleRateLimitButtonClick(): Promise<void> {
        try {
            const result = await this.apiService.testRateLimit();

            // Update UI with rate limit info
            if (result.rateLimitInfo) {
                this.uiManager.updateRateLimitCounter(
                    this.requestsRemaining,
                    result.rateLimitInfo.remaining
                );
                this.uiManager.updateRateLimitVisual(result.rateLimitInfo.percentage);
            }

            // Handle rate limit exceeded
            if (result.isRateLimited) {
                this.uiManager.showFeedback(
                    this.rateLimitFeedback,
                    result.response?.message || 'Rate limit exceeded',
                    'error'
                );
                this.uiManager.updateRateLimitCounter(this.requestsRemaining, 0);
                this.uiManager.updateRateLimitVisual(0);
            } else if (result.response) {
                this.uiManager.showFeedback(
                    this.rateLimitFeedback,
                    'Request successful',
                    'success'
                );
            }
        } catch (error) {
            console.error('Error testing rate limit:', error);
            this.uiManager.showFeedback(this.rateLimitFeedback, 'Network error', 'error');
        }
    }

    /**
     * Fetch statistics from the API
     */
    private async fetchStats(): Promise<void> {
        try {
            const data = await this.apiService.getStats();

            if (data && data.status === 'success') {
                this.uiManager.updateStatsDisplay(
                    this.totalClicks,
                    this.homeClicks,
                    this.clickMeClicks,
                    this.clickCount,
                    data.data.totalClicks,
                    data.data.routes.home,
                    data.data.routes.clickMe
                );
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new RedisWebApp();
});