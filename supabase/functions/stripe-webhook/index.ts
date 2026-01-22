import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "npm:stripe@^14.0";
import { createClient } from 'npm:@supabase/supabase-js@^2.39.3';
import { processStripeEvent } from "./handler.ts";

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
    apiVersion: '2023-10-16',
});
const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    const signature = req.headers.get('Stripe-Signature');
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
    let event: Stripe.Event;

    try {
        const reqBody = await req.text();
        event = stripe.webhooks.constructEvent(reqBody, signature!, webhookSecret!);
    } catch (err: any) {
        console.error(`Webhook signature verification failed: ${err.message}`);
        return new Response(`Webhook Error: ${err.message}`, { status: 400 });
    }

    try {
        await processStripeEvent(event, supabaseAdmin);
    } catch (error: any) {
        console.error(`Error processing Stripe event: ${error.message}`);
        return new Response(JSON.stringify({ error: 'Failed to process event' }), { status: 500 });
    }

    return new Response(JSON.stringify({ received: true }), {
        status: 200,
        headers: {...corsHeaders, 'Content-Type': 'application/json' }
    });
});
