# Pre-Launch Checklist

Use this checklist to ensure your Document Scanner app is ready for development, testing, and production release.

## Development Setup

- [ ] Node.js 18+ installed
- [ ] npm or yarn installed
- [ ] Expo CLI installed (`npm install -g expo-cli`)
- [ ] Xcode installed (Mac only, for iOS development)
- [ ] Android Studio installed (for Android development)
- [ ] Dependencies installed (`npm install`)
- [ ] Assets created (icon, splash, adaptive-icon, favicon)
- [ ] Native projects generated (`npx expo prebuild`)
- [ ] App runs on iOS Simulator (`npx expo run:ios`)
- [ ] App runs on Android Emulator (`npx expo run:android`)

## Feature Testing

### Scanning
- [ ] Camera permission requested on first launch
- [ ] Scan button opens camera
- [ ] Document edges detected automatically
- [ ] Crop adjustment works correctly
- [ ] Multi-page scanning works (scan 2+ pages)
- [ ] Cancel scan works without crashing

### Preview & Filters
- [ ] Preview screen shows all scanned pages
- [ ] Page indicator shows correct count (e.g., "1 / 5")
- [ ] Thumbnail carousel displays all pages
- [ ] Tapping thumbnail switches to that page
- [ ] Delete page works (with minimum 1 page enforced)
- [ ] All 5 filters work: Original, Color, Grayscale, B&W, Enhance
- [ ] Active filter is visually highlighted
- [ ] Cancel button returns to scan screen
- [ ] Save button saves document

### Files Tab
- [ ] Document list shows all saved documents
- [ ] Each document shows thumbnail of first page
- [ ] Page count badge displays correctly
- [ ] Document title shows auto-generated name
- [ ] Tapping document opens detail view
- [ ] Delete button shows confirmation dialog
- [ ] Delete removes document from list
- [ ] Empty state shows when no documents

### Document Detail
- [ ] Document title displays at top
- [ ] Edit button allows renaming
- [ ] Save/Cancel buttons work for rename
- [ ] Page count displays correctly
- [ ] All pages display in grid layout
- [ ] Page numbers show on each thumbnail
- [ ] Delete page button works (with minimum 1 page)
- [ ] Export PDF button is visible

### PDF Export
- [ ] Export button generates PDF
- [ ] Native share sheet appears
- [ ] PDF contains all pages
- [ ] Page numbers included (if enabled in settings)
- [ ] Can share via email, messages, etc.
- [ ] Can save to Files app
- [ ] PDF opens correctly in PDF viewers

### Settings
- [ ] Settings screen loads without errors
- [ ] Page size options work (Letter/A4)
- [ ] Page numbers toggle works
- [ ] Settings persist after app restart
- [ ] About section displays version
- [ ] Features list displays correctly

## Edge Cases

- [ ] App handles low storage gracefully
- [ ] App handles camera permission denied
- [ ] App handles no camera available (simulator)
- [ ] App doesn't crash when backgrounded during scan
- [ ] App doesn't crash with very large documents (10+ pages)
- [ ] Database initializes correctly on first launch
- [ ] App recovers from database errors

## Performance

- [ ] App launches in < 3 seconds
- [ ] Scan flow is smooth (no lag)
- [ ] Filter preview updates quickly
- [ ] Document list scrolls smoothly
- [ ] Large documents (10+ pages) don't cause freezing
- [ ] PDF export completes in reasonable time
- [ ] No memory leaks during extended use

## UI/UX

- [ ] All text is readable (sufficient contrast)
- [ ] Touch targets are minimum 44×44 points
- [ ] Loading states show for async operations
- [ ] Error messages are user-friendly
- [ ] Navigation is intuitive
- [ ] Back buttons work correctly
- [ ] Tab bar navigation works on all screens
- [ ] No UI elements overlap
- [ ] Safe area insets respected (notch, home indicator)

## Before Production Build

### Configuration
- [ ] Update bundle identifier in `app.json` (iOS: `bundleIdentifier`)
- [ ] Update package name in `app.json` (Android: `package`)
- [ ] Set unique app name in `app.json`
- [ ] Update version number in `app.json`
- [ ] Update app description
- [ ] Replace placeholder icons with branded assets
- [ ] Replace placeholder splash screen with branded design

### EAS Build Setup
- [ ] Expo account created
- [ ] EAS CLI installed (`npm install -g eas-cli`)
- [ ] Logged into EAS (`eas login`)
- [ ] EAS configured (`eas build:configure`)
- [ ] `eas.json` reviewed and customized

### iOS Specific
- [ ] Apple Developer account created ($99/year)
- [ ] Bundle identifier registered in App Store Connect
- [ ] App icon meets Apple guidelines (no transparency)
- [ ] Privacy strings updated in `app.json`
- [ ] Test on physical iPhone device
- [ ] Submit to TestFlight for internal testing

### Android Specific
- [ ] Google Play Developer account created ($25 one-time)
- [ ] Package name is unique
- [ ] App icon meets Google guidelines
- [ ] Permissions declared in `app.json`
- [ ] Test on physical Android device
- [ ] Generate signed AAB for Play Store

## Documentation

- [ ] README.md updated with project details
- [ ] Build instructions documented
- [ ] Environment variables documented (if any)
- [ ] API documentation complete (if applicable)
- [ ] User guide written (optional)

## Legal & Compliance

- [ ] Privacy policy written
- [ ] Terms of service written
- [ ] Camera usage clearly explained to users
- [ ] Data storage policy documented
- [ ] App store descriptions written
- [ ] Screenshots prepared for app stores

## Marketing Preparation

- [ ] App Store listing prepared
- [ ] Google Play listing prepared
- [ ] App screenshots (5-10 per platform)
- [ ] App preview video (optional but recommended)
- [ ] Marketing website or landing page
- [ ] Social media accounts created

## Launch Day

- [ ] Final testing on both platforms
- [ ] All assets uploaded
- [ ] Store listings complete
- [ ] Build submitted for review
- [ ] Support channels ready (email, social media)
- [ ] Analytics tracking enabled (if using)
- [ ] Crash reporting enabled (if using)

## Post-Launch

- [ ] Monitor crash reports
- [ ] Monitor user reviews
- [ ] Respond to user feedback
- [ ] Track key metrics (downloads, usage, retention)
- [ ] Plan first update based on feedback

---

## Quick Reference

**Minimum Requirements Before First Run:**
1. ✅ Dependencies installed (`npm install`)
2. ✅ Assets created (at least placeholders)
3. ✅ Prebuild completed (`npx expo prebuild`)

**Minimum Requirements Before Production:**
1. ✅ Unique bundle identifier/package name
2. ✅ Branded icons and splash screen
3. ✅ Tested on physical devices
4. ✅ Privacy policy available
5. ✅ Store listings complete

**Critical Files to Update:**
- `app.json` - Bundle ID, package name, app name, version
- `assets/` - All image assets
- `README.md` - Project documentation
- `eas.json` - Build configuration (if using EAS)

Good luck with your app launch! 🚀
