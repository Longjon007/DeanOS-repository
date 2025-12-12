# Hyperien AI Health Check System

## Overview

The Hyperien AI Health Check system provides comprehensive validation and monitoring of the Hyperien AI autonomous AI system. It ensures all critical components are operational and properly configured.

## Components

### 1. Health Check Script (`health_check.sh`)

A comprehensive bash script that validates:

- **Repository Structure**: Verifies essential files and directories exist
- **Documentation**: Checks README and documentation content
- **Hyperien AI Interface**: Validates the HTML prompt interface (`docs/hyperien-prompt.html`)
- **Git Configuration**: Verifies repository setup and remote configuration
- **File Permissions**: Ensures scripts are properly configured
- **System Dependencies**: Checks for required tools (git, bash)
- **Repository Health**: Analyzes file counts and sizes

### 2. Automated Workflow

GitHub Actions workflow (`.github/workflows/health-check.yml`) that:

- Runs on every push to main/master branches
- Runs on pull requests
- Executes daily at 9:00 UTC
- Can be triggered manually via workflow dispatch
- Generates health reports
- Comments on pull requests with results

## Usage

### Running Manually

```bash
# Make the script executable (if not already)
chmod +x health_check.sh

# Run the health check
./health_check.sh
```

### Exit Codes

- `0`: All checks passed (or only warnings)
- `1`: One or more critical checks failed

### Health Metrics

The health check calculates an overall system health percentage:

- **90-100%**: EXCELLENT - System is fully operational
- **75-89%**: GOOD - System is functional with minor issues
- **50-74%**: FAIR - System has some problems requiring attention
- **Below 50%**: POOR - System has critical issues

## Checks Performed

1. ✓ README.md exists and has content
2. ✓ Documentation directory (docs/) exists
3. ✓ Git repository is initialized
4. ✓ .github directory exists
5. ✓ README mentions Hyperien AI
6. ✓ Hyperien prompt interface exists
7. ✓ HTML has valid DOCTYPE
8. ✓ HTML has title tag
9. ✓ Hyperien AI branding present
10. ✓ Command input element present
11. ✓ HTML file has substantial content
12. ✓ Git repository is valid
13. ✓ Git remote configured
14. ✓ Current branch information
15. ✓ Commit history exists
16. ✓ Health check script is executable
17. ✓ Git is installed
18. ✓ Bash is available
19. ✓ File count validation
20. ✓ Repository contains files
21. ✓ Large file detection

## Interpreting Results

### Passed (✓)
Green checkmarks indicate successful validation of a component.

### Failed (✗)
Red X marks indicate a critical issue that needs attention.

### Warning (⚠)
Yellow warnings indicate potential issues that should be reviewed but don't prevent system operation.

## Continuous Monitoring

The automated workflow ensures:

- Regular daily health checks
- Validation on all code changes
- Pull request validation before merge
- Historical tracking via GitHub Actions logs

## Customization

To add new health checks:

1. Open `health_check.sh`
2. Add a new section with `print_section "Your Section"`
3. Implement checks using `check_pass`, `check_fail`, or `check_warn`
4. Update this documentation

## Troubleshooting

### Health check fails to run

```bash
# Ensure the script is executable
chmod +x health_check.sh

# Run with bash explicitly
bash health_check.sh
```

### Workflow fails

1. Check the Actions tab in GitHub
2. Review the workflow logs
3. Verify all required files exist
4. Ensure permissions are correctly set

## Maintenance

- Review health check results regularly
- Update checks as new components are added
- Keep the workflow actions up to date
- Document any new validation requirements

## Contact

For issues or questions about the health check system, please open an issue in the repository.
