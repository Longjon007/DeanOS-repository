# Stripe Webhook Handler

Secure webhook handler for processing Stripe payment events and updating subscription status in Supabase.

## Overview

This Deno Edge Function handles incoming Stripe webhook events and automatically updates user subscription records in the database. It's critical for activating services after payment completion.

## Security Features

### ✅ Signature Verification
- **Validates every request** using Stripe webhook signatures
- Rejects requests without valid `Stripe-Signature` header
- Prevents malicious actors from sending fake payment events
- Returns `401 Unauthorized` for invalid signatures

### ✅ Environment Variable Validation
- **Fails fast on startup** if required env vars are missing
- Validates all credentials before processing any requests
- Clear error messages for misconfiguration

### ✅ Idempotency Protection
- **Prevents duplicate processing** using `webhook_events` table
- Tracks processed event IDs
- Safe to retry without side effects
- Handles Stripe's automatic retry mechanism

### ✅ Request Timeout Protection
- **25-second timeout** (Stripe expects response within 30s)
- Prevents slow database queries from causing issues
- Returns `504 Gateway Timeout` if processing takes too long

## Supported Events

| Event Type | Description | Action |
|------------|-------------|--------|
| `checkout.session.completed` | Customer completed checkout | Activate subscription |
| `invoice.payment_succeeded` | Recurring payment succeeded | Renew subscription |
| `customer.subscription.deleted` | Customer canceled subscription | Deactivate subscription |
| `invoice.payment_failed` | Payment failed | Log for monitoring |

## Database Schema

### `subscriptions` Table
```sql
- id: uuid (primary key)
- user_id: uuid (unique, references auth.users)
- stripe_customer_id: text
- status: text ('active', 'inactive', 'pending', 'past_due', 'canceled')
- last_billed_at: timestamptz
- canceled_at: timestamptz
- created_at: timestamptz
- updated_at: timestamptz
```

### `webhook_events` Table
```sql
- id: text (primary key, Stripe event ID)
- type: text (event type)
- processed_at: timestamptz
- created_at: timestamptz
```

## Setup Instructions

### 1. Environment Variables

Set these in your Supabase Edge Functions settings:

```bash
STRIPE_SECRET_KEY=sk_live_...           # Your Stripe secret key
STRIPE_WEBHOOK_SECRET=whsec_...         # Webhook signing secret
SUPABASE_URL=https://xxx.supabase.co    # Your Supabase project URL
SUPABASE_SERVICE_ROLE_KEY=eyJ...        # Service role key (RLS bypass)
```

### 2. Database Migration

Run the migration to create required tables:

```bash
supabase db push
```

This creates:
- `webhook_events` table for idempotency
- Indexes for performance
- Constraints for data validation
- Cleanup function for old events

### 3. Stripe Webhook Configuration

1. Go to [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/webhooks)
2. Click "Add endpoint"
3. Enter your webhook URL: `https://xxx.supabase.co/functions/v1/stripe-webhook`
4. Select events to send:
   - `checkout.session.completed`
   - `invoice.payment_succeeded`
   - `customer.subscription.deleted`
   - `invoice.payment_failed` (optional, for monitoring)
5. Copy the **Signing secret** and set it as `STRIPE_WEBHOOK_SECRET`

### 4. Stripe Checkout Session Metadata

**IMPORTANT:** When creating Stripe Checkout sessions, you MUST include `user_id` in metadata:

```javascript
const session = await stripe.checkout.sessions.create({
  // ... other parameters
  metadata: {
    user_id: user.id  // UUID from auth.users table
  }
});
```

Without this metadata, the webhook cannot link payments to users.

## Data Flow

### Checkout Flow
```
User → Stripe Checkout → Payment → Stripe Webhook → This Function → Supabase
                                         ↓
                             1. Verify signature
                             2. Check idempotency
                             3. Validate user_id
                             4. Update subscription
                             5. Mark as processed
```

### Invoice Flow
```
Stripe → Recurring Payment → Invoice Paid → Webhook → This Function
                                                ↓
                                    1. Get customer_id
                                    2. Lookup user_id
                                    3. Renew subscription
```

## Error Handling

### Client Errors (4xx)
- **401 Unauthorized**: Missing or invalid signature
- **405 Method Not Allowed**: Non-POST request

### Server Errors (5xx)
- **500 Internal Server Error**: Database failure, triggers Stripe retry
- **504 Gateway Timeout**: Processing took too long

