#!/bin/bash

# Botermi - Universal Build Script
# Builds for both Android and iOS platforms

echo "🚀 Starting Universal Build for Botermi..."
echo "📱 Building for Android and iOS platforms"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Check if EAS CLI is installed
if ! command -v eas &> /dev/null; then
    print_error "EAS CLI is not installed!"
    print_status "Installing EAS CLI..."
    npm install -g eas-cli
fi

# Check login status
print_status "Checking EAS authentication..."
if ! eas whoami &> /dev/null; then
    print_error "You are not logged in to EAS!"
    print_status "Please run: eas login"
    exit 1
fi

USER=$(eas whoami 2>/dev/null)
print_success "Logged in as: $USER"

# Build function
build_for_platform() {
    local platform=$1
    local profile=$2
    
    print_status "Starting $platform build with profile: $profile"
    
    if eas build --platform "$platform" --profile "$profile" --non-interactive --no-wait; then
        print_success "$platform build completed successfully!"
        return 0
    else
        print_error "$platform build failed!"
        return 1
    fi
}

# Main build process
main() {
    local profile="${1:-production}"
    
    print_status "Using build profile: $profile"
    print_status "Starting parallel builds..."
    
    # Build Android and iOS simultaneously
    print_status "Building for all platforms..."
    
    if eas build --platform all --profile "$profile" --non-interactive --no-wait; then
        print_success "🎉 All builds completed successfully!"
        print_status "📥 Download your builds from: https://expo.dev/"
        
        # Show build list
        print_status "Recent builds:"
        eas build:list --limit 5
        
    else
        print_error "❌ Build process failed!"
        exit 1
    fi
}

# Parse command line arguments
case "${1:-production}" in
    "production")
        print_status "🏪 Building for App Store & Google Play (Production)"
        main "production"
        ;;
    "preview")
        print_status "🔍 Building preview versions"
        main "preview-all"
        ;;
    "android")
        print_status "🤖 Building Android only"
        build_for_platform "android" "production"
        ;;
    "ios")
        print_status "🍎 Building iOS only"
        build_for_platform "ios" "production"
        ;;
    *)
        echo "Usage: $0 [production|preview|android|ios]"
        echo "  production: Build for App Store & Google Play"
        echo "  preview:    Build preview versions"
        echo "  android:    Build Android only"
        echo "  ios:        Build iOS only"
        exit 1
        ;;
esac

print_success "✨ Build script completed!"
