#!/bin/bash
# Plan Physique — publication en 1 double-clic.
# Construit l'app, enregistre les changements et les envoie sur GitHub.
# GitHub reconstruit et met à jour le site automatiquement (~1 min).

cd "$(dirname "$0")" || exit 1

echo "🔧 Plan Physique — publication…"
echo

# 1. Dépendances (si besoin)
if [ ! -d node_modules ]; then
  echo "📦 Installation des dépendances…"
  npm install || { echo "❌ npm install a échoué"; read -r; exit 1; }
fi

# 2. Build (vérifie que tout compile)
echo "🏗️  Build…"
npm run build || { echo "❌ Le build a échoué — rien n'a été publié."; read -r; exit 1; }

# 3. Remote GitHub (configuré une seule fois)
if ! git remote get-url origin >/dev/null 2>&1; then
  git remote add origin https://github.com/Edenmaqueta-oss/plan-physique.git
fi

# 4. Commit + push
git add -A
if git diff --cached --quiet; then
  echo "ℹ️  Aucun changement à publier."
else
  STAMP="$(date '+%Y-%m-%d %H:%M')"
  git commit -m "Mise à jour — $STAMP"
fi

echo "🚀 Envoi vers GitHub…"
echo "   (Au tout premier envoi, une fenêtre GitHub te demandera de te connecter."
echo "    Connecte-toi : l'autorisation est mémorisée dans le trousseau, à ne faire qu'une fois.)"
git branch -M main
git push -u origin main || { echo "❌ Le push a échoué (connexion GitHub ?)."; read -r; exit 1; }

echo
echo "✅ Publié ! GitHub reconstruit le site (~1 min)."
echo "   App : https://edenmaqueta-oss.github.io/plan-physique/"
echo
echo "Tu peux fermer cette fenêtre."
read -r
