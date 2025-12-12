# Hyperien AI
Autonomous experimentally trained AI

## Database Migrations

This repository uses synchronized database migrations between Supabase and Prisma. For detailed information about managing database migrations and ensuring synchronization across branches, see [docs/DATABASE_MIGRATIONS.md](docs/DATABASE_MIGRATIONS.md).

### Quick Validation

To validate that database migrations are synchronized:

```bash
./scripts/validate_migrations.sh
```
