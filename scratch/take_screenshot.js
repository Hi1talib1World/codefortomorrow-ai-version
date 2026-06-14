import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';

async function run() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  // Set viewport to a high desktop resolution
  await page.setViewportSize({ width: 1440, height: 900 });

  console.log("Navigating to http://localhost:3000/role-selection...");
  await page.goto("http://localhost:3000/role-selection");

  console.log("Selecting student role...");
  // Wait for student button and click it
  await page.waitForSelector('button:has-text("student")');
  await page.click('button:has-text("student")');

  console.log("Waiting for auth screen...");
  await page.waitForURL('**/auth');

  console.log("Logging in as Guest...");
  // Wait for guest login button and click it
  await page.waitForSelector('button:has-text("Continue as Guest")');
  await page.click('button:has-text("Continue as Guest")');

  console.log("Waiting for dashboard to load...");
  await page.waitForURL('**/dashboard');
  
  // Wait for some time to let layout settle and any queries finish
  await page.waitForTimeout(5000);

  // Take the screenshot
  const screenshotPath = path.resolve('public/assets/images/dashboard-screenshot.png');
  console.log(`Taking screenshot to ${screenshotPath}...`);
  await page.screenshot({ path: screenshotPath });

  console.log("Done!");
  await browser.close();
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
