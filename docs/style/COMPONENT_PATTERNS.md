
# Patterns de Composants

## 🧩 Structure Standard d'un Composant

### Template de Base
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

## 🎯 Patterns Recommandés

### 1. Composition Pattern
```typescript
// ✅ Préféré - Composition flexible
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
  // ... 10+ props
/>
```

### 2. Render Props Pattern
```typescript
// ✅ Recommandé - Flexibilité maximale
<DataRenderer data={contacts} loading={loading} error={error}>
  {({ data, hasData, isEmpty }) => (
    <>
      {isEmpty && <EmptyState />}
      {hasData && <ContactList contacts={data} />}
    </>
  )}
</DataRenderer>

// Implementation du DataRenderer
interface DataRendererProps<T> {
  data: T[] | undefined;
  loading: boolean;
  error: Error | null;
  children: (state: {
    data: T[];
    hasData: boolean;
    isEmpty: boolean;
    isLoading: boolean;
    hasError: boolean;
  }) => React.ReactNode;
}

export const DataRenderer = <T,>({ 
  data, 
  loading, 
  error, 
  children 
}: DataRendererProps<T>) => {
  const state = {
    data: data || [],
    hasData: !loading && !error && data && data.length > 0,
    isEmpty: !loading && !error && (!data || data.length === 0),
    isLoading: loading,
    hasError: !!error
  };
  
  return <>{children(state)}</>;
};
```

### 3. Hook Composition Pattern
```typescript
// ✅ Séparer la logique dans des hooks
const useContactForm = (initialData?: ContactFormData) => {
  const [formData, setFormData] = useState(initialData || DEFAULT_FORM_DATA);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const updateField = useCallback((field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  }, [errors]);
  
  const submitForm = useCallback(async (submitFn: Function) => {
    setIsSubmitting(true);
    try {
      await submitFn(formData);
      setErrors({});
    } catch (error) {
      // Handle errors
    } finally {
      setIsSubmitting(false);
    }
  }, [formData]);
  
  const resetForm = useCallback(() => {
    setFormData(initialData || DEFAULT_FORM_DATA);
    setErrors({});
  }, [initialData]);
  
  return {
    formData,
    errors,
    isSubmitting,
    updateField,
    submitForm,
    resetForm,
    isValid: Object.keys(errors).length === 0
  };
};

// Utilisation dans le composant - Seule la logique de rendu
const ContactForm = ({ initialData, onSubmit }: ContactFormProps) => {
  const {
    formData,
    errors,
    isSubmitting,
    updateField,
    submitForm,
    resetForm
  } = useContactForm(initialData);
  
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      submitForm(onSubmit);
    }}>
      {/* Rendu du formulaire */}
    </form>
  );
};
```

### 4. Compound Components Pattern
```typescript
// ✅ API intuitive avec contexte partagé
<Card>
  <Card.Header>
    <Card.Title>Contact Details</Card.Title>
    <Card.Actions>
      <Button>Edit</Button>
      <Button variant="destructive">Delete</Button>
    </Card.Actions>
  </Card.Header>
  <Card.Content>
    <ContactDetails />
  </Card.Content>
  <Card.Footer>
    <Button>Save Changes</Button>
  </Card.Footer>
</Card>

// Implementation
const CardContext = React.createContext<CardContextType | null>(null);

const Card = ({ children, ...props }: CardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <CardContext.Provider value={{ isExpanded, setIsExpanded }}>
      <div className="bg-white border rounded-lg shadow" {...props}>
        {children}
      </div>
    </CardContext.Provider>
  );
};

Card.Header = ({ children }: { children: React.ReactNode }) => (
  <div className="flex justify-between items-center p-4 border-b">
    {children}
  </div>
);

Card.Title = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-lg font-semibold">{children}</h3>
);

// ... autres sous-composants
```

## 🔄 Patterns de Gestion d'État

### État Local Simple
```typescript
// ✅ Pour des données simples et locales
const ContactForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isValid, setIsValid] = useState(false);
  
  useEffect(() => {
    setIsValid(name.length > 0 && email.includes('@'));
  }, [name, email]);
  
  return (
    <form>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      <button disabled={!isValid}>Submit</button>
    </form>
  );
};
```

