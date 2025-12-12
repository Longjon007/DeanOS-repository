# Hyperien AI
Autonomous experimentally trained AI

## Build process recommendations

Follow these steps when working with the project. Each step includes what to do before and after to keep builds reliable.

1) Install dependencies (`npm install` in `web/`)
- Before: Ensure Node.js LTS is installed and `.env` variables (Supabase URL/key) are present if needed.
- After: Confirm `package-lock.json` is updated only when intentional; re-run install on clean checkout if lockfile changes unexpectedly.

2) Lint the project (`npm run lint`)
- Before: Run after dependency install; ensure TypeScript config matches the repo (strict mode enabled).
- After: Address any warnings/errors immediately; rerun lint to verify a clean state.

3) Run the build (`npm run build`)
- Before: Verify required environment variables are set for production builds; clear any stale `.next` artifacts if switching branches.
- After: Review build output for warnings; if the build generated artifacts, avoid committing `.next` by relying on `.gitignore`.

4) Start the dev server (`npm run dev`)
- Before: Ensure lint passes to avoid runtime issues; confirm ports are free (default 3000).
- After: Manually verify UI flows (template cards and todos) and watch terminal for runtime warnings.
