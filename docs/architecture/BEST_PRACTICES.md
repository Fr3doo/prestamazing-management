
# Meilleures Pratiques d'Architecture

## 🏗️ Séparation des Responsabilités

### Correct - Séparation Claire
```typescript
// ✅ Présentation
components/domain/Contact/
├── ContactForm.tsx          # Présentation
├── ContactList.tsx          # Présentation
└── types.ts                 # Types locaux

// ✅ Logique
hooks/domain/contact/
├── useContacts.ts           # Logique de récupération
├── useContactForm.ts        # Logique de formulaire
└── useContactActions.ts     # Actions (CRUD)

// ✅ Données
repositories/
└── ContactRepository.ts     # Accès aux données

// ✅ Métier
services/
└── ContactService.ts        # Logique métier
```

## 🔄 Co-location des Fichiers Liés

### Préféré - Fichiers Liés Ensemble
```typescript
components/domain/Contact/
├── ContactForm.tsx
├── ContactFormHeader.tsx    # Utilisé uniquement par ContactForm
├── ContactFormActions.tsx   # Utilisé uniquement par ContactForm
└── ContactFormField.tsx     # Utilisé uniquement par ContactForm
```

### Éviter - Éparpillement
```typescript
// ❌ Structure trop dispersée
components/domain/Contact/ContactForm.tsx
components/domain/Contact/Header/ContactFormHeader.tsx
components/domain/Contact/Actions/ContactFormActions.tsx
components/domain/Contact/Fields/ContactFormField.tsx
```

## 📋 Index Files pour Exports Publics

### Structure des Exports
```typescript
// components/domain/Contact/index.ts
export { ContactForm } from './ContactForm';
export { ContactList } from './ContactList';
export { ContactDetails } from './ContactDetails';
export type { ContactFormProps, ContactListProps } from './types';

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

## 🎯 Guidelines par Type de Composant

### Pages vs Composants
```typescript
// ✅ Pages - Routes principales
pages/
├── Contact.tsx              # Route /contact
├── ContactDetails.tsx       # Route /contact/:id
└── About.tsx               # Route /about

// ✅ Composants - Réutilisables
components/domain/Contact/
├── ContactForm.tsx          # Utilisé dans plusieurs pages
├── ContactCard.tsx          # Utilisé dans plusieurs contextes
└── ContactList.tsx          # Liste réutilisable
```

### Common vs Domain
```typescript
// ✅ Common - Génériques, réutilisables partout
components/common/
├── GenericForm.tsx          # Formulaire générique
├── GenericList.tsx          # Liste générique
├── LoadingSpinner.tsx       # Spinner de chargement
└── ErrorBoundary.tsx        # Gestion d'erreurs

// ✅ Domain - Spécifiques au domaine métier
components/domain/
├── Contact/                 # Gestion des contacts
├── Review/                  # Gestion des avis
└── Admin/                   # Interface d'administration
```

## 🧩 Composition vs Configuration

### Préféré - Composition
```typescript
// ✅ Flexible et composable
<ComposableCard
  title="Contact"
  actions={[
    { label: 'Edit', onClick: handleEdit },
    { label: 'Delete', onClick: handleDelete }
  ]}
>
  <ContactDetails />
</ComposableCard>
```

### Éviter - Trop de Props
```typescript
// ❌ Configuration complexe
<ContactCard
  title="Contact"
  showEditButton={true}
  showDeleteButton={true}
  onEdit={handleEdit}
  onDelete={handleDelete}
  editButtonText="Modifier"
  deleteButtonText="Supprimer"
  // ... 10+ props
/>
```

## 📦 Gestion des Dépendances

### Imports Organisés
```typescript
// 1. React et bibliothèques externes
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

// 2. Composants UI
import { Button } from '@/components/ui/button';

// 3. Composants internes
import { FormField } from '@/components/common/FormField';

// 4. Hooks
import { useContacts } from '@/hooks/domain/contact';

// 5. Utils et types
import { Contact } from '@/types/contact';

// 6. Imports locaux
import { ContactFormField } from './ContactFormField';
```

## 🔒 Encapsulation et Interfaces

### Types Publics vs Privés
```typescript
// types/contact.ts - Interface publique
export interface Contact {
  id: string;
  name: string;
  email: string;
}

// components/domain/Contact/types.ts - Types internes
interface ContactFormState {
  isEditing: boolean;
  hasUnsavedChanges: boolean;
}

interface ContactFormProps {
  contact?: Contact;
  onSave: (contact: Contact) => Promise<void>;
}
```

### Services avec Interfaces
```typescript
// interfaces/repositories/IContactRepository.ts
export interface IContactRepository {
  findAll(): Promise<Contact[]>;
  findById(id: string): Promise<Contact | null>;
  create(data: CreateContactData): Promise<Contact>;
}

// repositories/SupabaseContactRepository.ts
export class SupabaseContactRepository implements IContactRepository {
  // Implémentation spécifique
}
```

## ⚡ Performance et Optimisation

### Lazy Loading des Composants
```typescript
// Chargement différé des pages
const AdminPage = lazy(() => import('@/pages/Admin'));
const ContactDetails = lazy(() => import('@/components/domain/Contact/ContactDetails'));

// Usage avec Suspense
<Suspense fallback={<LoadingSpinner />}>
  <AdminPage />
</Suspense>
```

### Optimisation des Re-renders
```typescript
// Memoization appropriée
const ContactCard = React.memo(({ contact, onEdit }) => {
  const handleEdit = useCallback(() => {
    onEdit(contact);
  }, [contact, onEdit]);
  
  return (
    <div onClick={handleEdit}>
      {contact.name}
    </div>
  );
});
```

## 🧪 Testabilité

### Structure de Tests
```typescript
// __tests__/ContactForm.test.tsx
describe('ContactForm', () => {
  // Test d'intégration
  it('should submit form with valid data', async () => {
    // Arrange, Act, Assert
  });
  
  // Test unitaire
  it('should validate email format', () => {
    // Test de la logique de validation
  });
});
```

### Mocks et Stubs
```typescript
// __tests__/mocks/contactMocks.ts
export const mockContact: Contact = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com'
};

export const mockContactRepository = {
  findAll: jest.fn().mockResolvedValue([mockContact]),
  create: jest.fn().mockResolvedValue(mockContact)
};
```

## ✅ Checklist de Bonnes Pratiques

### Avant de Créer un Nouveau Composant
- [ ] Est-ce réutilisable ? → `common/`
- [ ] Spécifique au domaine ? → `domain/`  
- [ ] Moins de 150 lignes ?
- [ ] Une seule responsabilité ?
- [ ] Types TypeScript définis ?
- [ ] Tests unitaires créés ?

### Avant de Créer une Nouvelle Feature
- [ ] Structure de dossiers définie
- [ ] Séparation présentation/logique
- [ ] Interfaces publiques documentées
- [ ] Hooks personnalisés créés
- [ ] Services et repositories implémentés
- [ ] Tests d'intégration ajoutés
