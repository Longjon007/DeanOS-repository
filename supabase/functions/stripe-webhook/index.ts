// Filename: stripe-webhook-handler.ts
// Securely handles incoming Stripe events and updates the Supabase database.
// This function is critical for instantly activating services after payment processing.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "npm:stripe@^14.0";
import { createClient } from 'npm:@supabase/supabase-js@^2.39.3';

// =============================================================================
// ENVIRONMENT VALIDATION
// =============================================================================
// Validate all required environment variables on startup to fail fast
const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY');
const STRIPE_WEBHOOK_SECRET = Deno.env.get('STRIPE_WEBHOOK_SECRET');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

if (!STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY environment variable is required');
}
if (!STRIPE_WEBHOOK_SECRET) {
    throw new Error('STRIPE_WEBHOOK_SECRET environment variable is required');
}
if (!SUPABASE_URL) {
    throw new Error('SUPABASE_URL environment variable is required');
}
if (!SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY environment variable is required');
}

// =============================================================================
// INITIALIZE CLIENTS
// =============================================================================
const stripe = new Stripe(STRIPE_SECRET_KEY, {
    apiVersion: '2023-10-16',
});

const supabaseAdmin = createClient(
    SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY // Uses service role key for RLS bypass
);

// =============================================================================
// CORS CONFIGURATION
// =============================================================================
// NOTE: Webhooks are server-to-server and typically don't need CORS.
// If you need to call this from a browser (not recommended), restrict the origin.
const corsHeaders = {
    'Access-Control-Allow-Origin': '*', // Consider removing or restricting
    'Access-Control-Allow-Headers': 'content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

// =============================================================================
// CONSTANTS
// =============================================================================
const WEBHOOK_TIMEOUT_MS = 25000; // 25 seconds (Stripe expects response within 30s)
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Validates that a user ID is in valid UUID format
 */
function isValidUserId(userId: string | undefined): boolean {
    if (!userId) return false;
    return UUID_REGEX.test(userId);
}

/**
 * Updates a user's subscription status in the database
 */
async function updateSubscription(
    userId: string,
    customerId: string,
    status: 'active' | 'inactive'
): Promise<void> {
    const updateData: Record<string, unknown> = {
        user_id: userId,
        stripe_customer_id: customerId,
        status: status,
        updated_at: new Date().toISOString()
    };

    if (status === 'active') {
        updateData.last_billed_at = new Date().toISOString();
    } else if (status === 'inactive') {
        updateData.canceled_at = new Date().toISOString();
    }

    const { data, error } = await supabaseAdmin
        .from('subscriptions')
        .upsert(updateData, {
            onConflict: 'user_id',
            ignoreDuplicates: false
        })
        .select()
        .single();

    if (error) {
        throw new Error(`Database update failed: ${error.message}`);
    }

    if (!data) {
        throw new Error(`Failed to update subscription for user ${userId}`);
    }

    console.log(`Subscription updated for user ${userId}:`, JSON.stringify(data));
}

/**
 * Checks if a webhook event has already been processed (idempotency)
 */
async function isEventProcessed(eventId: string): Promise<boolean> {
    const { data, error } = await supabaseAdmin
        .from('webhook_events')
        .select('id')
        .eq('id', eventId)
        .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Error checking event idempotency:', error);
        // Don't fail the webhook - process it anyway to be safe
        return false;
    }

    return data !== null;
}

/**
 * Marks a webhook event as processed
 */
async function markEventProcessed(eventId: string, eventType: string): Promise<void> {
    const { error } = await supabaseAdmin
        .from('webhook_events')
        .insert({
            id: eventId,
            type: eventType,
            processed_at: new Date().toISOString()
        });

    if (error) {
        // Log but don't fail - the event was processed successfully
        console.error('Failed to mark event as processed:', error);
    }
}

/**
 * Logs detailed error information for debugging
 */
function logError(context: string, error: unknown, eventId?: string): void {
    const errorDetails = {
        context,
        event_id: eventId,
        error_message: error instanceof Error ? error.message : String(error),
        error_stack: error instanceof Error ? error.stack : undefined,
        timestamp: new Date().toISOString()
    };

    console.error('Webhook error:', JSON.stringify(errorDetails, null, 2));
}

// =============================================================================
// EVENT HANDLERS
// =============================================================================

/**
 * Handles checkout.session.completed events
 */
async function handleCheckoutCompleted(event: Stripe.Event): Promise<void> {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.user_id;

    // Validate user ID
    if (!userId) {
        console.warn(`Missing user_id in metadata for session ${session.id}`);
        return; // Not an error - just log and continue
    }

    if (!isValidUserId(userId)) {
        throw new Error(`Invalid user_id format in metadata: ${userId}`);
    }

    // Validate payment status
    if (session.payment_status !== 'paid') {
        console.log(`Session ${session.id} payment status is ${session.payment_status}, skipping`);
        return;
    }

    // Validate customer ID
    if (!session.customer || typeof session.customer !== 'string') {
        throw new Error(`Missing or invalid customer ID in session ${session.id}`);
    }

    // Update subscription
    await updateSubscription(userId, session.customer, 'active');
    console.log(`User ${userId} service activated via checkout completion`);
}

/**
 * Handles invoice.payment_succeeded events
 */
