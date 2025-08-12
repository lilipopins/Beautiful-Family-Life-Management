# Beautiful Family Life — Starter Capacitor (Android + iOS)

Charge l'URL distante : **https://lilipopins.github.io/Beautiful-Family-Life-Management/**

## Prérequis
- Node.js LTS
- Android Studio (SDK/émulateur) • Xcode (pour iOS)
- Capacitor CLI : `npm i -g @capacitor/cli`

## Installation
```bash
npm install
npm run cap:add:android
npm run cap:add:ios
npm run assets      # génère icônes et splash depuis /resources
npm run cap:sync
```

## Ouvrir dans les IDE
```bash
npm run cap:open:android   # Android Studio
npm run cap:open:ios       # Xcode
```

## Personnalisation
- App Name : **Beautiful Family Life**
- Package : **com.familylife.app**
- Orientation : portrait (à régler dans Android Studio & Xcode si besoin)
- Icônes & splash : dossier **/resources** (`icon.png`, `splash.png`)
