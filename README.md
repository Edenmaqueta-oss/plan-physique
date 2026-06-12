# Plan Physique — Eden

PWA de suivi protéines (objectif **202 g/jour**), plan repas, suivi IA et routine « mâchoire carrée ».
React + Vite + TypeScript, déployée sur GitHub Pages.

## Démarrer en local

```bash
npm install
npm run dev
```

Ouvre http://localhost:5173/plan-physique/

## Build

```bash
npm run build
npm run preview
```

## Les 4 onglets

1. **Plan** — 5 repas (42 / 30 / 52 / 36 / 42 g). Carte cliquable → conseil + recherche de ce
   qui a vraiment été mangé (grammes **ou** unités : 3 œufs, 1 boîte de thon…). Progression en
   direct, sauvegarde par date (`plan_meals_v2`), reset à minuit.
2. **Suivi IA** — recherche libre dans 70+ aliments avec catégories, preview protéines, puis
   « Analyser ma journée » → API Anthropic (`claude-sonnet-4-6`). Aliment inconnu = ajout manuel,
   l'IA estime.
3. **Mâchoire carrée** — 6 sections de checklist, cochage par date, reset quotidien.
4. **Stats** — streak, moyenne 7 jours, graphique barres (CSS pur), et **réglage de la clé API**.

## Clé API Anthropic

Onglet **Stats → Réglages**. La clé est stockée **uniquement** dans le `localStorage` du
navigateur. L'appel est direct (header `anthropic-dangerous-direct-browser-access: true`), donc
la clé est exposée côté client : **usage strictement personnel**, ne publie pas l'app avec ta clé.

## Déploiement — GitHub Pages (branche `gh-pages`)

Publication directe du dossier `dist` sur la branche `gh-pages`.

**Le plus simple :** double-clic sur **`deploy.command`** (build + envoi automatique).

Ou en ligne de commande :

```bash
npm run deploy   # build + push du dossier dist sur la branche gh-pages
```

L'app sera disponible sur :
**https://edenmaqueta-oss.github.io/plan-physique/**

## ⚠️ Sécurité

- **Ne committe jamais** de token GitHub ni de clé API dans le code. Le token personnel partagé
  pendant la création doit être considéré comme compromis et **révoqué**
  (GitHub → Settings → Developer settings → Personal access tokens).
- Le déploiement utilise le `GITHUB_TOKEN` automatique du runner, pas un PAT.
