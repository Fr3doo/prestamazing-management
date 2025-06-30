
# Standards TypeScript

## 📝 Définition des Types

### Interfaces vs Types
```typescript
// ✅ Interfaces pour les objets extensibles
interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  updatedAt?: Date;
}

// Extension d'interface
interface AdminUser extends User {
  permissions: Permission[];
  lastLoginAt?: Date;
}

// ✅ Types pour les unions et compositions
type UserRole = 'admin' | 'user' | 'moderator';
type LoadingState = 'idle' | 'loading' | 'success' | 'error';
type ThemeMode = 'light' | 'dark' | 'system';

// Types utilitaires
type CreateUserData = Omit<User, 'id' | 'createdAt'>;
type UpdateUserData = Partial<Pick<User, 'name' | 'email' | 'role'>>;
type UserWithoutDates = Omit<User, 'createdAt' | 'updatedAt'>;
```

### Props avec Documentation
```typescript
/**
 * Props pour le composant ContactForm
 */
interface ContactFormProps {
  /** Données initiales du contact (mode édition) */
  initialData?: Contact;
  
  /** Callback appelé lors de la soumission du formulaire */
  onSubmit: (data: ContactFormData) => Promise<void>;
  
  /** Callback appelé lors de l'annulation */
  onCancel?: () => void;
  
  /** Indique si le formulaire est en mode édition */
  isEditing?: boolean;
  
  /** Classes CSS additionnelles */
  className?: string;
  
  /** Désactive le formulaire pendant le chargement */
  disabled?: boolean;
}

/**
 * Données de formulaire pour la création/modification d'un contact
 */
interface ContactFormData {
  /** Nom complet du contact (obligatoire) */
  name: string;
  
  /** Adresse email (obligatoire, validée) */
  email: string;
  
  /** Numéro de téléphone (optionnel) */
  phone?: string | null;
  
  /** Type de contact */
  type: ContactType;
  
  /** Notes additionnelles */
  notes?: string;
}
```

### Énumérations Typées
```typescript
// ✅ Const assertions pour les énumérations
const ContactType = {
  PERSONAL: 'personal',
  PROFESSIONAL: 'professional',
  EMERGENCY: 'emergency'
} as const;
type ContactType = typeof ContactType[keyof typeof ContactType];

const ApiStatus = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error'
} as const;
type ApiStatus = typeof ApiStatus[keyof typeof ApiStatus];

// Usage avec validation
const isValidContactType = (type: string): type is ContactType => {
  return Object.values(ContactType).includes(type as ContactType);
};
```

## 🔄 Génériques et Types Avancés

### Génériques pour la Réutilisabilité
```typescript
// Generic API Response
interface ApiResponse<T> {
  data: T;
  message: string;
  status: 'success' | 'error';
  timestamp: Date;
}

// Generic List Props
interface ListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor?: (item: T) => string;
  emptyMessage?: string;
  loading?: boolean;
}

// Generic Form Hook
interface UseFormReturn<T> {
  formData: T;
  errors: Partial<Record<keyof T, string>>;
  isValid: boolean;
  isDirty: boolean;
  updateField: <K extends keyof T>(field: K, value: T[K]) => void;
  resetForm: () => void;
  submitForm: () => Promise<void>;
}

export const useForm = <T extends Record<string, any>>(
  initialData: T,
  validationSchema?: ZodSchema<T>
): UseFormReturn<T> => {
  // Implementation...
};
```

### Types Conditionnels
```typescript
// Type conditionnel pour les props optionnelles
type OptionalProps<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// Props avec variant conditionnel
type ButtonProps<T extends 'button' | 'link' = 'button'> = {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
} & (T extends 'link'
  ? { href: string; to?: never }
  : { href?: never; to?: never }
);

// Hook avec return type conditionnel
type UseDataReturn<T, HasError extends boolean> = {
  data: T | null;
  loading: boolean;
} & (HasError extends true
  ? { error: Error | null }
  : { error?: never }
);

export function useData<T, HasError extends boolean = true>(
  url: string,
  options: { handleError: HasError }
): UseDataReturn<T, HasError>;
```

## 🛡️ Gestion des Erreurs TypeScript

