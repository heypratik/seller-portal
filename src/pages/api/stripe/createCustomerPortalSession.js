import stripe from 'stripe';
import { getSession } from 'next-auth/react'

const stripeInstance = new stripe(process.env.NEXT_STRIPE_SECRET_KEY);

export default async function handler(req, res) {

  const { customerId } = req.body;

  try {
    const session = await stripeInstance.billingPortal.sessions.create({
        customer: customerId,
        return_url: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/account`,
      });

    res.status(200).json({ url: session.url });
  } catch (error) {
    res.status(500).json({ error: { message: error.message } });
  }
}
