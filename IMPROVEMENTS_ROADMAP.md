# Improvements Roadmap - Based on 2025 Code Review

**Created:** November 24, 2025
**Based on:** CODE_REVIEW_2025.md
**Priority:** Implementation order based on impact and effort

---

## 🎯 Quick Wins (Do First - 1 Day)

### 1. Enhanced TypeScript Strictness ⏱️ 30 minutes

**File:** `tsconfig.json`

**Current:**
```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true
  }
}
```

**Update to:**
```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,

    // Enhanced strictness for 2025
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "noPropertyAccessFromIndexSignature": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

**Steps:**
1. Update tsconfig.json with new flags
2. Run `npm run type-check`
3. Fix any new TypeScript errors that appear
4. Commit changes

**Expected Issues:**
- May need to add `!` assertions for array access
- May need to add explicit returns in some functions
- May need to mark unused params with `_` prefix

---

### 2. Verify/Enable Hermes Engine ⏱️ 15 minutes

**Goal:** Ensure Hermes v1 is enabled for better performance

**Step 1: Check Current Status**
```bash
npx react-native info
# Look for "Hermes": true or false
```

**Step 2: If Not Enabled, Update app.json**

**File:** `app.json`

**Add:**
```json
{
  "expo": {
    "jsEngine": "hermes",
    "android": {
      "jsEngine": "hermes",
      // ... existing config
    },
    "ios": {
      "jsEngine": "hermes",
      // ... existing config
    }
  }
}
```

**Step 3: Test**
```bash
npx expo start -c  # Clear cache
# Test on device
# Check app startup time
```

**Expected Results:**
- Faster app startup (especially Android)
- Lower memory usage
- Smooth performance

---

### 3. Touch Target Verification ⏱️ 2 hours

**Goal:** Ensure all interactive elements meet WCAG 2.2 minimum (44x44px)

**Files to Check:**
- `src/components/CategoryCard.tsx`
- `src/components/BusinessCard.tsx`
- `src/screens/HomeScreen.tsx` (navigation buttons)
- `src/screens/MapScreen.tsx` (markers)

**Testing Method:**
```typescript
// Add to component temporarily for testing
import { Dimensions } from 'react-native';

onLayout={(event) => {
  const { width, height } = event.nativeEvent.layout;
  console.log(`Touch target: ${width}x${height}`);
  if (width < 44 || height < 44) {
    console.warn('WCAG violation: Touch target too small');
  }
}}
```

**Fix Template:**
```typescript
// If touch target is too small
const styles = StyleSheet.create({
  button: {
    minWidth: 44,
    minHeight: 44,
    // ... other styles
  }
});
```

**Checklist:**
- [ ] CategoryCard - verify `width: '48%'` is >= 44px on iPhone SE
- [ ] Navigation buttons - check actual rendered size
- [ ] Map markers - verify tap area is adequate
- [ ] Settings language buttons
- [ ] All TouchableOpacity components

---

## 🚀 Major Upgrade (Do Next - 2-3 Days)

### 4. React Native New Architecture Migration ⏱️ 2-3 days

**Goal:** Upgrade to React Native 0.76+ with New Architecture (Fabric + TurboModules)

**Benefits:**
- 15-30% performance improvement
- Better memory usage
- Future-proof (old architecture deprecated)
- Required for latest RN versions

**Prerequisites:**
- Backup project
- Update all dependencies
- Review breaking changes
- Test plan ready

---

#### Phase 1: Dependency Updates (Day 1)

**Step 1: Check Expo SDK Compatibility**
```bash
npx expo-doctor
# Check which Expo SDK supports RN 0.76+
```

**Step 2: Update Expo SDK**

**Current:** Expo ~54.0 (RN 0.81.5)
**Target:** Expo SDK 55+ (RN 0.76+)

```bash
npx expo install expo@latest
npx expo install --fix
```

**Step 3: Update package.json**

Check for breaking changes in:
- react-navigation
- react-native-maps
- @supabase/supabase-js
- react-i18next

**Step 4: Run Dependency Check**
```bash
npm outdated
npm audit
npm run type-check
```

---

#### Phase 2: Enable New Architecture (Day 2)

**Step 1: Update app.json**

```json
{
  "expo": {
    "plugins": [
      [
        "expo-build-properties",
        {
          "android": {
            "newArchEnabled": true
          },
          "ios": {
            "newArchEnabled": true
          }
        }
      ]
    ]
  }
}
```

**Step 2: Install Plugin**
```bash
npx expo install expo-build-properties
```

**Step 3: Rebuild Native Code**
```bash
npx expo prebuild --clean
```

---

#### Phase 3: Testing (Day 2-3)

**Critical Test Checklist:**

**Functionality:**
- [ ] App launches successfully
- [ ] All screens load correctly
- [ ] Navigation works (stack navigator)
- [ ] Categories load from Supabase
- [ ] Business list displays
- [ ] Business detail view works
- [ ] Map shows all markers
- [ ] Map markers are tappable
- [ ] Language switching works
- [ ] Settings screen functions
- [ ] Phone call links work
- [ ] Google Maps navigation works
- [ ] Waze navigation works
- [ ] Images load correctly
- [ ] Error states display
- [ ] Retry buttons work
- [ ] Loading indicators show

**Performance:**
- [ ] App startup time (measure before/after)
- [ ] Time to Interactive (measure)
- [ ] Smooth scrolling in business list
- [ ] Smooth map panning
- [ ] No memory leaks

**Accessibility:**
- [ ] Screen reader works (TalkBack/VoiceOver)
- [ ] All buttons are tappable
- [ ] Accessibility labels read correctly

**Languages:**
- [ ] EN works
- [ ] RO works
- [ ] FR works
- [ ] DE works
- [ ] Language persists after app restart

**Test Devices:**
- [ ] Android high-end (Pixel 8)
- [ ] Android low-end (budget device)
- [ ] iOS (iPhone 12+)
- [ ] iOS (iPhone SE - small screen)

---

#### Phase 4: Rollback Plan

**If migration fails:**

```bash
# Restore from git
git checkout HEAD~1

