// Filename: stripe-webhook-handler.ts
// Securely handles incoming Stripe events and updates the Supabase database.
// This function is critical for instantly activating services after an overage charge.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "npm:stripe@^14.0";
import { createClient } from 'npm:@supabase/supabase-js@^2.39.3';
import { createHandler } from './handler.ts';

// **NOTE:** Replace these environment variables with your actual keys
const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
    apiVersion: '2023-10-16',
});
const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL')!,
    // Use the Service Role Key for secure, Row-Level-Security (RLS) bypass access
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');

serve(createHandler(stripe, supabaseAdmin, webhookSecret));
