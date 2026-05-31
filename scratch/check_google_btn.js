import { chromium } from '@playwright/test';

async function run() {
  console.log('Launching browser...');
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => {
    console.log(`[CONSOLE] ${msg.type()}: ${msg.text()}`);
  });

  page.on('pageerror', err => {
    console.log(`[PAGE ERROR] ${err.message}`);
    console.log(err.stack);
  });

  console.log('Navigating to http://localhost:3000/auth...');
  try {
    await page.goto('http://localhost:3000/auth', { waitUntil: 'networkidle', timeout: 10000 });
    console.log('Page loaded. Clicking Google button...');
    
    // Find the Google button
    // It has text "continue_with_google" or "Continue with Google"
    // Let's print all buttons to be sure
    const buttons = await page.locator('button').allInnerTexts();
    console.log('Available buttons:', buttons);
    
    // Click button that contains Google
    const googleBtn = page.locator('button:has-text("Google")');
    await googleBtn.click();
    console.log('Clicked Google button. Waiting 5 seconds...');
    
    await page.waitForTimeout(5000);
    console.log('Current URL:', page.url());
  } catch (error) {
    console.error('Failed:', error);
  }

  await browser.close();
  console.log('Done.');
}

run();
