import { Request, Response, NextFunction } from 'express';
import { v2 as cloudinary } from 'cloudinary';
import { z } from 'zod';
import Content from '../models/Content';
import ApiError from '../utils/ApiError';

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
 * Proxy PostHog metrics
 */
export const getAnalytics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const apiKey = process.env.POSTHOG_PERSONAL_API_KEY;
    const projectId = process.env.POSTHOG_PROJECT_ID;

    if (!apiKey || !projectId) {
      // Return mock data if not configured
      return res.json({
        configured: false,
        message: 'Set POSTHOG_PERSONAL_API_KEY and POSTHOG_PROJECT_ID to enable analytics.',
        mock: {
          pageviews: 0,
          uniqueVisitors: 0,
          newSignups: 0,
          topPages: [],
        },
      });
    }

    const headers = {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    };

    // Fetch last 7 days of pageview insights
    const insightRes = await fetch(
      `https://app.posthog.com/api/projects/${projectId}/insights/trend/?events=[{"id":"$pageview"}]&date_from=-7d`,
      { headers }
    );

    if (!insightRes.ok) {
      return next(new ApiError(502, 'Failed to fetch PostHog analytics'));
    }

    const insightData = await insightRes.json();
    res.json({ configured: true, data: insightData });
  } catch (error) {
    next(error);
  }
};
