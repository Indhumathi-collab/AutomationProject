const { test, expect } = require('@playwright/test');

// Reusable login function
async function login(page) {
  await page.goto('https://www.saucedemo.com');
  await expect(page).toHaveTitle('Swag Labs');
  await expect(page).toHaveScreenshot('login-page.png'); // visual test added
  await page.locator('#user-name').fill('standard_user');
  await page.locator('#password').fill('secret_sauce');
  await page.locator('#login-button').click();
  await expect(page.locator('.title')).toHaveText('Products');
  await expect(page).toHaveScreenshot('products-page.png'); // visual test added
}

// Reusable product sorting function
async function sortProducts(page, optionValue) {
  await page.selectOption('select.product_sort_container', { value: optionValue });
}

// Reusable function to extract text content from locators
async function extractTexts(locatorArray) {
  const texts = [];
  for (const el of locatorArray) {
    const text = (await el.textContent()).trim();
    texts.push(text);
  }
  return texts;
}

// Reusable function to add products to cart
async function addProductsToCart(page, productNames) {
  for (const name of productNames) {
    const product = page.locator('.inventory_item').filter({ hasText: name });
    await product.locator('button:has-text("Add to cart")').click();
  }

  // Go to cart
  await page.locator('a.shopping_cart_link').click();
  await expect(page).toHaveScreenshot('cart-page.png'); // visual test added

  // Verify cart contents
  const cartItemNames = await page.locator('.cart_item .inventory_item_name').allTextContents();
  expect(cartItemNames.sort()).toEqual(productNames.sort());
}

// ----------- TEST CASES -----------

test('Verify product titles are sorted Z to A with visual check', async ({ page }) => {
  await login(page);
  await sortProducts(page, 'za');

  const productTitleLocators = await page.locator("a[id^='item_'][id$='_title_link'] div.inventory_item_name").all();
  const titles = await extractTexts(productTitleLocators);

  const sorted = [...titles].sort((a, b) => b.localeCompare(a)); // Z to A
  expect(titles).toEqual(sorted);

  await expect(page).toHaveScreenshot('sorted-titles-za.png'); // visual test added
});

test('Verify prices are sorted High to Low with visual check', async ({ page }) => {
  await login(page);
  await sortProducts(page, 'hilo');

  const priceLocators = await page.locator('.inventory_item_price').all();
  const prices = [];

  for (const el of priceLocators) {
    const priceText = await el.textContent();
    prices.push(parseFloat(priceText.replace('$', '')));
  }

  const sortedPrices = [...prices].sort((a, b) => b - a); // high to low
  expect(prices).toEqual(sortedPrices);

  await expect(page.locator('.inventory_list')).toHaveScreenshot('sorted-prices-hilo.png'); // visual test
});

test('Add multiple items to cart, checkout, and verify visually', async ({ page }) => {
  await login(page);

  const productsToAdd = [
    'Sauce Labs Backpack',
    'Sauce Labs Onesie',
    'Sauce Labs Bolt T-Shirt',
  ];

  await addProductsToCart(page, productsToAdd);
  await page.locator('button#checkout').click();
  await expect(page).toHaveScreenshot('checkout-info.png'); // visual test

  await page.locator('input#first-name').fill('John');
  await page.locator('input#last-name').fill('Doe');
  await page.locator('input#postal-code').fill('600089');
  await page.locator('input#continue').click();

  await expect(page).toHaveScreenshot('checkout-overview.png'); // visual test

  await page.locator('button#finish').click();
  await expect(page).toHaveScreenshot('checkout-complete.png'); // visual test

  await page.locator('button#back-to-products').click();
});
