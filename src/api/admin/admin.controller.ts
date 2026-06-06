import { Request, Response, NextFunction } from 'express';
import { v2 as cloudinary } from 'cloudinary';
import { z } from 'zod';
import Content from '../../../src/models/Content';
import ApiError from '../../../utils/ApiError';
import User from '../../../src/models/user.model';
import { getLearningAnalytics } from '../../../src/core/analytics/analytics.service';

// ─── Cloudinary Config ────────────────────────────────────────────────────────
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ─── Zod Schemas ──────────────────────────────────────────────────────────────
const ContentCreateSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  slug: z.string().optional(),
  type: z.enum(['post', 'announcement', 'featured']).default('post'),
  status: z.enum(['draft', 'live']).default('draft'),
  body: z.string().default(''),
  coverImageUrl: z.string().url().optional().or(z.literal('')),
  tags: z.array(z.string()).default([]),
});

const ContentUpdateSchema = ContentCreateSchema.partial();

// ─── Helpers ──────────────────────────────────────────────────────────────────
const generateSlug = (title: string): string =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') +
  '-' +
  Date.now();

// ─── Controllers ──────────────────────────────────────────────────────────────

/**
 * GET /api/admin/content
 * List all content with optional search/filter
 */
export const listContent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { search, type, status, page = '1', limit = '20' } = req.query as Record<string, string>;
    const query: Record<string, any> = {};

    if (search) query.title = { $regex: search, $options: 'i' };
    if (type) query.type = type;
    if (status) query.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [items, total] = await Promise.all([
      Content.find(query)
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .populate('author', 'name email profilePictureUrl'),
      Content.countDocuments(query),
    ]);

    res.json({ items, total, page: parseInt(page), limit: parseInt(limit) });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/admin/content/:id
 */
export const getContent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const item = await Content.findById(req.params.id).populate('author', 'name email');
    if (!item) return next(new ApiError(404, 'Content not found'));
    res.json(item);
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/admin/content
 */
export const createContent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = ContentCreateSchema.safeParse(req.body);
    if (!parsed.success) {
      return next(new ApiError(400, parsed.error.issues.map((e) => e.message).join(', ')));
    }

    const data = parsed.data;
    const slug = data.slug || generateSlug(data.title);

    const item = await Content.create({
      ...data,
      slug,
      author: (req as any).user.id,
      publishedAt: data.status === 'live' ? new Date() : undefined,
    });

    res.status(201).json(item);
  } catch (error: any) {
    if (error.code === 11000) {
      return next(new ApiError(409, 'A post with this slug already exists'));
    }
    next(error);
  }
};

/**
 * PUT /api/admin/content/:id
 */
export const updateContent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = ContentUpdateSchema.safeParse(req.body);
    if (!parsed.success) {
      return next(new ApiError(400, parsed.error.issues.map((e) => e.message).join(', ')));
    }

    const update: Record<string, any> = { ...parsed.data };
    if (update.status === 'live') {
      // Set publishedAt only if not already set
      const existing = await Content.findById(req.params.id);
      if (existing && !existing.publishedAt) {
        update.publishedAt = new Date();
      }
    }

    const item = await Content.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    });
    if (!item) return next(new ApiError(404, 'Content not found'));
    res.json(item);
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/admin/content/:id
 */
export const deleteContent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const item = await Content.findByIdAndDelete(req.params.id);
    if (!item) return next(new ApiError(404, 'Content not found'));
    res.json({ message: 'Content deleted successfully' });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/admin/content/:id/status
 * Toggle draft <-> live
 */
export const toggleStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const item = await Content.findById(req.params.id);
    if (!item) return next(new ApiError(404, 'Content not found'));

    item.status = item.status === 'live' ? 'draft' : 'live';
    if (item.status === 'live' && !item.publishedAt) {
      item.publishedAt = new Date();
    }
    await item.save();
    res.json(item);
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/admin/upload
 * Upload image to Cloudinary (expects base64 data URI in req.body.image)
 */
export const uploadImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { image } = req.body;
    if (!image) return next(new ApiError(400, 'No image provided'));

    if (!process.env.CLOUDINARY_CLOUD_NAME) {
      return next(new ApiError(503, 'Image upload not configured. Set CLOUDINARY_* env vars.'));
    }

    const result = await cloudinary.uploader.upload(image, {
      folder: 'codefortomorrow/admin',
      resource_type: 'auto',
    });

    res.json({ url: result.secure_url, public_id: result.public_id });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/admin/analytics
 * Comprehensive analytics dashboard data: PostHog metrics + MongoDB aggregations
 */
