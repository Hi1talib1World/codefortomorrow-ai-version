import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

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
      query += ` location:${country}`;
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
    if (cachedData) {
      if (cachedData.length === repos.length) {
        return res.json(cachedData);
      }
    }

    let rateLimited = false;

    const fetchRepo = async (fullName: string) => {
      // If we know we are rate limited, just return the cached version immediately
      if (rateLimited) {
        return persistentCache.find((r: any) => r.full_name?.toLowerCase() === fullName.toLowerCase()) || null;
      }

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
      return null;
    };

    // Process sequentially to avoid slamming the API
    const repoDetails = [];
    for (const repo of repos) {
      const details = await fetchRepo(repo);
      if (details) {
        repoDetails.push(details);
      }
    }
    
    // Save to persistent cache if we got good data
    if (repoDetails.length > 0) {
      fs.writeFileSync(cacheFilePath, JSON.stringify(repoDetails, null, 2));
      setCached(cacheKey, repoDetails);
    }
    
    res.json(repoDetails);
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
    // Trending = created in the last 7 days, sorted by stars
    const date = new Date();
    date.setDate(date.getDate() - 7);
    const dateStr = date.toISOString().split('T')[0];

    const cacheKey = `trending_repos_${dateStr}`;
    const cachedData = getCached(cacheKey);
    if (cachedData) {
      return res.json(cachedData);
    }

    const query = `created:>${dateStr}`;
    const response = await fetch(`https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=stars&order=desc&per_page=15`, {
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
    console.error('Error fetching trending repos:', error);
    res.status(500).json({ message: 'Error fetching trending repos' });
  }
};
