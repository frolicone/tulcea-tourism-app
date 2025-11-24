# App Assets Guide - Tulcea Tourism

This guide provides specifications for creating custom app icons and splash screens for the Tulcea Tourism app.

## 🎨 Design Theme

**Brand Colors:**
- Primary Blue: `#1E88E5` (RGB: 30, 136, 229)
- White: `#FFFFFF`
- Light Blue: `#64B5F6` (for gradients/accents)

**Design Concept:**
The app represents Tulcea and the Danube Delta, so consider incorporating:
- Water/wave motifs (Danube Delta)
- Navigation/location pin
- Simple, modern, recognizable at small sizes
- Blue and white color scheme

---

## 📱 Required Assets

### 1. App Icon (icon.png)

**Specifications:**
- **Size:** 1024x1024 pixels
- **Format:** PNG with transparency
- **Color Space:** sRGB
- **Safe Zone:** Keep important content within 80% of canvas (avoid corners)
- **Background:** Can use transparency or solid color

**Design Guidelines:**
- Simple, bold design that works at all sizes (16px to 1024px)
- Avoid text (hard to read when small)
- High contrast between icon and background
- Test visibility on both light and dark backgrounds

**File Location:** `./assets/icon.png`

---

### 2. Adaptive Icon - Android (adaptive-icon.png)

**Specifications:**
- **Size:** 1024x1024 pixels
- **Format:** PNG with transparency
- **Foreground Safe Zone:** Keep content within 66% center circle (avoid outer 17% on all sides)
- **Background:** Solid color defined in app.json (`#1E88E5`)

**Why Adaptive?**
Android uses adaptive icons that can be masked into different shapes (circle, square, rounded square) depending on device manufacturer.

