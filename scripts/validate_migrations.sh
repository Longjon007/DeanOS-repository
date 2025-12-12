#!/bin/bash

# Database Migration Validation Script
# Ensures Supabase migrations and Prisma schema are synchronized

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check counters
PASS=0
FAIL=0
WARN=0

# Print section header
print_section() {
    echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

# Check result functions
check_pass() {
    echo -e "${GREEN}✓${NC} $1"
    ((PASS++))
}

check_fail() {
    echo -e "${RED}✗${NC} $1"
    ((FAIL++))
}

check_warn() {
    echo -e "${YELLOW}⚠${NC} $1"
    ((WARN++))
}

echo -e "${BLUE}╔════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                                                ║${NC}"
echo -e "${BLUE}║     DeanOS Database Migration Validator        ║${NC}"
echo -e "${BLUE}║                                                ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════╝${NC}"
echo ""

# Get repository root
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT" || exit 1

# Temporarily disable exit on error for checks
set +e

# ============================================================================
# Supabase Migration Validation
# ============================================================================
print_section "Supabase Migration Structure"

# Check if supabase directory exists
if [ -d "supabase" ]; then
    check_pass "Supabase directory exists"
else
    check_fail "Supabase directory not found"
fi

# Check if migrations directory exists
if [ -d "supabase/migrations" ]; then
    check_pass "Migrations directory exists"
    
    # Count migration files
    MIGRATION_COUNT=$(find supabase/migrations -name "*.sql" 2>/dev/null | wc -l)
    if [ "$MIGRATION_COUNT" -gt 0 ]; then
        check_pass "Found $MIGRATION_COUNT migration file(s)"
        
        # List migration files
        echo -e "\n${BLUE}Migration Files:${NC}"
        find supabase/migrations -name "*.sql" -exec basename {} \; | sort
    else
        check_warn "No migration files found"
    fi
else
    check_fail "Migrations directory not found"
fi

# Check if config.toml exists
if [ -f "supabase/config.toml" ]; then
    check_pass "Supabase config.toml exists"
    
    # Check for branch configurations
    if grep -q "\[environments" supabase/config.toml 2>/dev/null; then
        check_pass "Branch-specific configurations found in config.toml"
    else
        check_warn "No branch-specific configurations in config.toml"
    fi
else
    check_warn "Supabase config.toml not found (optional for hosted projects)"
fi

# ============================================================================
# Prisma Schema Validation
# ============================================================================
print_section "Prisma Schema Structure"

# Check if Prisma schema exists
if [ -f "web/prisma/schema.prisma" ]; then
    check_pass "Prisma schema file exists"
    
    # Check if schema has models
    MODEL_COUNT=$(grep -c "^model " web/prisma/schema.prisma 2>/dev/null || echo "0")
    if [ "$MODEL_COUNT" -gt 0 ]; then
        check_pass "Found $MODEL_COUNT Prisma model(s)"
        
        # List models
        echo -e "\n${BLUE}Prisma Models:${NC}"
        grep "^model " web/prisma/schema.prisma | awk '{print "  - " $2}'
    else
        check_warn "No Prisma models defined"
    fi
    
    # Check for datasource configuration
    if grep -q "datasource db" web/prisma/schema.prisma 2>/dev/null; then
        check_pass "Datasource configuration present"
    else
        check_fail "Datasource configuration missing"
    fi
    
    # Check for generator configuration
    if grep -q "generator client" web/prisma/schema.prisma 2>/dev/null; then
        check_pass "Generator configuration present"
    else
        check_fail "Generator configuration missing"
    fi
else
    check_fail "Prisma schema file not found"
fi

# ============================================================================
# Migration Synchronization Check
# ============================================================================
print_section "Migration Synchronization"

# Check if subscriptions table exists in both
SUPABASE_HAS_SUBSCRIPTIONS=0
PRISMA_HAS_SUBSCRIPTIONS=0

if [ -f "supabase/migrations/20240522000000_create_subscriptions.sql" ]; then
    SUPABASE_HAS_SUBSCRIPTIONS=1
    check_pass "Supabase has subscriptions migration"
fi

if [ -f "web/prisma/schema.prisma" ] && grep -q "model Subscription" web/prisma/schema.prisma 2>/dev/null; then
    PRISMA_HAS_SUBSCRIPTIONS=1
    check_pass "Prisma has Subscription model"
fi

# Check synchronization
if [ $SUPABASE_HAS_SUBSCRIPTIONS -eq 1 ] && [ $PRISMA_HAS_SUBSCRIPTIONS -eq 1 ]; then
    check_pass "Subscriptions table synchronized between Supabase and Prisma"
elif [ $SUPABASE_HAS_SUBSCRIPTIONS -eq 1 ] && [ $PRISMA_HAS_SUBSCRIPTIONS -eq 0 ]; then
    check_fail "Supabase has subscriptions but Prisma schema is missing it"
elif [ $SUPABASE_HAS_SUBSCRIPTIONS -eq 0 ] && [ $PRISMA_HAS_SUBSCRIPTIONS -eq 1 ]; then
    check_warn "Prisma has Subscription model but no Supabase migration found"
fi

# ============================================================================
# Environment Configuration Check
# ============================================================================
print_section "Environment Configuration"

# Check for environment example files
if [ -f "web/.env.example" ]; then
    check_pass "Web .env.example exists"
    
    # Check for required database variables
    if grep -q "DATABASE_URL" web/.env.example 2>/dev/null; then
        check_pass "DATABASE_URL defined in web/.env.example"
    else
        check_warn "DATABASE_URL not found in web/.env.example"
    fi
    
    if grep -q "DIRECT_URL" web/.env.example 2>/dev/null; then
        check_pass "DIRECT_URL defined in web/.env.example"
    else
        check_warn "DIRECT_URL not found in web/.env.example"
    fi
else
    check_warn "Web .env.example not found"
fi

if [ -f "app/.env.example" ]; then
    check_pass "App .env.example exists"
else
    check_warn "App .env.example not found"
fi

# ============================================================================
# Documentation Check
# ============================================================================
print_section "Documentation"

if [ -f "docs/DATABASE_MIGRATIONS.md" ]; then
    check_pass "Database migrations documentation exists"
else
    check_warn "DATABASE_MIGRATIONS.md not found"
fi

if [ -f "README.md" ]; then
    check_pass "README.md exists"
else
    check_fail "README.md not found"
fi

# ============================================================================
# Summary
# ============================================================================
print_section "Validation Summary"

TOTAL=$((PASS + FAIL + WARN))
if [ $TOTAL -eq 0 ]; then
    TOTAL=1  # Avoid division by zero
fi

HEALTH=$((PASS * 100 / TOTAL))

echo -e "${GREEN}Passed:${NC}  $PASS"
echo -e "${RED}Failed:${NC}  $FAIL"
echo -e "${YELLOW}Warnings:${NC} $WARN"
echo -e "Total:   $TOTAL"
echo ""
echo -e "Health:  ${BLUE}$HEALTH%${NC}"
echo ""

# Determine health status
if [ $HEALTH -ge 90 ]; then
    echo -e "${GREEN}✓ EXCELLENT${NC} - Database migrations are properly synchronized"
    EXIT_CODE=0
elif [ $HEALTH -ge 75 ]; then
    echo -e "${GREEN}✓ GOOD${NC} - Database migrations are mostly synchronized with minor issues"
    EXIT_CODE=0
elif [ $HEALTH -ge 50 ]; then
    echo -e "${YELLOW}⚠ FAIR${NC} - Database migrations need attention"
    EXIT_CODE=0
else
    echo -e "${RED}✗ POOR${NC} - Database migrations are out of sync"
    EXIT_CODE=1
fi

echo ""

# Re-enable exit on error
set -e

exit $EXIT_CODE
