# Pack SEO + PWA + Favicon (🌼)

Ce pack ajoute un SEO complet, un favicon **🌼** (SVG), et la configuration PWA.

## Contenu
- `robots.txt` — autorise l’indexation et annonce le sitemap
- `sitemap.xml` — plan du site
- `manifest.json` — PWA (icônes et paramètres)
- `favicon.svg` — favicon basé sur l’emoji 🌼 (compatible Chrome/Edge/Firefox récents)
- `icon-192.png`, `icon-512.png`, `apple-touch-icon.png` — **placeholders** (remplacez par vos PNG réels quand vous voulez)
- `head-seo-snippet.html` — extrait SEO à coller dans votre `<head>`
- `index-seo.html` — version complète prête à remplacer

## Installation rapide
**Option A — Remplacer votre index :**
1. Renommez votre `index.html` actuel en `index.old.html`.
2. Renommez `index-seo.html` en `index.html` et uploadez **tous les fichiers** à la racine du dépôt.
3. Vérifiez : `https://lilipopins.github.io/Beautiful-Family-Life-Management/robots.txt` et `https://lilipopins.github.io/Beautiful-Family-Life-Management/sitemap.xml`.

**Option B — Garder votre index actuel :**
1. Ouvrez votre `index.html`.
2. Copiez-collez le contenu de `head-seo-snippet.html` dans `<head>…</head>`.
3. Ajoutez aussi :
   ```html
   <link rel="manifest" href="manifest.json">
   <link rel="apple-touch-icon" href="apple-touch-icon.png">
   <link rel="icon" type="image/svg+xml" href="favicon.svg">
   <meta name="theme-color" content="#2bb7a5">
   ```
4. Uploadez **tous les fichiers** du pack à la racine.

## Après déploiement
- Search Console → **Sitemaps** : soumettez `sitemap.xml`
- **Inspection d’URL** : demandez l’indexation de la page d’accueil
- Remplacez les icônes PNG par vos vraies images (192×192, 512×512, 180×180).

> Gardez le fichier de validation `googleXXXXXXXX.html` à la racine.