### Types d'Erreur Spécifiques
```typescript
// Base Error
interface BaseError {
  code: string;
  message: string;
  timestamp: Date;
}

// Validation Error
interface ValidationError extends BaseError {
  code: 'VALIDATION_ERROR';
  field: string;
  rule: 'REQUIRED' | 'INVALID_FORMAT' | 'TOO_LONG' | 'TOO_SHORT';
}

// API Error
interface ApiError extends BaseError {
  code: 'API_ERROR';
  status: number;
  endpoint: string;
}

// Network Error
interface NetworkError extends BaseError {
  code: 'NETWORK_ERROR';
  type: 'TIMEOUT' | 'CONNECTION_FAILED' | 'DNS_ERROR';
}

// Union type pour tous les types d'erreur
type AppError = ValidationError | ApiError | NetworkError;

// Type guards
const isValidationError = (error: AppError): error is ValidationError => {
  return error.code === 'VALIDATION_ERROR';
};

const isApiError = (error: AppError): error is ApiError => {
  return error.code === 'API_ERROR';
};
```

### Result Pattern pour la Gestion d'Erreurs
```typescript
// Result type pattern
type Result<T, E = Error> = 
  | { success: true; data: T }
  | { success: false; error: E };

// Utility functions
const success = <T>(data: T): Result<T, never> => ({ success: true, data });
const failure = <E>(error: E): Result<never, E> => ({ success: false, error });

// Usage
const validateEmail = (email: string): Result<string, ValidationError> => {
  if (!email) {
    return failure({
      code: 'VALIDATION_ERROR',
      message: 'Email is required',
      field: 'email',
      rule: 'REQUIRED',
      timestamp: new Date()
    });
  }
  
  if (!email.includes('@')) {
    return failure({
      code: 'VALIDATION_ERROR',
      message: 'Invalid email format',
      field: 'email',
      rule: 'INVALID_FORMAT',
      timestamp: new Date()
    });
  }
  
  return success(email);
};

// Dans un hook
const useContactValidation = () => {
  const validateContact = (data: ContactFormData): Result<ContactFormData, ValidationError[]> => {
    const errors: ValidationError[] = [];
    
    const nameResult = validateName(data.name);
    if (!nameResult.success) errors.push(nameResult.error);
    
    const emailResult = validateEmail(data.email);
    if (!emailResult.success) errors.push(emailResult.error);
    
    if (errors.length > 0) {
      return failure(errors);
    }
    
    return success(data);
  };
  
  return { validateContact };
};
```

## 🧪 Types pour les Tests

### Mock Types
```typescript
// Types pour les mocks
type MockedFunction<T extends (...args: any[]) => any> = jest.MockedFunction<T>;

interface MockContactRepository {
  findAll: MockedFunction<() => Promise<Contact[]>>;
  findById: MockedFunction<(id: string) => Promise<Contact | null>>;
  create: MockedFunction<(data: CreateContactData) => Promise<Contact>>;
  update: MockedFunction<(id: string, data: UpdateContactData) => Promise<Contact>>;
  delete: MockedFunction<(id: string) => Promise<void>>;
}

// Factory pour créer des mocks
const createMockContactRepository = (): MockContactRepository => ({
  findAll: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn()
});

// Test fixtures avec types
interface ContactTestFixture {
  validContact: Contact;
  invalidContact: Partial<Contact>;
  contactFormData: ContactFormData;
  apiResponse: ApiResponse<Contact>;
}

const createContactFixtures = (): ContactTestFixture => ({
  validContact: {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    type: ContactType.PERSONAL,
    createdAt: new Date()
  },
  invalidContact: {
    name: '',
    email: 'invalid-email'
  },
  contactFormData: {
    name: 'John Doe',
    email: 'john@example.com',
    type: ContactType.PERSONAL
  },
  apiResponse: {
    data: {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      type: ContactType.PERSONAL,
      createdAt: new Date()
    },
    message: 'Contact created successfully',
    status: 'success',
    timestamp: new Date()
  }
});
```

