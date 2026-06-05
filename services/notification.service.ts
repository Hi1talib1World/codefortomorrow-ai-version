import { Response } from 'express';
import Notification from '../models/notification.model';

// Map of active Server-Sent Events (SSE) connections indexed by User ID
const sseClients = new Map<string, Response[]>();

/**
 * Creates a notification in the database and streams it to active SSE clients in real-time
 */
export const createNotification = async (
  userId: string,
  title: string,
  message: string,
  type: 'lesson_completed' | 'streak_at_risk' | 'leaderboard_rank_change' | 'course_unlocked' | 'general'
) => {
  try {
    const notification = await Notification.create({
      userId,
      title,
      message,
      type,
    });

    // Stream the new notification to active client sessions in real-time
    sendLiveNotification(userId, notification);
    return notification;
  } catch (error) {
    console.error('Failed to create notification inside notification.service:', error);
    throw error;
  }
};

/**
 * Registers an SSE client connection for a specific logged-in user
 */
export const registerSseClient = (userId: string, res: Response) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'X-Accel-Buffering': 'no', // Disable buffering for Nginx
  });

  res.write('retry: 5000\n\n');

  const clients = sseClients.get(userId.toString()) || [];
  clients.push(res);
  sseClients.set(userId.toString(), clients);

  res.on('close', () => {
    const active = sseClients.get(userId.toString()) || [];
    const filtered = active.filter(client => client !== res);
    if (filtered.length > 0) {
      sseClients.set(userId.toString(), filtered);
    } else {
      sseClients.delete(userId.toString());
    }
  });
};

/**
 * Broadcasts a notification to a specific user's active SSE connections
 */
const sendLiveNotification = (userId: string, notification: any) => {
  const clients = sseClients.get(userId.toString());
  if (clients && clients.length > 0) {
    const data = JSON.stringify(notification);
    for (const client of clients) {
      try {
        client.write(`data: ${data}\n\n`);
      } catch (err) {
        console.error(`Error streaming notification to user ${userId}:`, err);
      }
    }
  }
};
