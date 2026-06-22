import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { AIEngine } from '../../core/ai-coach/aiEngine';
import { JSDOM } from 'jsdom';

// Simple TTL cache implementation
const cache = new Map<string, { data: any, timestamp: number }>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

function getCached(key: string) {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }
  return null;
}

function setCached(key: string, data: any) {
  cache.set(key, { data, timestamp: Date.now() });
}

export const getLeaderboard = async (req: Request, res: Response) => {
  try {
    const country = (req.query.country as string) || 'Global';
    const cacheKey = `leaderboard_${country}`;
    
    const cachedData = getCached(cacheKey);
    if (cachedData) {
      return res.json(cachedData);
    }

    let query = 'type:user';
    if (country !== 'Global') {
      query += ` location:"${country}"`;
    }

    // Only get top 30
    const response = await fetch(`https://api.github.com/search/users?q=${encodeURIComponent(query)}&sort=followers&per_page=30`, {
      headers: {
        'User-Agent': 'CodeForTomorrow-App',
        ...(process.env.GITHUB_TOKEN ? { 'Authorization': `token ${process.env.GITHUB_TOKEN}` } : {})
      }
    });

    if (!response.ok) {
      if (response.status === 403) {
        return res.status(429).json({ message: 'GitHub API rate limit exceeded.' });
      }
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = await response.json();
    setCached(cacheKey, data.items || []);
    res.json(data.items || []);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ message: 'Error fetching leaderboard' });
  }
};

export const getCuratedRepos = async (req: Request, res: Response) => {
  try {
    const filePath = path.resolve(process.cwd(), 'custom-repos.json');
    const cacheFilePath = path.resolve(process.cwd(), 'repos-cache.json');
    
    let repos: string[] = [];
    if (fs.existsSync(filePath)) {
      repos = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }

    let persistentCache: any[] = [];
    if (fs.existsSync(cacheFilePath)) {
      try {
        persistentCache = JSON.parse(fs.readFileSync(cacheFilePath, 'utf-8'));
      } catch (e) {
        console.error('Error parsing repos-cache.json', e);
      }
    }

    const cacheKey = 'curated_repos';
    const cachedData = getCached(cacheKey);
    // If we have cached data and it matches the number of curated repos, return it
    if (cachedData && cachedData.length > 0 && cachedData.length === repos.length) {
      return res.json(cachedData);
    }

    // If GitHub API is likely rate-limited (we can guess if we failed recently), we could just serve persistentCache
    // But let's try fetching. If it fails, we fall back.
    let rateLimited = false;

    const fetchRepo = async (fullName: string) => {
      if (rateLimited) {
        return persistentCache.find((r: any) => r.full_name?.toLowerCase() === fullName.toLowerCase()) || null;
      }

      try {
        const response = await fetch(`https://api.github.com/repos/${fullName}`, {
          headers: {
            'User-Agent': 'CodeForTomorrow-App',
            'Accept': 'application/vnd.github.mercy-preview+json',
            ...(process.env.GITHUB_TOKEN ? { 'Authorization': `token ${process.env.GITHUB_TOKEN}` } : {})
          }
        });
        
        if (response.ok) {
          return await response.json();
        } else if (response.status === 403 || response.status === 429) {
          rateLimited = true;
          console.warn(`[GitHub API] Rate limit exceeded while fetching ${fullName}. Falling back to persistent cache.`);
          return persistentCache.find((r: any) => r.full_name?.toLowerCase() === fullName.toLowerCase()) || null;
        }
      } catch (err) {
        console.warn(`[GitHub API] Fetch failed for ${fullName}. Falling back to persistent cache.`);
        rateLimited = true;
        return persistentCache.find((r: any) => r.full_name?.toLowerCase() === fullName.toLowerCase()) || null;
      }
      return null;
    };

    const repoDetails = [];
    for (const repo of repos) {
      const details = await fetchRepo(repo);
      if (details) {
        repoDetails.push(details);
      }
    }
    
    if (repoDetails.length > 0) {
      fs.writeFileSync(cacheFilePath, JSON.stringify(repoDetails, null, 2));
      setCached(cacheKey, repoDetails);
      res.json(repoDetails);
    } else if (persistentCache.length > 0) {
      res.json(persistentCache); // Ultimate fallback
    } else {
      res.json([]);
    }
  } catch (error) {
    console.error('Error fetching curated repos:', error);
    res.status(500).json({ message: 'Error fetching curated repos' });
  }
};

