var __commonJS = (cb, mod) => () => (mod || cb((mod = { exports: {} }).exports, mod), mod.exports);

// src/frontend/api-service.ts
class ApiService {
  baseUrl;
  constructor(baseUrl = "") {
    this.baseUrl = baseUrl;
  }
  async recordClick() {
    try {
      const response = await fetch(`${this.baseUrl}/click-me`);
      return await response.json();
    } catch (error) {
      console.error("API Error (recordClick):", error);
      return {
        status: "error",
        message: "Network error occurred"
      };
    }
  }
  async testRateLimit() {
    try {
      const response = await fetch(`${this.baseUrl}/test-rate-limit`);
      const rateLimitInfo = this.extractRateLimitInfo(response.headers);
      const isRateLimited = response.status === 429;
      const data = await response.json();
      return {
        response: data,
        rateLimitInfo,
        isRateLimited
      };
    } catch (error) {
      console.error("API Error (testRateLimit):", error);
      return {
        response: {
          status: "error",
          message: "Network error occurred"
        },
        rateLimitInfo: null,
        isRateLimited: false
      };
    }
  }
  async getStats() {
    try {
      const response = await fetch(`${this.baseUrl}/stats`);
      return await response.json();
    } catch (error) {
      console.error("API Error (getStats):", error);
      return null;
    }
  }
  extractRateLimitInfo(headers) {
    const remaining = headers.get("X-RateLimit-Remaining");
    const limit = headers.get("X-RateLimit-Limit");
    if (remaining !== null && limit !== null) {
      const remainingNum = parseInt(remaining);
      const limitNum = parseInt(limit);
      const percentage = remainingNum / limitNum * 100;
      return {
        remaining: remainingNum,
        limit: limitNum,
        percentage
      };
    }
    return null;
  }
}

// src/frontend/ui-manager.ts
class UiManager {
  styleElement;
  styleSheet;
  constructor() {
    this.styleElement = document.createElement("style");
    document.head.appendChild(this.styleElement);
    this.styleSheet = this.styleElement.sheet;
  }
  showFeedback(element, message, type) {
    element.textContent = message;
    element.className = `feedback show ${type}`;
    setTimeout(() => {
      element.className = "feedback";
    }, 3000);
  }
  updateRateLimitVisual(percentage) {
    while (this.styleSheet.cssRules.length > 0) {
      this.styleSheet.deleteRule(0);
    }
    const safePercentage = Math.max(0, Math.min(100, percentage));
    this.styleSheet.insertRule(`.rate-limit-visual::before { transform: scaleX(${safePercentage / 100}); }`, 0);
  }
  updateStatsDisplay(totalElement, homeElement, clickMeElement, clickCountElement, totalCount, homeCount, clickMeCount) {
    totalElement.textContent = totalCount.toString();
    homeElement.textContent = homeCount.toString();
    clickMeElement.textContent = clickMeCount.toString();
    clickCountElement.textContent = clickMeCount.toString();
    [totalElement, homeElement, clickMeElement].forEach((el) => {
      el.classList.add("updated");
      setTimeout(() => el.classList.remove("updated"), 1000);
    });
  }
  updateRateLimitCounter(element, remaining) {
    element.textContent = remaining.toString();
    element.classList.add("updated");
    setTimeout(() => element.classList.remove("updated"), 1000);
  }
}

// src/frontend/theme.ts
class ThemeManager {
  currentTheme = "light";
  themeButton;
  prefersDarkMediaQuery;
  constructor() {
    this.themeButton = document.createElement("button");
    this.themeButton.id = "themeToggle";
    this.themeButton.className = "theme-toggle";
    this.themeButton.innerHTML = "<span>\uD83C\uDF19</span>";
    document.body.appendChild(this.themeButton);
    this.prefersDarkMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    this.initializeEventListeners();
    this.loadThemePreference();
  }
  initializeEventListeners() {
    this.themeButton.addEventListener("click", () => this.toggleTheme());
    this.prefersDarkMediaQuery.addEventListener("change", (e) => {
      if (localStorage.getItem("theme") === null) {
        this.setTheme(e.matches ? "dark" : "light");
      }
    });
  }
  loadThemePreference() {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      this.setTheme(savedTheme);
    } else {
      this.setTheme(this.prefersDarkMediaQuery.matches ? "dark" : "light");
    }
  }
  toggleTheme() {
    const newTheme = this.currentTheme === "light" ? "dark" : "light";
    this.setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  }
  setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    this.themeButton.innerHTML = theme === "light" ? "<span>\uD83C\uDF19</span>" : "<span>☀️</span>";
    this.currentTheme = theme;
  }
}

