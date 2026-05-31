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

  console.log('Navigating to http://localhost:3000...');
  try {
    // In development mode, the app bypasses splash screen automatically (thanks to our earlier fixes!)
    // Let's navigate directly to the root
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 10000 });
    console.log('Page loaded. Current URL:', page.url());
    
    // We should be redirected to language selection or welcome page if guest.
    // Let's wait a moment
    await page.waitForTimeout(2000);
    
    // Check if we can find any textareas or get the html
    const html = await page.content();
    console.log('HTML size:', html.length);
  } catch (error) {
    console.error('Failed:', error);
  }

  await browser.close();
  console.log('Done.');
}

run();
