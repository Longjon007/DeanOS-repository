import Stripe from "npm:stripe@^14.0";
import { createClient, SupabaseClient } from 'npm:@supabase/supabase-js@^2.39.3';

export const processStripeEvent = async (
    event: Stripe.Event,
    supabaseAdmin: SupabaseClient
) => {
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
                return { success: true, userId };
            }
            break;
        }
        case 'customer.subscription.deleted':
            break;
        default:
            console.log(`Unhandled event type ${event.type}`);
    }
    return { success: true, received: true };
};
