const { JSDOM } = require('jsdom');

async function testFetch() {
  try {
    console.log('Fetching github.com/trending...');
    const response = await fetch('https://github.com/trending', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const html = await response.text();
    console.log('HTML fetched successfully. Length:', html.length);
    
    const dom = new JSDOM(html);
    const document = dom.window.document;
    const rows = document.querySelectorAll('article.Box-row');
    console.log('Found rows:', rows.length);

    const repos = [];
    rows.forEach((row, i) => {
      const titleAnchor = row.querySelector('h2 a');
      const href = titleAnchor ? titleAnchor.getAttribute('href') : '';
      // href is typically "/owner/repo"
      const fullName = href ? href.substring(1) : '';
      
      const p = row.querySelector('p');
      const description = p ? p.textContent.trim() : '';

      // Find language
      const langSpan = row.querySelector('[itemprop="programmingLanguage"]');
      const language = langSpan ? langSpan.textContent.trim() : '';

      // Find stars
      // Stars is usually an anchor with relative href ending with "/stargazers"
      const starAnchor = row.querySelector(`a[href$="/stargazers"]`);
      const starsText = starAnchor ? starAnchor.textContent.trim().replace(/,/g, '') : '0';
      const stargazers_count = parseInt(starsText, 10) || 0;

      // Find forks
      const forkAnchor = row.querySelector(`a[href$="/forks"]`);
      const forksText = forkAnchor ? forkAnchor.textContent.trim().replace(/,/g, '') : '0';
      const forks_count = parseInt(forksText, 10) || 0;

      repos.push({
        id: i,
        name: fullName.split('/')[1] || '',
        full_name: fullName,
        description,
        language,
        stargazers_count,
        forks_count,
        html_url: `https://github.com/${fullName}`
      });
    });

    console.log('Scraped first 3 repos:');
    console.log(repos.slice(0, 3));
  } catch (err) {
    console.error('Error during test:', err);
  }
}

testFetch();
