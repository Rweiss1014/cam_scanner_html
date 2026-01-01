# Document Scanner App

A professional mobile document scanner built with React Native and Expo. Scan documents, apply filters, organize multi-page documents, and export to PDF.

## Features

- **Document Scanning**: Auto edge detection and cropping with `react-native-document-scanner-plugin`
- **Multi-Page Support**: Scan and organize multiple pages into single documents
- **Professional Filters**: Original, Color, Grayscale, B&W, and Enhance presets
- **Local Storage**: SQLite database with file system storage for offline access
- **PDF Export**: Generate PDFs with customizable page sizes and margins
- **Clean UI**: Modern, intuitive interface with smooth animations

## Tech Stack

- React Native + Expo
- TypeScript
- SQLite for document metadata
- expo-file-system for image storage
- expo-print for PDF generation
- react-native-document-scanner-plugin for scanning

## Prerequisites

- Node.js 18+ and npm/yarn
- iOS Simulator (Mac only) or Android Emulator
- Expo CLI: `npm install -g expo-cli`
- EAS CLI (for production builds): `npm install -g eas-cli`

## Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

## Running the App Locally

### Important: Custom Dev Client Required

The `react-native-document-scanner-plugin` requires native modules that aren't available in Expo Go. You must use a custom development client.

### Initial Setup (First Time Only)

1. **Prebuild the native projects:**

```bash
npx expo prebuild
```

This generates the `ios/` and `android/` directories with native code.

2. **Start the development server:**

```bash
npx expo start --dev-client
```

### Running on iOS (Mac only)

```bash
npx expo run:ios
```

This will:
- Build the custom development client
- Install it on the iOS Simulator
- Launch the app

### Running on Android

```bash
npx expo run:android
```

Make sure you have:
- Android Studio installed
- Android SDK configured
- An Android emulator running OR a physical device connected via USB with USB debugging enabled

### Subsequent Runs

After the initial build, you can use:

```bash
npx expo start --dev-client
```

Then press `i` for iOS or `a` for Android.

## Project Structure

```
├── App.tsx                          # Entry point with navigation
├── src/
│   ├── types.ts                     # TypeScript interfaces
│   ├── database.ts                  # SQLite database service
│   ├── imageProcessing.ts           # Image filters and storage
│   └── screens/
│       ├── ScanScreen.tsx           # Main scan interface
│       ├── ScanPreviewScreen.tsx    # Preview with filters
│       ├── FilesScreen.tsx          # Document list
│       ├── DocumentDetailScreen.tsx # Document viewer & editor
│       └── SettingsScreen.tsx       # Export settings
├── app.json                         # Expo configuration
├── package.json                     # Dependencies
└── tsconfig.json                    # TypeScript config
```

## Building for Production

### Prerequisites for Building

1. **Create an Expo account** at https://expo.dev
2. **Login to EAS:**

```bash
eas login
```

3. **Configure the project:**

```bash
eas build:configure
```

This creates an `eas.json` file with build profiles.

### Building for iOS

```bash
eas build --platform ios --profile production
```

Options:
- For App Store: `--profile production`
- For internal testing: `--profile preview`
- For development: `--profile development`

**Note**: You'll need an Apple Developer account ($99/year) to distribute on the App Store.

### Building for Android

```bash
eas build --platform android --profile production
```

This generates an APK or AAB file that can be:
- Uploaded to Google Play Store
- Distributed directly as an APK for sideloading

### Building for Both Platforms

```bash
eas build --platform all --profile production
```

### Build Profiles

Edit `eas.json` to customize build settings:

```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "app-bundle"
      }
    }
  }
}
```

## Permissions

The app requires the following permissions:

### iOS
- Camera access (for scanning)
- Photo library access (for saving)

### Android
- CAMERA
- READ_EXTERNAL_STORAGE
- WRITE_EXTERNAL_STORAGE

These are configured in `app.json` and will be requested at runtime.

## Export Settings

Configure default PDF export options in the Settings tab:

- **Page Size**: Letter (8.5" × 11") or A4 (210mm × 297mm)
- **Margins**: Adjustable padding around pages
- **Page Numbers**: Toggle page numbering in exports

## Development Commands

- `npm start` - Start Expo dev server
- `npm run android` - Build and run on Android
- `npm run ios` - Build and run on iOS (Mac only)
- `npm run prebuild` - Generate native projects
- `npm run clean` - Clean and regenerate native projects

## Troubleshooting

### "Unable to resolve module" errors

```bash
npm run clean
npm install
npx expo prebuild
```

### Scanner not working

Make sure you're using a custom dev client, not Expo Go. Run:

```bash
npx expo run:ios
# or
npx expo run:android
```

### Build fails on EAS

Check that:
- Your `app.json` has unique `bundleIdentifier` (iOS) and `package` (Android)
- You're logged in: `eas login`
- Your Expo account has build credits

### Database errors

The database initializes automatically on app launch. If you see SQLite errors, try:

1. Clear app data
2. Reinstall the app
3. Check file permissions

## Known Limitations

- Filter effects are basic implementations (expo-image-manipulator has limited capabilities)
- No OCR text extraction
- No cloud sync
- Maximum 20 pages per scan session (configurable in ScanScreen.tsx)

## Future Enhancements

- Drag-and-drop page reordering
- Rescan individual pages
- Multiple filter previews simultaneously
- Cloud backup integration
- OCR text extraction
- Batch document operations

## License

MIT

## Support

For issues and questions, please open an issue on the repository.
