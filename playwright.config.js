const { defineConfig } = require("@playwright/test");

module.exports = defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  use: {
    baseURL: process.env.TEST_URL || "http://127.0.0.1:3100",
    launchOptions: process.env.BROWSER_PATH
      ? { executablePath: process.env.BROWSER_PATH }
      : {},
  },
});
