
#!/bin/bash

echo "🎯 Analyse de qualité du code..."

# Analyse ESLint avec rapport détaillé
echo "📊 Rapport ESLint détaillé..."
npx eslint "src/**/*.{ts,tsx}" --format=table

# Analyse des imports inutilisés
echo "🔍 Analyse des imports..."
npx eslint "src/**/*.{ts,tsx}" --rule "unused-imports/no-unused-imports: error"

# Vérification des types stricts
echo "🔒 Vérification des types stricts..."
npx tsc --noEmit --strict --noUnusedLocals --noUnusedParameters

echo "✅ Analyse de qualité terminée !"
