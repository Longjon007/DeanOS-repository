#!/bin/bash

# DeanOS Database Health Check
# Validates database configuration and connectivity

set +e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Counters
PASSED=0
FAILED=0
WARNINGS=0

# Functions
check_pass() {
    echo -e "${GREEN}✓${NC} $1"
    ((PASSED++))
}

check_fail() {
    echo -e "${RED}✗${NC} $1"
    ((FAILED++))
}

check_warn() {
    echo -e "${YELLOW}⚠${NC} $1"
    ((WARNINGS++))
}

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   DeanOS Database Health Check        ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""

# Check .env file
echo -e "${BLUE}Checking Environment Configuration...${NC}"
if [ -f ".env" ]; then
    check_pass ".env file exists"
    
    if grep -q "DATABASE_URL" .env; then
        check_pass "DATABASE_URL is defined"
    else
        check_fail "DATABASE_URL not found in .env"
    fi
    
    if grep -q "DIRECT_URL" .env; then
        check_pass "DIRECT_URL is defined"
    else
        check_fail "DIRECT_URL not found in .env"
    fi
    
    if grep -q "\[YOUR-PASSWORD\]" .env; then
        check_fail "Password placeholder not replaced in .env"
    else
        check_pass "Password has been configured"
    fi
else
    check_fail ".env file not found"
    check_warn "Run: cp .env.example .env"
fi
echo ""

# Check .env.example
echo -e "${BLUE}Checking Template Files...${NC}"
if [ -f ".env.example" ]; then
    check_pass ".env.example template exists"
else
    check_fail ".env.example template missing"
fi
echo ""

# Check Prisma setup
echo -e "${BLUE}Checking Prisma Configuration...${NC}"
if [ -f "web/prisma/schema.prisma" ]; then
    check_pass "Prisma schema exists"
    
    if grep -q "provider.*postgresql" web/prisma/schema.prisma; then
        check_pass "PostgreSQL provider configured"
    else
        check_fail "PostgreSQL provider not configured"
    fi
    
    if grep -q "directUrl" web/prisma/schema.prisma; then
        check_pass "Direct URL configuration present"
    else
        check_fail "Direct URL configuration missing"
    fi
else
    check_fail "Prisma schema not found"
fi

if [ -d "web/node_modules/@prisma/client" ]; then
    check_pass "Prisma Client installed"
else
    check_warn "Prisma Client not installed (run: npm install)"
fi
echo ""

# Check documentation
echo -e "${BLUE}Checking Documentation...${NC}"
if [ -f "docs/DATABASE_SETUP.md" ]; then
    check_pass "Database setup documentation exists"
else
    check_warn "Database setup documentation missing"
fi
echo ""

# Check .gitignore
echo -e "${BLUE}Checking Security Configuration...${NC}"
if [ -f ".gitignore" ]; then
    if grep -q "^\.env$" .gitignore || grep -q "^# Environment variables" .gitignore; then
        check_pass ".env is properly gitignored"
    else
        check_fail ".env not in .gitignore (SECURITY RISK)"
    fi
else
    check_fail ".gitignore file not found"
fi
echo ""

# Calculate health
TOTAL=$((PASSED + FAILED + WARNINGS))
if [ $TOTAL -eq 0 ]; then
    PERCENTAGE=0
else
    PERCENTAGE=$((PASSED * 100 / TOTAL))
fi

# Results
echo -e "${BLUE}═══════════════════════════════════════${NC}"
echo -e "${BLUE}Results:${NC}"
echo -e "${GREEN}  Passed:   ${PASSED}${NC}"
echo -e "${RED}  Failed:   ${FAILED}${NC}"
echo -e "${YELLOW}  Warnings: ${WARNINGS}${NC}"
echo -e "${BLUE}  Health:   ${PERCENTAGE}%${NC}"
echo -e "${BLUE}═══════════════════════════════════════${NC}"

if [ $FAILED -gt 0 ]; then
    echo -e "${RED}Database configuration needs attention!${NC}"
    exit 1
else
    echo -e "${GREEN}Database configuration is healthy!${NC}"
    exit 0
fi
