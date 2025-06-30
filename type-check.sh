
#!/bin/bash

echo "🔍 Vérification stricte des types TypeScript..."

# Vérification des types avec mode strict
npx tsc --noEmit --strict --exactOptionalPropertyTypes

echo "✅ Vérification des types terminée !"
