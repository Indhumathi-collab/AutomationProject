"# AutomationProject" 
# Playwright Automation for SauceDemo

This project uses [Playwright](https://playwright.dev/) to automate and visually verify functionality on the [SauceDemo](https://www.saucedemo.com) web application.

---

# Features

- Automated login to SauceDemo
- Reusable test functions (login, sorting, cart interactions)
- Add products to cart and verify
- Visual regression testing with screenshots
- Product sorting (Z → A, High → Low)
- Checkout flow with visual checks

---

# Tech Stack

- [Playwright](https://playwright.dev/)
- JavaScript
- Node.js

---

To run scripts:
use command - npx playwright test

to run headless > go to playwright.config.js & set up 'headless' to false

to run headed > go to playwright.config.js & set up 'headless' to true

Screenshots:
First time after executing scripts it would fail as it takes the current screenshots and keep it as original
On the second run, it would execute correct and compare it with original screenshots
