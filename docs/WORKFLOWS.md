# GitHub Actions Workflows

This document provides an overview of all automated workflows configured for the DeanOS (Hyperion AI) repository.

## Available Workflows

### 1. Code Review (`code-review.yml`)
**Purpose:** Automatically reviews pull requests for common code quality issues

**Triggers:**
- Pull requests opened, synchronized, or reopened
- Target branches: `main`, `master`

**What it checks:**
- ✅ Console.log statements
- ✅ TODO comments
- ✅ Debugger statements
- ✅ Hardcoded credentials

**Output:** Posts a review report as a PR comment

---

### 2. Build Web Application (`build-web.yml`)
**Purpose:** Builds the Next.js web application

**Triggers:**
- Push to `main`/`master` (when web/ files change)
- Pull requests to `main`/`master` (when web/ files change)
- Manual workflow dispatch

**Steps:**
1. Setup Node.js 20
2. Install dependencies (with caching)
3. Copy environment variables
4. Run linter
5. Build production bundle
6. Upload build artifacts (retained for 7 days)

**Artifacts:** `web-build-{sha}` containing `.next` and `out` directories

---

### 3. Build Mobile Application (`build-mobile.yml`)
**Purpose:** Validates the Expo/React Native mobile application

**Triggers:**
- Push to `main`/`master` (when app/ files change)
- Pull requests to `main`/`master` (when app/ files change)
- Manual workflow dispatch

**Steps:**
1. Setup Node.js 20
2. Install dependencies (with caching)
3. Copy environment variables
4. Validate Expo configuration
5. Check Expo installation

**Note:** Full iOS/Android builds require [Expo Application Services (EAS)](https://expo.dev/eas)

---

### 4. Deploy Web Application (`deploy-web.yml`)
**Purpose:** Deploy the web application to production or staging

**Triggers:**
- Manual workflow dispatch (with environment selection)
- Push to `main` branch (when web/ files change)

**Environments:**
- Production
- Staging

**Steps:**
1. Setup Node.js 20
2. Install dependencies (with caching)
3. Copy environment variables
4. Build production bundle
5. Create deployment summary

**Configuration Required:**
To enable automated deployment, uncomment the appropriate section in the workflow file and add required secrets:

- **Vercel:** `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`
- **Netlify:** `NETLIFY_AUTH_TOKEN`, `NETLIFY_SITE_ID`
- **Custom Server:** `HOST`, `USERNAME`, `SSH_KEY`

---

### 5. Health Check (`health-check.yml`)
**Purpose:** Validates system health and repository structure

**Triggers:**
- Push to `main`/`master`
- Pull requests to `main`/`master`
- Daily at 9:00 UTC (scheduled)
- Manual workflow dispatch

**What it checks:**
- Repository structure
- Documentation
- Hyperion AI interface
- Git configuration
- File permissions
- System dependencies

**Output:** Posts health report to PR comments (if applicable)

---

### 6. CodeQL Analysis (`codeql.yml`)
**Purpose:** Automated security scanning for vulnerabilities

**Triggers:**
- Push to `main`
- Pull requests to `main`
- Weekly on Sundays at 19:43 UTC

**Languages Analyzed:**
- JavaScript/TypeScript
- GitHub Actions

**Output:** Security alerts in the Security tab

---

### 7. Deno Testing (`deno.yml`)
**Purpose:** Runs Deno linting and tests

**Triggers:**
- Push to `main`
- Pull requests to `main`

**Steps:**
1. Setup Deno
2. Run linter
3. Run tests

---

## Manual Workflow Execution

### Using GitHub UI:
1. Go to the **Actions** tab
2. Select the workflow from the left sidebar
3. Click **Run workflow** button
4. Select branch and options (if applicable)
5. Click **Run workflow**

### Using GitHub CLI:
```bash
# Run web build workflow
gh workflow run build-web.yml

# Run deployment workflow with environment
gh workflow run deploy-web.yml -f environment=production

# List workflow runs
gh run list

# View specific run
gh run view <run-id>
```

## Workflow Status Badges

Add these badges to your README.md to show workflow status:

```markdown
![Code Review](https://github.com/{username}/{repository}/actions/workflows/code-review.yml/badge.svg)
![Build Web](https://github.com/{username}/{repository}/actions/workflows/build-web.yml/badge.svg)
![Build Mobile](https://github.com/{username}/{repository}/actions/workflows/build-mobile.yml/badge.svg)
![Health Check](https://github.com/{username}/{repository}/actions/workflows/health-check.yml/badge.svg)
![CodeQL](https://github.com/{username}/{repository}/actions/workflows/codeql.yml/badge.svg)
```

**Example for this repository:**
```markdown
![Code Review](https://github.com/Longjon007/DeanOS-repository/actions/workflows/code-review.yml/badge.svg)
![Build Web](https://github.com/Longjon007/DeanOS-repository/actions/workflows/build-web.yml/badge.svg)
![Build Mobile](https://github.com/Longjon007/DeanOS-repository/actions/workflows/build-mobile.yml/badge.svg)
![Health Check](https://github.com/Longjon007/DeanOS-repository/actions/workflows/health-check.yml/badge.svg)
![CodeQL](https://github.com/Longjon007/DeanOS-repository/actions/workflows/codeql.yml/badge.svg)
```

## Monitoring Workflows

### View Workflow Runs:
- Go to the **Actions** tab in GitHub
- Click on a workflow to see its history
- Click on a specific run to see detailed logs

### Notifications:
- GitHub will send email notifications for failed workflows
- Configure notifications in Settings → Notifications

### Workflow Logs:
- Each step in a workflow produces logs
- Logs are retained for 90 days
- Download logs for offline analysis

## Troubleshooting

### Workflow Fails to Start:
- Check workflow syntax with: `yamllint .github/workflows/*.yml`
- Verify triggers match your branch/event

### Build Fails:
- Check error logs in the workflow run
- Ensure dependencies are up to date
- Verify environment variables are set

### Deployment Fails:
- Verify secrets are configured correctly
- Check deployment platform status
- Review deployment logs

### Permission Errors:
- Check workflow permissions in the YAML file
- Verify repository settings allow workflow execution

## Best Practices

1. **Always review workflow runs** after pushing changes
2. **Keep secrets up to date** in repository settings
3. **Monitor security alerts** from CodeQL
4. **Test workflows locally** when possible
5. **Keep workflows updated** with latest action versions
6. **Use caching** to speed up builds
7. **Set proper permissions** for each workflow
8. **Document custom workflows** for team members

## Security Considerations

- ✅ All workflows run with minimal required permissions
- ✅ Secrets are never exposed in logs
- ✅ CodeQL scanning enabled for security
- ✅ Dependabot can be enabled for dependency updates
- ✅ Branch protection can require workflow success

## Support

For workflow-related issues:
1. Check the **Actions** tab for error logs
2. Review this documentation
3. Open an issue with workflow logs attached
4. Contact repository maintainers

## Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Workflow Syntax Reference](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Expo Build Process](https://docs.expo.dev/build/introduction/)
