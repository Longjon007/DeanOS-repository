import { assertEquals } from "https://deno.land/std@0.168.0/testing/asserts.ts";

Deno.test("Backend Example Test", () => {
  const x = 1 + 2;
  assertEquals(x, 3);
});
