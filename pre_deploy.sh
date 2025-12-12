#!/bin/bash

# Hyperion AI Pre-Deploy Readiness Script
# Ensures the web and mobile apps are production-ready before a public release

# Allow the script to continue so every gate is evaluated
set +e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

PASS_COUNT=0
FAIL_COUNT=0
WARN_COUNT=0
RUN_BUILDS=true

print_header() {
    echo ""
    echo "================================================================"
    echo "  Hyperion AI Pre-Deploy Checklist"
    echo "  Production readiness verification"
    echo "================================================================"
    echo ""
}

print_section() {
    echo ""
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

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

usage() {
    cat <<EOF
Usage: ./pre_deploy.sh [--skip-builds] [--help]

Options:
  --skip-builds   Skip lint/build execution (useful when dependencies are not installed)
  --help          Show this help message
EOF
}

abs_path() {
    # Portable absolute path resolver (realpath may not exist everywhere)
    if command -v realpath >/dev/null 2>&1; then
        realpath "$1"
    elif command -v readlink >/dev/null 2>&1; then
        readlink -f "$1" 2>/dev/null || echo "$1"
    else
        case "$1" in
            /*) echo "$1" ;;
            *) echo "$(pwd)/$1" ;;
        esac
    fi
}

while [[ $# -gt 0 ]]; do
    case "$1" in
        --skip-builds)
            RUN_BUILDS=false
            ;;
        --help|-h)
            usage
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            usage
            exit 1
            ;;
    esac
    shift
done

print_header

print_section "Core Prerequisites"

if command -v node >/dev/null 2>&1; then
    NODE_VERSION=$(node -v | tr -d 'v')
    NODE_MAJOR=${NODE_VERSION%%.*}
    if [ "$NODE_MAJOR" -ge 18 ]; then
        check_pass "Node.js detected (v$NODE_VERSION)"
    else
        check_fail "Node.js v18+ required (found v$NODE_VERSION)"
    fi
else
    check_fail "Node.js is not installed"
fi

if command -v npm >/dev/null 2>&1; then
    NPM_VERSION=$(npm -v)
    check_pass "npm detected (v$NPM_VERSION)"
else
    check_fail "npm is not installed"
fi

print_section "Configuration & Secrets"

ENV_READY_WEB=false
ENV_READY_APP=false

check_env() {
    local label="$1"
    local file_path="$2"
    shift 2
    local keys=("$@")
    local missing=0

    for key in "${keys[@]}"; do
        local value=""
        if [ -n "${!key}" ]; then
            value="${!key}"
        elif [ -f "$file_path" ]; then
            # Parse the line matching the key with whitespace tolerance and no regex expansion
            value=$(awk -F'=' -v k="$key" '
                $0 ~ "^[[:space:]]*"k"[[:space:]]*=" {
                    sub(/^[[:space:]]*[^=]*=/, "");
                    gsub(/^"/, "");
                    gsub(/"$/, "");
                    print;
                    exit
                }' "$file_path")
        fi

        if [ -z "$value" ]; then
            missing=1
            check_fail "$label: missing value for ${key} (set env var or update ${file_path})"
        fi
    done

    if [ "$missing" -eq 0 ]; then
        check_pass "$label: all required values present"
        return 0
    fi

    return 1
}

if check_env "Web env" "web/.env.local" \
    NEXT_PUBLIC_SUPABASE_URL \
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY; then
    ENV_READY_WEB=true
fi

if check_env "Mobile env" "app/.env" \
    EXPO_PUBLIC_SUPABASE_URL \
    EXPO_PUBLIC_SUPABASE_KEY; then
    ENV_READY_APP=true
fi

print_section "System Health"

if [ -x "./health_check.sh" ]; then
    HEALTH_LOG=$(mktemp)
    ./health_check.sh >"$HEALTH_LOG" 2>&1
    if [ $? -eq 0 ]; then
        check_pass "Repository health check succeeded"
        rm -f "$HEALTH_LOG"
    else
        check_fail "Health check reported issues. Review $(abs_path "$HEALTH_LOG")"
    fi
else
    check_warn "health_check.sh is missing or not executable"
fi

print_section "Build Verification"

if $RUN_BUILDS; then
    if [ -d "web" ]; then
        if [ ! -r "web" ] || [ ! -x "web" ]; then
            check_fail "Web app directory exists but is not accessible."
        elif $ENV_READY_WEB; then
            if [ -d "web/node_modules" ]; then
                WEB_BUILD_LOG=$(mktemp)
                (cd web && npm run lint) >"$WEB_BUILD_LOG" 2>&1
                LINT_STATUS=$?
                if [ $LINT_STATUS -eq 0 ]; then
                    (cd web && npm run build) >>"$WEB_BUILD_LOG" 2>&1
                    BUILD_STATUS=$?
                else
                    BUILD_STATUS=$LINT_STATUS
                fi

                if [ $LINT_STATUS -ne 0 ]; then
                    check_fail "Web app lint failed. Inspect $(abs_path "$WEB_BUILD_LOG")"
                elif [ $BUILD_STATUS -ne 0 ]; then
                    check_fail "Web app build failed. Inspect $(abs_path "$WEB_BUILD_LOG")"
                else
                    check_pass "Web app lint & build completed (see $(abs_path "$WEB_BUILD_LOG"))"
                    rm -f "$WEB_BUILD_LOG"
                fi
            else
                check_warn "web/node_modules not found. Run 'npm install' in web/ before building."
            fi
        else
            check_warn "Skipping web build until Supabase env values are configured."
        fi
    else
        check_warn "Web app directory missing; skipping web build."
    fi

    if [ -d "app" ]; then
        if [ ! -r "app" ] || [ ! -x "app" ]; then
            check_fail "Mobile app directory exists but is not accessible."
        elif $ENV_READY_APP; then
            if [ -d "app/node_modules" ]; then
                APP_CHECK_LOG=$(mktemp)
                (cd app && npx expo-doctor) >"$APP_CHECK_LOG" 2>&1
                if [ $? -eq 0 ]; then
                    check_pass "Expo doctor completed (see $(abs_path "$APP_CHECK_LOG"))"
                    rm -f "$APP_CHECK_LOG"
                else
                    check_fail "Expo doctor reported issues. Review $(abs_path "$APP_CHECK_LOG")"
                fi
            else
                check_warn "app/node_modules not found. Run 'npm install' in app/ before running Expo checks."
            fi
        else
            check_warn "Skipping mobile checks until Expo env values are configured."
        fi
    else
        check_warn "Mobile app directory missing; skipping mobile checks."
    fi
else
    check_warn "Build execution skipped (--skip-builds). Re-run without the flag to lint/build."
fi

print_section "Pre-Deploy Summary"

TOTAL_CHECKS=$((PASS_COUNT + FAIL_COUNT + WARN_COUNT))

echo ""
echo "  Total Checks: $TOTAL_CHECKS"
echo -e "  ${GREEN}Passed:${NC} $PASS_COUNT"
echo -e "  ${RED}Failed:${NC} $FAIL_COUNT"
echo -e "  ${YELLOW}Warnings:${NC} $WARN_COUNT"
echo ""

if [ "$FAIL_COUNT" -gt 0 ]; then
    echo -e "  ${RED}Status: Blocked for release. Resolve failures before deploying.${NC}"
    exit 1
fi

echo -e "  ${GREEN}Status: Ready for deployment once warnings are addressed.${NC}"
exit 0
