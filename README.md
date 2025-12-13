# Hyperien AI
Autonomous experimentally trained AI

## Supabase Management

DeanOS provides automated tools for managing Supabase projects programmatically.

### Quick Start

Create a new Supabase project:
```bash
./scripts/init-supabase.sh
```

Manage existing projects:
```bash
./scripts/manage-supabase.sh
```

For complete documentation, see [docs/SUPABASE_API.md](docs/SUPABASE_API.md).

## Database Migrations

This repository uses synchronized database migrations between Supabase and Prisma. For detailed information about managing database migrations and ensuring synchronization across branches, see [docs/DATABASE_MIGRATIONS.md](docs/DATABASE_MIGRATIONS.md).

### Quick Validation

To validate that database migrations are synchronized:

```bash
./scripts/validate_migrations.sh
```
