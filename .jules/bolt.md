## 2024-05-24 - Missing Test Infrastructure
**Learning:** The project instructions mention 100% test coverage and existing tests, but `app/` and `web/` package.json files lack test scripts and dependencies (except `lint` in `web`).
**Action:** Do not rely on memory for project state. Verify file existence before assuming tools are available. When "Always do" instructions conflict with reality (e.g., "Run tests"), document the limitation and proceed with manual verification if safe.
