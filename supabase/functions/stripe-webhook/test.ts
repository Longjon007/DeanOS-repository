import { assert, assertEquals } from "https://deno.land/std@0.192.0/testing/asserts.ts";
import { createClient } from 'npm:@supabase/supabase-js@^2.39.3';
import { processStripeEvent } from "./handler.ts";

// Mock Supabase Client
const mockSupabase = {
    from: (_table: string) => ({
        update: (_data: any) => ({
            eq: (_col: string, _val: string) => Promise.resolve({ error: null })
        })
    })
};

Deno.test("processStripeEvent handles checkout.session.completed", async () => {
    const event: any = {
        type: 'checkout.session.completed',
        data: {
            object: {
                payment_status: 'paid',
                metadata: { user_id: 'user_123' },
                customer: 'cus_123'
            }
        }
    };

    const result = await processStripeEvent(event, mockSupabase as any);
    assertEquals(result.success, true);
    assertEquals(result.userId, 'user_123');
});
