import { assertEquals } from "https://deno.land/std@0.192.0/testing/asserts.ts";

Deno.test("example test", () => {
  const x = 1 + 2;
  assertEquals(x, 3);
});
