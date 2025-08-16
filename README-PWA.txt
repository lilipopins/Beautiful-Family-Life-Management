# Beautiful Family Life — PWA (Web App)

Pack prêt à déposer sur GitHub Pages pour obtenir une application web installable et un mode hors-ligne simple.

## Contenu
- `index.html` — One page en **mode onglets** (une section visible à la fois).
- `styles.css` — Palette vert/saumon.
- `manifest.json` — Config PWA.
- `service-worker.js` — Cache pages + images principales + `offline.html`.
- `assets/` — icônes PWA (placeholders).
- `offline.html` — Page affichée sans connexion.

## Installation
1. Uploadez tout à la **racine** du dépôt `Beautiful-Family-Life-Management`.
2. **Gardez vos images** existantes à la racine avec ces noms :
   - `page-d-accueil.png` (+ `.webp`)
   - `tarifs-et-offres-premium.png` (+ `.webp`)
   - `modules-et-fonctionnalites.png` (+ `.webp`)
   - `communauté-et-ressources.png` (+ `.webp`)
   - `contact-et-support.png` (+ `.webp`)
   - `infographie-gratuit-vs-premium.png` (+ `.webp`)
3. Rechargez avec **Cmd/Ctrl + Shift + R**.
4. Pour forcer une mise à jour de cache, changez `CACHE_NAME` dans `service-worker.js` (ex: `bfl-pwa-v2`) puis commit.
