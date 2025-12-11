# GitHub Copilot Instructions for DeanOS

## Project Overview

DeanOS is an autonomous experimentally trained AI system. This repository contains the core system components, health monitoring, and documentation.

## Coding Style and Conventions

### Shell Scripts
- Use bash for all shell scripts
- Include shebang `#!/bin/bash` at the top of all scripts
- Add descriptive comments explaining script purpose and complex logic
- Use meaningful variable names in UPPER_CASE for constants and lower_case for variables
- For comprehensive health checks, use `set +e` around specific check blocks to capture and handle errors manually, then re-enable with `set -e`
- Always make scripts executable with proper permissions (chmod +x)

### Output and Formatting
- Use ANSI color codes for output (RED, GREEN, YELLOW, BLUE, NC)
- Provide clear, user-friendly messages with appropriate symbols (✓, ✗, ⚠)
- Include section headers to organize output
- Maintain consistent formatting across all output

## Documentation

### README Files
- Clearly identify the project as part of the DeanOS ecosystem in the repository README
- Include clear project overview and purpose
- Provide usage instructions and examples
- Document all available commands and options
- Keep documentation up-to-date with code changes

### Code Comments
- Add header comments to all scripts explaining their purpose
- Comment complex logic or non-obvious implementations
- Document all functions with their parameters and return values
- Include examples where helpful

### Markdown Files
- Use proper markdown syntax and formatting
- Include table of contents for long documents
- Use code blocks with appropriate language tags
- Add visual separators (horizontal rules) for better readability

## Testing and Validation

### Health Checks
- Create comprehensive validation for all system components
- Check for file existence before operations
- Validate configuration and dependencies
- Implement counters for pass/fail/warning states
- Calculate and report health percentages
- Use exit codes appropriately (0 for success, 1 for failure)

### Testing Guidelines
- Test all scripts manually before committing
- Verify output formatting and colors
- Check edge cases and error conditions
- Ensure scripts work in different environments

## Security

### Secrets and Credentials
- Never commit secrets, API keys, or credentials
- Use environment variables for sensitive data
- Document required environment variables in README

### File Permissions
- Ensure executable scripts have proper permissions
- Validate file permissions in health checks
- Use secure default permissions for new files

## Git and GitHub

### Commit Messages
- Write clear, descriptive commit messages
- Use present tense ("Add feature" not "Added feature")
- Keep first line under 50 characters
- Add detailed description when needed

### Repository Structure
- Place workflows in `.github/workflows/`
- Store documentation in `docs/` directory
- Keep health check scripts in repository root
- Organize custom agents in `.github/agents/`

### GitHub Actions
- Add health check workflows for continuous monitoring
- Run checks on push, pull requests, and schedule
- Generate clear output in workflow logs
- Use latest stable action versions

## Project-Specific Patterns

### Hyperion AI Interface
- Validate HTML structure and content
- Check for required elements (DOCTYPE, title, input fields)
- Ensure proper branding and styling
- Verify substantial content exists

### System Monitoring
- Implement comprehensive health metrics
- Track multiple validation points
- Provide actionable feedback on failures
- Calculate overall system health percentage
- Use consistent check result functions (check_pass, check_fail, check_warn)

### File Structure Validation
- Verify essential files exist (README, docs, .github)
- Check git repository configuration
- Validate remote and branch information
- Detect and warn about large files

## Best Practices

1. **Keep it Simple**: Write clear, maintainable code
2. **Be Explicit**: Don't rely on implicit behavior
3. **Fail Gracefully**: Handle errors appropriately
4. **Provide Context**: Give users meaningful error messages
5. **Stay Consistent**: Follow established patterns in the codebase
6. **Document Everything**: Code should be self-documenting with helpful comments
7. **Test Thoroughly**: Validate all changes before committing
8. **Think About Users**: Make tools easy to use and understand
