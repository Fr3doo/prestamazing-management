
# Règles d'Organisation Détaillées

## 🗂️ Structure des Composants

### Common vs Domain

#### Composants Common
```typescript
// ✅ Common - Réutilisable partout
components/common/
├── GenericForm.tsx          # Formulaire générique
├── GenericList.tsx          # Liste générique
├── ComposableCard.tsx       # Carte composable
└── SearchableList.tsx       # Liste avec recherche
```

#### Composants Domain
```typescript
// ✅ Domain - Spécifique au domaine métier
components/domain/
├── Contact/
│   ├── ContactForm.tsx      # Formulaire de contact spécifique
│   └── ContactCard.tsx      # Carte de contact spécifique
└── Review/
    ├── ReviewForm.tsx
    └── ReviewCard.tsx
```

## 📦 Gestion des Imports

### Ordre Standard des Imports
```typescript
// 1. Imports externes (React, bibliothèques)
import React, { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';

// 2. Imports UI (shadcn/ui)
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// 3. Imports composants internes
import { FormField } from '@/components/common/FormField';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

// 4. Imports hooks
import { useStandardToast } from '@/hooks/useStandardToast';
import { useContacts } from '@/hooks/domain/contact';

// 5. Imports utils et types
import { contactValidationSchema } from '@/utils/validation';
import { Contact, ContactFormData } from '@/types/contact';

// 6. Imports locaux (même dossier)
import { ContactFormField } from './ContactFormField';
import { ContactFormActions } from './ContactFormActions';
```

## 🎨 Organisation des Styles

### Structure CSS
```
styles/
├── base.css                 # Reset et styles de base
├── components.css           # Styles de composants
├── utilities.css            # Classes utilitaires
├── variables.css            # Variables CSS
├── animations.css           # Animations
└── tailwind.css             # Configuration Tailwind
```

### Classes Tailwind Standardisées
```typescript
const styles = {
  card: "bg-white border border-gray-200 rounded-lg shadow-sm p-6",
  button: {
    primary: "bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded",
    secondary: "bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded"
  },
  input: "w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
};
```

## 🔧 Utilitaires par Catégorie

### Structure des Utils
```
utils/
├── validation/
│   ├── contactValidation.ts     # Règles spécifiques
│   ├── commonValidation.ts      # Règles génériques
│   └── index.ts                 # Export public
├── formatting/
│   ├── dateFormatting.ts
│   ├── textFormatting.ts
│   └── index.ts
├── constants/
│   ├── apiEndpoints.ts
│   ├── errorMessages.ts
│   └── index.ts
└── helpers/
    ├── arrayHelpers.ts
    ├── objectHelpers.ts
    └── index.ts
```

## 🧪 Organisation des Tests

### Structure des Tests
```
src/
├── components/
│   └── domain/
│       └── Contact/
│           ├── ContactForm.tsx
│           └── __tests__/
│               ├── ContactForm.test.tsx
│               ├── ContactForm.integration.test.tsx
│               └── ContactForm.utils.ts    # Helpers de test
├── hooks/
│   └── domain/
│       └── contact/
│           ├── useContacts.ts
│           └── __tests__/
│               └── useContacts.test.ts
└── __tests__/
    ├── setup.ts                # Configuration globale
    ├── mocks/                  # Mocks globaux
    │   ├── handlers.ts
    │   └── server.ts
    └── utils/                  # Utilitaires de test
        └── test-utils.tsx
```

## 📚 Documentation par Dossier

### README par Feature
```markdown
# Feature Components

## Description
Composants pour la gestion de [Feature] dans l'application.

## Composants
- `FeatureForm` - Formulaire de création/édition
- `FeatureList` - Liste avec pagination et recherche
- `FeatureCard` - Affichage d'un élément

## Usage
```tsx
import { FeatureForm, FeatureList } from '@/components/domain/Feature';

<FeatureForm onSubmit={handleSubmit} />
<FeatureList items={items} />
```

## Types
Voir `types.ts` pour les interfaces utilisées.
```

## 🎯 Règles par Type de Composant

### Composants de Page
```
pages/
├── Contact.tsx              # Page principale
├── ContactDetails.tsx       # Sous-page
└── contact/                 # Dossier pour pages complexes
    ├── ContactPage.tsx
    ├── ContactEditPage.tsx
    └── components/          # Composants spécifiques à ces pages
        ├── ContactPageHeader.tsx
        └── ContactPageSidebar.tsx
```

### Règles de Taille
- **Composant** : max 150 lignes
- **Hook** : max 100 lignes  
- **Utilitaire** : max 50 lignes
- **Type/Interface** : groupés logiquement

### Règles de Nommage
```typescript
// ✅ Correct
ComponentName.tsx         // PascalCase pour composants
useCustomHook.ts         // camelCase avec préfixe "use"
utilityFunction.ts       // camelCase pour utilitaires
CONSTANTS.ts             // UPPERCASE pour constantes
types.ts                 // lowercase pour types/interfaces
```
