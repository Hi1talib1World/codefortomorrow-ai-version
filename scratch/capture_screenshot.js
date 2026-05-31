import { chromium } from '@playwright/test';

async function run() {
  console.log('Launching browser...');
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  console.log('Navigating to http://localhost:3000...');
  try {
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 10000 });
    console.log('Page loaded. URL:', page.url());
    
    // Wait for 3 seconds to let any transitions complete
    await page.waitForTimeout(3000);
    
    // Take a screenshot of the page
    const screenshotPath = 'C:/Users/hicha/.gemini/antigravity/brain/5ae33823-720e-449c-9801-452e5634ea03/screenshot.png';
    await page.screenshot({ path: screenshotPath });
    console.log('Screenshot saved to:', screenshotPath);
  } catch (error) {
    console.error('Failed to capture page:', error);
  }

  await browser.close();
  console.log('Done.');
}

run();
