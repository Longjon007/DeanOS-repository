import Stripe from "npm:stripe@^14.0";
import { SupabaseClient } from 'npm:@supabase/supabase-js@^2.39.3';

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

export const createHandler = (stripe: Stripe, supabaseAdmin: SupabaseClient) => {
    return async (req: Request) => {
        // 1. Handle CORS Preflight
        if (req.method === 'OPTIONS') {
            return new Response('ok', { headers: corsHeaders });
        }

        // 2. Validate Stripe Webhook Signature (CRITICAL SECURITY STEP)
        const signature = req.headers.get('Stripe-Signature');
        const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
        let event: Stripe.Event;

        try {
            const reqBody = await req.text();
            // stripe.webhooks.constructEvent expects (payload, header, secret)
            event = stripe.webhooks.constructEvent(reqBody, signature!, webhookSecret!);
        } catch (err: any) {
            console.error(`Webhook signature verification failed: ${err.message}`);
            return new Response(`Webhook Error: ${err.message}`, { status: 400 });
        }

        // 3. Process the Event
        try {
            switch (event.type) {
                case 'checkout.session.completed':
                case 'invoice.payment_succeeded': {
                    const session = event.data.object as Stripe.Checkout.Session;
                    const userId = session.metadata?.user_id;

                    if (session.payment_status === 'paid' && userId) {
                        const { error } = await supabaseAdmin
                           .from('subscriptions')
                           .update({
                                stripe_customer_id: session.customer as string,
                                status: 'active',
                                last_billed_at: new Date().toISOString()
                            })
                           .eq('user_id', userId);

                        if (error) throw error;
                        console.log(`User ${userId} service unlocked successfully.`);
                    }
                    break;
                }
                case 'customer.subscription.deleted':
                    break;
                default:
                    console.log(`Unhandled event type ${event.type}`);
            }
        } catch (error: any) {
            console.error(`Error processing Stripe event: ${error.message}`);
            return new Response(JSON.stringify({ error: 'Failed to process event' }), { status: 500 });
        }

        // 4. Success Response
        return new Response(JSON.stringify({ received: true }), {
            status: 200,
            headers: {...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
}