# Or restore package.json versions
npm install

# Clear caches
npx expo start -c
```

---

## 📝 Documentation Updates (Do After Each Item)

### After Each Change:

1. **Update CHANGELOG.md** (create if doesn't exist)
   ```markdown
   ## [1.1.0] - 2025-11-24
   ### Added
   - Enhanced TypeScript strictness flags
   - Hermes engine verification

   ### Changed
   - Touch targets verified for WCAG 2.2 compliance

   ### Performance
   - Enabled Hermes v1 for 60% faster startup
   ```

2. **Update README.md** (if applicable)
   - Update tech stack section if RN version changes
   - Update performance metrics

3. **Update PROJECT_PLAN.md**
   - Mark Phase 6 improvements complete
   - Add Phase 7 for post-review enhancements

---

## 🧪 Testing Strategy

### After Each Improvement:

```bash
# 1. Type check
npm run type-check

# 2. Lint
npm run lint

# 3. Format
npm run format

# 4. Clear cache and run
npx expo start -c

# 5. Test on device
# Scan QR with Expo Go

# 6. Check for regressions
# - All screens load
# - Navigation works
# - API calls succeed
# - No console errors
```

---

## 📊 Success Metrics

### After All Improvements Complete:

**Code Quality:**
- [ ] TypeScript score: 90%+ (from 75%)
- [ ] 0 ESLint errors
- [ ] All new strictness flags enabled

**Performance:**
- [ ] App startup < 2 seconds (measure)
- [ ] Time to Interactive < 3 seconds
- [ ] Hermes enabled and verified
- [ ] New Architecture enabled (if upgraded)

**Accessibility:**
- [ ] All touch targets >= 44x44px
- [ ] WCAG 2.2 AA compliant
- [ ] Screen reader tested

**Documentation:**
- [ ] All changes documented
- [ ] CODE_REVIEW_2025.md archived
- [ ] README.md updated

---

## ⏰ Timeline Summary

| Task | Duration | Priority | Dependencies |
|------|----------|----------|--------------|
| TypeScript Strictness | 30 min | HIGH | None |
| Hermes Verification | 15 min | HIGH | None |
| Touch Target Check | 2 hours | HIGH | None |
| RN New Architecture | 2-3 days | MEDIUM | All quick wins done |

**Total Quick Wins:** ~3-4 hours
**Total Major Upgrade:** 2-3 days
**Overall Timeline:** 3-4 days for complete implementation

---

## 🎯 Next Steps

**Start with:**
1. Enhanced TypeScript strictness (30 min) - Immediate benefit, low risk
2. Hermes verification (15 min) - High impact if not enabled
3. Touch target check (2 hours) - Complete WCAG compliance

**Then proceed to:**
4. React Native New Architecture (2-3 days) - Major upgrade, requires careful testing

**For each item:**
- Create new git branch
- Implement change
- Test thoroughly
- Commit with descriptive message
- Push to GitHub
- Mark complete in this document

---

**Last Updated:** 2025-11-24
**Status:** Ready for implementation
**Next Action:** Start with TypeScript strictness enhancements
