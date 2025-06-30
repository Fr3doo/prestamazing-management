
# Conventions de Nommage

## 🏷️ Fichiers et Dossiers

### Règles de Base
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
utility_function.ts     // Pas snake_case
```

### Organisation des Dossiers
```
components/
├── common/              // Composants réutilisables
├── domain/              // Composants spécifiques au domaine
│   ├── Contact/         // PascalCase pour domaines
│   ├── Review/
│   └── Admin/
└── ui/                  // Composants shadcn/ui
```

## 🔧 Variables et Fonctions

### Variables
```typescript
// ✅ Correct
const userName = 'john';                    // camelCase
const API_ENDPOINT = 'https://api.com';     // SCREAMING_SNAKE_CASE pour constantes
const isLoading = false;                    // Préfixe "is/has/can" pour booleans
const hasPermission = true;                 // Boolean descriptif
const canEdit = false;                      // Capacité d'action

// ❌ Incorrect
const user_name = 'john';                   // Pas snake_case
const apiEndpoint = 'https://api.com';      // Constante pas en majuscules
const loading = false;                      // Boolean pas descriptif
```

### Fonctions et Handlers
```typescript
// ✅ Correct - Event Handlers
const handleSubmit = () => {};              // Préfixe "handle" pour events
const handleInputChange = () => {};         // Action spécifique
const handleButtonClick = () => {};         // Contexte clair

// ✅ Correct - Fonctions utilitaires
const formatDate = () => {};               // Action + objet
const validateEmail = () => {};            // Action + contexte
const calculateTotal = () => {};           // Action + résultat

// ✅ Correct - Fonctions de récupération
const getContacts = () => {};              // Préfixe "get" pour retrieval
const fetchUserData = () => {};            // Préfixe "fetch" pour API calls
const loadConfiguration = () => {};        // Préfixe "load" pour initialization

// ❌ Incorrect
const submitHandler = () => {};            // Suffixe "Handler" pas standard
const click = () => {};                    // Pas assez descriptif
const data = () => {};                     // Nom générique
```

## 🧩 Composants

### Composants Principaux
```typescript
// ✅ Correct - Composant principal
export const ContactForm = () => {};
export const UserProfile = () => {};
export const AdminDashboard = () => {};

// ✅ Correct - Sous-composants (même fichier ou fichier séparé)
const ContactFormField = () => {};
const ContactFormActions = () => {};
const UserProfileHeader = () => {};

// ❌ Incorrect
export const contactForm = () => {};        // Pas PascalCase
export const Contact_Form = () => {};       // Pas snake_case
export const ContactFormComponent = () => {}; // Suffixe "Component" redondant
```

### Props et Interfaces
```typescript
// ✅ Correct - Props
interface ContactFormProps {
  initialData?: ContactFormData;
  onSubmit: (data: ContactFormData) => Promise<void>;
  onCancel?: () => void;
}

interface ButtonProps {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

// ✅ Correct - Types de données
interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
}

interface User {
  id: string;
  email: string;
  role: UserRole;
}

// ❌ Incorrect
interface Props {                          // Trop générique
  data: any;                              // Type any à éviter
}
```

## 🎣 Hooks

### Hooks Personnalisés
```typescript
// ✅ Correct - Préfixe "use" obligatoire
export const useContacts = () => {};
export const useContactForm = () => {};
export const useAuthState = () => {};
export const useLocalStorage = () => {};

// ✅ Correct - Hooks spécialisés
export const useContactManagement = () => {};  // Gestion complète
export const useFormValidation = () => {};     // Validation
export const useDataFetching = () => {};       // Récupération de données
export const useErrorHandler = () => {};       // Gestion d'erreurs

// ❌ Incorrect
export const contactHook = () => {};           // Pas de préfixe "use"
export const ContactManager = () => {};       // PascalCase pour composant, pas hook
export const useHook = () => {};               // Nom générique
```

### Valeurs Retournées par les Hooks
```typescript
// ✅ Correct - Noms descriptifs
export const useContacts = () => {
  return {
    contacts,        // Données principales
    loading,         // État de chargement
    error,           // Erreurs
    refetch,         // Action de rechargement
    createContact,   // Actions CRUD
    updateContact,
    deleteContact
  };
};

