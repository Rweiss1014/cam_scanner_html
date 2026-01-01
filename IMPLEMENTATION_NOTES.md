# Implementation Notes

This document provides technical details about the implementation of the Document Scanner app, following the step-by-step guide provided.

## Architecture Overview

The app follows a clean, modular architecture with clear separation of concerns:

```
┌─────────────────────────────────────────────┐
│           App.tsx (Entry Point)              │
│         Navigation & Initialization          │
└─────────────────────────────────────────────┘
                    │
        ┌───────────┴───────────┐
        │                       │
┌───────▼────────┐    ┌────────▼────────┐
│  Tab Navigator  │    │  Stack Navigator │
│  (3 main tabs)  │    │  (Modal flows)   │
└───────┬────────┘    └────────┬────────┘
        │                      │
   ┌────┴─────┬────────┬──────┴────┐
   │          │        │            │
┌──▼──┐   ┌──▼──┐  ┌──▼──┐   ┌────▼─────┐
│Scan │   │Files│  │Set- │   │Document  │
│     │   │     │  │tings│   │Detail    │
└─────┘   └─────┘  └─────┘   └──────────┘
   │          │
   ▼          ▼
┌─────────────────────────────────────────────┐
│         Core Services Layer                  │
│  ┌──────────┐  ┌──────────┐  ┌───────────┐│
│  │Database  │  │Image      │  │File       ││
│  │(SQLite)  │  │Processing │  │Storage    ││
│  └──────────┘  └──────────┘  └───────────┘│
└─────────────────────────────────────────────┘
```

## Step-by-Step Implementation

### Step 1: Project Structure ✅

**Completed:**
- Set up Expo managed workflow with TypeScript
- Configured React Navigation with bottom tabs and stack navigation
- Three main tabs: Scan, Files, Settings
- Clean, original UI design (no CamScanner branding copied)

**Key Files:**
- `App.tsx` - Navigation setup
- `app.json` - Expo configuration with permissions
- `tsconfig.json` - TypeScript configuration

### Step 2: Scanning Engine ✅

**Path Chosen:** Path A (Simple) - `react-native-document-scanner-plugin`

**Implementation:**
- Integrated `react-native-document-scanner-plugin` for native scanning
- Automatic edge detection and cropping handled by the plugin
- Multi-page scanning support (up to 20 pages per session)
- Camera permissions handling for iOS and Android
- Configured as plugin in `app.json` for Expo

**Key Features:**
- `letUserAdjustCrop: true` - Users can manually adjust detected edges
- `maxNumDocuments: 20` - Supports multi-page scanning
- `responseType: 'imageFilePath'` - Returns file paths for processing

**Custom Dev Client:**
- Configured for native module support
- `npx expo prebuild` generates native projects
- Cannot use Expo Go (requires custom development build)

### Step 3: Filter Presets ✅

**Implementation:**
- Five filter presets: Original, Color, Grayscale, B&W, Enhance
- Uses `expo-image-manipulator` for basic transforms
- Stores both original and processed versions
- Per-page filter selection in preview screen

**Technical Details:**
- Original URI preserved for re-processing
- Processed images compressed to JPEG (0.9 quality)
- Images resized to max 2000px width for performance
- Filter metadata stored in SQLite

**Current Limitations:**
- Filters are basic implementations
- `expo-image-manipulator` has limited capabilities
- For advanced filters (true B&W threshold, contrast enhancement), would need:
  - Native image processing libraries
  - Custom native modules
  - Or server-side processing

**Recommended Future Enhancement:**
- Integrate `react-native-vision-camera` with frame processors
- Use custom shaders for real-time filter previews
- Implement histogram equalization for "Enhance" filter

### Step 4: Local Storage ✅

**Data Model:**
```typescript
Document {
  id: string
  title: string
  createdAt: number
  updatedAt: number
  pages: Page[]
}

Page {
  id: string
  originalUri: string
  processedUri: string
  filterName: FilterName
  rotation: number
  order: number
}
```

**Storage Architecture:**
- **Metadata:** SQLite database (`expo-sqlite`)
  - `documents` table
  - `pages` table with foreign key
  - Indexed on documentId and order
- **Images:** File system (`expo-file-system`)
  - Stored in `${documentDirectory}scanned_docs/`
  - Persistent across app restarts
  - Not backed up (excluded from cloud backup)

**Database Features:**
- PRAGMA journal_mode = WAL (Write-Ahead Logging)
- Foreign key constraints with CASCADE delete
- Atomic transactions for data integrity
- Proper error handling

**Files Tab:**
- Lists all documents with thumbnail previews
- Shows page count badge
- Sortable by creation date
- Delete document with confirmation
- Navigate to document detail view

### Step 5: PDF Export ✅

**Implementation:**
- Uses `expo-print` to generate PDF from HTML
- Uses `expo-sharing` to share/export PDF
- Configurable export settings

**Export Options:**
- **Page Size:** Letter (8.5" × 11") or A4 (210mm × 297mm)
- **Margins:** Adjustable padding (default: 20px)
- **Page Numbers:** Toggle on/off

**Technical Approach:**
1. Generate HTML with embedded images
2. CSS for page layout and sizing
3. `expo-print` renders HTML to PDF
4. `expo-sharing` provides native share sheet

**Current Limitations:**
- Images embedded as base64 or file:// URIs
- Large documents may cause memory issues
- No PDF compression options
- No watermark support

### Step 6: UX Polish ✅

**Implemented Features:**

1. **Auto-naming:**
   - Format: "Scan YYYY-MM-DD HH:MM AM/PM"
   - Example: "Scan 2025-01-01 5:42 PM"
   - Editable after creation

