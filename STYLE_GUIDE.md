
# Guide de Style - Standards et Conventions

## 📋 Table des Matières
- [Structure des Fichiers](#structure-des-fichiers)
- [Conventions de Nommage](#conventions-de-nommage)
- [Patterns de Composants](#patterns-de-composants)
- [Gestion d'État](#gestion-détat)
- [Styling et CSS](#styling-et-css)
- [TypeScript](#typescript)
- [Tests](#tests)

## 🗂️ Structure des Fichiers

### Organisation des Dossiers
```
src/
├── components/
│   ├── common/           # Composants réutilisables
│   ├── domain/           # Composants spécifiques au domaine
│   │   ├── Contact/
│   │   ├── Review/
│   │   └── Admin/
│   └── ui/               # Composants shadcn/ui
├── hooks/
│   ├── common/           # Hooks génériques
│   ├── domain/           # Hooks spécifiques au domaine
│   └── auth/             # Hooks d'authentification
├── utils/
│   ├── validation/       # Règles de validation
│   ├── formatting/       # Formatage de données
│   └── constants/        # Constantes et configurations
├── types/                # Définitions TypeScript
└── styles/               # Styles globaux
```

### Règles de Structure
1. **Un composant = Un fichier** (max 150 lignes)
2. **Index files** pour les exports publics
3. **Co-location** : Fichiers liés dans le même dossier
4. **Séparation** : Logique métier vs présentation

## 🏷️ Conventions de Nommage

### Fichiers et Dossiers
```typescript
// ✅ Correct
ComponentName.tsx         // PascalCase pour composants
useCustomHook.ts         // camelCase avec préfixe "use"
utilityFunction.ts       // camelCase pour utilitaires
CONSTANTS.ts             // UPPERCASE pour constantes
types.ts                 // lowercase pour types/interfaces

// ❌ Incorrect
componentName.tsx        // Pas camelCase pour composants
CustomHook.ts           // Pas de préfixe "use"
```

### Variables et Fonctions
```typescript
// ✅ Correct
const userName = 'john';                    // camelCase
const API_ENDPOINT = 'https://api.com';     // SCREAMING_SNAKE_CASE pour constantes
const handleSubmit = () => {};              // Préfixe "handle" pour event handlers
const isLoading = false;                    // Préfixe "is/has/can" pour booleans

// ❌ Incorrect
const user_name = 'john';                   // Pas snake_case
const apiEndpoint = 'https://api.com';      // Constante pas en majuscules
const submitHandler = () => {};             // Préfixe "Handler" pas standard
```

### Composants
```typescript
// ✅ Correct - Composant principal
export const ContactForm = () => {};

// ✅ Correct - Sous-composants
const ContactFormField = () => {};
const ContactFormActions = () => {};

// ❌ Incorrect
export const contactForm = () => {};        // Pas PascalCase
export const Contact_Form = () => {};       // Pas snake_case
```

## 🧩 Patterns de Composants

### Structure Standard d'un Composant
```typescript
// 1. Imports (externe, interne, types)
import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { useStandardToast } from '@/hooks/useStandardToast';
import { ContactFormData, ContactFormProps } from './types';

// 2. Types/Interfaces locales (si petites)
interface LocalState {
  isEditing: boolean;
}

// 3. Constantes locales
const DEFAULT_VALUES = {
  name: '',
  email: '',
} as const;

// 4. Composant principal
export const ContactForm = ({ 
  initialData, 
  onSubmit, 
  onCancel 
}: ContactFormProps) => {
  // 4a. État local
  const [formData, setFormData] = useState<ContactFormData>(initialData || DEFAULT_VALUES);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // 4b. Hooks personnalisés
  const { showSuccess, showError } = useStandardToast();
  
  // 4c. Handlers
  const handleInputChange = useCallback((field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  }, [errors]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit(formData);
      showSuccess('Contact sauvegardé avec succès');
    } catch (error) {
      showError('Erreur lors de la sauvegarde');
    }
  };
  
  // 4d. Rendu
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* JSX content */}
    </form>
  );
};

// 5. Composants internes (si nécessaire)
const ContactFormField = ({ label, value, onChange }: FieldProps) => (
  <div className="space-y-2">
    <label className="text-sm font-medium">{label}</label>
    <input 
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full p-2 border rounded"
    />
  </div>
);

// 6. Export par défaut (si un seul composant principal)
export default ContactForm;
```

### Patterns Recommandés

#### 1. Composition over Configuration
```typescript
// ✅ Préféré - Composition
<ComposableCard
  title="Contact"
  actions={[
    { label: 'Edit', onClick: handleEdit },
    { label: 'Delete', onClick: handleDelete }
  ]}
>
  <ContactDetails />
</ComposableCard>

// ❌ Éviter - Trop de props
<ContactCard
  title="Contact"
  showEditButton={true}
  showDeleteButton={true}
  onEdit={handleEdit}
  onDelete={handleDelete}
  editButtonText="Modifier"
  deleteButtonText="Supprimer"
/>
```

#### 2. Render Props pour la Flexibilité
```typescript
// ✅ Recommandé
<DataRenderer data={contacts} loading={loading} error={error}>
  {({ data, hasData, isEmpty }) => (
    <>
      {isEmpty && <EmptyState />}
      {hasData && <ContactList contacts={data} />}
    </>
  )}
</DataRenderer>
```

#### 3. Hooks Personnalisés pour la Logique
```typescript
// ✅ Séparer la logique dans des hooks
const useContactForm = (initialData?: ContactFormData) => {
  const [formData, setFormData] = useState(initialData || {});
  const [errors, setErrors] = useState({});
  
  const handleSubmit = async (submitFn: Function) => {
    // Logique de soumission
  };
  
  return { formData, errors, handleSubmit };
};

// Utilisation dans le composant
const ContactForm = () => {
  const { formData, errors, handleSubmit } = useContactForm();
  // Seule la logique de rendu ici
};
```

## 🎯 Gestion d'État

### État Local vs Global
```typescript
// ✅ État local pour données de formulaire
const [formData, setFormData] = useState({});

// ✅ État global pour données partagées
const { user, isAuthenticated } = useAuth();

// ✅ Hooks personnalisés pour logique complexe
const { contacts, loading, error, refetch } = useContacts();
```

### Patterns de Mise à Jour d'État
```typescript
// ✅ Mise à jour immutable
setFormData(prev => ({ ...prev, [field]: value }));

// ✅ Callback pour éviter les re-renders
const handleChange = useCallback((field: string, value: string) => {
  setFormData(prev => ({ ...prev, [field]: value }));
}, []);

// ✅ Réinitialisation propre
const resetForm = useCallback(() => {
  setFormData(initialData);
  setErrors({});
}, [initialData]);
```

## 🎨 Styling et CSS

### Classes Tailwind Standardisées
```typescript
// ✅ Classes réutilisables définies
const styles = {
  card: "bg-white border border-gray-200 rounded-lg shadow-sm p-6",
  button: {
    primary: "bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded",
    secondary: "bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded"
  },
  input: "w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500",
  label: "block text-sm font-medium text-gray-700 mb-1"
};

// Utilisation
<div className={styles.card}>
  <button className={styles.button.primary}>Save</button>
</div>
```

### Responsive Design
```typescript
// ✅ Mobile-first approach
className="w-full md:w-1/2 lg:w-1/3"

// ✅ Breakpoints cohérents
// sm: 640px, md: 768px, lg: 1024px, xl: 1280px
```

## 📝 TypeScript

### Définition des Types
```typescript
// ✅ Types précis et descriptifs
interface ContactFormData {
  readonly id?: string;
  name: string;
  email: string;
  phone?: string | null;
  type: 'personal' | 'professional';
  createdAt?: Date;
}

// ✅ Props avec documentation
interface ContactFormProps {
  /** Données initiales du formulaire */
  initialData?: ContactFormData;
  /** Callback appelé lors de la soumission */
  onSubmit: (data: ContactFormData) => Promise<void>;
  /** Callback appelé lors de l'annulation */
  onCancel?: () => void;
  /** Mode édition ou création */
  isEditing?: boolean;
}

// ✅ Énumérations typées
const ContactType = {
  PERSONAL: 'personal',
  PROFESSIONAL: 'professional'
} as const;
type ContactType = typeof ContactType[keyof typeof ContactType];
```

### Gestion des Erreurs TypeScript
```typescript
// ✅ Types d'erreur spécifiques
interface ValidationError {
  field: string;
  message: string;
  code: 'REQUIRED' | 'INVALID_FORMAT' | 'TOO_LONG';
}

// ✅ Union types pour les états
type LoadingState = 'idle' | 'loading' | 'success' | 'error';

// ✅ Génériques pour la réutilisabilité
interface ApiResponse<T> {
  data: T;
  message: string;
  status: 'success' | 'error';
}
```

## 🧪 Tests

### Conventions de Test
```typescript
// ContactForm.test.tsx
describe('ContactForm', () => {
  // Arrange, Act, Assert pattern
  it('should submit form with valid data', async () => {
    // Arrange
    const mockOnSubmit = jest.fn();
    const validData = { name: 'John', email: 'john@example.com' };
    
    // Act
    render(<ContactForm onSubmit={mockOnSubmit} />);
    // ... user interactions
    
    // Assert
    expect(mockOnSubmit).toHaveBeenCalledWith(validData);
  });
  
  // Test des cas d'erreur
  it('should display validation errors for invalid data', () => {
    // ...
  });
  
  // Test des interactions utilisateur
  it('should enable submit button when form is valid', () => {
    // ...
  });
});
```

## 📚 Documentation

### Commentaires de Code
```typescript
/**
 * Formulaire de contact avec validation en temps réel
 * 
 * @example
 * ```tsx
 * <ContactForm
 *   initialData={contact}
 *   onSubmit={handleSave}
 *   onCancel={handleCancel}
 * />
 * ```
 */
export const ContactForm = ({ initialData, onSubmit, onCancel }: ContactFormProps) => {
  // Logique de validation en temps réel pour améliorer l'UX
  const validateField = useCallback((field: string, value: string) => {
    // ...
  }, []);
  
  return (
    // JSX avec commentaires explicatifs si nécessaire
    <form onSubmit={handleSubmit}>
      {/* Section des champs obligatoires */}
      <div className="space-y-4">
        {/* ... */}
      </div>
    </form>
  );
};
```

## ✅ Checklist de Revue de Code

Avant de soumettre un composant, vérifier :
- [ ] Structure de fichier respectée
- [ ] Nommage cohérent
- [ ] Types TypeScript définis
- [ ] Gestion d'erreurs implémentée
- [ ] Responsive design appliqué
- [ ] Tests unitaires écrits
- [ ] Documentation JSDoc ajoutée
- [ ] Performance optimisée (useCallback, useMemo si nécessaire)
- [ ] Accessibilité respectée (aria-labels, keyboard navigation)