export const useContactForm = () => {
  return {
    formData,        // Données du formulaire
    errors,          // Erreurs de validation
    isValid,         // État de validation
    isSubmitting,    // État de soumission
    handleSubmit,    // Gestionnaire de soumission
    updateField,     // Mise à jour de champ
    resetForm        // Réinitialisation
  };
};
```

## 📁 Types et Interfaces

### Énumérations et Constantes
```typescript
// ✅ Correct - Énumérations typées
const ContactType = {
  PERSONAL: 'personal',
  PROFESSIONAL: 'professional',
  EMERGENCY: 'emergency'
} as const;
type ContactType = typeof ContactType[keyof typeof ContactType];

const UserRole = {
  ADMIN: 'admin',
  USER: 'user',
  MODERATOR: 'moderator'
} as const;
type UserRole = typeof UserRole[keyof typeof UserRole];

// ✅ Correct - Constantes globales
export const API_ENDPOINTS = {
  CONTACTS: '/api/contacts',
  USERS: '/api/users',
  AUTH: '/api/auth'
} as const;

export const VALIDATION_RULES = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  MIN_PASSWORD_LENGTH: 8,
  MAX_NAME_LENGTH: 100
} as const;
```

### Interfaces Publiques vs Privées
```typescript
// ✅ Correct - Types publics (fichiers types/)
// types/contact.ts
export interface Contact {
  id: string;
  name: string;
  email: string;
  type: ContactType;
  createdAt: Date;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  type: ContactType;
}

// ✅ Correct - Types privés (dans le composant)
// components/domain/Contact/ContactForm.tsx
interface ContactFormState {
  isEditing: boolean;
  hasUnsavedChanges: boolean;
  validationErrors: Record<string, string>;
}

interface ContactFormProps {
  contact?: Contact;
  onSave: (contact: ContactFormData) => Promise<void>;
  onCancel?: () => void;
}
```

## 🔗 Imports et Exports

### Nommage des Imports
```typescript
// ✅ Correct - Imports cohérents
import { ContactForm } from '@/components/domain/Contact/ContactForm';
import { useContacts } from '@/hooks/domain/contact';
import { Contact, ContactFormData } from '@/types/contact';
import { validateEmail } from '@/utils/validation';

// ✅ Correct - Imports avec alias si conflit
import { Button as UIButton } from '@/components/ui/button';
import { Button as CustomButton } from '@/components/common/Button';

// ✅ Correct - Imports de types
import type { Contact } from '@/types/contact';
import type { ComponentProps } from 'react';
```

### Exports Centralisés
```typescript
// ✅ Correct - Index files pour exports publics
// components/domain/Contact/index.ts
export { ContactForm } from './ContactForm';
export { ContactList } from './ContactList';
export { ContactDetails } from './ContactDetails';
export type { ContactFormProps, ContactListProps } from './types';

// hooks/domain/contact/index.ts
export { useContacts } from './useContacts';
export { useContactForm } from './useContactForm';
export { useContactActions } from './useContactActions';
```

## 📋 Règles Spécifiques par Contexte

### API et Services
```typescript
// ✅ Correct - Services
export class ContactService {
  async getContacts(): Promise<Contact[]> {}
  async createContact(data: ContactFormData): Promise<Contact> {}
  async updateContact(id: string, data: Partial<ContactFormData>): Promise<Contact> {}
  async deleteContact(id: string): Promise<void> {}
}

// ✅ Correct - Repositories
export class SupabaseContactRepository implements IContactRepository {
  async findAll(): Promise<Contact[]> {}
  async findById(id: string): Promise<Contact | null> {}
  async create(data: CreateContactData): Promise<Contact> {}
}
```

### Tests
```typescript
// ✅ Correct - Nommage des tests
describe('ContactForm', () => {
  it('should render with initial data', () => {});
  it('should validate required fields', () => {});
  it('should submit form with valid data', async () => {});
  it('should display error message on validation failure', () => {});
});

// ✅ Correct - Mocks et fixtures
export const mockContact: Contact = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  type: ContactType.PERSONAL,
  createdAt: new Date()
};

export const createMockContactRepository = () => ({
  findAll: jest.fn().mockResolvedValue([mockContact]),
  create: jest.fn().mockResolvedValue(mockContact)
});
```

