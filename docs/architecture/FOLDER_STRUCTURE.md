
# Structure des Dossiers - Architecture Générale

## 📁 Architecture de Base

```
src/
├── components/
│   ├── common/              # Composants réutilisables
│   ├── domain/              # Composants spécifiques au domaine
│   └── ui/                  # Composants shadcn/ui
├── hooks/
│   ├── common/              # Hooks génériques
│   ├── domain/              # Hooks spécifiques au domaine
│   └── auth/                # Hooks d'authentification
├── pages/                   # Pages/Routes principales
├── types/                   # Définitions TypeScript globales
├── utils/                   # Utilitaires et helpers
├── styles/                  # Styles globaux
├── providers/               # Context providers
├── repositories/            # Couche d'accès aux données
└── services/                # Services métier
```

## 🎯 Principes Fondamentaux

### 1. Séparation des Responsabilités
- **Composants** : Présentation uniquement
- **Hooks** : Logique d'état et effets
- **Services** : Logique métier
- **Repositories** : Accès aux données

### 2. Co-location des Fichiers Liés
- Fichiers utilisés ensemble → même dossier
- Types locaux → avec le composant qui les utilise
- Tests → à côté du code testé

### 3. Exports Publics via Index
```typescript
// components/domain/Contact/index.ts
export { ContactForm } from './ContactForm';
export { ContactList } from './ContactList';
export type { ContactFormProps } from './types';
```

## 📋 Règles Essentielles

1. **Un composant = Un fichier** (max 150 lignes)
2. **PascalCase** pour les composants
3. **camelCase** pour les hooks et utilitaires
4. **Index files** pour les exports publics
5. **Types locaux** dans le même dossier

## 📚 Documentation Complémentaire

- [Template pour Nouvelles Features](./FEATURE_TEMPLATE.md)
- [Règles d'Organisation Détaillées](./ORGANIZATION_RULES.md)
- [Meilleures Pratiques](./BEST_PRACTICES.md)
