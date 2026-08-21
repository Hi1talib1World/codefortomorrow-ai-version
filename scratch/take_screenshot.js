import { chromium } from '@playwright/test';
import path from 'path';

(async () => {
  try {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();
    
    console.log('Navigating to http://127.0.0.1:3000/dashboard...');
    await page.goto('http://127.0.0.1:3000/dashboard', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);
    
    const targetPath = path.resolve(process.cwd(), 'public/assets/images/dashboard-screenshot.png');
    await page.screenshot({ path: targetPath });
    console.log('Screenshot successfully saved to:', targetPath);
    
    await browser.close();
  } catch (err) {
    console.error('Error capturing screenshot:', err);
    process.exit(1);
  }
})();
