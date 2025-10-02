# 🚀 Botermi Universal Build System

Bu loyihada Android va iOS platformalar uchun birgalikda build qilish tizimi mavjud.

## 📋 Quick Start

### 1️⃣ NPM/Yarn Scripts (Eng oson)

```bash
# NPM bilan:
npm run build:production      # Production build (App Store + Google Play)
npm run build:preview         # Preview build (Test uchun)  
npm run build:android         # Faqat Android
npm run build:ios            # Faqat iOS
npm run submit:all           # Submit to stores

# YARN bilan (tezroq):
yarn build:production        # Production build (App Store + Google Play)
yarn build:preview          # Preview build (Test uchun)
yarn build:android          # Faqat Android  
yarn build:ios              # Faqat iOS
yarn submit:all             # Submit to stores
```

### 2️⃣ Bash Script

```bash
# Production build
./build-all.sh production

# Preview build
./build-all.sh preview

# Faqat Android
./build-all.sh android

# Faqat iOS
./build-all.sh ios
```

### 3️⃣ Node.js API

```bash
# Production build
node build-api.js production

# Preview build  
node build-api.js preview

# Custom build
node build-api.js build all production
node build-api.js build android production
node build-api.js build ios production

# Build status
node build-api.js status

# Build history
node build-api.js list
```

### 4️⃣ Direct EAS Commands

```bash
# Hammasi uchun build
eas build --platform all --profile production

# Android uchun
eas build --platform android --profile production

# iOS uchun
eas build --platform ios --profile production
```

## 📊 Build Profiles

### `production` (App Store & Google Play)
- **Android**: AAB file
- **iOS**: IPA file (Distribution certificate kerak)
- **Purpose**: Store submission

### `preview-all` (Test uchun)  
- **Android**: APK file
- **iOS**: Simulator build
- **Purpose**: Testing

### `preview` (Android only)
- **Android**: APK file  
- **Purpose**: Quick Android testing

## 🔧 Build Configuration

### `eas.json` da available profiles:
```json
{
  "production": "Store builds",
  "production-all": "Both platforms for store",
  "preview-all": "Both platforms for testing",
  "preview": "Android APK only",
  "ios-simulator": "iOS simulator only"
}
```

## 📱 Platform Specific

### Android Requirements:
- ✅ Google Play Console account
- ✅ Keystore (EAS handles automatically)

### iOS Requirements: 
- 📋 Apple Developer Program ($99/year)
- 📋 Distribution Certificate
- 📋 Provisioning Profile
- 📋 App Store Connect access

## 🎯 Recommended Workflow

### For Development:
```bash
# NPM
npm run build:preview
# YARN  
yarn build:preview
```

### For Testing:
```bash
./build-all.sh preview
```

### For Production:
```bash
# NPM
npm run build:production
# YARN (tezroq)
yarn build:production
```

### Submit to Stores:
```bash
# NPM
npm run submit:all
# YARN
yarn submit:all
```

## 🔍 Build Status Monitoring

```bash
# Status
node build-api.js status

# Recent builds
eas build:list

# Build logs
eas build:view <BUILD_ID>
```

## 📥 Download Built Apps

1. **EAS Dashboard**: https://expo.dev/
2. **Email notifications** (automatic)
3. **QR codes** for direct installation
4. **Direct download links**

## ⚡ Quick Commands

| Action | NPM Command | Yarn Command (tezroq) |
|--------|-------------|----------------------|
| **Both platforms (Production)** | `npm run build:production` | `yarn build:production` |
| **Both platforms (Test)** | `npm run build:preview` | `yarn build:preview` |
| **Android only** | `npm run build:android` | `yarn build:android` |
| **iOS only** | `npm run build:ios` | `yarn build:ios` |
| **Submit all** | `npm run submit:all` | `yarn submit:all` |
| **Build status** | `node build-api.js status` | `node build-api.js status` |

---

## 🚨 Troubleshooting

### iOS build fails?
- Apple Developer Account kerakmi?
- `eas credentials` orqali certificate setup qiling

### Android build fails?
- `eas build:list` orqali logs ko'ring
- Google Play Console setup qilingmi?

### Build stuck?
- `eas build:list` orqali status ko'ring
- EAS Dashboard ga boring

---

**🎉 Happy Building!** 
Har qanday muammo bo'lsa, EAS documentation: https://docs.expo.dev/build/introduction/