### Types pour les Tests de Composants
```typescript
// Render options avec types
interface CustomRenderOptions {
  initialState?: Partial<AppState>;
  user?: Partial<User>;
  theme?: 'light' | 'dark';
  wrapper?: React.ComponentType<{ children: React.ReactNode }>;
}

// Custom render function avec types
const renderWithProviders = (
  ui: React.ReactElement,
  options: CustomRenderOptions = {}
) => {
  const {
    initialState,
    user,
    theme = 'light',
    wrapper: Wrapper = React.Fragment,
    ...renderOptions
  } = options;
  
  // Setup providers with typed options
  const AllProviders = ({ children }: { children: React.ReactNode }) => (
    <Wrapper>
      <ThemeProvider initialTheme={theme}>
        <AuthProvider initialUser={user}>
          <QueryClient>
            {children}
          </QueryClient>
        </AuthProvider>
      </ThemeProvider>
    </Wrapper>
  );
  
  return render(ui, { wrapper: AllProviders, ...renderOptions });
};

// User event helpers avec types
const createUserHelpers = (user: UserEvent) => ({
  async fillContactForm(data: ContactFormData) {
    await user.type(screen.getByLabelText(/nom/i), data.name);
    await user.type(screen.getByLabelText(/email/i), data.email);
    if (data.phone) {
      await user.type(screen.getByLabelText(/téléphone/i), data.phone);
    }
  },
  
  async submitForm() {
    await user.click(screen.getByRole('button', { name: /sauvegarder/i }));
  }
});
```

## 📚 Documentation TypeScript

### JSDoc avec Types
```typescript
/**
 * Service de gestion des contacts
 * 
 * @example
 * ```typescript
 * const contactService = new ContactService(repository);
 * const contacts = await contactService.getAllContacts();
 * ```
 */
export class ContactService {
  constructor(private repository: IContactRepository) {}
  
  /**
   * Récupère tous les contacts
   * 
   * @returns Promise qui résout vers un tableau de contacts
   * @throws {ApiError} Si la requête échoue
   * 
   * @example
   * ```typescript
   * try {
   *   const contacts = await service.getAllContacts();
   *   console.log(`Found ${contacts.length} contacts`);
   * } catch (error) {
   *   if (isApiError(error)) {
   *     console.error(`API Error: ${error.status}`);
   *   }
   * }
   * ```
   */
  async getAllContacts(): Promise<Contact[]> {
    try {
      return await this.repository.findAll();
    } catch (error) {
      throw new ApiError({
        code: 'API_ERROR',
        message: 'Failed to fetch contacts',
        status: 500,
        endpoint: '/contacts',
        timestamp: new Date()
      });
    }
  }
  
  /**
   * Crée un nouveau contact
   * 
   * @param data - Données du contact à créer
   * @returns Promise qui résout vers le contact créé
   * @throws {ValidationError} Si les données sont invalides
   * @throws {ApiError} Si la création échoue
   */
  async createContact(data: ContactFormData): Promise<Contact> {
    const validation = validateContactData(data);
    if (!validation.success) {
      throw validation.error;
    }
    
    return await this.repository.create(data);
  }
}
```

## ✅ Configuration TypeScript Stricte

### tsconfig.json Recommandé
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    
    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    
    /* Linting - Configuration stricte */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noImplicitReturns": true,
    "noImplicitOverride": true,
    "noPropertyAccessFromIndexSignature": true,
    "exactOptionalPropertyTypes": true,
    
    /* Path mapping */
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/hooks/*": ["./src/hooks/*"],
      "@/types/*": ["./src/types/*"],
      "@/utils/*": ["./src/utils/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### Règles ESLint TypeScript
```javascript
// eslint.config.js - TypeScript rules strictes
"@typescript-eslint/no-unused-vars": "error",
"@typescript-eslint/no-explicit-any": "warn",
"@typescript-eslint/no-non-null-assertion": "warn",
"@typescript-eslint/prefer-nullish-coalescing": "error",
"@typescript-eslint/prefer-optional-chain": "error",
"@typescript-eslint/no-unnecessary-type-assertion": "error",
"@typescript-eslint/no-unsafe-assignment": "warn",
"@typescript-eslint/no-unsafe-member-access": "warn",
"@typescript-eslint/no-unsafe-call": "warn",
"@typescript-eslint/no-unsafe-return": "warn",
"@typescript-eslint/strict-boolean-expressions": "error",
"@typescript-eslint/prefer-readonly": "error",
"@typescript-eslint/prefer-as-const": "error"
```

