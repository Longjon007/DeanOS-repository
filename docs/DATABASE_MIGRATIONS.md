# Database Migrations Guide

## Overview

DeanOS uses both Supabase migrations and Prisma schema for database management. This document ensures both systems stay synchronized across different branches and environments.

## Supabase Automation Tools

DeanOS provides automated scripts for managing Supabase projects:

- **[init-supabase.sh](../scripts/init-supabase.sh)** - Create new Supabase projects with auto-configuration
- **[manage-supabase.sh](../scripts/manage-supabase.sh)** - Manage existing projects, API keys, and migrations

For complete API documentation and usage examples, see [SUPABASE_API.md](./SUPABASE_API.md).

## Migration Systems

### Supabase Migrations

Location: `supabase/migrations/`

Supabase migrations are SQL files that define database schema changes:
- `20240522000000_create_subscriptions.sql` - Creates subscriptions table with RLS policies

### Prisma Schema

Location: `web/prisma/schema.prisma`

Prisma schema provides type-safe database access for the Next.js web application. It must match the Supabase migrations.

## Synchronization Requirements

**IMPORTANT**: Whenever you create a new Supabase migration, you must update the Prisma schema to match.

### Current Synchronized Tables

1. **subscriptions** table
   - Supabase Migration: `20240522000000_create_subscriptions.sql`
   - Prisma Model: `Subscription` in `schema.prisma`
   - Fields: id, userId, stripeCustomerId, status, lastBilledAt, createdAt, updatedAt

## Branch Configurations

### Production (main branch)
- Project Reference: `pitmtcljvkwcquqoepgz`
- Database URL: `https://pitmtcljvkwcquqoepgz.supabase.co`
- Auto-migrate: Enabled
- RLS: Enabled for all tables

### Development/Staging
- **IMPORTANT**: For production deployments, create a separate Supabase project for staging
- Currently uses same Supabase project (suitable for small projects/testing)
- For enterprise use: Create dedicated staging project to prevent data exposure
- Environment variables configured in `.env.local`
- Local Supabase CLI for development

### Local Development
- Use Supabase CLI: `supabase start`
- Migrations applied automatically
- Connect via local ports (see `supabase/config.toml`)

## Adding New Migrations

### Step 1: Create Supabase Migration

```bash
# Create a new migration file
supabase migration new your_migration_name

# Edit the SQL file in supabase/migrations/
```

### Step 2: Update Prisma Schema

Add corresponding models to `web/prisma/schema.prisma`:

```prisma
model YourModel {
  id        String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  // ... other fields
  createdAt DateTime @default(now()) @map("created_at") @db.Timestamptz(6)
  
  @@map("your_table_name")
}
```

### Step 3: Generate Prisma Client

```bash
cd web
npx prisma generate
```

### Step 4: Verify Synchronization

```bash
# Check Prisma schema matches database
cd web
npx prisma db pull  # Pull current database schema

# Compare with your schema.prisma to ensure they match
npx prisma format
```

## Environment Variables

### Web Application (.env.local)

```env
# Supabase Connection
NEXT_PUBLIC_SUPABASE_URL=https://pitmtcljvkwcquqoepgz.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your_publishable_key

# Database URLs for Prisma
DATABASE_URL="postgres://postgres:[PASSWORD]@db.pitmtcljvkwcquqoepgz.supabase.co:6543/postgres?pgbouncer=true"
DIRECT_URL="postgres://postgres:[PASSWORD]@db.pitmtcljvkwcquqoepgz.supabase.co:5432/postgres"
```

### Mobile Application (.env)

```env
EXPO_PUBLIC_SUPABASE_URL=https://pitmtcljvkwcquqoepgz.supabase.co
EXPO_PUBLIC_SUPABASE_KEY=your_publishable_key
```

## Migration Workflow

### For Feature Branches

1. Create feature branch from main
2. Add Supabase migration if needed
3. Update Prisma schema to match
4. Test locally with `supabase start`
5. Commit both migration and schema changes together
6. Create PR with database changes documented

### For Main Branch

1. Migrations are auto-applied on merge to main
2. Verify with health checks
3. Monitor Supabase dashboard for migration status

## Troubleshooting

### Schema Out of Sync

If Prisma schema doesn't match Supabase:

```bash
cd web
npx prisma db pull  # Pull latest schema from Supabase
npx prisma format   # Format the schema file
```

### Migration Fails

1. Check Supabase dashboard logs
2. Verify SQL syntax in migration file
3. Ensure no conflicting migrations
4. Check database permissions

### RLS Policies

Remember to:
- Enable RLS on new tables: `alter table your_table enable row level security;`
- Create appropriate policies for user access
- Test policies with different user roles

## Best Practices

1. **Always sync both systems**: Update Supabase migration AND Prisma schema together
2. **Use descriptive migration names**: Include timestamp and clear description
3. **Test locally first**: Use `supabase start` to test migrations before deploying
4. **Document changes**: Update this file when adding new migrations
5. **Version control**: Commit migration files with descriptive commit messages
6. **Branch-specific testing**: Test migrations on feature branches before merging

## Configuration Files

- `supabase/config.toml` - Supabase project configuration and branch settings
- `web/prisma/schema.prisma` - Prisma schema (must match Supabase tables)
- `supabase/migrations/*.sql` - SQL migration files
- `.env.example` files - Environment variable templates

## Health Checks

The migration validation system checks:
- Migration files exist
- Prisma schema is valid
- Database connectivity
- Schema synchronization

Run migration validation:
```bash
./scripts/validate_migrations.sh
```

For general system health:
```bash
./health_check.sh
```

## References

- [Supabase Migrations Documentation](https://supabase.com/docs/guides/cli/local-development#database-migrations)
- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- [Supabase + Prisma Integration](https://supabase.com/docs/guides/integrations/prisma)
