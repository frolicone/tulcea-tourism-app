# Assets Folder

This folder contains app icons, splash screens, and templates for the Tulcea Tourism app.

## 📁 Current Files

### Templates (SVG - Editable)
- **icon-template.svg** - Main app icon design with location pin and waves
- **adaptive-icon-template.svg** - Android adaptive icon (simplified version)
- **splash-template.svg** - Splash screen with logo and text

### Default Assets (PNG - To be replaced)
- **icon.png** - Default Expo icon (1024x1024) ⚠️ Replace with custom design
- **adaptive-icon.png** - Default adaptive icon (1024x1024) ⚠️ Replace with custom design
- **splash-icon.png** - Default splash screen (1284x1284) ⚠️ Replace with custom design
- **favicon.png** - Default favicon (48x48) ⚠️ Replace with custom design

## 🎨 How to Use Templates

### Option 1: Edit SVG Templates Directly

**Using Figma (Recommended):**
1. Go to https://figma.com (free account)
2. File → Import → Select one of the template SVG files
3. Edit colors, shapes, text as needed
4. Remove guide lines (red dashed circles/rectangles)
5. File → Export → PNG → 1024x1024 (or 2048x2048 for splash)
6. Save with correct filename in this folder

**Using Inkscape (Free Desktop App):**
1. Download from https://inkscape.org
2. Open template SVG file
3. Edit design elements
4. Delete guide layers
5. File → Export PNG Image → Set size → Export
6. Save with correct filename

**Using Adobe Illustrator:**
1. Open template SVG
2. Edit design
3. Delete guides
4. Export As → PNG → Set dimensions
5. Save with correct filename

### Option 2: Use as Reference Only
1. Open template SVG to see design concept
2. Recreate in your preferred design tool
3. Follow specifications in ../ASSETS_GUIDE.md
4. Export and replace PNG files

## 📋 Export Checklist

When exporting from templates:

### For icon.png:
- [ ] Remove guide circles (dashed lines)
- [ ] Export size: 1024x1024 pixels
- [ ] Format: PNG with transparency
- [ ] Filename: `icon.png`
- [ ] Test at small sizes (48px)

### For adaptive-icon.png:
- [ ] Remove red safe zone guide
- [ ] Ensure content within 66% center circle
- [ ] Export size: 1024x1024 pixels
- [ ] Format: PNG with transparency
- [ ] Filename: `adaptive-icon.png`

### For splash-icon.png:
- [ ] Remove guide lines (safe zones, center lines)
- [ ] Export size: 2048x2048 pixels (or minimum 1284x1284)
- [ ] Format: PNG with transparency
- [ ] Filename: `splash-icon.png`
- [ ] Background will be #1E88E5 (set in app.json)

### For favicon.png:
- [ ] Simplify icon design for small size
- [ ] Export size: 96x96 pixels
- [ ] Format: PNG
- [ ] Filename: `favicon.png`

## 🧪 Testing After Export

After replacing assets:

```bash
# Clear Expo cache
npx expo start -c

# Check icon in Expo Go app list
# Watch splash screen on app launch
```

## 🎨 Design Theme

**Primary Blue:** `#1E88E5` (RGB: 30, 136, 229)
**White:** `#FFFFFF`
**Light Blue:** `#64B5F6` (for accents)

## 📚 Full Documentation

See [ASSETS_GUIDE.md](../ASSETS_GUIDE.md) for complete specifications and design guidelines.

---

**Quick Start:**
1. Open `icon-template.svg` in Figma/Inkscape
2. Customize or use as-is
3. Remove guide lines
4. Export as PNG 1024x1024
5. Save as `icon.png`
6. Repeat for adaptive-icon and splash
7. Run `npx expo start -c` to see changes
