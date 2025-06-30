
# Template pour Nouvelle Feature

## 🚀 Structure Standard d'une Feature

### Exemple : Feature "Notifications"

```
src/
├── components/
│   └── domain/
│       └── Notifications/
│           ├── index.ts                    # Export public
│           ├── NotificationCenter.tsx      # Composant principal
│           ├── NotificationItem.tsx        # Sous-composant
│           ├── NotificationFilters.tsx     # Filtres
│           ├── types.ts                    # Types locaux
│           └── __tests__/                  # Tests
│               ├── NotificationCenter.test.tsx
│               └── NotificationItem.test.tsx
├── hooks/
│   └── domain/
│       └── notifications/
│           ├── index.ts                    # Export public
│           ├── useNotifications.ts         # Hook principal
│           ├── useNotificationActions.ts   # Actions
│           └── __tests__/
│               └── useNotifications.test.ts
├── types/
│   └── notifications.ts                   # Types publics
├── repositories/
│   └── NotificationRepository.ts          # Accès données
└── services/
    └── NotificationService.ts             # Logique métier
```

## 📝 Étapes de Création

### 1. Créer la Structure de Base
```bash
mkdir -p src/components/domain/FeatureName
mkdir -p src/hooks/domain/featureName
mkdir -p src/components/domain/FeatureName/__tests__
mkdir -p src/hooks/domain/featureName/__tests__
```

### 2. Créer les Fichiers Index
```typescript
// components/domain/FeatureName/index.ts
export { FeatureMainComponent } from './FeatureMainComponent';
export { FeatureSubComponent } from './FeatureSubComponent';
export type { FeatureProps, FeatureData } from './types';

// hooks/domain/featureName/index.ts
export { useFeature } from './useFeature';
export { useFeatureActions } from './useFeatureActions';
```

### 3. Définir les Types
```typescript
// components/domain/FeatureName/types.ts
export interface FeatureData {
  id: string;
  name: string;
  status: 'active' | 'inactive';
  createdAt: Date;
}

export interface FeatureProps {
  data?: FeatureData;
  onSave: (data: FeatureData) => Promise<void>;
  onCancel?: () => void;
}

// types/featureName.ts - Types publics partagés
export interface FeaturePublicInterface {
  // Types exposés à d'autres features
}
```

### 4. Créer les Services
```typescript
// repositories/FeatureRepository.ts
export class FeatureRepository {
  async findAll(): Promise<FeatureData[]> {
    // Accès aux données
  }
}

// services/FeatureService.ts
export class FeatureService {
  constructor(private repo: FeatureRepository) {}
  
  async getActiveFeatures(): Promise<FeatureData[]> {
    // Logique métier
  }
}
```

## ✅ Checklist Nouvelle Feature

- [ ] Créer `components/domain/FeatureName/`
- [ ] Créer `hooks/domain/featureName/`
- [ ] Créer `types/featureName.ts`
- [ ] Créer `repositories/FeatureRepository.ts`
- [ ] Créer `services/FeatureService.ts`
- [ ] Ajouter les exports dans les index.ts
- [ ] Créer les tests associés
- [ ] Documenter dans un README.md
- [ ] Mettre à jour la navigation si nécessaire

## 📋 Template de Composant Principal
```typescript
// components/domain/FeatureName/FeatureMainComponent.tsx
import React from 'react';
import { FeatureProps } from './types';

export const FeatureMainComponent = ({ 
  data, 
  onSave, 
  onCancel 
}: FeatureProps) => {
  // État local
  // Hooks personnalisés
  // Handlers
  // Rendu
  
  return (
    <div className="feature-container">
      {/* Contenu du composant */}
    </div>
  );
};
```

## 📋 Template de Hook Principal
```typescript
// hooks/domain/featureName/useFeature.ts
import { useQuery } from '@tanstack/react-query';
import { FeatureService } from '@/services/FeatureService';

export const useFeature = () => {
  const service = new FeatureService();
  
  return useQuery({
    queryKey: ['feature'],
    queryFn: () => service.getActiveFeatures()
  });
};
```
