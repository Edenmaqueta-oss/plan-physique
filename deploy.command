#!/bin/bash
# Plan Physique — publication en 1 double-clic.
# Construit l'app et l'envoie directement sur la branche gh-pages (GitHub Pages).
# Le site se met à jour en ~1 min. Sur le téléphone, rafraîchis l'app.

cd "$(dirname "$0")" || exit 1

echo "🔧 Plan Physique — publication…"
echo

if [ ! -d node_modules ]; then
  echo "📦 Installation des dépendances…"
  npm install || { echo "❌ npm install a échoué"; read -r; exit 1; }
fi

echo "🏗️  Build…"
npm run build || { echo "❌ Le build a échoué — rien n'a été publié."; read -r; exit 1; }

# Remote GitHub (configuré une seule fois)
if ! git remote get-url origin >/dev/null 2>&1; then
  git remote add origin https://github.com/Edenmaqueta-oss/plan-physique.git
fi

# Sauvegarde du code source sur main
git add -A
git diff --cached --quiet || git commit -q -m "Mise à jour — $(date '+%Y-%m-%d %H:%M')"
git branch -M main
echo "🚀 Envoi du code source (branche main)…"
git push -u origin main

# Publication du site (dossier dist → branche gh-pages)
echo "🌐 Publication du site (branche gh-pages)…"
npx --yes gh-pages -d dist -b gh-pages -m "Deploy $(date '+%Y-%m-%d %H:%M')" \
  || { echo "❌ La publication a échoué (connexion GitHub ?)."; read -r; exit 1; }

echo
echo "✅ Publié ! Le site se met à jour dans ~1 min :"
echo "   https://edenmaqueta-oss.github.io/plan-physique/"
echo
echo "Tu peux fermer cette fenêtre."
read -r
