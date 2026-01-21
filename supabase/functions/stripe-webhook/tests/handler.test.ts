import { assertEquals } from "https://deno.land/std@0.168.0/testing/asserts.ts";
import { createHandler } from "../webhook_handler.ts";

// Mock Deno.env
Deno.env.set('STRIPE_WEBHOOK_SECRET', 'whsec_test');

Deno.test("Stripe Webhook Handler", async (t) => {
    // Mock Stripe
    const mockStripe = {
        webhooks: {
            constructEvent: (body: string, sig: string, secret: string) => {
                if (sig === 'valid_signature' && secret === 'whsec_test') {
                    return JSON.parse(body);
                }
                throw new Error('Invalid signature');
            }
        }
    } as any;

    // Mock Supabase
    const mockSupabase = {
        from: (table: string) => ({
            update: (data: any) => ({
                eq: (col: string, val: any) => Promise.resolve({ error: null })
            })
        })
    } as any;

    const handler = createHandler(mockStripe, mockSupabase);

    await t.step("should handle OPTIONS request", async () => {
        const req = new Request("http://localhost", { method: "OPTIONS" });
        const res = await handler(req);
        assertEquals(res.status, 200);
        assertEquals(await res.text(), "ok");
    });

    await t.step("should reject invalid signature", async () => {
        const req = new Request("http://localhost", {
            method: "POST",
            headers: { "Stripe-Signature": "invalid" },
            body: JSON.stringify({ type: "test" })
        });
        const res = await handler(req);
        assertEquals(res.status, 400);
    });

    await t.step("should process checkout.session.completed", async () => {
        const event = {
            type: 'checkout.session.completed',
            data: {
                object: {
                    metadata: { user_id: 'user_123' },
                    payment_status: 'paid',
                    customer: 'cus_123'
                }
            }
        };
        const req = new Request("http://localhost", {
            method: "POST",
            headers: { "Stripe-Signature": "valid_signature" },
            body: JSON.stringify(event)
        });
        const res = await handler(req);
        assertEquals(res.status, 200);
        const json = await res.json();
        assertEquals(json.received, true);
    });
});
