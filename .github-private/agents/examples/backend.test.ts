// Example Deno test for Supabase Edge Functions
import { assertEquals } from "https://deno.land/std@0.168.0/testing/asserts.ts";

// Mocking global fetch if necessary
globalThis.fetch = async (url: string | Request | URL, init?: RequestInit) => {
  return new Response(JSON.stringify({ success: true }), { status: 200 });
};

Deno.test("Edge Function - Basic Handler Test", async () => {
  // Simulate a request
  const req = new Request("http://localhost:54321/functions/v1/my-function", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "Test" }),
  });

  // Call your function handler here (import it first)
  // For this example, we simulate the logic:
  const handler = async (req: Request) => {
    const data = await req.json();
    return new Response(JSON.stringify({ message: `Hello ${data.name}` }), {
      headers: { "Content-Type": "application/json" },
    });
  };

  const response = await handler(req);
  const data = await response.json();

  assertEquals(response.status, 200);
  assertEquals(data.message, "Hello Test");
});
