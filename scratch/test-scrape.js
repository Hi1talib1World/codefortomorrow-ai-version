import { JSDOM } from 'jsdom';

async function test() {
  try {
    const response = await fetch('https://github.com/trending', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    console.log('Status:', response.status);
    const html = await response.text();
    const dom = new JSDOM(html);
    const document = dom.window.document;
    const rows = document.querySelectorAll('article.Box-row');
    console.log('Number of rows found:', rows.length);
    
    if (rows.length === 0) {
      console.log('HTML length:', html.length);
      console.log('HTML sample:', html.substring(0, 1000));
    } else {
      const firstRow = rows[0];
      const titleAnchor = firstRow.querySelector('h2 a');
      const href = titleAnchor ? titleAnchor.getAttribute('href') : '';
      console.log('First repo href:', href);
    }
  } catch (err) {
    console.error('Error:', err);
  }
}

test();
