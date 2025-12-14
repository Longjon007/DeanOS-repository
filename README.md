# Hyperien AI
Autonomous experimentally trained AI

## 🗄️ Database Setup

DeanOS uses Supabase (PostgreSQL) with Prisma ORM for data persistence.

### Quick Start

1. **Copy environment template**:
   ```bash
   cp .env.example .env
   ```

2. **Add your Supabase password** to `.env`

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Generate Prisma Client**:
   ```bash
   npx prisma generate
   ```

5. **Run migrations**:
   ```bash
   npx prisma migrate dev
   ```

For detailed instructions, see [Database Setup Guide](docs/DATABASE_SETUP.md).

### Health Check

Run the database configuration health check:
```bash
./check-database.sh
```

## Database Migrations

This repository uses synchronized database migrations between Supabase and Prisma. For detailed information about managing database migrations and ensuring synchronization across branches, see [docs/DATABASE_MIGRATIONS.md](docs/DATABASE_MIGRATIONS.md).

### Quick Validation

To validate that database migrations are synchronized:

```bash
./scripts/validate_migrations.sh
```
