import stripe from 'stripe';
import { getSession } from 'next-auth/react'

const stripeInstance = new stripe(process.env.NEXT_STRIPE_SECRET_KEY);

export default async function handler(req, res) {

    // const session = await getSession({ req })

    // if (!session) return res.status(401).send('Unauthorized');

    const { planId, customerEmail, stripeCustomerId } = req.body;

    const email = customerEmail

    const stripeCustId = stripeCustomerId

    try {
        const session = await stripeInstance.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price: planId,
                quantity: 1,
            }],
            mode: 'subscription',
            subscription_data: { metadata: { 'platform': 'mybranz' } },
            success_url: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/account`,
            cancel_url: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/account`,
            customer: stripeCustId
        });
        res.status(200).json({ sessionId: session.id });

    } catch (error) {
        console.log('error')
        res.status(500).json({ error: { message: error.message } });
    }
}