/**
 * Theme management for Redis Web App
 */

type Theme = 'light' | 'dark';

export class ThemeManager {
    private currentTheme: Theme = 'light';
    private themeButton: HTMLButtonElement;
    private prefersDarkMediaQuery: MediaQueryList;

    constructor() {
        // Create theme toggle button
        this.themeButton = document.createElement('button');
        this.themeButton.id = 'themeToggle';
        this.themeButton.className = 'theme-toggle';
        this.themeButton.innerHTML = '<span>🌙</span>';
        document.body.appendChild(this.themeButton);

        // Check system preference
        this.prefersDarkMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        this.initializeEventListeners();
        this.loadThemePreference();
    }

    private initializeEventListeners(): void {
        // Theme toggle button click
        this.themeButton.addEventListener('click', () => this.toggleTheme());

        // Listen for system preference changes
        this.prefersDarkMediaQuery.addEventListener('change', (e) => {
            if (localStorage.getItem('theme') === null) {
                this.setTheme(e.matches ? 'dark' : 'light');
            }
        });
    }

    private loadThemePreference(): void {
        // Check if user has previously set theme
        const savedTheme = localStorage.getItem('theme') as Theme | null;

        if (savedTheme) {
            // Use saved preference
            this.setTheme(savedTheme);
        } else {
            // Use system preference
            this.setTheme(this.prefersDarkMediaQuery.matches ? 'dark' : 'light');
        }
    }

    private toggleTheme(): void {
        const newTheme: Theme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    }

    private setTheme(theme: Theme): void {
        document.documentElement.setAttribute('data-theme', theme);
        this.themeButton.innerHTML = theme === 'light' ? '<span>🌙</span>' : '<span>☀️</span>';
        this.currentTheme = theme;
    }
}