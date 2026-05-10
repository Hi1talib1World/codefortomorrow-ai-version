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
    let repos: string[] = [];
    if (fs.existsSync(filePath)) {
      repos = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }

    const cacheKey = 'curated_repos';
    const cachedData = getCached(cacheKey);
    if (cachedData) {
      // Check if the number of repos has changed, if not return cached
      if (cachedData.length === repos.length) {
        return res.json(cachedData);
      }
    }

    const fetchRepo = async (fullName: string) => {
      const response = await fetch(`https://api.github.com/repos/${fullName}`, {
        headers: {
          'User-Agent': 'CodeForTomorrow-App',
          'Accept': 'application/vnd.github.mercy-preview+json',
          ...(process.env.GITHUB_TOKEN ? { 'Authorization': `token ${process.env.GITHUB_TOKEN}` } : {})
        }
      });
      if (response.ok) {
        return await response.json();
      }
      return null;
    };

    const repoDetails = (await Promise.all(repos.map(fetchRepo))).filter(Boolean);
    
    setCached(cacheKey, repoDetails);
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
