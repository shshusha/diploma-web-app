# Vector Icons Fix Instructions

## Problem

Icons are showing as question marks (?) instead of proper Material Icons.

## Root Cause

The vector icons fonts were not properly linked in the iOS and Android builds.

## ✅ Fixes Applied

### 1. iOS Configuration (Info.plist)

Added `UIAppFonts` array with all Material Icons fonts:

- MaterialIcons.ttf
- AntDesign.ttf
- Entypo.ttf
- And many more...

### 2. Android Configuration (build.gradle)

Added the vector icons fonts.gradle configuration:

```gradle
apply from: file("../../node_modules/react-native-vector-icons/fonts.gradle")
```

## 🔧 Steps to Apply the Fix

### For iOS:

1. Clean the build:

   ```bash
   cd ios
   rm -rf build
   cd ..
   ```

2. Reinstall pods:

   ```bash
   cd ios
   pod install
   cd ..
   ```

3. Rebuild the app:
   ```bash
   npx react-native run-ios
   ```

### For Android:

1. Clean the build:

   ```bash
   cd android
   ./gradlew clean
   cd ..
   ```

2. Rebuild the app:
   ```bash
   npx react-native run-android
   ```

## 🧪 Testing the Fix

The following icons should now display properly:

### Quick Action Buttons:

- `emergency` - Emergency icon
- `location-on` - Location icon
- `phone` - Phone icon
- `notifications` - Notifications icon

### Alert Severity Icons:

- `info` - Information icon
- `warning` - Warning icon
- `error` - Error icon
- `priority-high` - High priority icon

### App Bar Icons:

- `notifications` - Notifications icon
- `account` - Account icon

## 🔍 Verification

If icons are still showing as question marks:

1. **Check the build**: Make sure you've cleaned and rebuilt the project
2. **Check the font files**: Verify the font files exist in the node_modules
3. **Check the import**: Ensure Icon is imported from `react-native-vector-icons/MaterialIcons`
4. **Check the icon names**: Verify the icon names are valid Material Icons

## 📱 Icon Names Reference

Common Material Icons used in the app:

- `emergency` - Emergency icon
- `location-on` - Location icon
- `phone` - Phone icon
- `notifications` - Notifications icon
- `info` - Information icon
- `warning` - Warning icon
- `error` - Error icon
- `priority-high` - High priority icon
- `account` - Account icon

## 🚨 Troubleshooting

If the issue persists:

1. **Restart Metro bundler**:

   ```bash
   npx react-native start --reset-cache
   ```

2. **Check for conflicts**: Make sure no other icon libraries are conflicting

3. **Verify installation**: Ensure react-native-vector-icons is properly installed

4. **Check platform-specific issues**: Some icons might not work on certain platforms

## ✅ Expected Result

After applying the fix and rebuilding, all icons should display as proper Material Icons instead of question marks.
