# BFL — Maquette Gated (Offert vs Premium) — Repas complet

Cette version ajoute un module **Repas** complet :
- Menus hebdomadaires (petit-déj / déjeuner / dîner) par jour
- Sélecteur de semaine (clé ISO `YYYY-Www` par défaut) + création de semaines nommées
- Liste de courses : ajouter, cocher (acheté), supprimer, nettoyer, exporter
- Suggestions de plats via `datalist`
- Export **menus** et **liste de courses** vers le presse‑papiers
- Données stockées en `localStorage`

**Gating Premium conservé** :
- Bouton **Générer menus automatiques** = 🔒 Premium

## Fichiers
- `index.html` — one-page + modules (Repas complet)
- `styles.css` — styles vert/saumon + UI Repas
- `script.js` — logique Repas + persistence

## Intégration
1) Remplacez vos `index.html`, `styles.css`, `script.js` à la **racine** du dépôt.
2) Conservez les images de sections (png/webp) à la racine.
3) Ouvrez `/#modules?tab=repas` pour tester.

## Prochaines étapes (optionnelles)
- Catégories d’ingrédients et tri par rayons (Fruits/Légumes, Épicerie, Frais…)
- Import de recettes (.json) et calcul automatique de liste de courses
- Multi-profils famille + partage (quand le backend sera prêt)
