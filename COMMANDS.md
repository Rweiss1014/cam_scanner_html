# Command Reference

Quick reference for all commands you'll need to develop and build the Document Scanner app.

## Initial Setup

```bash
# Install dependencies
npm install

# Create placeholder assets (if you have ImageMagick)
chmod +x create-assets.sh
./create-assets.sh

# Generate native iOS and Android projects
npx expo prebuild
```

## Development

```bash
# Start development server with custom dev client
npx expo start --dev-client

# Start development server (alternative)
npm start

# Run on iOS Simulator (Mac only)
npx expo run:ios
# or
npm run ios

# Run on Android Emulator/Device
npx expo run:android
# or
npm run android

# Clear Metro bundler cache
npx expo start --clear

# Clean and regenerate native projects
npx expo prebuild --clean
# or
npm run clean
```

## Troubleshooting

```bash
# Complete clean reinstall
rm -rf node_modules
rm -rf ios android
rm -rf .expo
npm install
npx expo prebuild

# Fix package issues
npm audit fix

# Check Expo doctor
npx expo-doctor

# Rebuild native projects
npx expo prebuild --clean
```

## Production Builds (EAS)

```bash
# Install EAS CLI globally
npm install -g eas-cli

# Login to Expo account
eas login

# Configure EAS build
eas build:configure

# Build for iOS (production)
eas build --platform ios --profile production

# Build for iOS (internal testing)
eas build --platform ios --profile preview

# Build for Android (production - AAB)
eas build --platform android --profile production

# Build for Android (internal testing - APK)
eas build --platform android --profile preview

# Build for both platforms
eas build --platform all --profile production

# Check build status
eas build:list

# Submit to App Store
eas submit --platform ios

# Submit to Google Play
eas submit --platform android
```

## Debugging

```bash
# View iOS logs
npx react-native log-ios

# View Android logs
npx react-native log-android

# or use adb directly
adb logcat

# Inspect element on iOS
npx react-devtools

# Inspect network requests
npx react-native debugger
```

## Testing

```bash
# Run type checking
npx tsc --noEmit

# Format code (if using Prettier)
npx prettier --write .

# Lint code (if using ESLint)
npx eslint .
```

## Asset Management

```bash
# Create placeholder assets with ImageMagick
./create-assets.sh

# Create assets manually (macOS)
mkdir -p assets
# Then add your PNG files to the assets/ directory

# Verify asset sizes
file assets/*.png
```

## Git Commands

```bash
# Initialize git repository
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit: Document Scanner App"

# Add remote
git remote add origin YOUR_REPO_URL

# Push to GitHub
git push -u origin main
```

## Environment

```bash
# Check Node version
node --version

# Check npm version
npm --version

# Check Expo CLI version
npx expo --version

# Check React Native version
npx react-native --version

# Check EAS CLI version
eas --version

# View environment info
npx react-native info
```

## Useful Shortcuts (During Development)

When the development server is running, press:

- `i` - Open iOS Simulator
- `a` - Open Android Emulator
- `r` - Reload app
- `m` - Toggle menu
- `d` - Open developer menu
- `j` - Open debugger (Chrome DevTools)
- `?` - Show all commands

## Package Management

```bash
# Add a new package
npm install package-name

# Add a dev dependency
npm install --save-dev package-name

# Remove a package
npm uninstall package-name

# Update all packages
npm update

# Check outdated packages
npm outdated

# Audit security vulnerabilities
npm audit
```

## Platform-Specific Commands

### iOS (Mac only)

```bash
# Install CocoaPods dependencies
cd ios && pod install && cd ..

# Clean iOS build
cd ios && xcodebuild clean && cd ..

# Open in Xcode
xed ios

# Simulator management
xcrun simctl list devices

# Reset iOS Simulator
xcrun simctl erase all
```

### Android

```bash
# Clean Android build
cd android && ./gradlew clean && cd ..

# Open in Android Studio
studio android

# List connected devices
adb devices

# Reverse port for debugging
adb reverse tcp:8081 tcp:8081

# Uninstall app
adb uninstall com.docscanner.app

# Clear app data
adb shell pm clear com.docscanner.app
```

## Quick Start (TL;DR)

```bash
# One-time setup
npm install
./create-assets.sh  # or create assets manually
npx expo prebuild

# Daily development
npx expo start --dev-client
# Press 'i' for iOS or 'a' for Android

# Building for release
eas login
eas build --platform all --profile production
```

## Common Issues & Fixes

### "Unable to resolve module"
```bash
npx expo start --clear
# or
rm -rf node_modules && npm install
```

### "Could not find iPhone Simulator"
```bash
# Make sure Xcode is installed
xcode-select --install
```

### "Android SDK not found"
```bash
# Set ANDROID_HOME environment variable
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

### "Expo Go is not supported"
```bash
# You must use custom dev client
npx expo run:ios
# or
npx expo run:android
```

## Documentation Links

- Expo Docs: https://docs.expo.dev/
- React Native Docs: https://reactnavigation.org/
- EAS Build: https://docs.expo.dev/build/introduction/
- Document Scanner Plugin: https://github.com/websitebeaver/react-native-document-scanner-plugin

## Support

For issues and questions:
1. Check the README.md
2. Check the SETUP.md
3. Check the IMPLEMENTATION_NOTES.md
4. Search GitHub issues
5. Open a new issue with detailed logs
