# Quick Setup Guide

Follow these steps to get the document scanner app running on your machine.

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Create Asset Files

Before running the app, you need to create placeholder image assets. Create the `assets/` directory and add these files:

1. **icon.png** (1024 × 1024 px) - App icon
2. **adaptive-icon.png** (1024 × 1024 px) - Android adaptive icon
3. **splash.png** (1284 × 2778 px) - Splash screen
4. **favicon.png** (48 × 48 px) - Web favicon

See `assets/README.md` for detailed specifications and design suggestions.

**Quick Placeholder Creation:**
You can create simple solid-color PNG files with the required dimensions using any image editor, or use online tools like:
- https://placeholder.com/
- https://dummyimage.com/

Example using ImageMagick (if installed):
```bash
mkdir -p assets
convert -size 1024x1024 xc:#007AFF assets/icon.png
convert -size 1024x1024 xc:#007AFF assets/adaptive-icon.png
convert -size 1284x2778 xc:#FFFFFF assets/splash.png
convert -size 48x48 xc:#007AFF assets/favicon.png
```

## Step 3: Prebuild Native Projects

The document scanner plugin requires native modules, so you need to generate the native iOS and Android projects:

```bash
npx expo prebuild
```

This creates `ios/` and `android/` directories with native code.

## Step 4: Start Development Server

```bash
npx expo start --dev-client
```

## Step 5: Run on Device/Emulator

### For iOS (Mac only):
```bash
npx expo run:ios
```

### For Android:
```bash
npx expo run:android
```

Make sure you have:
- **iOS**: Xcode installed with iOS Simulator
- **Android**: Android Studio with an emulator running, or a physical device connected

## Step 6: Start Scanning!

Once the app launches:
1. Tap the **Scan** tab
2. Press **Scan Document**
3. Grant camera permissions
4. Point at a document and scan
5. Review, apply filters, and save

## Troubleshooting

### "Command not found: expo"
Install Expo CLI globally:
```bash
npm install -g expo-cli
```

### "Unable to resolve module"
Clean and reinstall:
```bash
npm run clean
rm -rf node_modules
npm install
npx expo prebuild
```

### Scanner not working
You must use a custom development client (not Expo Go). Make sure you ran:
```bash
npx expo run:ios
# or
npx expo run:android
```

### Android build fails
Make sure Android SDK is configured:
1. Open Android Studio
2. Go to Tools → SDK Manager
3. Install Android SDK Platform-Tools and Build-Tools

### iOS build fails
Make sure Xcode command-line tools are installed:
```bash
xcode-select --install
```

## Building for Production

See the main **README.md** for detailed production build instructions using EAS Build.

Quick command:
```bash
# Install EAS CLI
npm install -g eas-cli

# Login
eas login

# Configure
eas build:configure

# Build
eas build --platform ios --profile production
eas build --platform android --profile production
```

## Next Steps

- Customize the UI colors and styling
- Add your own app icons and branding
- Configure bundle identifiers in `app.json`
- Set up EAS Build for production releases

For more details, see the full **README.md**.
