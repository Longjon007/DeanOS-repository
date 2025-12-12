# Quick Reference: CodeRabbit Pre-Deploy Checks

## What Gets Checked?

### ✅ Automatic Checks (Critical)
- No `debugger` statements
- No hardcoded credentials
- No security vulnerabilities
- Valid YAML configuration

### ⚠️ Warning Checks (Review)
- `console.log` statements in production code
- TODO/FIXME comments
- Large files (>500KB)
- Missing error handling in async functions

## How to Use

### Before Creating a PR
```bash
# Remove console.log statements
# Remove debugger statements
# Add error handling to async functions
# Review TODO comments
```

### When PR is Created
1. CodeRabbit automatically reviews your code
2. Pre-deploy workflow runs quality checks
3. Review comments appear on your PR
4. Address any critical issues

### Manual Workflow Trigger
1. Go to Actions tab
2. Select "Pre-Deploy CodeRabbit Check"
3. Click "Run workflow"
4. Select branch and run

## Common Issues

### ✗ Debugger Found
```javascript
// Remove this before deployment
debugger;
```

### ⚠️ Console.log Found
```javascript
// Change this:
console.log('Debug info');

// To this:
logger.debug('Debug info');
// Or remove it
```

### ⚠️ Missing Error Handling
```javascript
// Bad:
async function getData() {
  const data = await fetch('/api/data');
  return data;
}

// Good:
async function getData() {
  try {
    const data = await fetch('/api/data');
    return data;
  } catch (error) {
    console.error('Failed to fetch data:', error);
    throw error;
  }
}
```

## Configuration Files

- **`.coderabbit.yaml`** - CodeRabbit AI configuration
- **`.github/workflows/pre-deploy-coderabbit.yml`** - Workflow definition
- **`docs/CODERABBIT.md`** - Full documentation

## Status Indicators

| Icon | Meaning |
|------|---------|
| ✅ | Check passed |
| ⚠️ | Warning - review recommended |
| ✗ | Failed - must fix |
| ℹ️ | Information only |

## Getting Help

1. Read full docs: `docs/CODERABBIT.md`
2. Check workflow logs in Actions tab
3. Review `.coderabbit.yaml` configuration
4. Open an issue for questions

---

*Part of DeanOS (Hyperion AI) Quality Assurance System*
