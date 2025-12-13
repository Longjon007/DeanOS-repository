# Supabase Management API Guide

## Overview

This guide provides comprehensive documentation for managing Supabase projects programmatically using the DeanOS automation scripts. These tools streamline project creation, configuration, and management through interactive command-line interfaces.

## Table of Contents

- [Getting Started](#getting-started)
- [Authentication](#authentication)
- [Automation Scripts](#automation-scripts)
- [API Reference](#api-reference)
- [Available Regions](#available-regions)
- [Configuration Management](#configuration-management)
- [CI/CD Integration](#cicd-integration)
- [Troubleshooting](#troubleshooting)
- [Best Practices](#best-practices)

---

## Getting Started

### Prerequisites

1. **Supabase CLI**: Install the Supabase command-line interface

   ```bash
   # Using npm
   npm install -g supabase
   
   # Using Homebrew (macOS/Linux)
   brew install supabase/tap/supabase
   
   # Using Scoop (Windows)
   scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
   scoop install supabase
   ```

2. **Supabase Account**: Create a free account at [supabase.com](https://supabase.com)

3. **Access Token**: Generate a personal access token from your [Supabase account settings](https://app.supabase.com/account/tokens)

### Quick Start

1. **Login to Supabase**:
   ```bash
   supabase login
   ```

2. **Create a new project**:
   ```bash
   ./scripts/init-supabase.sh
   ```

3. **Manage existing projects**:
   ```bash
   ./scripts/manage-supabase.sh
   ```

---

## Authentication

### Interactive Login

The Supabase CLI uses token-based authentication:

```bash
supabase login
```

This opens a browser window for authentication and stores your access token securely.

### Environment Variables

For automated/CI environments, set the access token as an environment variable:

```bash
export SUPABASE_ACCESS_TOKEN="your-access-token"
```

### Verifying Authentication

Check your authentication status:

```bash
supabase projects list
```

If authenticated successfully, this will display your available projects.

---

## Automation Scripts

### init-supabase.sh

Interactive wizard for creating new Supabase projects with automatic configuration.

**Features:**
- Organization selection
- Region selection with full list of available regions
- Pricing tier selection (Free/Pro)
- Database password configuration
- Automatic environment file generation
- Supabase config.toml updates

**Usage:**

```bash
./scripts/init-supabase.sh
```

**Workflow:**

1. Authenticates with Supabase (if not already authenticated)
2. Lists available organizations
3. Prompts for project configuration:
   - Project name
   - Organization ID
   - Database password (minimum 6 characters)
   - AWS region
   - Pricing plan (Free/Pro)
4. Creates the project
5. Generates environment configuration files
6. Provides next steps for setup

**Generated Files:**

- `.env.supabase.example` - Template environment configuration
- `supabase/config.toml.backup` - Backup of existing config (if updated)

### manage-supabase.sh

Interactive management tool for existing Supabase projects.

**Features:**
- List all projects
- View detailed project information
- Display and manage API keys
- Health checks for project status
- Local project linking
- Environment configuration generation
- Database migration management

**Usage:**

```bash
./scripts/manage-supabase.sh
```

**Menu Options:**

1. **List all projects** - Display all accessible Supabase projects
2. **View project details** - Show detailed information for a specific project
3. **Show API keys** - Display anon and service role keys
4. **Check project health** - Validate project status and connectivity
5. **Link project locally** - Connect local development to remote project
6. **Generate environment configuration** - Create .env files
7. **Run migrations** - Push local migrations to remote database
8. **Exit** - Close the management tool

---

## API Reference

### Supabase Management API

The Supabase CLI interacts with the Supabase Management API. Key endpoints include:

#### Organizations

```bash
# List organizations
supabase orgs list

# List with JSON output
supabase orgs list --output json
```

#### Projects

```bash
# List all projects
supabase projects list

# Create a new project
supabase projects create "project-name" \
  --db-password "secure-password" \
  --region us-east-1 \
  --org-id "org-id" \
  --plan free

# Get project API keys
supabase projects api-keys --project-ref "project-ref"
```

#### Database Operations

```bash
# Link local project to remote
supabase link --project-ref "project-ref"

# Push migrations to remote
supabase db push

# Pull schema from remote
supabase db pull

# Reset local database
supabase db reset
```

#### Local Development

```bash
# Start local Supabase
supabase start

# Stop local Supabase
supabase stop

# Check local status
supabase status
```

### API Authentication

All API requests require authentication via access token:

```bash
# Set token for CLI
export SUPABASE_ACCESS_TOKEN="sbp_xxxxxxxxxxxxx"

# Or authenticate interactively
supabase login
```

---

## Available Regions

Supabase projects can be deployed in the following AWS regions:

| Region Code      | Location                      | Description                    |
|------------------|-------------------------------|--------------------------------|
| `us-east-1`      | US East (N. Virginia)         | North America - East Coast     |
| `us-west-1`      | US West (N. California)       | North America - West Coast     |
| `us-west-2`      | US West (Oregon)              | North America - Northwest      |
| `eu-west-1`      | Europe (Ireland)              | Europe - Western               |
| `eu-west-2`      | Europe (London)               | Europe - UK                    |
| `eu-central-1`   | Europe (Frankfurt)            | Europe - Central               |
| `ap-southeast-1` | Asia Pacific (Singapore)      | Asia - Southeast               |
| `ap-northeast-1` | Asia Pacific (Tokyo)          | Asia - Northeast               |
| `ap-southeast-2` | Asia Pacific (Sydney)         | Oceania                        |
| `sa-east-1`      | South America (São Paulo)     | South America                  |

### Region Selection Guidelines

**Considerations:**
- **Latency**: Choose a region closest to your users
- **Compliance**: Consider data residency requirements (GDPR, etc.)
- **Pricing**: Costs may vary by region
- **Availability**: Check current region availability at [Supabase Status](https://status.supabase.com)

**Recommendations:**
- **North America**: `us-east-1` (default, most features)
- **Europe**: `eu-west-1` (GDPR compliant)
- **Asia**: `ap-southeast-1` (Singapore) or `ap-northeast-1` (Tokyo)
- **Global**: Use multi-region strategy with CDN

---

## Configuration Management

### Environment Variables

DeanOS applications use the following Supabase environment variables:

#### Web Application (.env.local)

```env
# Project Information
SUPABASE_PROJECT_REF=your-project-ref

# Supabase URLs
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_URL=https://your-project-ref.supabase.co

# API Keys
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Database URLs for Prisma
DATABASE_URL=postgres://postgres:password@db.your-project-ref.supabase.co:6543/postgres?pgbouncer=true
DIRECT_URL=postgres://postgres:password@db.your-project-ref.supabase.co:5432/postgres
```

#### Mobile Application (.env)

```env
# Supabase Configuration
EXPO_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
EXPO_PUBLIC_SUPABASE_KEY=your-anon-key
```

### Supabase Configuration (config.toml)

Update `supabase/config.toml` with your project reference:

```toml
[project]
project_id = "your-project-ref"

[db.migrations]
path = "supabase/migrations"

[environments.production]
project_ref = "your-project-ref"
auto_migrate = true
```

### Security Best Practices

1. **Never commit secrets**: Add `.env` files to `.gitignore`
2. **Use environment-specific files**: `.env.local`, `.env.production`, `.env.staging`
3. **Rotate keys regularly**: Generate new API keys periodically
4. **Service role key**: Only use on server-side, never expose to client
5. **Row Level Security (RLS)**: Always enable RLS on production tables

---

## CI/CD Integration

### GitHub Actions

#### Environment Setup

Store Supabase credentials as GitHub Secrets:

- `SUPABASE_ACCESS_TOKEN` - Personal access token
- `SUPABASE_PROJECT_REF` - Project reference ID
- `SUPABASE_DB_PASSWORD` - Database password

#### Example Workflow: Deploy Migrations

```yaml
name: Deploy Supabase Migrations

on:
  push:
    branches: [main]
    paths:
      - 'supabase/migrations/**'

jobs:
  deploy-migrations:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
      
      - name: Setup Supabase CLI
        uses: supabase/setup-cli@v1
        with:
          version: latest
      
      - name: Link to Supabase project
        env:
          SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}
        run: |
          supabase link --project-ref ${{ secrets.SUPABASE_PROJECT_REF }}
      
      - name: Push migrations
        env:
          SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}
        run: |
          supabase db push
      
      - name: Verify migrations
        run: |
          echo "Migrations deployed successfully"
```

#### Example Workflow: Automated Project Creation

```yaml
name: Create Staging Environment

on:
  workflow_dispatch:
    inputs:
      project_name:
        description: 'Project name'
        required: true
      region:
        description: 'AWS region'
        required: true
        default: 'us-east-1'

jobs:
  create-project:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
      
      - name: Setup Supabase CLI
        uses: supabase/setup-cli@v1
      
      - name: Authenticate with Supabase
        env:
          SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}
        run: |
          echo "Authentication configured"
      
      - name: Create Supabase project
        env:
          SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}
        run: |
          supabase projects create "${{ github.event.inputs.project_name }}" \
            --db-password "${{ secrets.SUPABASE_DB_PASSWORD }}" \
            --region ${{ github.event.inputs.region }} \
            --org-id ${{ secrets.SUPABASE_ORG_ID }}
```

### GitLab CI

```yaml
deploy-migrations:
  image: supabase/cli:latest
  stage: deploy
  script:
    - supabase link --project-ref $SUPABASE_PROJECT_REF
    - supabase db push
  only:
    - main
  environment:
    name: production
```

### Automated Testing

```yaml
test-database:
  runs-on: ubuntu-latest
  
  steps:
    - uses: actions/checkout@v4
    
    - name: Setup Supabase CLI
      uses: supabase/setup-cli@v1
    
    - name: Start local Supabase
      run: supabase start
    
    - name: Run database tests
      run: |
        # Your test commands here
        npm run test:db
    
    - name: Stop Supabase
      if: always()
      run: supabase stop
```

---

## Troubleshooting

### Common Issues

#### Authentication Failures

**Symptom**: `Error: Failed to authenticate with Supabase`

**Solutions**:
1. Verify you're logged in: `supabase login`
2. Check token is valid: `supabase projects list`
3. Regenerate access token from dashboard
4. Clear CLI cache: `rm -rf ~/.supabase`

#### Project Creation Fails

**Symptom**: `Error: Failed to create project`

**Solutions**:
1. Verify organization ID is correct
2. Check region availability
3. Ensure password meets requirements (6+ characters)
4. Verify billing information (for Pro plan)
5. Check organization project limits

#### Migration Errors

**Symptom**: `Error: Migration failed`

**Solutions**:
1. Check SQL syntax in migration files
2. Verify database connection: `supabase status`
3. Check for conflicting migrations
4. Review migration order (timestamp-based)
5. Test locally first: `supabase db reset`

#### API Key Issues

**Symptom**: `Invalid API key` or `Unauthorized`

**Solutions**:
1. Regenerate keys: `supabase projects api-keys --project-ref xxx`
2. Verify correct key type (anon vs service_role)
3. Check environment variables are loaded
4. Ensure no trailing spaces in .env files
5. Restart development server after updating keys

#### Connection Timeouts

**Symptom**: `Error: Connection timeout`

**Solutions**:
1. Check project status in dashboard
2. Verify region is accessible
3. Check network/firewall settings
4. Confirm project is not paused
5. Test with curl: `curl https://your-ref.supabase.co`

### Debug Mode

Enable verbose logging for troubleshooting:

```bash
# Set debug environment variable
export DEBUG=supabase:*

# Run command with verbose output
supabase --debug db push
```

### Getting Help

1. **Supabase CLI help**: `supabase help [command]`
2. **Documentation**: [supabase.com/docs](https://supabase.com/docs)
3. **Community**: [discord.gg/supabase](https://discord.gg/supabase)
4. **GitHub Issues**: [github.com/supabase/cli/issues](https://github.com/supabase/cli/issues)
5. **DeanOS Support**: Check repository issues

### Health Check Commands

```bash
# Verify CLI installation
supabase --version

# Check authentication
supabase projects list

# Check local instance
supabase status

# Test project connectivity
curl -I https://your-project-ref.supabase.co

# Validate migrations
./scripts/validate_migrations.sh
```

---

## Best Practices

### Project Organization

1. **One project per environment**: Separate dev, staging, and production
2. **Consistent naming**: Use descriptive, environment-specific names
3. **Branch protection**: Use Git branches aligned with Supabase projects
4. **Documentation**: Keep project references documented

### Security

1. **API Key Management**:
   - Never commit keys to version control
   - Use environment variables
   - Rotate keys regularly
   - Use service role keys only on backend

2. **Database Security**:
   - Enable Row Level Security (RLS) on all tables
   - Create policies for user access
   - Use database roles appropriately
   - Audit security policies regularly

3. **Access Control**:
   - Use organization teams
   - Apply least privilege principle
   - Review member access regularly
   - Enable 2FA for team members

### Migration Management

1. **Version Control**: Commit all migration files
2. **Testing**: Test migrations locally before production
3. **Naming**: Use descriptive migration names with timestamps
4. **Rollback**: Keep rollback scripts for critical migrations
5. **Documentation**: Document schema changes

### Performance

1. **Database Pooling**: Use PgBouncer (port 6543) for connection pooling
2. **Indexes**: Create appropriate indexes for queries
3. **Caching**: Implement caching strategies
4. **Region**: Choose region closest to users
5. **Monitoring**: Use Supabase dashboard for performance metrics

### Cost Optimization

1. **Free Tier**: Use for development/testing
2. **Pausing**: Pause unused projects
3. **Pro Plan**: Upgrade only when needed
4. **Monitoring**: Track usage in dashboard
5. **Cleanup**: Remove unused resources

### Development Workflow

1. **Local Development**:
   ```bash
   supabase start  # Start local instance
   # Develop and test locally
   supabase stop   # Clean shutdown
   ```

2. **Feature Branches**:
   ```bash
   # Create migration in feature branch
   supabase migration new feature_name
   # Test locally
   supabase db reset
   # Commit and push
   git add supabase/migrations/
   git commit -m "Add feature migration"
   ```

3. **Deployment**:
   ```bash
   # After PR merge to main
   supabase link --project-ref production-ref
   supabase db push
   ```

### Monitoring and Maintenance

1. **Health Checks**: Implement automated health checks
2. **Logging**: Monitor Supabase logs in dashboard
3. **Alerts**: Set up alerts for errors/performance
4. **Backups**: Regular database backups (automatic in Pro)
5. **Updates**: Keep Supabase CLI updated

---

## Additional Resources

### Documentation Links

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase CLI Reference](https://supabase.com/docs/reference/cli)
- [Management API](https://supabase.com/docs/reference/api)
- [Database Migrations Guide](https://supabase.com/docs/guides/cli/local-development#database-migrations)
- [Self-Hosting Guide](https://supabase.com/docs/guides/self-hosting)

### DeanOS Resources

- [Database Migrations Guide](./DATABASE_MIGRATIONS.md)
- [Health Check Documentation](../HEALTH_CHECK.md)
- [Security Policy](../SECURITY.md)
- [Repository README](../README.md)

### Community

- [Supabase Discord](https://discord.supabase.com)
- [GitHub Discussions](https://github.com/supabase/supabase/discussions)
- [Twitter @supabase](https://twitter.com/supabase)

---

## Changelog

### Version 1.0.0 (Initial Release)

**Added:**
- `init-supabase.sh` - Interactive project creation wizard
- `manage-supabase.sh` - Project management tool
- Comprehensive API documentation
- CI/CD integration examples
- Troubleshooting guide

**Features:**
- Automated project creation
- Environment configuration generation
- Project health checks
- Migration management
- Multi-region support

---

## Contributing

To contribute improvements to these scripts or documentation:

1. Fork the repository
2. Create a feature branch
3. Make your changes following DeanOS coding standards
4. Test thoroughly
5. Submit a pull request

For issues or suggestions, please open an issue in the repository.

---

## License

These automation tools are part of the DeanOS project. See the repository LICENSE file for details.
