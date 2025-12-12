# Hyperion AI
Autonomous experimentally trained AI and part of the DeanOS ecosystem.

## Step-by-step to finish and publish Hyperion AI for public purchase
1. **Stabilize the product**
   - Freeze the feature set for both the Next.js web app (`web/`) and Expo mobile app (`app/`), then run `./health_check.sh` plus existing lint/build commands to ensure they pass.
   - Verify data flows against Supabase, apply environment variables securely, and confirm login/onboarding paths work end-to-end.
2. **Harden security and compliance**
   - Enable Supabase RLS policies, rotate keys, add rate limiting, and ensure logging/monitoring is active.
   - Publish required legal pages (Terms of Service, Privacy) and update SECURITY.md with project-specific policies before aligning data handling accordingly.
3. **Package and deploy**
   - Web: `npm install`, `npm run lint`, `npm run build`, then deploy the generated build to the chosen host with a branded domain and TLS.
   - Mobile: Produce signed store builds through Expo (Android/iOS), supply icons/screenshots/descriptions, and validate deep links to Supabase/AI endpoints.
4. **Enable commerce**
   - Integrate a payment provider (e.g., Stripe) with pricing plans, tax handling, receipts, refunds, and licensing/seat limits before granting AI access.
   - Gate premium features behind successful purchase and store entitlements server-side.
5. **Launch operations**
   - Prepare onboarding docs, FAQs, and support channels; set up status/uptime monitoring and incident playbooks.
   - Add analytics for activation/retention, plus alerting on errors, latency, and billing failures.
6. **Publish and monitor**
   - Release the web site, submit mobile binaries to app stores, and announce availability; double-check store metadata and age/content ratings.
   - Monitor early-user telemetry, resolve defects quickly, and iterate pricing or onboarding based on feedback.
