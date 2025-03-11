/**
 * UI Manager for Redis Web App
 */

type FeedbackType = 'success' | 'error';

export class UiManager {
    // Style element for dynamic CSS
    private styleElement: HTMLStyleElement;
    private styleSheet: CSSStyleSheet;

    constructor() {
        // Create style element for dynamic CSS
        this.styleElement = document.createElement('style');
        document.head.appendChild(this.styleElement);
        this.styleSheet = this.styleElement.sheet as CSSStyleSheet;
    }

    /**
     * Show a feedback message
     */
    public showFeedback(element: HTMLElement, message: string, type: FeedbackType): void {
        element.textContent = message;
        element.className = `feedback show ${type}`;

        setTimeout(() => {
            element.className = 'feedback';
        }, 3000);
    }

    /**
     * Update the rate limit visual indicator
     */
    public updateRateLimitVisual(percentage: number): void {
        // Remove previous rule if exists
        while (this.styleSheet.cssRules.length > 0) {
            this.styleSheet.deleteRule(0);
        }

        // Add new rule with proper scaling
        const safePercentage = Math.max(0, Math.min(100, percentage));
        this.styleSheet.insertRule(
            `.rate-limit-visual::before { transform: scaleX(${safePercentage / 100}); }`,
            0
        );
    }

    /**
     * Update stats display
     */
    public updateStatsDisplay(
        totalElement: HTMLElement,
        homeElement: HTMLElement,
        clickMeElement: HTMLElement,
        clickCountElement: HTMLElement,
        totalCount: number,
        homeCount: number,
        clickMeCount: number
    ): void {
        totalElement.textContent = totalCount.toString();
        homeElement.textContent = homeCount.toString();
        clickMeElement.textContent = clickMeCount.toString();
        clickCountElement.textContent = clickMeCount.toString();

        // Add animation class
        [totalElement, homeElement, clickMeElement].forEach(el => {
            el.classList.add('updated');
            setTimeout(() => el.classList.remove('updated'), 1000);
        });
    }

    /**
     * Update rate limit counter
     */
    public updateRateLimitCounter(element: HTMLElement, remaining: number): void {
        element.textContent = remaining.toString();

        // Add animation class
        element.classList.add('updated');
        setTimeout(() => element.classList.remove('updated'), 1000);
    }
}