export const addCuratedRepo = async (req: Request, res: Response) => {
  try {
    const { url } = req.body;
    if (!url || typeof url !== 'string') {
      return res.status(400).json({ message: 'Valid GitHub URL is required' });
    }

    // Extract owner/repo from URL
    const match = url.match(/github\.com\/([^\/]+\/[^\/]+)/);
    if (!match) {
      return res.status(400).json({ message: 'Invalid GitHub URL format' });
    }

    let repoName = match[1];
    // Remove .git if exists
    if (repoName.endsWith('.git')) {
      repoName = repoName.substring(0, repoName.length - 4);
    }

    const filePath = path.resolve(process.cwd(), 'custom-repos.json');
    let repos: string[] = [];
    if (fs.existsSync(filePath)) {
      repos = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }

    if (repos.includes(repoName)) {
      return res.status(400).json({ message: 'Repository already exists in curation list' });
    }

    repos.push(repoName);
    fs.writeFileSync(filePath, JSON.stringify(repos, null, 2));

    // Clear cache
    cache.delete('curated_repos');

    res.status(201).json({ message: 'Repository added successfully', repo: repoName });
  } catch (error) {
    console.error('Error adding curated repo:', error);
    res.status(500).json({ message: 'Error adding curated repo' });
  }
};

export const getTrendingRepos = async (req: Request, res: Response) => {
  try {
    const todayStr = new Date().toISOString().split('T')[0];
    const cacheKey = `trending_repos_scraped_${todayStr}`;
    const cachedData = getCached(cacheKey);
    if (cachedData) {
      return res.json(cachedData);
    }

    const response = await fetch('https://github.com/trending', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`GitHub HTML trending request failed: ${response.status}`);
    }

    const html = await response.text();
    const dom = new JSDOM(html);
    const document = dom.window.document;
    const rows = document.querySelectorAll('article.Box-row');

    const repos: any[] = [];
    rows.forEach((row, i) => {
      const titleAnchor = row.querySelector('h2 a');
      const href = titleAnchor ? titleAnchor.getAttribute('href') : '';
      const fullName = href ? href.substring(1) : '';
      
      const p = row.querySelector('p');
      const description = p ? p.textContent.trim() : '';

      const langSpan = row.querySelector('[itemprop="programmingLanguage"]');
      const language = langSpan ? langSpan.textContent.trim() : '';

      const starAnchor = row.querySelector(`a[href$="/stargazers"]`);
      const starsText = starAnchor ? starAnchor.textContent.trim().replace(/,/g, '') : '0';
      const stargazers_count = parseInt(starsText, 10) || 0;

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

    if (repos.length > 0) {
      try {
        const descList = repos.map(r => r.description || '');
        console.log(`[Trending] Translating ${descList.length} descriptions to Arabic...`);
        const translationsAr = await AIEngine.translateDescriptionsToArabic(descList);
        if (translationsAr && translationsAr.length === repos.length) {
          repos.forEach((repo, idx) => {
            if (translationsAr[idx]) {
              repo.description_ar = translationsAr[idx];
            }
          });
        }
      } catch (err) {
        console.error('Failed to translate trending descriptions:', err);
      }

      setCached(cacheKey, repos);
      return res.json(repos);
    } else {
      throw new Error('No repositories found on trending page');
    }
  } catch (error) {
    console.error('Error fetching trending repos:', error);
    const cacheFilePath = path.resolve(process.cwd(), 'repos-cache.json');
    if (fs.existsSync(cacheFilePath)) {
      const cacheData = JSON.parse(fs.readFileSync(cacheFilePath, 'utf-8'));
      return res.json(cacheData.slice(0, 15));
    }
    res.status(500).json({ message: 'Error fetching trending repos' });
  }
};

export const searchIssues = async (req: Request, res: Response) => {
  try {
    const { q, language, sort = 'comments', order = 'desc', per_page = '30', page = '1' } = req.query as any;
    if (!q || typeof q !== 'string') {
      return res.status(400).json({ message: 'Query parameter `q` is required.' });
    }

    let query = `${q} label:\"good first issue\" state:open`;
    if (language) {
      query += ` language:${language}`;
    }

    const response = await fetch(`https://api.github.com/search/issues?q=${encodeURIComponent(query)}&sort=${encodeURIComponent(sort)}&order=${encodeURIComponent(order)}&per_page=${encodeURIComponent(per_page)}&page=${encodeURIComponent(page)}`, {
      headers: {
        'User-Agent': 'CodeForTomorrow-App',
        ...(process.env.GITHUB_TOKEN ? { 'Authorization': `token ${process.env.GITHUB_TOKEN}` } : {})
      }
    });

    if (!response.ok) {
      if (response.status === 403 || response.status === 429) {
        console.warn('[GitHub API] Issues search rate-limited. Returning empty array.');
        return res.json({ items: [] });
      }
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error searching issues:', error);
    res.json({ items: [] });
  }
};

export const searchRepos = async (req: Request, res: Response) => {
  const { q, language, sort = 'stars', order = 'desc', per_page = '30', page = '1' } = req.query as any;
  try {
    // Allow clients to pass a full q; otherwise return bad request
    if (!q || typeof q !== 'string') {
      return res.status(400).json({ message: 'Query parameter `q` is required.' });
    }

    const cacheKey = `search_${q}_${language || ''}_${sort}_${order}_${per_page}_${page}`;
    const cachedData = getCached(cacheKey);
    if (cachedData) return res.json(cachedData);

    let query = q;
    if (language) {
      query += ` language:${language}`;
    }

    const response = await fetch(`https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=${encodeURIComponent(sort)}&order=${encodeURIComponent(order)}&per_page=${encodeURIComponent(per_page)}&page=${encodeURIComponent(page)}`, {
      headers: {
        'User-Agent': 'CodeForTomorrow-App',
        ...(process.env.GITHUB_TOKEN ? { 'Authorization': `token ${process.env.GITHUB_TOKEN}` } : {})
      }
    });

    if (!response.ok) {
      if (response.status === 403 || response.status === 429) {
        console.warn('[GitHub API] Search rate-limited. Falling back to local search.');
        const cacheFilePath = path.resolve(process.cwd(), 'repos-cache.json');
        if (fs.existsSync(cacheFilePath)) {
          const cacheData = JSON.parse(fs.readFileSync(cacheFilePath, 'utf-8'));
          const filtered = cacheData.filter((r: any) => 
            (r.name || '').toLowerCase().includes(q.toLowerCase()) ||
            (r.description || '').toLowerCase().includes(q.toLowerCase()) ||
            (r.language || '').toLowerCase().includes(q.toLowerCase())
          );
          return res.json(filtered);
        }
        return res.status(429).json({ message: 'GitHub API rate limit exceeded.' });
      }
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = await response.json();
    setCached(cacheKey, data.items || []);
    res.json(data.items || []);
  } catch (error) {
    console.error('Error searching repos:', error);
    const cacheFilePath = path.resolve(process.cwd(), 'repos-cache.json');
    if (fs.existsSync(cacheFilePath)) {
      const cacheData = JSON.parse(fs.readFileSync(cacheFilePath, 'utf-8'));
      const filtered = cacheData.filter((r: any) => 
        (r.name || '').toLowerCase().includes(q.toLowerCase()) ||
        (r.description || '').toLowerCase().includes(q.toLowerCase())
      );
      return res.json(filtered);
    }
    res.status(500).json({ message: 'Error searching repositories' });
  }
};

export const getReposById = async (req: Request, res: Response) => {
  try {
    const ids = (req.query.ids as string) || '';
    if (!ids) return res.status(400).json({ message: 'ids query param required' });
    const idList = ids.split(',').map(s => s.trim()).filter(Boolean);
    const results: any[] = [];

    for (const id of idList) {
      try {
        const response = await fetch(`https://api.github.com/repositories/${encodeURIComponent(id)}`, {
          headers: {
            'User-Agent': 'CodeForTomorrow-App',
            ...(process.env.GITHUB_TOKEN ? { 'Authorization': `token ${process.env.GITHUB_TOKEN}` } : {})
          }
        });
        if (response.ok) {
          const data = await response.json();
          results.push(data);
        }
      } catch (err) {
        console.warn('Failed to fetch repo by id', id, err);
      }
    }

    res.json(results);
  } catch (error) {
    console.error('Error getting repos by id:', error);
    res.status(500).json({ message: 'Error fetching repositories by id' });
  }
};

export const getRepoReadme = async (req: Request, res: Response) => {
  try {
    const { owner, repo } = req.params;
    const cacheKey = `readme_${owner}_${repo}`;

    // 1. Check in-memory cache first
    const cachedData = getCached(cacheKey);
    if (cachedData) {
      return res.send(cachedData);
    }

    // 2. Check persistent file cache
    const readmeCacheDir = path.resolve(process.cwd(), 'readme-cache');
    const readmeCacheFile = path.resolve(readmeCacheDir, `${owner}__${repo}.md`);
    
    let persistentCachedReadme: string | null = null;
    if (fs.existsSync(readmeCacheFile)) {
      persistentCachedReadme = fs.readFileSync(readmeCacheFile, 'utf-8');
    }

    // 3. Try fetching from GitHub
    try {
      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, {
        headers: {
          'User-Agent': 'CodeForTomorrow-App',
          'Accept': 'application/vnd.github.v3.raw',
          ...(process.env.GITHUB_TOKEN ? { 'Authorization': `token ${process.env.GITHUB_TOKEN}` } : {})
        }
      });

      if (response.ok) {
        const markdown = await response.text();
        setCached(cacheKey, markdown);

        // Persist to file cache
        if (!fs.existsSync(readmeCacheDir)) {
          fs.mkdirSync(readmeCacheDir, { recursive: true });
        }
        fs.writeFileSync(readmeCacheFile, markdown);

        return res.send(markdown);
      } else if (response.status === 404) {
        return res.status(404).json({ message: 'Readme not found' });
      } else {
        // Rate limited or other error — fall through to persistent cache
        console.warn(`[GitHub API] Error ${response.status} fetching README for ${owner}/${repo}`);
      }
    } catch (fetchErr) {
      console.warn(`[GitHub API] Network error fetching README for ${owner}/${repo}:`, fetchErr);
    }

    // 4. Fallback to persistent cache
    if (persistentCachedReadme) {
      setCached(cacheKey, persistentCachedReadme);
      return res.send(persistentCachedReadme);
    }

    res.status(503).json({ message: 'GitHub API unavailable and no cached README found.' });
  } catch (error) {
    console.error('Error fetching readme:', error);
    res.status(500).json({ message: 'Error fetching readme' });
  }
};

export const getRepoSetupGuide = async (req: Request, res: Response) => {
  try {
    const owner = typeof req.params.owner === 'string' ? req.params.owner : '';
    const repo = typeof req.params.repo === 'string' ? req.params.repo : '';
    const description = typeof req.query.description === 'string' ? req.query.description : '';
    const lang = typeof req.query.lang === 'string' ? req.query.lang : 'en';
    const targetLang = lang === 'ar' ? 'ar' : 'en';
    const cacheKey = `setup_guide_${owner}_${repo}_${targetLang}`;

    // 1. Check in-memory cache first
    const cachedData = getCached(cacheKey);
    if (cachedData) {
      return res.send(cachedData);
    }

    // 2. Check persistent file cache
    const readmeCacheDir = path.resolve(process.cwd(), 'readme-cache');
    const guideCacheFile = path.resolve(readmeCacheDir, `setup_guide_${owner}__${repo}_${targetLang}.md`);
    
    if (fs.existsSync(guideCacheFile)) {
      const persistentCachedGuide = fs.readFileSync(guideCacheFile, 'utf-8');
      setCached(cacheKey, persistentCachedGuide);
      return res.send(persistentCachedGuide);
    }

    // 3. Get the raw README (read from cache or fetch)
    const readmeCacheFile = path.resolve(readmeCacheDir, `${owner}__${repo}.md`);
    let readmeContent = '';

    if (fs.existsSync(readmeCacheFile)) {
      readmeContent = fs.readFileSync(readmeCacheFile, 'utf-8');
    } else {
      // Fetch README from GitHub
      try {
        const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, {
          headers: {
            'User-Agent': 'CodeForTomorrow-App',
            'Accept': 'application/vnd.github.v3.raw',
            ...(process.env.GITHUB_TOKEN ? { 'Authorization': `token ${process.env.GITHUB_TOKEN}` } : {})
          }
        });

        if (response.ok) {
          readmeContent = await response.text();
          // Cache raw readme for later use
          if (!fs.existsSync(readmeCacheDir)) {
            fs.mkdirSync(readmeCacheDir, { recursive: true });
          }
          fs.writeFileSync(readmeCacheFile, readmeContent);
          setCached(`readme_${owner}_${repo}`, readmeContent);
        } else {
          console.warn(`[GitHub API] Error ${response.status} fetching README for ${owner}/${repo}`);
        }
      } catch (fetchErr) {
        console.warn(`[GitHub API] Network error fetching README for ${owner}/${repo}:`, fetchErr);
      }
    }

    // If we have no README, we can't generate a guide easily, but we can try to fall back
    if (!readmeContent) {
      readmeContent = `No README content was found on GitHub for ${owner}/${repo}. Please visit the repository for more details.`;
    }

    // 4. Generate AI guide
    const guide = await AIEngine.getBeginnerSetupGuide(repo, description, readmeContent, targetLang);

    // 5. Cache and return the generated guide
    if (!fs.existsSync(readmeCacheDir)) {
      fs.mkdirSync(readmeCacheDir, { recursive: true });
    }
    fs.writeFileSync(guideCacheFile, guide);
    setCached(cacheKey, guide);

    return res.send(guide);
  } catch (error) {
    console.error('Error generating setup guide:', error);
    res.status(500).json({ message: 'Error generating setup guide' });
  }
};

export const translateText = async (req: Request, res: Response) => {
  try {
    const { text, texts, targetLang } = req.body;
    const target = targetLang === 'ar' || targetLang === 'en' ? targetLang : 'ar';

    if (texts && Array.isArray(texts)) {
      if (texts.length === 0) {
        return res.json({ translatedTexts: [] });
      }
      if (target === 'ar') {
        const translatedTexts = await AIEngine.translateDescriptionsToArabic(texts);
        return res.json({ translatedTexts });
      } else {
        return res.json({ translatedTexts: texts });
      }
    }

    if (!text) {
      return res.status(400).json({ message: 'Text to translate is required' });
    }
    const translatedText = await AIEngine.translateText(text, target);
    res.json({ translatedText });
  } catch (error) {
    console.error('Error translating text:', error);
    res.status(500).json({ message: 'Error translating text' });
  }
};


