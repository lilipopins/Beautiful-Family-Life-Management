# BFL — Maquette Gated (Offert vs Premium)

Maquette interactive HTML/CSS/JS qui sépare clairement les fonctionnalités **Offert** et **Premium**.

## Fichiers
- `index.html` — one-page + section Modules avec 6 sous-onglets
- `styles.css` — styles vert/saumon + composants UI
- `script.js` — routage, stockage local (tâches/documents), et **gating** Premium

## Règles de gating (démo)
- **Organisation** : répétition des tâches, rappels & partage = Premium (🔒). Le reste est Offert.
- **Documents** : Offert limité à **3 documents** maximum ; illimité en Premium.
- **Repas** : génération automatique = Premium (bouton 🔒).
- **Bien‑être** : historique & graphiques = Premium (bouton 🔒).
- **Communauté** : création de posts = Premium.
- **Sync** : partage familial = Premium.

Le sélecteur **Mode : Offert/Premium** (en haut à droite) permet de tester sans authentification.

## Intégration
1. Sauvegardez vos fichiers existants si besoin.
2. Remplacez/ajoutez `index.html`, `styles.css`, `script.js` à la racine du dépôt.
3. Conservez vos images (png/webp) à la racine avec les noms utilisés par `index.html`.
4. Ouvrez `/#modules` et testez les onglets + le sélecteur de plan.

## Étapes suivantes
- Lier un backend (Supabase/Firebase) pour comptes famille et synchronisation.
- Mettre le gating côté serveur (sécurité) et non seulement côté UI.
- Journal d’audit + notifications réelles pour les rappels.
