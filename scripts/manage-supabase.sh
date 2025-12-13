#!/bin/bash

# Supabase Project Management Script
# Interactive tool for managing existing Supabase projects
# Part of DeanOS ecosystem

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m' # No Color

# Print header
print_header() {
    echo ""
    echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║                                                            ║${NC}"
    echo -e "${BLUE}║          ${CYAN}DeanOS Supabase Project Manager${BLUE}                ║${NC}"
    echo -e "${BLUE}║                                                            ║${NC}"
    echo -e "${BLUE}║  ${NC}Manage and monitor your Supabase projects${BLUE}               ║${NC}"
    echo -e "${BLUE}║                                                            ║${NC}"
    echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
    echo ""
}

# Print section header
print_section() {
    echo ""
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

# Success message
print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

# Error message
print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Warning message
print_warn() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# Info message
print_info() {
    echo -e "${CYAN}ℹ${NC} $1"
}

# Prompt for input
prompt_input() {
    local prompt="$1"
    local default="$2"
    local result
    
    if [ -n "$default" ]; then
        echo -e -n "${CYAN}${prompt}${NC} ${YELLOW}[${default}]${NC}: "
    else
        echo -e -n "${CYAN}${prompt}${NC}: "
    fi
    
    read -r result
    echo "${result:-$default}"
}

# Prompt for yes/no
prompt_yes_no() {
    local prompt="$1"
    local default="$2"
    local result
    
    if [ "$default" = "y" ]; then
        echo -e -n "${CYAN}${prompt}${NC} ${YELLOW}[Y/n]${NC}: "
    else
        echo -e -n "${CYAN}${prompt}${NC} ${YELLOW}[y/N]${NC}: "
    fi
    
    read -r result
    result="${result:-$default}"
    
    if [[ "$result" =~ ^[Yy]$ ]]; then
        return 0
    else
        return 1
    fi
}

# URL encode a string for safe use in database URLs
url_encode() {
    local string="$1"
    local encoded=""
    local length="${#string}"
    
    for (( i=0; i<length; i++ )); do
        local c="${string:i:1}"
        case "$c" in
            [a-zA-Z0-9.~_-]) encoded+="$c" ;;
            *) printf -v hex '%%%02X' "'$c"; encoded+="$hex" ;;
        esac
    done
    
    echo "$encoded"
}

# Validate project reference format
validate_project_ref() {
    local ref="$1"
    if [[ "$ref" =~ ^[a-z]{20}$ ]]; then
        return 0
    else
        return 1
    fi
}

# Check if Supabase CLI is installed
check_supabase_cli() {
    if ! command -v supabase &> /dev/null; then
        print_error "Supabase CLI is not installed"
        echo ""
        echo "Please install the Supabase CLI first:"
        echo ""
        echo "  npm install -g supabase"
        echo ""
        echo "Or using Homebrew:"
        echo "  brew install supabase/tap/supabase"
        echo ""
        echo "For more information: https://supabase.com/docs/guides/cli"
        exit 1
    fi
    
    local version=$(supabase --version 2>&1 | head -n1)
    print_success "Supabase CLI: $version"
}

# Check if user is authenticated
check_auth() {
    if ! supabase projects list &> /dev/null; then
        print_error "Not authenticated with Supabase"
        echo ""
        echo "Please login first:"
        echo "  supabase login"
        exit 1
    fi
}

# List all projects
list_projects() {
    print_section "Available Projects"
    
    local projects=$(supabase projects list 2>&1)
    
    if [ $? -ne 0 ]; then
        print_error "Failed to fetch projects"
        echo "$projects"
        return 1
    fi
    
    echo "$projects"
    echo ""
}

# Get project details
get_project_details() {
    local project_ref="$1"
    
    print_section "Project Details: $project_ref"
    
    # Get project info
    local project_info=$(supabase projects list 2>&1 | grep "$project_ref")
    
    if [ -z "$project_info" ]; then
        print_error "Project not found: $project_ref"
        return 1
    fi
    
    echo "$project_info"
    echo ""
    
    # Get project URL
    local project_url="https://${project_ref}.supabase.co"
    echo -e "${CYAN}Project URL:${NC} $project_url"
    echo -e "${CYAN}Dashboard:${NC} https://app.supabase.com/project/$project_ref"
    echo ""
}

# Display API keys
show_api_keys() {
    local project_ref="$1"
    
    print_section "API Keys"
    
    print_info "Fetching API keys..."
    
    local api_keys=$(supabase projects api-keys --project-ref "$project_ref" 2>&1)
    
    if [ $? -ne 0 ]; then
        print_error "Failed to fetch API keys"
        echo "$api_keys"
        return 1
    fi
    
    echo ""
    echo "$api_keys"
    echo ""
    
    print_warn "Keep these keys secure! Never commit them to version control."
}

