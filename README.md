# Hyperion AI
Autonomous experimentally trained AI and part of the DeanOS ecosystem.

## Step-by-step to finish and publish Hyperion AI for public purchase
1. **Stabilize the product**
   - Freeze the feature set for both the Next.js web app (`web/`) and Expo mobile app (`app/`), then run:
     - `./health_check.sh`
     - In `web/`: `npm run lint && npm run build`
     - In `app/`: `expo run:android` or `expo run:ios`, then open the app to log in and issue a sample request
   - Verify data flows against Supabase, apply environment variables securely, and confirm login/onboarding paths work end-to-end.
2. **Harden security and compliance**
   - Enable Supabase RLS policies, rotate keys, add rate limiting, and ensure logging/monitoring is active.
   - Publish required legal pages (Terms of Service, Privacy).
   - Replace the current template in SECURITY.md with Hyperion-specific policies.
   - Align data handling and operational controls to match the published policies.
3. **Package and deploy**
   - Web: In `web/`: `npm install && npm run lint && npm run build`, then deploy the generated build to the chosen host with a branded domain and TLS.
   - Mobile:
     - Produce signed store builds through Expo (Android/iOS)
     - Supply icons/screenshots/descriptions
     - Validate deep links plus API calls to Supabase/AI endpoints
4. **Enable commerce**
   - Integrate a payment provider (e.g., Stripe):
     - Configure pricing plans, tax handling, and invoicing/receipts
     - Implement refunds and licensing/seat limits
     - Gate premium features behind successful purchase and store entitlements server-side
5. **Launch operations**
   - Prepare onboarding docs, FAQs, and support channels; set up status/uptime monitoring and incident playbooks.
   - Add analytics for activation/retention, plus alerting on errors, latency, and billing failures.
6. **Publish and monitor**
   - Release the web site, submit mobile binaries to app stores, and announce availability; double-check store metadata and age/content ratings.
   - Monitor early-user telemetry, resolve defects quickly, and iterate pricing or onboarding based on feedback.