**Design Guidelines:**
- The foreground image should work when masked as a circle
- Important content must be in the center 66% (684x684 pixels from center)
- The background color (#1E88E5) will show around the icon

**File Location:** `./assets/adaptive-icon.png`

---

### 3. Splash Screen (splash-icon.png)

**Specifications:**
- **Size:** 1284x1284 pixels (minimum)
- **Recommended:** 2048x2048 pixels for best quality
- **Format:** PNG with transparency
- **Background Color:** Defined in app.json (`#1E88E5`)
- **Resize Mode:** `contain` (image scaled to fit, aspect ratio maintained)

**Design Guidelines:**
- Center your logo/icon in the middle
- Keep content within safe area (avoid top/bottom for notches/status bars)
- Works on both portrait and landscape orientations
- Background color in app.json fills the screen

**File Location:** `./assets/splash-icon.png`

**App.json Configuration:**
```json
"splash": {
  "image": "./assets/splash-icon.png",
  "resizeMode": "contain",
  "backgroundColor": "#1E88E5"
}
```

---

### 4. Favicon (favicon.png)

**Specifications:**
- **Size:** 48x48 pixels (or 96x96 for retina)
- **Format:** PNG
- **Use:** Web version only

**Design Guidelines:**
- Simplified version of main app icon
- Must be recognizable at 16x16 pixels (browser tab size)

**File Location:** `./assets/favicon.png`

---

## 🛠 Recommended Tools

### Free Design Tools:
1. **Figma** (Web-based, free tier)
   - https://figma.com
   - Templates available for app icons
   - Export to PNG easily

2. **Canva** (Web-based, free tier)
   - https://canva.com
   - Templates: Search "app icon" or "mobile app logo"
   - Resize designs easily

3. **GIMP** (Desktop, free)
   - https://gimp.org
   - Full-featured image editor
   - Export with transparency

4. **Inkscape** (Desktop, free)
   - https://inkscape.org
   - Vector graphics (SVG)
   - Export to PNG at any size

### Icon Generators:
1. **Expo Icon Builder**
   - https://icon.kitchen
   - Upload one image, generates all required sizes

2. **App Icon Generator**
   - https://appicon.co
   - Creates iOS and Android icons from single image

---

## 💡 Design Ideas for Tulcea Tourism

### Option 1: Location Pin with Wave
```
- Blue location pin (#1E88E5)
- Water wave pattern at bottom
- Simple, recognizable
- White background or transparent
```

### Option 2: Delta Symbol
```
- Greek Delta symbol (Δ) representing Danube Delta
- Blue color (#1E88E5)
- Clean, modern typography
- Transparent or white background
```

### Option 3: Map Marker with Boat
```
- Circular blue background
- White boat silhouette
- Location pin integrated
- Represents tourism + navigation
```

### Option 4: Minimalist
```
- Abstract water ripples
- Blue gradient (#1E88E5 to #64B5F6)
- Modern, simple
- Works at all sizes
```

---

## 📋 Asset Checklist

Before finalizing, verify:

- [ ] **Icon (1024x1024)** - Created and placed in `./assets/icon.png`
- [ ] **Adaptive Icon (1024x1024)** - Foreground content in center 66%
- [ ] **Splash Screen (2048x2048)** - Centered logo, works on blue background
- [ ] **Favicon (96x96)** - Simplified version for web
- [ ] **Color Consistency** - All use #1E88E5 as primary blue
- [ ] **Transparency** - Icons use transparency where appropriate
- [ ] **File Size** - All PNGs optimized (< 500KB each)
- [ ] **Testing** - Viewed at multiple sizes (16px, 48px, 192px, 512px, 1024px)
- [ ] **Backgrounds** - Tested on white, black, and colored backgrounds
- [ ] **App.json** - Paths correctly reference all assets

---

## 🧪 Testing Your Assets

### Preview in Expo:
```bash
npm start
# Scan QR code - check icon in Expo Go app list
# Watch splash screen on app launch
```

### Test Icon at Different Sizes:
1. Open icon.png in image viewer
2. Zoom to 25%, 50%, 75%, 100%
3. Verify details are visible at all sizes
4. Check if icon is recognizable at 48px

### Test Splash Screen:
1. Kill and restart app multiple times
2. Verify splash appears correctly
3. Check on different device sizes (if possible)

---

## 🚀 Implementation Steps

### Step 1: Design Your Icon
1. Choose design concept from ideas above (or create your own)
2. Use design tool (Figma, Canva, etc.)
3. Create square design (1024x1024)
4. Export as PNG with transparency

### Step 2: Create Adaptive Icon
1. Use same design as main icon
2. Ensure important content is in center circle (684x684 from center)
3. Export as PNG 1024x1024

### Step 3: Create Splash Screen
1. Create simplified/centered version of icon
2. Size: 2048x2048 recommended
3. Design for blue background (#1E88E5)
4. Export as PNG

### Step 4: Create Favicon
1. Simplify icon design for small size
2. Export at 96x96 pixels
3. Test visibility at 16x16

### Step 5: Replace Assets
```bash
# Backup old assets
cd assets
mkdir backup
cp *.png backup/

# Replace with new assets
# Copy your new icon.png, adaptive-icon.png, splash-icon.png, favicon.png
# to the assets/ folder
```

### Step 6: Verify app.json
Check that all paths are correct:
```json
{
  "expo": {
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash-icon.png",
      "backgroundColor": "#1E88E5"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#1E88E5"
      }
    },
    "web": {
      "favicon": "./assets/favicon.png"
    }
  }
}
```

### Step 7: Test
```bash
npm start
# Clear Expo cache if needed:
# npx expo start -c
```

---

## 📊 File Size Guidelines

**Recommended File Sizes:**
- icon.png: < 300KB
- adaptive-icon.png: < 300KB
- splash-icon.png: < 500KB
- favicon.png: < 50KB

**Optimization Tools:**
- **TinyPNG** - https://tinypng.com (online, free)
- **ImageOptim** - https://imageoptim.com (Mac)
- **PngCrush** - Command line tool

---

## ❓ Quick Tips

1. **Keep It Simple** - Complex designs don't scale well
2. **Test Small** - Always check how icon looks at 48px
3. **High Contrast** - Ensure visibility on various backgrounds
4. **Brand Consistent** - Use official blue (#1E88E5)
5. **No Text** - Text becomes unreadable at small sizes
6. **Center Important Content** - Safe for adaptive icons and notches
7. **Use Transparency Wisely** - Solid backgrounds often work better

---

## 📞 Need Help?

If you need a designer:
- **Fiverr** - https://fiverr.com (search "app icon design")
- **Upwork** - https://upwork.com
- **99designs** - https://99designs.com (design contest)

Budget: $20-$100 typically for app icon + splash screen

---

**Last Updated:** 2025-11-24
**Status:** Ready for asset creation
