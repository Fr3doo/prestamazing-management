
# Structure des Dossiers - Standards et Organisation

## 📁 Architecture Générale

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

## 🚀 Template pour Nouvelle Feature

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

## 📋 Règles de Structure

### 1. Séparation des Responsabilités

```typescript
// ✅ Correct - Séparation claire
components/domain/Contact/
├── ContactForm.tsx          # Présentation
├── ContactList.tsx          # Présentation
└── types.ts                 # Types locaux

hooks/domain/contact/
├── useContacts.ts           # Logique de récupération
├── useContactForm.ts        # Logique de formulaire
└── useContactActions.ts     # Actions (CRUD)

repositories/
└── ContactRepository.ts     # Accès aux données

services/
└── ContactService.ts        # Logique métier
```

### 2. Co-location des Fichiers Liés

```typescript
// ✅ Préféré - Fichiers liés ensemble
components/domain/Contact/
├── ContactForm.tsx
├── ContactFormHeader.tsx    # Utilisé uniquement par ContactForm
├── ContactFormActions.tsx   # Utilisé uniquement par ContactForm
└── ContactFormField.tsx     # Utilisé uniquement par ContactForm

// ❌ Éviter - Éparpillement
components/domain/Contact/ContactForm.tsx
components/domain/Contact/Header/ContactFormHeader.tsx
components/domain/Contact/Actions/ContactFormActions.tsx
components/domain/Contact/Fields/ContactFormField.tsx
```

### 3. Index Files pour Exports Publics

```typescript
// components/domain/Contact/index.ts
export { ContactForm } from './ContactForm';
export { ContactList } from './ContactList';
export { ContactDetails } from './ContactDetails';

// hooks/domain/contact/index.ts
export { useContacts } from './useContacts';
export { useContactForm } from './useContactForm';
export { useContactActions } from './useContactActions';

// types/contact.ts - Types publics partagés
export interface Contact {
  id: string;
  name: string;
  email: string;
}
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

## 📦 Gestion des Dépendances

### Imports Organisés
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

## 🎯 Guidelines par Type de Composant

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

### Composants Common vs Domain

```typescript
// ✅ Common - Réutilisable partout
components/common/
├── GenericForm.tsx          # Formulaire générique
├── GenericList.tsx          # Liste générique
├── ComposableCard.tsx       # Carte composable
└── SearchableList.tsx       # Liste avec recherche

// ✅ Domain - Spécifique au domaine métier
components/domain/
├── Contact/
│   ├── ContactForm.tsx      # Formulaire de contact spécifique
│   └── ContactCard.tsx      # Carte de contact spécifique
└── Review/
    ├── ReviewForm.tsx
    └── ReviewCard.tsx
```

## 📚 Documentation par Dossier

### README par Feature
```
src/components/domain/Contact/README.md

# Contact Components

## Description
Composants pour la gestion des contacts dans l'application.

## Composants
- `ContactForm` - Formulaire de création/édition
- `ContactList` - Liste avec pagination et recherche
- `ContactCard` - Affichage d'un contact

## Usage
```tsx
import { ContactForm, ContactList } from '@/components/domain/Contact';

<ContactForm onSubmit={handleSubmit} />
<ContactList contacts={contacts} />
```

## Types
Voir `types.ts` pour les interfaces utilisées.
```

## ✅ Checklist Nouvelle Feature

Pour créer une nouvelle feature "FeatureName" :

- [ ] Créer `components/domain/FeatureName/`
- [ ] Créer `hooks/domain/featureName/`
- [ ] Créer `types/featureName.ts`
- [ ] Créer `repositories/FeatureNameRepository.ts`
- [ ] Créer `services/FeatureNameService.ts`
- [ ] Ajouter les exports dans les index.ts
- [ ] Créer les tests associés
- [ ] Documenter dans un README.md
- [ ] Mettre à jour la navigation si nécessaire
