#!/bin/bash

# DeanOS Health Check Script
# This script performs a comprehensive health check on the DeanOS system

# Don't exit on errors, we want to run all checks
set +e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Counters
PASS_COUNT=0
FAIL_COUNT=0
WARN_COUNT=0

# Print header
print_header() {
    echo ""
    echo "================================================================"
    echo "  DeanOS Health Check"
    echo "  Autonomous experimentally trained AI - System Validation"
    echo "================================================================"
    echo ""
}

# Print section header
print_section() {
    echo ""
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

# Check result functions
check_pass() {
    echo -e "  ${GREEN}✓${NC} $1"
    ((PASS_COUNT++))
}

check_fail() {
    echo -e "  ${RED}✗${NC} $1"
    ((FAIL_COUNT++))
}

check_warn() {
    echo -e "  ${YELLOW}⚠${NC} $1"
    ((WARN_COUNT++))
}

# Start health check
print_header

# Check 1: Repository Structure
print_section "Repository Structure"

if [ -f "README.md" ]; then
    check_pass "README.md exists"
else
    check_fail "README.md is missing"
fi

if [ -d "docs" ]; then
    check_pass "docs directory exists"
else
    check_fail "docs directory is missing"
fi

if [ -d ".git" ]; then
    check_pass "Git repository initialized"
else
    check_fail "Not a git repository"
fi

if [ -d ".github" ]; then
    check_pass ".github directory exists"
else
    check_warn ".github directory is missing"
fi

# Check 2: Documentation Files
print_section "Documentation"

if [ -f "README.md" ]; then
    # Check if README has content
    if [ -s "README.md" ]; then
        check_pass "README.md has content"
        
        # Check for DeanOS mention
        if grep -q "DeanOS" "README.md"; then
            check_pass "README.md mentions DeanOS"
        else
            check_warn "README.md does not mention DeanOS"
        fi
    else
        check_fail "README.md is empty"
    fi
fi

# Check 3: Hyperion AI Interface
print_section "Hyperion AI Interface"

if [ -f "docs/hyperion-prompt.html" ]; then
    check_pass "Hyperion prompt interface exists"
    
    # Validate HTML structure
    if grep -q "<!DOCTYPE html>" "docs/hyperion-prompt.html"; then
        check_pass "HTML has valid DOCTYPE"
    else
        check_fail "HTML missing DOCTYPE declaration"
    fi
    
    if grep -q "<title>" "docs/hyperion-prompt.html"; then
        check_pass "HTML has title tag"
    else
        check_fail "HTML missing title tag"
    fi
    
    if grep -q "Hyperion AI" "docs/hyperion-prompt.html"; then
        check_pass "Hyperion AI branding present"
    else
        check_fail "Hyperion AI branding missing"
    fi
    
    # Check for essential elements
    if grep -q "command-input" "docs/hyperion-prompt.html"; then
        check_pass "Command input element present"
    else
        check_fail "Command input element missing"
    fi
    
    # Check file size (should not be empty or too small)
    FILE_SIZE=$(wc -c < "docs/hyperion-prompt.html" 2>/dev/null || echo "0")
    if [ "$FILE_SIZE" -gt 1000 ]; then
        check_pass "HTML file has substantial content (${FILE_SIZE} bytes)"
    else
        check_fail "HTML file is too small or empty"
    fi
else
    check_fail "Hyperion prompt interface is missing"
fi

# Check 4: Git Configuration
print_section "Git Configuration"

if git rev-parse --git-dir > /dev/null 2>&1; then
    check_pass "Git repository is valid"
    
    # Check for remote
    if git remote -v | grep -q "origin"; then
        REMOTE_URL=$(git remote get-url origin)
        check_pass "Git remote configured: $REMOTE_URL"
    else
        check_warn "No git remote configured"
    fi
    
    # Check current branch
    CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
    check_pass "Current branch: $CURRENT_BRANCH"
    
    # Check for commits
    COMMIT_COUNT=$(git rev-list --count HEAD 2>/dev/null || echo "0")
    if [ "$COMMIT_COUNT" -gt 0 ]; then
        check_pass "Repository has $COMMIT_COUNT commit(s)"
    else
        check_fail "Repository has no commits"
    fi
else
    check_fail "Git repository is not valid"
fi

# Check 5: File Permissions
print_section "File Permissions"

# Check if script is executable
if [ -x "$0" ]; then
    check_pass "Health check script is executable"
else
    check_warn "Health check script should be executable (chmod +x)"
fi

# Check 6: System Dependencies
print_section "System Dependencies"

# Check for common tools
if command -v git &> /dev/null; then
    GIT_VERSION=$(git --version | cut -d' ' -f3)
    check_pass "git is installed (version $GIT_VERSION)"
else
    check_fail "git is not installed"
fi

if command -v bash &> /dev/null; then
    check_pass "bash is available (version $BASH_VERSION)"
else
    check_fail "bash is not available"
fi

# Check 7: Repository Size and Health
print_section "Repository Health"

# Count files
TOTAL_FILES=$(find . -type f ! -path "./.git/*" -print0 | grep -zc .)
check_pass "Repository contains $TOTAL_FILES file(s)"

# Check for large files
LARGE_FILES=$( (find . -type f ! -path "./.git/*" -size +1M -print0 | grep -zc . || echo "0") 2>/dev/null | head -1)
if [ "$LARGE_FILES" -eq 0 ]; then
    check_pass "No large files (>1MB) found"
else
    check_warn "$LARGE_FILES large file(s) found (>1MB)"
fi

# Summary
print_section "Health Check Summary"

TOTAL_CHECKS=$((PASS_COUNT + FAIL_COUNT + WARN_COUNT))

echo ""
echo "  Total Checks: $TOTAL_CHECKS"
echo -e "  ${GREEN}Passed:${NC} $PASS_COUNT"
echo -e "  ${RED}Failed:${NC} $FAIL_COUNT"
echo -e "  ${YELLOW}Warnings:${NC} $WARN_COUNT"
echo ""

# Calculate health percentage
if [ "$TOTAL_CHECKS" -gt 0 ]; then
    HEALTH_PERCENTAGE=$(( (PASS_COUNT * 100) / TOTAL_CHECKS ))
    
    if [ $HEALTH_PERCENTAGE -ge 90 ]; then
        echo -e "  ${GREEN}System Health: ${HEALTH_PERCENTAGE}% - EXCELLENT${NC}"
    elif [ $HEALTH_PERCENTAGE -ge 75 ]; then
        echo -e "  ${YELLOW}System Health: ${HEALTH_PERCENTAGE}% - GOOD${NC}"
    elif [ $HEALTH_PERCENTAGE -ge 50 ]; then
        echo -e "  ${YELLOW}System Health: ${HEALTH_PERCENTAGE}% - FAIR${NC}"
    else
        echo -e "  ${RED}System Health: ${HEALTH_PERCENTAGE}% - POOR${NC}"
    fi
else
    echo -e "  ${RED}System Health: UNKNOWN${NC}"
fi

echo ""
echo "================================================================"

# Exit with appropriate code based on failures
if [ "$FAIL_COUNT" -gt 0 ]; then
    exit 1
else
    exit 0
fi
