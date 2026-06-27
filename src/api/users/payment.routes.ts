import express from 'express';
import Stripe from 'stripe';
import User from '../../../src/models/user.model';
import { protect } from '../../../src/core/permissions/auth.middleware';

const router = express.Router();

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || '';
const stripe = stripeSecretKey && stripeSecretKey !== 'your-stripe-secret-key-here' && !stripeSecretKey.startsWith('your-')
  ? new Stripe(stripeSecretKey)
  : null;

// GET /api/payments/config
// Returns the configuration status of the payment system
router.get('/config', protect, (req: any, res: any) => {
  res.json({
    stripeActive: !!stripe,
    mode: stripe ? 'production' : 'mock'
  });
});

// POST /api/payments/checkout
// Creates a checkout session or toggles premium in mock mode
router.post('/checkout', protect, async (req: any, res: any, next: any) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!stripe) {
      // Mock Mode: Immediately toggle premium subscription
      user.isPremium = !user.isPremium; // Toggle premium status for easy local testing
      await user.save();
      return res.json({
        mock: true,
        success: true,
        isPremium: user.isPremium,
        message: user.isPremium ? 'Mock Premium Activated!' : 'Mock Premium Deactivated.'
      });
    }

    // Stripe Mode: Create a checkout session
    const clientUrl = process.env.CLIENT_URL || `${req.protocol}://${req.get('host')}`;
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Code for Tomorrow Premium Plan',
              description: 'Access to Premium AI Coach, Unlimited coding hints, and localized setup guides.',
            },
            unit_amount: 500, // $5.00
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${clientUrl}/cftos?premium_status=success`,
      cancel_url: `${clientUrl}/cftos?premium_status=cancel`,
      customer_email: user.email,
      metadata: {
        userId: user._id.toString()
      }
    });

    res.json({
      mock: false,
      url: session.url
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/payments/cancel
// Cancels subscription (Stripe subscription if exists, or toggles off mock premium)
router.post('/cancel', protect, async (req: any, res: any, next: any) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (stripe && user.stripeSubscriptionId) {
      try {
        await stripe.subscriptions.cancel(user.stripeSubscriptionId);
      } catch (stripeErr) {
        console.warn('Stripe subscription cancel call failed:', stripeErr);
      }
    }

    user.isPremium = false;
    user.stripeSubscriptionId = null;
    await user.save();

    res.json({
      success: true,
      isPremium: user.isPremium,
      message: 'Subscription cancelled successfully.'
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/payments/webhook
// Webhook handler for Stripe callback notifications
router.post('/webhook', async (req: any, res: any) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

  if (!stripe || !sig || !endpointSecret) {
    return res.status(400).send('Webhook configuration missing');
  }

  let event;

  try {
    // rawBody is attached in server.ts express.json middleware verify callback
    const rawBody = req.rawBody || req.body;
    event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session: any = event.data.object;
      const userId = session.metadata?.userId;
      const subscriptionId = session.subscription;
      const customerId = session.customer;

      if (userId) {
        await User.findByIdAndUpdate(userId, {
          isPremium: true,
          stripeCustomerId: customerId,
          stripeSubscriptionId: subscriptionId
        });
        console.log(`[Stripe Webhook] Premium enabled for user ${userId}`);
      }
    } else if (event.type === 'customer.subscription.deleted') {
      const subscription: any = event.data.object;
      await User.findOneAndUpdate(
        { stripeSubscriptionId: subscription.id },
        { isPremium: false, stripeSubscriptionId: null }
      );
      console.log(`[Stripe Webhook] Subscription deleted. Downgraded user.`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook database update failed:', error);
    res.status(500).send('Webhook handling error');
  }
});

export default router;