# Check project health
check_project_health() {
    local project_ref="$1"
    
    print_section "Project Health Check"
    
    local pass=0
    local fail=0
    local warn=0
    
    # Check if project exists
    print_info "Checking project status..."
    if supabase projects list 2>&1 | grep -q "$project_ref"; then
        print_success "Project exists and is accessible"
        ((pass++))
    else
        print_error "Project not found or not accessible"
        ((fail++))
        return 1
    fi
    
    # Check API endpoint
    print_info "Testing API endpoint..."
    local api_url="https://${project_ref}.supabase.co"
    if curl -s -o /dev/null -w "%{http_code}" "$api_url" | grep -q "200\|404"; then
        print_success "API endpoint is reachable"
        ((pass++))
    else
        print_warn "API endpoint may not be fully initialized yet"
        ((warn++))
    fi
    
    # Check if linked locally
    print_info "Checking local project link..."
    if [ -f ".supabase/config.toml" ]; then
        if grep -q "$project_ref" .supabase/config.toml 2>/dev/null; then
            print_success "Project is linked locally"
            ((pass++))
        else
            print_warn "Different project linked locally"
            ((warn++))
        fi
    else
        print_warn "No local project link found"
        ((warn++))
    fi
    
    # Summary
    echo ""
    print_section "Health Summary"
    echo -e "${GREEN}Passed:${NC}   $pass"
    echo -e "${RED}Failed:${NC}   $fail"
    echo -e "${YELLOW}Warnings:${NC} $warn"
    echo ""
    
    if [ $fail -eq 0 ] && [ $warn -eq 0 ]; then
        print_success "Project health: EXCELLENT"
    elif [ $fail -eq 0 ]; then
        print_success "Project health: GOOD"
    else
        print_error "Project health: NEEDS ATTENTION"
    fi
}

# Link project locally
link_project() {
    local project_ref="$1"
    
    print_section "Link Project Locally"
    
    if [ -f ".supabase/config.toml" ]; then
        local current_ref=$(grep "project_id" .supabase/config.toml | cut -d'"' -f2)
        if [ -n "$current_ref" ]; then
            print_warn "Already linked to project: $current_ref"
            if ! prompt_yes_no "Unlink and link to $project_ref instead?" "n"; then
                return 0
            fi
        fi
    fi
    
    print_info "Linking project..."
    
    local output=$(supabase link --project-ref "$project_ref" 2>&1)
    
    if [ $? -eq 0 ]; then
        print_success "Successfully linked to project"
        echo ""
        echo "$output"
    else
        print_error "Failed to link project"
        echo "$output"
        return 1
    fi
}

# Generate environment configuration
generate_env_config() {
    local project_ref="$1"
    
    print_section "Generate Environment Configuration"
    
    # Get API keys
    print_info "Fetching API keys..."
    local api_keys=$(supabase projects api-keys --project-ref "$project_ref" 2>&1)
    
    if [ $? -ne 0 ]; then
        print_error "Failed to fetch API keys"
        return 1
    fi
    
    # Extract keys (simplified parsing)
    local anon_key=$(echo "$api_keys" | grep -oP '(?<=anon: ).*' || echo "YOUR_ANON_KEY")
    local service_key=$(echo "$api_keys" | grep -oP '(?<=service_role: ).*' || echo "YOUR_SERVICE_KEY")
    
    # Get output filename
    local output_file
    output_file=$(prompt_input "Output filename" ".env.supabase")
    
    # Get database password
    echo ""
    print_warn "Database password is required for Prisma DATABASE_URL"
    echo -n -e "${CYAN}Enter database password (or leave blank to skip)${NC}: "
    read -s db_password
    echo ""
    
    # Generate configuration
    cat > "$output_file" << EOF
# Supabase Configuration
# Generated by DeanOS Supabase Manager

# Project Information
SUPABASE_PROJECT_REF=$project_ref

# Supabase URLs
NEXT_PUBLIC_SUPABASE_URL=https://${project_ref}.supabase.co
SUPABASE_URL=https://${project_ref}.supabase.co

# API Keys
NEXT_PUBLIC_SUPABASE_ANON_KEY=$anon_key
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=$anon_key
SUPABASE_SERVICE_ROLE_KEY=$service_key

# Mobile/Expo Configuration
EXPO_PUBLIC_SUPABASE_URL=https://${project_ref}.supabase.co
EXPO_PUBLIC_SUPABASE_KEY=$anon_key
EOF
    
    # Add database URLs if password provided
    if [ -n "$db_password" ]; then
        # URL encode password for safe use in connection strings
        local encoded_password=$(url_encode "$db_password")
        cat >> "$output_file" << EOF

# Database URLs for Prisma
DATABASE_URL=postgres://postgres:${encoded_password}@db.${project_ref}.supabase.co:6543/postgres?pgbouncer=true
DIRECT_URL=postgres://postgres:${encoded_password}@db.${project_ref}.supabase.co:5432/postgres
EOF
    else
        cat >> "$output_file" << EOF

# Database URLs for Prisma (add your password)
# DATABASE_URL=postgres://postgres:YOUR_PASSWORD@db.${project_ref}.supabase.co:6543/postgres?pgbouncer=true
# DIRECT_URL=postgres://postgres:YOUR_PASSWORD@db.${project_ref}.supabase.co:5432/postgres
EOF
    fi
    
    print_success "Configuration saved to: $output_file"
    echo ""
    print_warn "Remember to copy this to .env.local and keep it secure!"
}