async function handleInvoicePaymentSucceeded(event: Stripe.Event): Promise<void> {
    const invoice = event.data.object as Stripe.Invoice;
    const customerId = invoice.customer as string;

    if (!customerId) {
        throw new Error(`Missing customer ID in invoice ${invoice.id}`);
    }

    // Look up user by customer ID
    const { data: subscription, error } = await supabaseAdmin
        .from('subscriptions')
        .select('user_id')
        .eq('stripe_customer_id', customerId)
        .single();

    if (error) {
        if (error.code === 'PGRST116') {
            console.warn(`No subscription found for customer ${customerId}`);
            return; // Not an error - customer might not be in system yet
        }
        throw error;
    }

    if (!subscription?.user_id) {
        console.warn(`No user_id found for customer ${customerId}`);
        return;
    }

    // Update subscription
    await updateSubscription(subscription.user_id, customerId, 'active');
    console.log(`User ${subscription.user_id} service renewed via invoice payment`);
}

/**
 * Handles customer.subscription.deleted events
 */
async function handleSubscriptionDeleted(event: Stripe.Event): Promise<void> {
    const subscription = event.data.object as Stripe.Subscription;
    const customerId = subscription.customer as string;

    if (!customerId) {
        throw new Error(`Missing customer ID in subscription ${subscription.id}`);
    }

    // Find user by customer ID
    const { data: userSubscription, error } = await supabaseAdmin
        .from('subscriptions')
        .select('user_id')
        .eq('stripe_customer_id', customerId)
        .single();

    if (error) {
        if (error.code === 'PGRST116') {
            console.warn(`No subscription found for customer ${customerId}`);
            return;
        }
        throw error;
    }

    if (!userSubscription?.user_id) {
        console.warn(`No user_id found for customer ${customerId}`);
        return;
    }

    // Deactivate subscription
    await updateSubscription(userSubscription.user_id, customerId, 'inactive');
    console.log(`User ${userSubscription.user_id} subscription canceled`);
}

// =============================================================================
// MAIN WEBHOOK HANDLER
// =============================================================================

serve(async (req: Request): Promise<Response> => {
    // Set up timeout protection
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), WEBHOOK_TIMEOUT_MS);

    try {
        // 1. Handle CORS Preflight
        if (req.method === 'OPTIONS') {
            clearTimeout(timeout);
            return new Response('ok', { headers: corsHeaders });
        }

        // 2. Only accept POST requests
        if (req.method !== 'POST') {
            clearTimeout(timeout);
            return new Response('Method not allowed', { status: 405 });
        }

        // 3. Validate Stripe Webhook Signature (CRITICAL SECURITY STEP)
        const signature = req.headers.get('Stripe-Signature');

        if (!signature) {
            console.error('Missing Stripe-Signature header');
            clearTimeout(timeout);
            return new Response('Unauthorized', { status: 401 });
        }

        let event: Stripe.Event;
        let reqBody: string;

        try {
            reqBody = await req.text();
            event = stripe.webhooks.constructEvent(
                reqBody,
                signature,
                STRIPE_WEBHOOK_SECRET
            );
        } catch (err) {
            logError('Signature verification failed', err);
            clearTimeout(timeout);
            return new Response('Invalid signature', { status: 401 });
        }

        console.log(`Received Stripe event: ${event.type} (${event.id})`);

        // 4. Check Idempotency - Have we already processed this event?
        const alreadyProcessed = await isEventProcessed(event.id);
        if (alreadyProcessed) {
            console.log(`Event ${event.id} already processed, skipping`);
            clearTimeout(timeout);
            return new Response(
                JSON.stringify({ received: true, duplicate: true }),
                {
                    status: 200,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                }
            );
        }

        // 5. Process the Event
        try {
            switch (event.type) {
                case 'checkout.session.completed':
                    await handleCheckoutCompleted(event);
                    break;

                case 'invoice.payment_succeeded':
                    await handleInvoicePaymentSucceeded(event);
                    break;

                case 'customer.subscription.deleted':
                    await handleSubscriptionDeleted(event);
                    break;

                case 'invoice.payment_failed':
                    // Log payment failures for monitoring
                    console.warn(`Payment failed for invoice: ${event.data.object.id}`);
                    break;

                default:
                    console.log(`Unhandled event type: ${event.type}`);
            }

            // 6. Mark event as processed (idempotency)
            await markEventProcessed(event.id, event.type);

        } catch (error) {
            logError('Event processing failed', error, event.id);
            clearTimeout(timeout);

            // Return 500 to trigger Stripe retry
            return new Response(
                JSON.stringify({
                    error: 'Failed to process event',
                    event_id: event.id
                }),
                {
                    status: 500,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                }
            );
        }

        // 7. Success Response
        clearTimeout(timeout);
        return new Response(
            JSON.stringify({ received: true, event_id: event.id }),
            {
                status: 200,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
        );

    } catch (error) {
        clearTimeout(timeout);

        if (error instanceof Error && error.name === 'AbortError') {
            console.error('Webhook processing timed out');
            return new Response('Request timeout', {
                status: 504,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

        logError('Unexpected webhook error', error);
        return new Response(
            JSON.stringify({ error: 'Internal server error' }),
            {
                status: 500,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
        );
    }
});
