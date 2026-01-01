#!/bin/bash

# Script to create placeholder image assets for the Expo app
# This creates simple solid-color placeholder images

echo "Creating placeholder assets..."

# Create assets directory if it doesn't exist
mkdir -p assets

# Check if ImageMagick is installed
if command -v convert &> /dev/null; then
    echo "Using ImageMagick to create assets..."

    # Create icon.png (1024x1024)
    convert -size 1024x1024 xc:#007AFF -gravity center \
        -pointsize 200 -fill white -annotate +0+0 "📄" \
        assets/icon.png
    echo "✓ Created assets/icon.png"

    # Create adaptive-icon.png (1024x1024)
    convert -size 1024x1024 xc:#007AFF -gravity center \
        -pointsize 200 -fill white -annotate +0+0 "📄" \
        assets/adaptive-icon.png
    echo "✓ Created assets/adaptive-icon.png"

    # Create splash.png (1284x2778)
    convert -size 1284x2778 xc:#FFFFFF -gravity center \
        -pointsize 100 -fill #007AFF -annotate +0-200 "Document Scanner" \
        -pointsize 300 -fill #007AFF -annotate +0+200 "📄" \
        assets/splash.png
    echo "✓ Created assets/splash.png"

    # Create favicon.png (48x48)
    convert -size 48x48 xc:#007AFF -gravity center \
        -pointsize 30 -fill white -annotate +0+0 "📄" \
        assets/favicon.png
    echo "✓ Created assets/favicon.png"

    echo ""
    echo "✅ All placeholder assets created successfully!"
    echo ""
    echo "Note: These are basic placeholder images."
    echo "Replace them with proper designs before publishing."

else
    echo "ImageMagick not found. Creating simple solid-color placeholders..."

    # Fallback: Create simple instructions
    echo ""
    echo "⚠️  ImageMagick is not installed."
    echo ""
    echo "Please create the following image files manually:"
    echo "  - assets/icon.png (1024 × 1024 px)"
    echo "  - assets/adaptive-icon.png (1024 × 1024 px)"
    echo "  - assets/splash.png (1284 × 2778 px)"
    echo "  - assets/favicon.png (48 × 48 px)"
    echo ""
    echo "You can use online tools like:"
    echo "  - https://placeholder.com/"
    echo "  - https://www.canva.com/"
    echo "  - https://www.figma.com/"
    echo ""
    echo "Or install ImageMagick and run this script again:"
    echo "  macOS: brew install imagemagick"
    echo "  Ubuntu: sudo apt-get install imagemagick"
    echo "  Windows: choco install imagemagick"

fi
