# Pen Parentis app — Windows 11 setup

Everything here runs on Windows. The iOS build happens on Expo's Mac servers, so you never need a Mac. You will test on your own iPhone within the hour.

---

## 1. Install the tools (about 20 minutes)

Open **PowerShell** (press Start, type `powershell`, hit Enter) and run these one at a time. `winget` is built into Windows 11.

```powershell
winget install OpenJS.NodeJS.LTS
winget install Git.Git
winget install Microsoft.VisualStudioCode
```

Close PowerShell and open a new one so the new commands are recognised, then check:

```powershell
node --version
git --version
```

Node should report v20 or higher. If either command is not recognised, restart the machine — the PATH change needs it sometimes.

On your **iPhone**, install **Expo Go** from the App Store. Your PC and your phone must be on the same Wi-Fi network.

---

## 2. Create the project (5 minutes)

```powershell
cd ~\Documents
npx create-expo-app@latest penparentis --template blank
cd penparentis
```

Say yes to any prompt about installing `create-expo-app`.

---

## 3. Add the libraries

Use `npx expo install`, not `npm install`. It picks versions that match your Expo SDK, which is the single most common cause of an app that builds but crashes on launch.

```powershell
npx expo install @react-navigation/native @react-navigation/material-top-tabs
npx expo install react-native-pager-view react-native-screens react-native-safe-area-context
npx expo install react-native-reanimated expo-linear-gradient
npx expo install @react-native-async-storage/async-storage
```

- `material-top-tabs` + `pager-view` is what makes the tabs swipeable.
- `expo-linear-gradient` is what stops the blue looking flat.
- `async-storage` keeps the writing streak on the phone between launches.

---

## 4. Drop in the starter files

Copy the contents of this folder into the `penparentis` folder you just created, overwriting `App.js`. You should end up with:

```
penparentis/
  App.js              five swipeable tabs, bottom bar
  theme.js            the hex values, shadows, spacing
  links.js            every external URL, in one place
  components/ui.js    header, card, buttons
  screens/            Home, Events, Salons, Write, Community
```

---

## 5. Run it

```powershell
npx expo start
```

A QR code appears in the terminal. Open the **Camera** app on your iPhone and point it at the code — it offers to open in Expo Go. The app loads on your phone, and every time you save a file in VS Code it reloads in about a second.

Press `w` in the terminal to also open it in a browser tab, which is handy for quick layout checks.

---

## 6. First things to change

1. Open `links.js` and paste in the real Eventbrite, Discord, Spotify and donation URLs. Use a **non-expiring** Discord invite — the default ones die after a day.
2. Open `theme.js` if you want to nudge any colour. Nothing else in the app hardcodes a hex.
3. In `screens/EventsScreen.js`, the `EVENTS` array is typed in by hand for now. Later this becomes a fetch from a small endpoint so events update without a new app release.

---

## 7. When you are ready to build real apps

You do not need this yet, but this is the path:

```powershell
npm install -g eas-cli
eas login
eas build:configure
eas build --platform ios      # compiled on Expo's Mac hardware
eas build --platform android
```

Before the iOS build you need an **Apple Developer** account ($99/year — apply now, verification for an organisation can take a week or two, and Apple waives the fee for some 501c3s, worth asking with the EIN). Google Play is a $25 one-time fee.

---

## If something breaks

- **App won't load on the phone:** both devices on the same Wi-Fi? If your network isolates clients, run `npx expo start --tunnel`.
- **Red screen mentioning reanimated:** stop the server, run `npx expo start --clear`.
- **`npm install` of a native library:** undo it, use `npx expo install` instead.
- **Anything after editing `App.js`:** the file paths in the imports are case-sensitive on some systems. `screens/HomeScreen` is not `screens/homescreen`.
