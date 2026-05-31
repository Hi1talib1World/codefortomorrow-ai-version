import { PubSub } from '@google-cloud/pubsub';
import { AIEngine } from './aiEngine.js';

const projectId = process.env.GCP_PROJECT_ID;
const pubsub = new PubSub({ projectId });
const analyticsResults = new Map();

export async function publishAnalyticsEvent(topicName, payload) {
  const topic = pubsub.topic(topicName);
  const dataBuffer = Buffer.from(JSON.stringify(payload));
  await topic.publishMessage({ data: dataBuffer });
  console.log(`Published analytics event ${payload.requestId} to ${topicName}`);
}

export async function publishTokenUsageEvent(topicName, payload) {
  const topic = pubsub.topic(topicName);
  const dataBuffer = Buffer.from(JSON.stringify(payload));
  await topic.publishMessage({ data: dataBuffer });
  console.log(`Published token usage event for user ${payload.userId}`);
}

export async function startAnalyticsSubscriber() {
  const subscriptionName = process.env.PUBSUB_ANALYTICS_SUBSCRIPTION;
  if (!subscriptionName) {
    console.warn('PUBSUB_ANALYTICS_SUBSCRIPTION is not configured. Analytics subscriber is disabled.');
    return;
  }

  const subscription = pubsub.subscription(subscriptionName);

  subscription.on('message', async (message) => {
    try {
      const payload = JSON.parse(message.data.toString('utf8'));
      console.log(`Received analytics event ${payload.requestId}`);
      const summary = await AIEngine.generateTeacherSummary(payload.classData);
      analyticsResults.set(payload.requestId, { summary, processedAt: new Date().toISOString() });
      message.ack();
    } catch (error) {
      console.error('Analytics subscriber error:', error);
      message.nack();
    }
  });

  subscription.on('error', (error) => {
    console.error('Pub/Sub subscription error:', error);
  });
}

export function getAnalyticsResult(requestId) {
  return analyticsResults.get(requestId);
}