# Run migrations
run_migrations() {
    local project_ref="$1"
    
    print_section "Database Migrations"
    
    # Check if migrations exist
    if [ ! -d "supabase/migrations" ] || [ -z "$(ls -A supabase/migrations/*.sql 2>/dev/null)" ]; then
        print_warn "No migrations found in supabase/migrations/"
        return 0
    fi
    
    # List migrations
    local migration_count=$(ls supabase/migrations/*.sql 2>/dev/null | wc -l)
    print_info "Found $migration_count migration file(s)"
    echo ""
    ls -1 supabase/migrations/*.sql 2>/dev/null | xargs -n1 basename
    echo ""
    
    if ! prompt_yes_no "Push these migrations to the project?" "y"; then
        return 0
    fi
    
    print_info "Pushing migrations..."
    
    local output=$(supabase db push --project-ref "$project_ref" 2>&1)
    
    if [ $? -eq 0 ]; then
        print_success "Migrations applied successfully"
        echo ""
        echo "$output"
    else
        print_error "Failed to apply migrations"
        echo "$output"
        return 1
    fi
}

# Main menu
show_menu() {
    echo ""
    echo -e "${CYAN}═══════════════════════════════════════════════════${NC}"
    echo -e "${CYAN}  Main Menu${NC}"
    echo -e "${CYAN}═══════════════════════════════════════════════════${NC}"
    echo ""
    echo "  1. List all projects"
    echo "  2. View project details"
    echo "  3. Show API keys"
    echo "  4. Check project health"
    echo "  5. Link project locally"
    echo "  6. Generate environment configuration"
    echo "  7. Run migrations"
    echo "  8. Exit"
    echo ""
}

# Handle menu selection
handle_selection() {
    local choice="$1"
    local project_ref=""
    
    case $choice in
        1)
            list_projects
            ;;
        2)
            project_ref=$(prompt_input "Enter project reference")
            if validate_project_ref "$project_ref"; then
                get_project_details "$project_ref"
            else
                print_error "Invalid project reference format (expected 20 lowercase letters)"
            fi
            ;;
        3)
            project_ref=$(prompt_input "Enter project reference")
            if validate_project_ref "$project_ref"; then
                show_api_keys "$project_ref"
            else
                print_error "Invalid project reference format (expected 20 lowercase letters)"
            fi
            ;;
        4)
            project_ref=$(prompt_input "Enter project reference")
            if validate_project_ref "$project_ref"; then
                check_project_health "$project_ref"
            else
                print_error "Invalid project reference format (expected 20 lowercase letters)"
            fi
            ;;
        5)
            project_ref=$(prompt_input "Enter project reference")
            if validate_project_ref "$project_ref"; then
                link_project "$project_ref"
            else
                print_error "Invalid project reference format (expected 20 lowercase letters)"
            fi
            ;;
        6)
            project_ref=$(prompt_input "Enter project reference")
            if validate_project_ref "$project_ref"; then
                generate_env_config "$project_ref"
            else
                print_error "Invalid project reference format (expected 20 lowercase letters)"
            fi
            ;;
        7)
            project_ref=$(prompt_input "Enter project reference")
            if validate_project_ref "$project_ref"; then
                run_migrations "$project_ref"
            else
                print_error "Invalid project reference format (expected 20 lowercase letters)"
            fi
            ;;
        8)
            echo ""
            print_success "Goodbye!"
            echo ""
            exit 0
            ;;
        *)
            print_error "Invalid option"
            ;;
    esac
}

# Main execution
main() {
    print_header
    
    check_supabase_cli
    check_auth
    
    # Interactive mode
    while true; do
        show_menu
        choice=$(prompt_input "Select an option (1-8)" "1")
        handle_selection "$choice"
        
        echo ""
        if ! prompt_yes_no "Continue?" "y"; then
            echo ""
            print_success "Goodbye!"
            echo ""
            break
        fi
    done
}

# Run main function
main
