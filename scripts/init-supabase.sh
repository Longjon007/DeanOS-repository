#!/bin/bash

# Supabase Project Initialization Script
# Interactive wizard for creating new Supabase projects with auto-configuration
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
    echo -e "${BLUE}║          ${CYAN}DeanOS Supabase Project Initializer${BLUE}            ║${NC}"
    echo -e "${BLUE}║                                                            ║${NC}"
    echo -e "${BLUE}║  ${NC}Create and configure new Supabase projects${BLUE}              ║${NC}"
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

# Prompt for input with default value
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

# Prompt for yes/no with default
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
    print_success "Supabase CLI is installed: $version"
}

# Check if user is logged in
check_auth() {
    print_section "Authentication Check"
    
    if supabase projects list &> /dev/null; then
        print_success "Already authenticated with Supabase"
        return 0
    else
        print_warn "Not authenticated with Supabase"
        echo ""
        if prompt_yes_no "Would you like to login now?" "y"; then
            supabase login
            if [ $? -eq 0 ]; then
                print_success "Successfully authenticated"
                return 0
            else
                print_error "Authentication failed"
                exit 1
            fi
        else
            print_error "Authentication required to create projects"
            exit 1
        fi
    fi
}

# List available organizations
list_organizations() {
    print_section "Available Organizations"
    
    # Get organizations list
    local orgs_json=$(supabase orgs list --output json 2>&1)
    
    if [ $? -ne 0 ]; then
        print_error "Failed to fetch organizations"
        echo "$orgs_json"
        exit 1
    fi
    
    # Parse and display organizations
    echo "$orgs_json" | jq -r '.[] | "\(.id) - \(.name)"' 2>/dev/null
    
    if [ $? -ne 0 ]; then
        print_warn "Could not parse organizations. Using default."
    fi
}

# Get available regions
get_regions() {
    cat << 'EOF'
Available Regions:
  us-east-1      - US East (N. Virginia)
  us-west-1      - US West (N. California)
  us-west-2      - US West (Oregon)
  eu-west-1      - Europe (Ireland)
  eu-west-2      - Europe (London)
  eu-central-1   - Europe (Frankfurt)
  ap-southeast-1 - Asia Pacific (Singapore)
  ap-northeast-1 - Asia Pacific (Tokyo)
  ap-southeast-2 - Asia Pacific (Sydney)
  sa-east-1      - South America (São Paulo)
EOF
}

