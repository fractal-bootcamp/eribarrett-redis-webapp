/**
 * Simple Redis Web App Frontend
 */

// Define interface for API responses
interface ApiResponse {
    status: 'success' | 'error';
    message: string;
}

// Wait for DOM to be loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('Redis Web App Frontend Initialized');

    // Get elements
    const clickButton = document.getElementById('clickButton') as HTMLButtonElement | null;
    const clickCounter = document.getElementById('clickCount') as HTMLElement | null;

    // Check if elements exist
    if (clickButton && clickCounter) {
        // Add click event listener
        clickButton.addEventListener('click', async () => {
            try {
                // Call the API to record a click
                const response = await fetch('/click-me');
                const data: ApiResponse = await response.json();

                if (data.status === 'success') {
                    // Get updated stats
                    const statsResponse = await fetch('/stats');
                    const statsData = await statsResponse.json();

                    // Update click count
                    if (statsData.status === 'success') {
                        clickCounter.textContent = statsData.data.routes.clickMe.toString();
                    }
                }
            } catch (error) {
                console.error('Error:', error);
            }
        });
    } else {
        console.warn('Required elements not found in the DOM');
    }
});