## 2024-05-24 - Environment Limitations
**Learning:** The sandbox environment has a strict file limit that prevents running `npm install` in the `web/` or `app/` directories. This means we cannot run linters or tests that require `node_modules`.
**Action:** When working in this environment, rely on manual verification and careful code review. Avoid relying on CI/CD-style local checks if they require full dependency trees.
