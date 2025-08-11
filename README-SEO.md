# Pack SEO avancé — Beautiful Family Life

Ce pack ajoute un **SEO complet** à votre site GitHub Pages.

## Contenu
- `robots.txt` — autorise l’indexation et annonce le sitemap
- `sitemap.xml` — plan du site
- `manifest.json` — PWA (icônes et paramètres)
- `favicon.ico`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png`, `safari-pinned-tab.svg` — icônes (remplacez-les plus tard par vos vraies icônes)
- `index-seo.html` — version **complète** d’`index.html` avec toutes les balises SEO
- `head-seo-snippet.html` — **extrait** à copier/coller dans votre `<head>` si vous préférez **garder votre index actuel**

## Installation rapide
**Option A — Remplacer votre index :**
1. Renommez votre `index.html` actuel en sauvegarde (`index.old.html`).
2. Renommez `index-seo.html` en `index.html` et uploadez **tous les fichiers** à la racine du dépôt.
3. Vérifiez : `https://lilipopins.github.io/Beautiful-Family-Life-Management/robots.txt` et `https://lilipopins.github.io/Beautiful-Family-Life-Management/sitemap.xml`.

**Option B — Conserver votre index et ajouter seulement le SEO :**
1. Ouvrez votre `index.html` actuel.
2. Copiez-collez le contenu de `head-seo-snippet.html` **à l’intérieur de `<head>…</head>`**.
3. Ajoutez aussi ces lignes dans `<head>` si absentes :
   ```html
   <link rel="manifest" href="manifest.json">
   <link rel="apple-touch-icon" href="apple-touch-icon.png">
   <link rel="icon" href="favicon.ico">
   <meta name="theme-color" content="#2bb7a5">
   ```
4. Uploadez **tous les fichiers** (robots, sitemap, manifest, icônes).

## Après déploiement
- Dans Google Search Console : soumettez `sitemap.xml` et **Demander une indexation** de la page d’accueil.
- Remplacez les icônes par vos **vraies images** (192×192, 512×512, 180×180).

> Conseil : gardez le fichier de validation `googleXXXXXXXX.html` à la racine de votre dépôt.
