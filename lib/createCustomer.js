import stripe from 'stripe'

const stripeInstance = new stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY)

export async function createCustomer(name, email) {
  const customer = await stripeInstance.customers.create({
    name, email
  })

  return customer.id
}