export const getAnalytics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const forceRefresh = req.query.refresh === 'true';
    const learningAnalytics = await getLearningAnalytics(forceRefresh);
    const apiKey = process.env.POSTHOG_PERSONAL_API_KEY;
    const projectId = process.env.POSTHOG_PROJECT_ID;
    const now = new Date();

    // ─── MongoDB Aggregations (always available) ────────────────────────────────

    // 1. New signups in the last 7 days
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const newSignups = await User.countDocuments({ createdAt: { $gte: sevenDaysAgo } });

    // 2. Previous-week signups for comparison (days -14 to -7)
    const fourteenDaysAgo = new Date(now);
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
    const prevWeekSignups = await User.countDocuments({
      createdAt: { $gte: fourteenDaysAgo, $lt: sevenDaysAgo },
    });

    // 3. Daily signup breakdown (last 7 days) for sparkline
    const dailySignups = await User.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Build a filled 7-day array (some days may have 0 signups)
    const signupSparkline: number[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      const found = dailySignups.find((r: any) => r._id === key);
      signupSparkline.push(found ? found.count : 0);
    }

    // 4. All current accounts
    const currentAccounts = await User.find()
      .select('name email role profilePictureUrl createdAt emailVerified updatedAt')
      .sort({ createdAt: -1 });

    // 5. Role distribution
    const roleDistribution = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } },
    ]);

    const roleCounts = { admin: 0, teacher: 0, student: 0 };
    roleDistribution.forEach((group) => {
      if (group._id in roleCounts) {
        roleCounts[group._id as keyof typeof roleCounts] = group.count;
      }
    });

    // 6. Verification stats
    const totalUsers = await User.countDocuments();
    const verifiedCount = await User.countDocuments({ emailVerified: true });
    const pendingCount = totalUsers - verifiedCount;
    const verificationStats = {
      total: totalUsers,
      verified: verifiedCount,
      pending: pendingCount,
      verifiedPct: totalUsers > 0 ? Math.round((verifiedCount / totalUsers) * 100) : 0,
    };

    // 7. User growth timeline (last 6 months, grouped by month)
    const sixMonthsAgo = new Date(now);
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const growthTimeline = await User.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // 8. Recent active users (updated in the last 24 hours — rough proxy)
    const oneDayAgo = new Date(now);
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    const recentlyActive = await User.countDocuments({ updatedAt: { $gte: oneDayAgo } });

    // ─── PostHog Metrics (only when configured) ─────────────────────────────────

    if (!apiKey || !projectId) {
      return res.json({
        configured: false,
        message: 'Set POSTHOG_PERSONAL_API_KEY and POSTHOG_PROJECT_ID to enable analytics.',
        mock: {
          pageviews: 0,
          uniqueVisitors: 0,
          newSignups,
          topPages: [],
        },
        currentAccounts,
        roleCounts,
        verificationStats,
        signupSparkline,
        prevWeekSignups,
        growthTimeline,
        recentlyActive,
        learningAnalytics,
      });
    }

    const headers = {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    };

    // Run PostHog queries in parallel for speed
    const [insightRes, prevPeriodRes, topPagesRes] = await Promise.all([
      // Current 7-day trends
      fetch(`https://app.posthog.com/api/projects/${projectId}/query/`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          query: {
            kind: 'TrendsQuery',
            dateRange: { date_from: '-7d' },
            series: [
              { event: '$pageview', kind: 'EventsNode' },
              { event: '$pageview', kind: 'EventsNode', math: 'dau' },
              { event: '$pageview', kind: 'EventsNode', math: 'avg', math_property: '$session_duration' },
            ],
            interval: 'day',
          },
        }),
      }),

      // Previous 7-day trends (for % change comparison)
      fetch(`https://app.posthog.com/api/projects/${projectId}/query/`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          query: {
            kind: 'TrendsQuery',
            dateRange: { date_from: '-14d', date_to: '-7d' },
            series: [
              { event: '$pageview', kind: 'EventsNode' },
              { event: '$pageview', kind: 'EventsNode', math: 'dau' },
              { event: '$pageview', kind: 'EventsNode', math: 'avg', math_property: '$session_duration' },
            ],
            interval: 'day',
          },
        }),
      }),

      // Top pages breakdown
      fetch(`https://app.posthog.com/api/projects/${projectId}/query/`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          query: {
            kind: 'TrendsQuery',
            dateRange: { date_from: '-7d' },
            series: [
              { event: '$pageview', kind: 'EventsNode' },
            ],
            breakdownFilter: {
              breakdown: '$current_url',
              breakdown_type: 'event',
            },
            interval: 'day',
          },
        }),
      }),
    ]);

    if (!insightRes.ok) {
      console.error('PostHog API Error status:', insightRes.status, await insightRes.text().catch(() => ''));
      return next(new ApiError(502, 'Failed to fetch PostHog analytics'));
    }

    const insightData = await insightRes.json();

    // Parse previous-period data (non-blocking — fallback to empty on error)
    let prevPeriodData: any = { results: [] };
    try {
      if (prevPeriodRes.ok) {
        prevPeriodData = await prevPeriodRes.json();
      }
    } catch { /* ignore */ }

    // Parse top pages (non-blocking)
    let topPagesData: any[] = [];
    try {
      if (topPagesRes.ok) {
        const tpJson = await topPagesRes.json();
        const raw = tpJson.results || [];
        // Sort by total count descending, take top 10
        topPagesData = raw
          .map((r: any) => ({
            path: (r.breakdown_value || r.label || 'Unknown')
              .replace(/https?:\/\/[^/]+/, '') // strip domain
              .replace(/\?.*$/, ''),            // strip query params
            count: r.count ?? r.aggregated_value ?? 0,
          }))
          .sort((a: any, b: any) => b.count - a.count)
          .slice(0, 10);
      }
    } catch { /* ignore */ }

    // Build previous-period comparison counts
    const prevResults = prevPeriodData.results || [];
    const prevPageviews = prevResults[0]?.count ?? 0;
    const prevVisitors = prevResults[1]?.count ?? 0;
    const prevAvgSession = prevResults[2]?.count ?? 0;

    res.json({
      configured: true,
      data: {
        result: insightData.results || [],
        newSignups,
        currentAccounts,
        roleCounts,
        verificationStats,
        signupSparkline,
        prevWeekSignups,
        growthTimeline,
        recentlyActive,
        topPages: topPagesData,
        previousPeriod: {
          pageviews: prevPageviews,
          visitors: prevVisitors,
          avgSession: prevAvgSession,
        },
        learningAnalytics,
      },
    });
  } catch (error) {
    next(error);
  }
};