### Logging
All errors are logged with:
- Context (where error occurred)
- Event ID (for debugging)
- Error message and stack trace
- Timestamp

## Testing

### Run Unit Tests
```bash
cd supabase/functions/stripe-webhook
deno test --allow-net --allow-env index_test.ts
```

### Test with Stripe CLI
```bash
# Install Stripe CLI: https://stripe.com/docs/stripe-cli
stripe login

# Forward webhooks to local function
stripe listen --forward-to http://localhost:54321/functions/v1/stripe-webhook

# Trigger test events
stripe trigger checkout.session.completed
stripe trigger invoice.payment_succeeded
stripe trigger customer.subscription.deleted
```

### Manual Testing with curl
```bash
# This will fail with 401 (signature invalid) - expected behavior
curl -X POST https://xxx.supabase.co/functions/v1/stripe-webhook \
  -H "Content-Type: application/json" \
  -H "Stripe-Signature: test" \
  -d '{"type":"checkout.session.completed"}'
```

## Monitoring

### Key Metrics to Track
1. **Webhook Success Rate**: Should be > 99%
2. **Processing Time**: Should be < 5 seconds
3. **Duplicate Events**: Should match Stripe's retry count
4. **Failed Events**: Investigate any 500 errors

### Database Queries
```sql
-- Recent webhook events
SELECT * FROM webhook_events
ORDER BY processed_at DESC
LIMIT 100;

-- Event processing by type
SELECT type, COUNT(*)
FROM webhook_events
GROUP BY type;

-- Failed subscription updates (check logs)
SELECT * FROM subscriptions
WHERE updated_at < created_at + interval '5 minutes'
AND status != 'active';
```

## Maintenance

### Cleanup Old Events
```sql
-- Run monthly to prevent table bloat
SELECT cleanup_old_webhook_events();
```

This deletes events older than 90 days. You can also set up a cron job:

```sql
-- Schedule automatic cleanup (requires pg_cron extension)
SELECT cron.schedule(
  'cleanup-webhooks',
  '0 2 1 * *',  -- 2 AM on 1st of every month
  'SELECT cleanup_old_webhook_events()'
);
```

## Troubleshooting

### Issue: "Missing user_id in metadata"
**Cause:** Stripe Checkout session created without metadata
**Solution:** Add `metadata: { user_id: user.id }` to checkout session

### Issue: "Invalid user_id format"
**Cause:** user_id is not a valid UUID
**Solution:** Ensure you're passing the correct UUID from `auth.users.id`

### Issue: "No subscription found for customer"
**Cause:** Customer exists in Stripe but not in your database
**Solution:** Create subscription record before creating Stripe customer

### Issue: Webhook signature verification fails
**Cause:** Wrong webhook secret or request body tampered
**Solution:** Verify `STRIPE_WEBHOOK_SECRET` matches Stripe Dashboard

### Issue: Duplicate events being processed
**Cause:** `webhook_events` table not created or accessible
**Solution:** Run the migration to create the table

## Code Quality Improvements (2025-12-16)

This version includes the following security and reliability improvements:

### Fixed Issues
1. ✅ **Signature verification** - Explicit null checks, no non-null assertions
2. ✅ **Type casting bugs** - Separate handlers for each event type
3. ✅ **Database race conditions** - Upsert instead of update
4. ✅ **Idempotency** - Full duplicate detection and tracking
5. ✅ **Error logging** - Comprehensive context and stack traces
6. ✅ **Metadata validation** - UUID format validation
7. ✅ **Subscription cancellation** - Fully implemented
8. ✅ **Timeout protection** - 25-second timeout with cleanup
9. ✅ **Environment validation** - Fail fast on startup
10. ✅ **CORS documentation** - Clear notes about server-to-server communication

### Testing Coverage
- Unit tests for validation functions
- Integration tests for event processing
- Security tests for signature verification
- Idempotency tests for duplicate handling
- Error handling tests for edge cases

## Additional Resources

- [Stripe Webhooks Documentation](https://stripe.com/docs/webhooks)
- [Stripe Event Types](https://stripe.com/docs/api/events/types)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [Deno Testing](https://deno.land/manual/testing)

## Support

For issues or questions:
1. Check Supabase Edge Function logs
2. Check Stripe webhook logs in Dashboard
3. Review database tables for data consistency
4. Enable debug logging if needed

---

**Last Updated:** 2025-12-16
**Version:** 2.0.0 (Security & Reliability Enhanced)