// src/frontend/main.ts
var require_main = __commonJS(() => {
  class RedisWebApp {
    apiService;
    uiManager;
    themeManager;
    clickButton;
    clickFeedback;
    clickCount;
    rateLimitButton;
    rateLimitFeedback;
    requestsRemaining;
    rateLimitVisual;
    totalClicks;
    homeClicks;
    clickMeClicks;
    refreshStats;
    constructor() {
      this.apiService = new ApiService;
      this.uiManager = new UiManager;
      this.themeManager = new ThemeManager;
      this.clickButton = document.getElementById("clickButton");
      this.clickFeedback = document.getElementById("clickFeedback");
      this.clickCount = document.getElementById("clickCount");
      this.rateLimitButton = document.getElementById("rateLimitButton");
      this.rateLimitFeedback = document.getElementById("rateLimitFeedback");
      this.requestsRemaining = document.getElementById("requestsRemaining");
      this.rateLimitVisual = document.getElementById("rateLimitVisual");
      this.totalClicks = document.getElementById("totalClicks");
      this.homeClicks = document.getElementById("homeClicks");
      this.clickMeClicks = document.getElementById("clickMeClicks");
      this.refreshStats = document.getElementById("refreshStats");
      this.initializeEventListeners();
      this.fetchStats();
      this.uiManager.updateRateLimitVisual(100);
    }
    initializeEventListeners() {
      this.clickButton.addEventListener("click", () => this.handleClickButtonClick());
      this.rateLimitButton.addEventListener("click", () => this.handleRateLimitButtonClick());
      this.refreshStats.addEventListener("click", () => this.fetchStats());
    }
    async handleClickButtonClick() {
      try {
        const response = await this.apiService.recordClick();
        if (response.status === "success") {
          this.uiManager.showFeedback(this.clickFeedback, "Click recorded!", "success");
          this.fetchStats();
        } else {
          this.uiManager.showFeedback(this.clickFeedback, "Failed to record click", "error");
        }
      } catch (error) {
        console.error("Error handling click:", error);
        this.uiManager.showFeedback(this.clickFeedback, "Network error", "error");
      }
    }
    async handleRateLimitButtonClick() {
      try {
        const result = await this.apiService.testRateLimit();
        if (result.rateLimitInfo) {
          this.uiManager.updateRateLimitCounter(this.requestsRemaining, result.rateLimitInfo.remaining);
          this.uiManager.updateRateLimitVisual(result.rateLimitInfo.percentage);
        }
        if (result.isRateLimited) {
          this.uiManager.showFeedback(this.rateLimitFeedback, result.response?.message || "Rate limit exceeded", "error");
          this.uiManager.updateRateLimitCounter(this.requestsRemaining, 0);
          this.uiManager.updateRateLimitVisual(0);
        } else if (result.response) {
          this.uiManager.showFeedback(this.rateLimitFeedback, "Request successful", "success");
        }
      } catch (error) {
        console.error("Error testing rate limit:", error);
        this.uiManager.showFeedback(this.rateLimitFeedback, "Network error", "error");
      }
    }
    async fetchStats() {
      try {
        const data = await this.apiService.getStats();
        if (data && data.status === "success") {
          this.uiManager.updateStatsDisplay(this.totalClicks, this.homeClicks, this.clickMeClicks, this.clickCount, data.data.totalClicks, data.data.routes.home, data.data.routes.clickMe);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    }
  }
  document.addEventListener("DOMContentLoaded", () => {
    new RedisWebApp;
  });
});
export default require_main();
