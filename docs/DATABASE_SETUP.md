# Database Setup Guide

## Overview
DeanOS uses Supabase (PostgreSQL) with Prisma ORM for data persistence.

## Configuration

### 1. Get Supabase Credentials
1. Log in to [Supabase Dashboard](https://app.supabase.com)
2. Navigate to your project: `pitmtcljvkwcquqoepgz`
3. Go to Settings > Database
4. Copy your database password

### 2. Set Up Environment Variables
1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Replace `[YOUR-PASSWORD]` with your actual Supabase password

### 3. Initialize Prisma
```bash
# Install dependencies
npm install prisma @prisma/client

# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init
```

### 4. Verify Connection
```bash
npx prisma db pull
```

## Connection Details

- **Pooled Connection (DATABASE_URL)**: Port 6543 via PgBouncer
  - Use for serverless functions and edge runtime
  - Handles connection pooling automatically

- **Direct Connection (DIRECT_URL)**: Port 5432 
  - Use for migrations and schema changes
  - Required for `prisma migrate` commands

## Models

### SystemLog
Stores system-wide logs from DeanOS components.

### HealthCheck
Records health check results over time.

### Configuration
Stores system configuration key-value pairs.

## Troubleshooting

### Connection Errors
- Verify password is correct
- Check firewall allows connections to Supabase
- Ensure environment variables are loaded

### Migration Errors
- Always use DIRECT_URL for migrations
- Check database permissions
- Verify schema syntax

## Security
- Never commit `.env` file
- Use environment variables in production
- Rotate database passwords regularly