# Create new Supabase project
create_project() {
    print_section "Project Configuration"
    
    # Get project name
    local project_name
    project_name=$(prompt_input "Enter project name" "my-deanos-project")
    
    # Get organization ID
    echo ""
    list_organizations
    echo ""
    local org_id
    org_id=$(prompt_input "Enter organization ID" "")
    
    # Get database password
    echo ""
    print_warn "Database password must be at least 6 characters"
    local db_password
    echo -n -e "${CYAN}Enter database password${NC}: "
    read -s db_password
    echo ""
    
    if [ ${#db_password} -lt 6 ]; then
        print_error "Password must be at least 6 characters"
        exit 1
    fi
    
    # Get region
    echo ""
    get_regions
    echo ""
    local region
    region=$(prompt_input "Enter region" "us-east-1")
    
    # Get plan (free/pro)
    echo ""
    local plan
    if prompt_yes_no "Use Pro plan? (default is Free)" "n"; then
        plan="pro"
    else
        plan="free"
    fi
    
    # Confirm creation
    print_section "Project Summary"
    echo ""
    echo -e "  ${CYAN}Project Name:${NC} $project_name"
    echo -e "  ${CYAN}Organization:${NC} $org_id"
    echo -e "  ${CYAN}Region:${NC} $region"
    echo -e "  ${CYAN}Plan:${NC} $plan"
    echo ""
    
    if ! prompt_yes_no "Create this project?" "y"; then
        print_warn "Project creation cancelled"
        exit 0
    fi
    
    # Create the project
    print_section "Creating Project"
    
    # Build command array to avoid eval security risk
    local cmd_args=("supabase" "projects" "create" "$project_name" "--db-password" "$db_password" "--region" "$region")
    
    if [ -n "$org_id" ]; then
        cmd_args+=("--org-id" "$org_id")
    fi
    
    if [ "$plan" = "pro" ]; then
        cmd_args+=("--plan" "pro")
    fi
    
    print_info "Creating project... (this may take a few minutes)"
    
    local output
    output=$("${cmd_args[@]}" 2>&1)
    
    if [ $? -eq 0 ]; then
        print_success "Project created successfully!"
        echo ""
        echo "$output"
        
        # Extract project reference - try multiple patterns
        local project_ref=$(echo "$output" | grep -oP '(?<=Created a new project ).*' | awk '{print $1}' | tr -d '.')
        
        if [ -z "$project_ref" ]; then
            # Try alternative parsing - match typical Supabase project ref format
            project_ref=$(echo "$output" | grep -oP '\b[a-z]{20}\b' | head -n1)
        fi
        
        # Validate project reference format (20 lowercase letters)
        if [ -n "$project_ref" ] && [[ "$project_ref" =~ ^[a-z]{20}$ ]]; then
            echo ""
            print_success "Project Reference: $project_ref"
            
            # Generate configuration
            generate_config "$project_ref" "$project_name" "$region" "$db_password"
        else
            print_warn "Could not extract valid project reference automatically"
            echo ""
            echo "Please manually retrieve the project reference from:"
            echo "  https://app.supabase.com/projects"
        fi
    else
        print_error "Failed to create project"
        echo "$output"
        exit 1
    fi
}

# Generate configuration files
generate_config() {
    local project_ref="$1"
    local project_name="$2"
    local region="$3"
    local db_password="$4"
    
    print_section "Configuration Generation"
    
    if ! prompt_yes_no "Generate environment configuration files?" "y"; then
        return 0
    fi
    
    # Get API keys
    print_info "Fetching API keys..."
    local api_keys=$(supabase projects api-keys --project-ref "$project_ref" 2>&1)
    
    # Extract keys (this is simplified - actual parsing may need adjustment)
    local anon_key=$(echo "$api_keys" | grep -oP '(?<=anon: ).*' || echo "YOUR_ANON_KEY")
    local service_key=$(echo "$api_keys" | grep -oP '(?<=service_role: ).*' || echo "YOUR_SERVICE_KEY")
    
    # Determine output directory
    local config_dir
    config_dir=$(prompt_input "Enter configuration output directory" ".")
    
    # Create directory if it doesn't exist
    mkdir -p "$config_dir"
    
    # Generate .env.example
    local env_file="$config_dir/.env.supabase.example"
    
    # URL encode password for safe use in connection strings
    local encoded_password=$(url_encode "$db_password")
    
    cat > "$env_file" << EOF
# Supabase Configuration for $project_name
# Generated by DeanOS Supabase Initializer

# Project Information
SUPABASE_PROJECT_REF=$project_ref
SUPABASE_PROJECT_NAME=$project_name
SUPABASE_REGION=$region

# Supabase URLs
NEXT_PUBLIC_SUPABASE_URL=https://${project_ref}.supabase.co
SUPABASE_URL=https://${project_ref}.supabase.co

# API Keys
NEXT_PUBLIC_SUPABASE_ANON_KEY=$anon_key
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=$anon_key
SUPABASE_SERVICE_ROLE_KEY=$service_key

# Database URLs for Prisma
DATABASE_URL=postgres://postgres:${encoded_password}@db.${project_ref}.supabase.co:6543/postgres?pgbouncer=true
DIRECT_URL=postgres://postgres:${encoded_password}@db.${project_ref}.supabase.co:5432/postgres

# Mobile/Expo Configuration
EXPO_PUBLIC_SUPABASE_URL=https://${project_ref}.supabase.co
EXPO_PUBLIC_SUPABASE_KEY=$anon_key
EOF
    
    print_success "Configuration file created: $env_file"
    
    # Update supabase/config.toml if it exists
    if [ -f "supabase/config.toml" ]; then
        if prompt_yes_no "Update supabase/config.toml with new project reference?" "y"; then
            # Validate project_ref format before using in sed
            if [[ "$project_ref" =~ ^[a-z]{20}$ ]]; then
                # Backup existing config
                cp supabase/config.toml supabase/config.toml.backup
                
                # Update project_id (project_ref is validated, safe to use)
                sed -i "s/project_id = \".*\"/project_id = \"$project_ref\"/" supabase/config.toml
                
                print_success "Updated supabase/config.toml (backup saved as config.toml.backup)"
            else
                print_error "Invalid project reference format, skipping config.toml update"
            fi
        fi
    fi
    
    print_section "Next Steps"
    echo ""
    echo "1. Copy the configuration to your .env files:"
    echo -e "   ${YELLOW}cp $env_file .env.local${NC}"
    echo ""
    echo "2. Review and update the configuration as needed"
    echo ""
    echo "3. Initialize your database schema:"
    echo -e "   ${YELLOW}supabase db push${NC}"
    echo ""
    echo "4. Or link to your local project and run migrations:"
    echo -e "   ${YELLOW}supabase link --project-ref $project_ref${NC}"
    echo -e "   ${YELLOW}supabase db push${NC}"
    echo ""
    echo "5. View your project dashboard:"
    echo -e "   ${CYAN}https://app.supabase.com/project/$project_ref${NC}"
    echo ""
}

# Main execution
main() {
    print_header
    
    check_supabase_cli
    check_auth
    create_project
    
    echo ""
    print_success "Project initialization complete!"
    echo ""
}

# Run main function
main
