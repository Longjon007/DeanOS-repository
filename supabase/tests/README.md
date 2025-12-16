# Supabase Tests

This directory contains the testing infrastructure for the Supabase backend.

## Structure

- `database/`: Contains pgTAP tests for database functions, triggers, and RLS policies.

## Running Tests

To run the tests, use the Supabase CLI:

```bash
supabase test db
```

Ensure you have the Supabase CLI installed and your local instance is running.

## Example Test

`database/01_example.sql` contains a basic sanity check test.