### État avec useReducer
```typescript
// ✅ Pour des états complexes avec logique
interface FormState {
  data: ContactFormData;
  errors: Record<string, string>;
  isSubmitting: boolean;
  isDirty: boolean;
}

type FormAction = 
  | { type: 'UPDATE_FIELD'; field: string; value: string }
  | { type: 'SET_ERRORS'; errors: Record<string, string> }
  | { type: 'SET_SUBMITTING'; isSubmitting: boolean }
  | { type: 'RESET_FORM' };

const formReducer = (state: FormState, action: FormAction): FormState => {
  switch (action.type) {
    case 'UPDATE_FIELD':
      return {
        ...state,
        data: { ...state.data, [action.field]: action.value },
        isDirty: true,
        errors: { ...state.errors, [action.field]: '' }
      };
    case 'SET_ERRORS':
      return { ...state, errors: action.errors };
    case 'SET_SUBMITTING':
      return { ...state, isSubmitting: action.isSubmitting };
    case 'RESET_FORM':
      return initialState;
    default:
      return state;
  }
};

const ContactForm = () => {
  const [state, dispatch] = useReducer(formReducer, initialState);
  
  const updateField = useCallback((field: string, value: string) => {
    dispatch({ type: 'UPDATE_FIELD', field, value });
  }, []);
  
  return (
    // JSX utilisant state et dispatch
  );
};
```

## 🎨 Patterns UI

### Polymorphic Components
```typescript
// ✅ Composants flexibles avec différents éléments HTML
interface ButtonProps<T extends React.ElementType = 'button'> {
  as?: T;
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
}

type ButtonPropsWithoutRef<T extends React.ElementType> = ButtonProps<T> & 
  Omit<React.ComponentPropsWithoutRef<T>, keyof ButtonProps<T>>;

export const Button = <T extends React.ElementType = 'button'>({
  as,
  variant = 'primary',
  children,
  className,
  ...props
}: ButtonPropsWithoutRef<T>) => {
  const Component = as || 'button';
  
  return (
    <Component
      className={cn(
        'px-4 py-2 rounded font-medium',
        variant === 'primary' && 'bg-blue-500 text-white',
        variant === 'secondary' && 'bg-gray-200 text-gray-800',
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
};

// Usage
<Button>Regular Button</Button>
<Button as="a" href="/contact">Link Button</Button>
<Button as={Link} to="/about">Router Link</Button>
```

### Conditional Rendering Pattern
```typescript
// ✅ Rendu conditionnel propre
const ContactList = ({ contacts, loading, error }: ContactListProps) => {
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  if (!contacts?.length) return <EmptyState message="Aucun contact trouvé" />;
  
  return (
    <div className="space-y-4">
      {contacts.map(contact => (
        <ContactCard key={contact.id} contact={contact} />
      ))}
    </div>
  );
};

// ✅ Avec early returns pour éviter la pyramide
const ContactDetails = ({ contactId }: { contactId: string }) => {
  const { data: contact, loading, error } = useContact(contactId);
  
  if (loading) {
    return <ContactDetailsSkeleton />;
  }
  
  if (error) {
    return <ErrorBoundary error={error} />;
  }
  
  if (!contact) {
    return <NotFoundMessage />;
  }
  
  return (
    <div>
      <ContactHeader contact={contact} />
      <ContactBody contact={contact} />
      <ContactActions contact={contact} />
    </div>
  );
};
```

## 📋 Templates Prêts à l'Emploi

### Template Formulaire
```typescript
interface FormTemplateProps<T> {
  initialData?: T;
  onSubmit: (data: T) => Promise<void>;
  onCancel?: () => void;
  validationSchema?: any;
}

export const FormTemplate = <T extends Record<string, any>>({
  initialData,
  onSubmit,
  onCancel,
  validationSchema
}: FormTemplateProps<T>) => {
  const {
    formData,
    errors,
    isSubmitting,
    updateField,
    submitForm,
    resetForm
  } = useGenericForm(initialData, validationSchema);
  
  return (
    <form onSubmit={submitForm} className="space-y-6">
      {/* Champs dynamiques basés sur le schéma */}
      <div className="flex justify-end space-x-4">
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Annuler
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Sauvegarde...' : 'Sauvegarder'}
        </Button>
      </div>
    </form>
  );
};
```

### Template Liste
```typescript
interface ListTemplateProps<T> {
  items: T[];
  loading?: boolean;
  error?: Error | null;
  renderItem: (item: T) => React.ReactNode;
  emptyMessage?: string;
  className?: string;
}

export const ListTemplate = <T extends { id: string }>({
  items,
  loading,
  error,
  renderItem,
  emptyMessage = "Aucun élément trouvé",
  className = "space-y-4"
}: ListTemplateProps<T>) => {
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  if (!items?.length) return <EmptyState message={emptyMessage} />;
  
  return (
    <div className={className}>
      {items.map(item => (
        <div key={item.id}>
          {renderItem(item)}
        </div>
      ))}
    </div>
  );
};
```

