# Supabase Tests

This directory contains tests for the Supabase database and Edge Functions.

## Database Tests

We use [pgTAP](https://pgtap.org/) for database testing. To run the tests, you need the Supabase CLI installed.

```bash
supabase test db
```

The tests are located in `.sql` files within this directory.

## Edge Function Tests

Edge function tests are located within the `supabase/functions/<function_name>` directories. They use Deno's built-in test runner.

```bash
supabase functions test
```
