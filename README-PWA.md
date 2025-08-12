# PWA Ready Assets — Beautiful Family Life

Fichiers à déposer **à la racine** de votre dépôt GitHub Pages.

## Inclus
- `manifest.json` — configuration PWA (nom, couleurs, icônes)
- `service-worker.js` — cache offline simple (pages, scripts, images)
- `offline.html` — page de secours hors ligne
- Icônes : `icon-192.png`, `icon-512.png`, `apple-touch-icon.png`
- Splash : `splash-portrait.png`, `splash-landscape.png`
- `head-pwa-snippet.html` — extrait à coller dans `<head>` de `index.html`

## Intégration
1. Uploadez tous ces fichiers à la **racine** du dépôt.
2. Dans votre `index.html`, ajoutez dans `<head>` le contenu de `head-pwa-snippet.html`.
3. Commit → attendez 1–2 min et rechargez le site (Ctrl/Cmd+Shift+R).
4. Sur mobile, ouvrez le site et utilisez “**Ajouter à l'écran d'accueil**”.

> Remarque : le service worker met en cache les fichiers listés dans `ASSETS`. Ajoutez-y d’autres fichiers si nécessaire.
