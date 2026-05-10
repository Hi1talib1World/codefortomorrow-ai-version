import fs from 'fs';
import path from 'path';

const GITHUB_TOKEN = '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';

async function seed() {
  const filePath = path.resolve(process.cwd(), 'custom-repos.json');
  const cacheFilePath = path.resolve(process.cwd(), 'repos-cache.json');
  
  if (!fs.existsSync(filePath)) {
    console.log('No custom-repos.json found');
    return;
  }
  
  const repos = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  const repoDetails = [];
  
  for (const repo of repos) {
    console.log(`Fetching ${repo}...`);
    const response = await fetch(`https://api.github.com/repos/${repo}`, {
      headers: {
        'User-Agent': 'CodeForTomorrow-App',
        'Accept': 'application/vnd.github.mercy-preview+json',
        'Authorization': `token ${GITHUB_TOKEN}`
      }
    });
    
    if (response.ok) {
      repoDetails.push(await response.json());
    } else {
      console.log(`Failed to fetch ${repo}: ${response.status}`);
    }
    
    // Wait a bit to avoid slamming API
    await new Promise(r => setTimeout(r, 200));
  }
  
  fs.writeFileSync(cacheFilePath, JSON.stringify(repoDetails, null, 2));
  console.log(`Successfully cached ${repoDetails.length} repos to repos-cache.json`);
}

seed().catch(console.error);