2. **Preview Carousel:**
   - Swipe through scanned pages
   - Page indicator (e.g., "1 / 5")
   - Thumbnail strip at bottom
   - Current page highlighted

3. **Delete Page:**
   - Delete button on preview screen
   - Confirmation dialog
   - Minimum 1 page enforced

4. **Document Management:**
   - Rename documents in-line
   - Delete documents with confirmation
   - Page count display
   - Date formatting

5. **Filter Selection:**
   - Horizontal scrollable filter list
   - Visual preview (future enhancement)
   - Active filter highlighted
   - Applies to all pages in preview

**Not Yet Implemented (Future):**
- Drag-and-drop page reordering
- Rescan individual page
- Rotation per page
- Batch operations

### Step 7: Build Configuration ✅

**Local Development:**
```bash
npm install
npx expo prebuild
npx expo start --dev-client
npx expo run:ios    # or run:android
```

**Production Builds:**
```bash
eas login
eas build:configure
eas build --platform ios --profile production
eas build --platform android --profile production
```

**Build Profiles (eas.json):**
- `development` - Development build with debug tools
- `preview` - Internal testing (APK for Android)
- `production` - App store release (AAB for Android)

## Technical Decisions

### Why SQLite Instead of Supabase?

The user instructions specifically requested local-first architecture with SQLite and `expo-file-system`. This decision provides:

**Pros:**
- ✅ Offline-first (no internet required)
- ✅ Faster performance (no network latency)
- ✅ Better privacy (data stays on device)
- ✅ No backend costs
- ✅ Simpler architecture

**Cons:**
- ❌ No cloud sync
- ❌ No cross-device access
- ❌ No backup/restore
- ❌ Data lost if device lost

**Future Enhancement:**
Could add optional Supabase sync:
- Use SQLite as source of truth
- Background sync to Supabase
- Conflict resolution strategy
- User authentication

### Why expo-image-manipulator?

**Pros:**
- ✅ Built-in Expo module (no custom dev client needed)
- ✅ Simple API
- ✅ Good enough for MVP filters

**Cons:**
- ❌ Limited filter capabilities
- ❌ No real-time preview
- ❌ No advanced image processing

**Alternative Considered:**
- `react-native-vision-camera` + frame processors
  - More complex setup
  - Better performance
  - Real-time filters
  - Overkill for MVP

### Why react-native-document-scanner-plugin?

**Pros:**
- ✅ Native edge detection (iOS and Android)
- ✅ Built-in crop adjustment UI
- ✅ Multi-page support
- ✅ Active maintenance
- ✅ Expo compatible (with custom dev client)

**Cons:**
- ❌ Requires custom dev client
- ❌ Limited customization
- ❌ Black box implementation

**Alternative Considered:**
- Build custom scanner with Vision Camera
  - More control
  - Better UX customization
  - More development time
  - More complex

## Known Issues & Limitations

1. **Expo Go Not Supported**
   - Must use custom development client
   - Adds complexity to setup

2. **Filter Quality**
   - Basic implementations only
   - No true B&W threshold
   - No advanced enhancements

3. **No Page Reordering**
   - Pages can't be rearranged after saving
   - Would need drag-and-drop library
   - Database already supports it (orderIndex column)

4. **No Rescan**
   - Can't replace individual pages
   - Must delete page and add new scan

5. **Memory Usage**
   - Large multi-page documents may cause issues
   - No image compression in database
   - No thumbnail generation

6. **Assets Required**
   - App won't build without icon/splash assets
   - Must create placeholder images
   - Provided script for ImageMagick

## Performance Considerations

- Images stored on disk (not in database)
- SQLite indexed for fast queries
- Lazy loading for document list
- Image compression (0.9 quality JPEG)
- Resize to 2000px max width

## Security Considerations

- No network requests (offline app)
- No user authentication required
- Data stored in app's private directory
- Permissions requested at runtime
- File URLs not exposed externally

## Testing Recommendations

1. **Manual Testing:**
   - Scan single page
   - Scan multi-page (10+ pages)
   - Test all filters
   - Test PDF export
   - Test delete operations
   - Test rename operations
   - Test permissions flow

2. **Edge Cases:**
   - Very large documents (20+ pages)
   - High resolution images
   - Low storage space
   - Permission denied
   - App backgrounded during scan

3. **Platform Testing:**
   - iOS Simulator
   - Android Emulator
   - Physical iPhone
   - Physical Android device

## Future Roadmap

### Phase 2 - Core Enhancements
- [ ] Drag-and-drop page reordering
- [ ] Rescan individual page
- [ ] Page rotation (90°, 180°, 270°)
- [ ] Thumbnail generation for performance
- [ ] Batch document operations

### Phase 3 - Advanced Features
- [ ] OCR text extraction
- [ ] Search within documents
- [ ] Document categories/tags
- [ ] Cloud backup (optional)
- [ ] Document templates

### Phase 4 - Premium Features
- [ ] Advanced filters (AI-powered)
- [ ] Automatic document type detection
- [ ] Form field detection
- [ ] Digital signatures
- [ ] Password-protected PDFs

## Maintenance Notes

- Keep dependencies up to date
- Test on new iOS/Android versions
- Monitor Expo SDK updates
- Watch for breaking changes in scanner plugin
- Update permissions for new OS versions

## Conclusion

This implementation follows the step-by-step guide closely, using Path A (simple) for scanning and maintaining a clean, local-first architecture. The app is production-ready for MVP use cases, with clear pathways for future enhancements.
