import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-11-17.clover',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

// Use Supabase service role for admin operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
)

export async function POST(request: Request) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        
        if (session.mode === 'subscription') {
          const mode = session.metadata?.mode
          
          // Handle new signup flow
          if (mode === 'signup') {
            const email = session.metadata?.signup_email || session.customer_email
            
            if (!email) {
              console.error('No email found in session')
              break
            }

            // Generate a random password for the user
            const randomPassword = Math.random().toString(36).slice(-12) + Math.random().toString(36).slice(-12)

            // Create Supabase user
            const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
              email,
              password: randomPassword,
              email_confirm: true, // Auto-confirm email
            })

            if (authError) {
              console.error('Error creating user:', authError)
              // Check if user already exists
              const { data: existingUser } = await supabaseAdmin.auth.admin.listUsers()
              const user = existingUser.users.find(u => u.email === email)
              
              if (user) {
                // User exists, just update their profile to premium
                await supabaseAdmin
                  .from('profiles')
                  .update({
                    is_premium: true,
                    subscription_status: 'active',
                    stripe_customer_id: session.customer as string,
                  })
                  .eq('id', user.id)
                
                console.log(`Existing user ${user.id} upgraded to premium`)
              }
              break
            }

            const user = authData.user

            // Profile should be auto-created by trigger, but update it to premium
            await supabaseAdmin
              .from('profiles')
              .update({
                is_premium: true,
                subscription_status: 'active',
                stripe_customer_id: session.customer as string,
              })
              .eq('id', user.id)

            console.log(`New premium user created: ${user.id}`)
            
            // Send password reset email so user can set their password
            await supabaseAdmin.auth.admin.generateLink({
              type: 'recovery',
              email,
            })
          } else {
            // Handle existing user upgrade
            const userId = session.metadata?.supabase_user_id
            
            if (!userId) {
              console.error('No user ID in session metadata')
              break
            }

            // Update user to premium
            await supabaseAdmin
              .from('profiles')
              .update({
                is_premium: true,
                subscription_status: 'active',
                stripe_customer_id: session.customer as string,
              })
              .eq('id', userId)

            console.log(`User ${userId} upgraded to premium`)
          }
        }
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        // Get user by customer ID
        const { data: profile } = await supabaseAdmin
          .from('profiles')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single()

        if (!profile) {
          console.error('No profile found for customer:', customerId)
          break
        }

        // Update subscription status
        const endDate = (subscription as any).current_period_end 
          ? new Date((subscription as any).current_period_end * 1000).toISOString()
          : null
          
        await supabaseAdmin
          .from('profiles')
          .update({
            subscription_status: subscription.status,
            subscription_end_date: endDate,
          })
          .eq('id', profile.id)

        console.log(`Subscription updated for user ${profile.id}:`, subscription.status)
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        // Get user by customer ID
        const { data: profile } = await supabaseAdmin
          .from('profiles')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single()

        if (!profile) {
          console.error('No profile found for customer:', customerId)
          break
        }

        // Revoke premium access
        await supabaseAdmin
          .from('profiles')
          .update({
            is_premium: false,
            subscription_status: 'canceled',
          })
          .eq('id', profile.id)

        console.log(`Premium access revoked for user ${profile.id}`)
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        const customerId = invoice.customer as string

        // Get user by customer ID
        const { data: profile } = await supabaseAdmin
          .from('profiles')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single()

        if (!profile) {
          console.error('No profile found for customer:', customerId)
          break
        }

        // Update subscription status
        await supabaseAdmin
          .from('profiles')
          .update({
            subscription_status: 'past_due',
          })
          .eq('id', profile.id)

        console.log(`Payment failed for user ${profile.id}`)
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('Error processing webhook:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}
