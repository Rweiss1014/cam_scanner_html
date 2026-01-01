# Assets

This directory should contain the following image assets:

## Required Assets

1. **icon.png** (1024 × 1024 px)
   - App icon used for all platforms
   - Should be a square image with no transparency
   - Recommended: Simple, recognizable icon representing document scanning

2. **adaptive-icon.png** (1024 × 1024 px)
   - Android adaptive icon foreground
   - Can be transparent
   - Should work well with different shaped masks (circle, square, rounded square)

3. **splash.png** (1284 × 2778 px)
   - Splash screen shown while app loads
   - Portrait orientation
   - Should have your app branding

4. **favicon.png** (48 × 48 px)
   - Web favicon (if deploying to web)

## Creating Placeholder Assets

You can create simple placeholder assets using:

1. **Online tools**:
   - Canva (canva.com)
   - Figma (figma.com)
   - Adobe Express (express.adobe.com)

2. **Design suggestions**:
   - Use a simple document or scan icon
   - Choose a color scheme (e.g., blue for trust, green for action)
   - Keep it minimal and professional
   - Avoid using purple/violet colors
   - Ensure good contrast for visibility

## Asset Generation

Once you have a single 1024×1024 icon, you can use tools like:
- https://easyappicon.com/
- https://appicon.co/
- https://makeappicon.com/

These will generate all required sizes for iOS and Android.

## Current Status

**⚠️ IMPORTANT**: This project does not include image assets. You must create and add the following files before building:

- `assets/icon.png`
- `assets/adaptive-icon.png`
- `assets/splash.png`
- `assets/favicon.png`

Without these assets, the build will fail. Create simple placeholder images with the dimensions listed above.
