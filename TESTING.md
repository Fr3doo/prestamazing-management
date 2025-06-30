
# Guide de test et Coverage

Ce projet utilise **Vitest** pour les tests unitaires et **@vitest/coverage-v8** pour mesurer la couverture de code.

## 🚀 Commandes disponibles

### Tests
```bash
# Lancer tous les tests
npm run test

# Lancer les tests en mode interactif (watch)
npm run test:watch

# Lancer les tests une seule fois
npm run test:run

# Interface graphique pour les tests
npm run test:ui
```

### Coverage
```bash
# Lancer les tests avec rapport de couverture
npm run test:coverage
```

## 📊 Rapports de couverture

Les rapports de couverture sont générés dans le dossier `coverage/` :
- **HTML** : `coverage/index.html` - Rapport visuel complet
- **JSON** : `coverage/coverage.json` - Données brutes
- **Texte** : Affiché dans le terminal

### Seuils de couverture configurés

- **Branches** : 70%
- **Fonctions** : 70%
- **Lignes** : 70%
- **Statements** : 70%

## 🧪 Structure des tests

```
src/
├── test/
│   ├── setup.ts              # Configuration globale des tests
│   ├── utils/
│   │   └── test-utils.tsx     # Utilitaires pour les tests React
│   └── mocks/
│       ├── handlers.ts        # Handlers MSW pour les mocks API
│       └── server.ts          # Serveur MSW
├── hooks/__tests__/           # Tests des hooks
├── repositories/__tests__/    # Tests des repositories
└── components/__tests__/      # Tests des composants
```

## 🔧 Configuration

### Vitest (vite.config.ts)
- **Environnement** : jsdom (pour React)
- **Globals** : Activées (pas besoin d'importer `describe`, `it`, etc.)
- **Setup** : `src/test/setup.ts`
- **Coverage** : V8 provider avec exclusions appropriées

### Mocks automatiques
- **Supabase** : Client mocké automatiquement
- **React Router** : Navigation mockée
- **Observers** : IntersectionObserver, ResizeObserver

## 📝 Exemples de tests

### Test de hook
```typescript
import { renderHook } from '@testing-library/react';
import { useRepositories } from '@/hooks/useRepositories';

it('should return all repositories', () => {
  const { result } = renderHook(() => useRepositories());
  expect(result.current).toHaveProperty('contactRepository');
});
```

### Test de composant
```typescript
import { render, screen } from '@/test/utils/test-utils';
import FormField from '@/components/common/FormField';

it('should render input field with label', () => {
  render(<FormField label="Test" value="" onChange={vi.fn()} />);
  expect(screen.getByLabelText('Test')).toBeInTheDocument();
});
```

### Test de repository
```typescript
import { SupabaseContactRepository } from '@/repositories/SupabaseContactRepository';

it('should fetch all contact info successfully', async () => {
  const repository = new SupabaseContactRepository();
  // Mock Supabase response
  const result = await repository.getAllContactInfo();
  expect(result).toEqual(mockData);
});
```

## 🎯 Bonnes pratiques

1. **Nommage** : `*.test.ts` ou `*.test.tsx`
2. **Organisation** : Tests dans dossier `__tests__` à côté du code
3. **Mocks** : Utiliser `vi.mock()` pour les dépendances externes
4. **Coverage** : Viser les seuils configurés (70%)
5. **Isolation** : Chaque test doit être indépendant

## 🚨 Exclusions du coverage

- `node_modules/`
- `src/test/`
- `src/integrations/` (code Supabase)
- `src/main.tsx` (point d'entrée)
- Fichiers de configuration
- Types TypeScript (`.d.ts`)

## 🔍 Surveillance continue

Utilisez `npm run test:watch` pour une surveillance continue pendant le développement. Les tests se relancent automatiquement à chaque modification.

## 📋 Scripts NPM (à ajouter manuellement)

Ajoutez ces scripts à votre `package.json` :

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage",
    "test:watch": "vitest --watch"
  }
}
```
