// Filename: stripe-webhook-handler.ts
// Securely handles incoming Stripe events and updates the Supabase database.
// This function is critical for instantly activating services after an overage charge.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// Import Stripe library for security verification
import Stripe from "npm:stripe@^14.0";
import { createClient } from 'npm:@supabase/supabase-js@^2.39.3';

// CORS headers for preflight checks
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

// **NOTE:** Replace these environment variables with your actual keys
const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
    apiVersion: '2023-10-16',
});
const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL')!,
    // Use the Service Role Key for secure, Row-Level-Security (RLS) bypass access
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

serve(async (req) => {
    // 1. Handle CORS Preflight
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    // 2. Validate Stripe Webhook Signature (CRITICAL SECURITY STEP)
    // Prevents malicious actors from sending fake payment updates
    const signature = req.headers.get('Stripe-Signature');
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
    let event: Stripe.Event;

    try {
        const reqBody = await req.text();
        event = stripe.webhooks.constructEvent(reqBody, signature!, webhookSecret!);
    } catch (err) {
        // If signature verification fails, reject the request immediately [29]
        console.error(`Webhook signature verification failed: ${err.message}`);
        return new Response(`Webhook Error: ${err.message}`, { status: 400 });
    }

    // 3. Process the Event
    try {
        switch (event.type) {
            // CRITICAL EVENT: Fired after a successful charge, including usage overage
            case 'checkout.session.completed':
            case 'invoice.payment_succeeded': {
                const session = event.data.object as Stripe.Checkout.Session;
                // 'user_id' must be passed from the front-end into the Stripe Checkout session's metadata
                const userId = session.metadata?.user_id;

                if (session.payment_status === 'paid' && userId) {
                    // Update user's subscription record in the Supabase database [32]
                    const { error } = await supabaseAdmin
                       .from('subscriptions')
                       .update({
                            stripe_customer_id: session.customer as string,
                            status: 'active', // Unlock full service access
                            last_billed_at: new Date().toISOString()
                        })
                       .eq('user_id', userId);

                    if (error) throw error;
                    console.log(`User ${userId} service unlocked successfully.`);
                }
                break;
            }

            // Optional: Handle cancellations or failures
            case 'customer.subscription.deleted':
                {
                    const subscription = event.data.object as Stripe.Subscription;
                    const { error: deleteError } = await supabaseAdmin
                        .from('subscriptions')
                        .update({ status: 'inactive' })
                        .eq('stripe_customer_id', subscription.customer as string);

                    if (deleteError) {
                         console.error('Error updating subscription status:', deleteError);
                    } else {
                         console.log(`Subscription for customer ${subscription.customer} deactivated.`);
                    }
                }
                break;
            default:
                console.log(`Unhandled event type ${event.type}`);
        }
    } catch (error) {
        console.error(`Error processing Stripe event: ${error.message}`);
        return new Response(JSON.stringify({ error: 'Failed to process event' }), { status: 500 });
    }

    // 4. Success Response
    return new Response(JSON.stringify({ received: true }), {
        status: 200,
        headers: {...corsHeaders, 'Content-Type': 'application/json' }
    });
});
