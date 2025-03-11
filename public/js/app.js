var __commonJS = (cb, mod) => () => (mod || cb((mod = { exports: {} }).exports, mod), mod.exports);

// src/frontend/app.ts
var require_app = __commonJS(() => {
  document.addEventListener("DOMContentLoaded", () => {
    console.log("Redis Web App Frontend Initialized");
    const clickButton = document.getElementById("clickButton");
    const clickCounter = document.getElementById("clickCount");
    if (clickButton && clickCounter) {
      clickButton.addEventListener("click", async () => {
        try {
          const response = await fetch("/click-me");
          const data = await response.json();
          if (data.status === "success") {
            const statsResponse = await fetch("/stats");
            const statsData = await statsResponse.json();
            if (statsData.status === "success") {
              clickCounter.textContent = statsData.data.routes.clickMe.toString();
            }
          }
        } catch (error) {
          console.error("Error:", error);
        }
      });
    } else {
      console.warn("Required elements not found in the DOM");
    }
  });
});
export default require_app();
