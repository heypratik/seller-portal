import { buffer } from 'micro'
import {stripe} from 'lib/stripe'

export const config = {
    api: {
      // Turn off the body parser so we can access raw body for verification.
      bodyParser: false,
    },
  }

export default async (req, res) => {

  if (req.method === 'POST') {
    const buf = await buffer(req)
    const sig = req.headers['stripe-signature']

    let event

    try {
      event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET)
    } catch (err) {
      console.log(`Webhook error: ${err.message}`)
      return res.status(400).send(`Webhook Error: ${err.message}`)
    }

    switch (event.type) {
        case 'customer.subscription.created':
            const responseNewSub = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/webhooks/newsubscription`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(event)
              })
          // Handle new subscription
        break
        case 'customer.subscription.deleted':
          const responseSubDelete = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/webhooks/subscriptiondeleted`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(event)
              })
          // Handle subscription cancellation
        break
        case 'customer.subscription.updated':
          const responseUpdate = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/webhooks/subscriptionupdated`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(event)
              })
          // Handle subscription update
        break
        default:
          console.log(`Unhandled event type: ${event.type}`)
      }

    res.status(200).json({ received: true })
  } else {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method Not Allowed')
  }
}