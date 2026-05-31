import { chromium } from '@playwright/test';

async function run() {
  console.log('Launching browser...');
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => {
    console.log(`[BROWSER CONSOLE] ${msg.type()}: ${msg.text()}`);
  });

  page.on('pageerror', err => {
    console.log(`[BROWSER PAGE ERROR] ${err.message}`);
    console.log(err.stack);
  });

  console.log('Navigating to http://localhost:3000...');
  try {
    await page.goto('http://localhost:3000', { waitUntil: 'load', timeout: 10000 });
    console.log('Page loaded.');
    
    // Wait another 3 seconds for any dynamic errors or hydration failures
    await page.waitForTimeout(3000);
    
    const html = await page.content();
    console.log('Page HTML length:', html.length);
  } catch (error) {
    console.error('Failed to navigate:', error);
  }

  await browser.close();
  console.log('Done.');
}

run();
