
#!/bin/bash

echo "🔍 Analyse complète du code..."

# Vérification ESLint
echo "📋 Vérification ESLint..."
npx eslint "src/**/*.{ts,tsx}" --report-unused-disable-directives --max-warnings 0

# Vérification des types
echo "🔍 Vérification des types..."
npx tsc --noEmit --strict

# Vérification du formatage
echo "🎨 Vérification du formatage..."
npx prettier --check "src/**/*.{ts,tsx,js,jsx,css,scss,json}"

echo "✅ Analyse complète terminée !"
