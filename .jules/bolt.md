## 2024-05-23 - Missing Global Gitignore for Node Modules
**Learning:** The root `.gitignore` only ignores `.env`, and does not ignore `node_modules`. This causes `npm install` in subdirectories (like `web/`) to potentially pollute the git status or hit file generation limits if not handled carefully.
**Action:** Always check `.gitignore` before running `npm install` and verify if temporary ignores are needed, or ensure cleanup is performed immediately after.
