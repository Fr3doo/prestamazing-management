
#!/bin/bash

echo "🎨 Formatage du code avec Prettier..."

# Formater tous les fichiers TypeScript/JavaScript/CSS
npx prettier --write "src/**/*.{ts,tsx,js,jsx,css,scss,json}"

# Formater les fichiers de config à la racine
npx prettier --write "*.{json,js,ts}"

echo "✅ Formatage terminé !"
