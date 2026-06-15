import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';

async function run() {
  const browser = await chromium.launch({ headless: true });
  // Create browser context
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.error('PAGE ERROR:', err.message));
  
  try {
    console.log("Navigating to http://localhost:3000/ to set localStorage...");
    await page.goto("http://localhost:3000/");
    
    // Set localStorage parameters so we skip language selection screen
    await page.evaluate(() => {
      localStorage.setItem('appLanguageSelected', 'true');
      localStorage.setItem('appLanguage', 'en');
    });

    console.log("Navigating to http://localhost:3000/role-selection...");
    await page.goto("http://localhost:3000/role-selection");

    console.log("Selecting student role...");
    // Wait for student button and click it
    await page.waitForSelector('button:has-text("I\'m a student")');
    await page.click('button:has-text("I\'m a student")');

    console.log("Waiting for auth screen...");
    await page.waitForURL('**/auth');

    console.log("Logging in as Guest...");
    // Wait for guest login button and click it
    await page.waitForSelector('button:has-text("Continue as Guest")');
    await page.click('button:has-text("Continue as Guest")');

    console.log("Waiting for dashboard to load...");
    await page.waitForURL('**/dashboard', { timeout: 10000 });
    
    // Wait for some time to let layout settle and any queries finish
    await page.waitForTimeout(6000);

    // Take the screenshot
    const screenshotPath = path.resolve('public/assets/images/dashboard-screenshot.png');
    console.log(`Taking screenshot to ${screenshotPath}...`);
    await page.screenshot({ path: screenshotPath });
    console.log("Done!");

  } catch (err) {
    console.error("Error during execution:", err);
    const debugPath = path.resolve('public/assets/images/debug-screenshot.png');
    console.log(`Taking debug screenshot to ${debugPath} at current URL: ${page.url()}`);
    await page.screenshot({ path: debugPath });
    throw err;
  } finally {
    await browser.close();
  }
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
