import { assertEquals } from "https://deno.land/std@0.168.0/testing/asserts.ts";
import { createHandler } from "../stripe-webhook/handler.ts";

Deno.test("handler returns 400 on signature verification failure", async () => {
    const mockStripe = {
        webhooks: {
            constructEvent: () => { throw new Error("Signature verification failed"); }
        }
    } as any;
    const mockSupabase = {} as any;
    const handler = createHandler(mockStripe, mockSupabase, "secret");

    const req = new Request("http://localhost", { method: "POST", body: "payload" });
    const res = await handler(req);
    assertEquals(res.status, 400);
});

Deno.test("handler processes valid checkout session", async () => {
    const mockStripe = {
        webhooks: {
            constructEvent: () => ({
                type: 'checkout.session.completed',
                data: {
                    object: {
                        payment_status: 'paid',
                        customer: 'cus_123',
                        metadata: { user_id: 'user_123' }
                    }
                }
            })
        }
    } as any;

    let updateCalled = false;
    const mockSupabase = {
        from: (table: string) => {
            assertEquals(table, 'subscriptions');
            return {
                update: (data: any) => {
                    assertEquals(data.stripe_customer_id, 'cus_123');
                    assertEquals(data.status, 'active');
                    updateCalled = true;
                    return {
                        eq: (col: string, val: string) => {
                            assertEquals(col, 'user_id');
                            assertEquals(val, 'user_123');
                            return Promise.resolve({ error: null });
                        }
                    };
                }
            };
        }
    } as any;

    const handler = createHandler(mockStripe, mockSupabase, "secret");
    const req = new Request("http://localhost", {
        method: "POST",
        body: "payload",
        headers: { "Stripe-Signature": "sig" }
    });

    const res = await handler(req);
    assertEquals(res.status, 200);
    const body = await res.json();
    assertEquals(body.received, true);
    assertEquals(updateCalled, true);
});
