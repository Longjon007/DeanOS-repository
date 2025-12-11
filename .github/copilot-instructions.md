# Copilot Instructions

- Keep every change minimal and focused on the specific request.
- Follow the existing project structure; do not add new dependencies unless strictly necessary.
- Web (`web/`): this is a Next.js app—use existing scripts (`npm run lint`, `npm run build`) when dependencies are available and never commit `node_modules`.
- Mobile (`app/`): this is an Expo project—avoid platform-specific additions that break cross-platform support.
- Document the tests you ran (or why they were skipped) in the PR description.
- Prioritize security and privacy; avoid committing secrets or modifying `.github/agents/`.
