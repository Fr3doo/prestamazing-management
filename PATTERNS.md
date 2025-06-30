
# Patterns et Architectures Recommandés

## 🏗️ Patterns d'Architecture

### 1. Layered Architecture

```
┌─────────────────────────────────────┐
│           UI Components             │ ← Présentation
├─────────────────────────────────────┤
│              Hooks                  │ ← Logique UI et état
├─────────────────────────────────────┤
│             Services                │ ← Logique métier
├─────────────────────────────────────┤
│           Repositories              │ ── Accès aux données
└─────────────────────────────────────┘
```

#### Implémentation
```typescript
// 1. Repository Layer - Accès aux données
class ContactRepository {
  async findAll(): Promise<Contact[]> {
    const { data } = await supabase.from('contacts').select('*');
    return data || [];
  }
}

// 2. Service Layer - Logique métier
class ContactService {
  constructor(private repo: ContactRepository) {}
  
  async getActiveContacts(): Promise<Contact[]> {
    const contacts = await this.repo.findAll();
    return contacts.filter(c => c.status === 'active');
  }
}

// 3. Hook Layer - État et logique UI
export const useContacts = () => {
  const service = useContactService();
  
  return useQuery({
    queryKey: ['contacts'],
    queryFn: () => service.getActiveContacts()
  });
};

// 4. Component Layer - Présentation
export const ContactList = () => {
  const { data: contacts, loading } = useContacts();
  
  if (loading) return <LoadingSpinner />;
  
  return (
    <div>
      {contacts?.map(contact => 
        <ContactCard key={contact.id} contact={contact} />
      )}
    </div>
  );
};
```

### 2. Composition Pattern

#### Problème - Composant Monolithique
```typescript
// ❌ Éviter - Trop de responsabilités
const ContactManager = ({ 
  contacts, 
  showSearch, 
  showFilters, 
  showPagination,
  onEdit,
  onDelete,
  onAdd,
  searchPlaceholder,
  // ... 20+ props
}) => {
  // 200+ lignes de code
  return (
    <div>
      {showSearch && <SearchBar />}
      {showFilters && <FilterPanel />}
      <ContactList />
      {showPagination && <Pagination />}
    </div>
  );
};
```

#### Solution - Composition
```typescript
// ✅ Préféré - Composition flexible
const ContactManager = ({ children }: { children: React.ReactNode }) => (
  <div className="contact-manager">
    {children}
  </div>
);

const ContactManagerHeader = ({ children }: { children: React.ReactNode }) => (
  <div className="flex justify-between items-center mb-6">
    {children}
  </div>
);

const ContactManagerContent = ({ children }: { children: React.ReactNode }) => (
  <div className="space-y-4">
    {children}
  </div>
);

// Usage flexible
<ContactManager>
  <ContactManagerHeader>
    <SearchBar />
    <FilterPanel />
    <AddButton />
  </ContactManagerHeader>
  
  <ContactManagerContent>
    <ContactList />
    <Pagination />
  </ContactManagerContent>
</ContactManager>
```

### 3. Render Props Pattern

```typescript
// Pattern DataRenderer
interface DataRendererProps<T> {
  data: T[];
  loading: boolean;
  error: string | null;
  children: (state: {
    data: T[];
    loading: boolean;
    error: string | null;
    hasData: boolean;
    isEmpty: boolean;
  }) => React.ReactNode;
}

export const DataRenderer = <T,>({ 
  data, 
  loading, 
  error, 
  children 
}: DataRendererProps<T>) => {
  return (
    <>
      {children({
        data,
        loading,
        error,
        hasData: data.length > 0,
        isEmpty: data.length === 0 && !loading
      })}
    </>
  );
};

// Usage
<DataRenderer data={contacts} loading={loading} error={error}>
  {({ hasData, isEmpty, loading, error }) => (
    <>
      {loading && <LoadingSpinner />}
      {error && <ErrorMessage error={error} />}
      {isEmpty && <EmptyState />}
      {hasData && <ContactList contacts={contacts} />}
    </>
  )}
</DataRenderer>
```

### 4. Hook Composition Pattern

```typescript
// Hooks spécialisés composables
export const useContactManagement = () => {
  const { data: contacts, loading, error, refetch } = useContacts();
  const { createContact, updateContact, deleteContact } = useContactMutations();
  const { searchQuery, filteredContacts } = useContactFilters(contacts);
  const { selectedContacts, toggleSelection } = useContactSelection();
  
  return {
    // Data
    contacts: filteredContacts,
    loading,
    error,
    
    // Actions
    createContact,
    updateContact,
    deleteContact,
    refetch,
    
    // Search & Filter
    searchQuery,
    
    // Selection
    selectedContacts,
    toggleSelection,
  };
};

// Usage dans le composant
const ContactManagerPage = () => {
  const {
    contacts,
    loading,
    createContact,
    searchQuery,
    selectedContacts
  } = useContactManagement();
  
  // Seule la logique de rendu ici
  return (
    <ContactManager>
      {/* ... */}
    </ContactManager>
  );
};
```

## 🔄 Patterns de Gestion d'État

### 1. Local State Pattern

```typescript
// ✅ Pour état simple et local
const ContactForm = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Logique locale uniquement
};
```

### 2. Custom Hook State Pattern

```typescript
// ✅ Pour logique réutilisable
export const useContactForm = (initialData?: ContactFormData) => {
  const [formData, setFormData] = useState(initialData || DEFAULT_FORM_DATA);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const updateField = useCallback((field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  }, [errors]);
  
  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est requis';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Email invalide';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);
  
  const submitForm = useCallback(async (submitFn: (data: ContactFormData) => Promise<void>) => {
    if (!validateForm()) return false;
    
    setIsSubmitting(true);
    try {
      await submitFn(formData);
      return true;
    } catch (error) {
      console.error('Form submission error:', error);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validateForm]);
  
  const resetForm = useCallback(() => {
    setFormData(initialData || DEFAULT_FORM_DATA);
    setErrors({});
    setIsSubmitting(false);
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
```

### 3. Server State Pattern (React Query)

```typescript
// ✅ Pour données serveur
export const useContacts = () => {
  return useQuery({
    queryKey: ['contacts'],
    queryFn: async () => {
      const repository = new ContactRepository();
      return repository.findAll();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

export const useContactMutations = () => {
  const queryClient = useQueryClient();
  
  const createMutation = useMutation({
    mutationFn: async (data: CreateContactData) => {
      const repository = new ContactRepository();
      return repository.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
  });
  
  return {
    createContact: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
  };
};
```

## 🎨 UI Patterns

### 1. Compound Components Pattern

```typescript
// Composant principal avec contexte
const ContactCard = ({ contact, children }: ContactCardProps) => {
  const contextValue = useMemo(() => ({ contact }), [contact]);
  
  return (
    <ContactCardContext.Provider value={contextValue}>
      <div className="border rounded-lg p-4 space-y-3">
        {children}
      </div>
    </ContactCardContext.Provider>
  );
};

// Sous-composants
ContactCard.Header = ({ children }: { children: React.ReactNode }) => {
  const { contact } = useContactCardContext();
  return (
    <div className="flex justify-between items-start">
      <div>
        <h3 className="font-semibold">{contact.name}</h3>
        <p className="text-gray-600">{contact.email}</p>
      </div>
      {children}
    </div>
  );
};

ContactCard.Actions = ({ children }: { children: React.ReactNode }) => (
  <div className="flex gap-2">
    {children}
  </div>
);

ContactCard.Badge = ({ type }: { type: string }) => (
  <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
    {type}
  </span>
);

// Usage
<ContactCard contact={contact}>
  <ContactCard.Header>
    <ContactCard.Badge type={contact.type} />
  </ContactCard.Header>
  
  <ContactCard.Actions>
    <Button onClick={() => onEdit(contact)}>Éditer</Button>
    <Button variant="destructive" onClick={() => onDelete(contact.id)}>
      Supprimer
    </Button>
  </ContactCard.Actions>
</ContactCard>
```

### 2. Polymorphic Components Pattern

```typescript
// Composant polymorphique
interface ButtonProps<T extends React.ElementType = 'button'> {
  as?: T;
  variant?: 'primary' | 'secondary' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

type ButtonPolymorphicProps<T extends React.ElementType> = ButtonProps<T> &
  Omit<React.ComponentPropsWithoutRef<T>, keyof ButtonProps<T>>;

export const Button = <T extends React.ElementType = 'button'>({
  as,
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonPolymorphicProps<T>) => {
  const Component = as || 'button';
  
  const baseClasses = 'inline-flex items-center justify-center rounded font-medium';
  const variantClasses = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
    destructive: 'bg-red-500 text-white hover:bg-red-600',
  };
  const sizeClasses = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  };
  
  const classes = cn(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    className
  );
  
  return (
    <Component className={classes} {...props}>
      {children}
    </Component>
  );
};

// Usage
<Button>Button normal</Button>
<Button as="a" href="/contact">Lien bouton</Button>
<Button as={Link} to="/dashboard">React Router Link</Button>
```

## 🛡️ Error Handling Patterns

### 1. Error Boundary Pattern

```typescript
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ContactErrorBoundary extends Component<
  PropsWithChildren<{}>,
  ErrorBoundaryState
> {
  constructor(props: PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }
  
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Contact Error Boundary caught an error:', error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 border border-red-200 bg-red-50 rounded">
          <h2 className="text-red-800 font-semibold mb-2">
            Erreur dans les contacts
          </h2>
          <p className="text-red-600 text-sm">
            Une erreur est survenue lors du chargement des contacts.
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="mt-2 px-3 py-1 bg-red-100 text-red-800 rounded text-sm hover:bg-red-200"
          >
            Réessayer
          </button>
        </div>
      );
    }
    
    return this.props.children;
  }
}

// Usage
<ContactErrorBoundary>
  <ContactList />
</ContactErrorBoundary>
```

### 2. Async Error Pattern

```typescript
export const useAsyncError = () => {
  const [error, setError] = useState<Error | null>(null);
  
  const executeAsync = useCallback(async <T>(
    asyncFn: () => Promise<T>,
    errorContext?: string
  ): Promise<T | null> => {
    try {
      setError(null);
      return await asyncFn();
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      
      if (errorContext) {
        console.error(`${errorContext}:`, error);
      }
      
      setError(error);
      return null;
    }
  }, []);
  
  const clearError = useCallback(() => setError(null), []);
  
  return { error, executeAsync, clearError };
};

// Usage
const ContactList = () => {
  const { data: contacts, loading } = useContacts();
  const { error, executeAsync } = useAsyncError();
  
  const handleDeleteContact = async (id: string) => {
    const result = await executeAsync(
      () => deleteContact(id),
      'Delete contact'
    );
    
    if (result) {
      toast.success('Contact supprimé');
    }
  };
  
  if (error) {
    return <ErrorMessage error={error} onRetry={() => window.location.reload()} />;
  }
  
  // ...
};
```

## 🚀 Performance Patterns

### 1. Memoization Pattern

```typescript
// Memoization des composants coûteux
const ContactCard = React.memo(({ 
  contact, 
  onEdit, 
  onDelete 
}: ContactCardProps) => {
  // Memoization des callbacks
  const handleEdit = useCallback(() => {
    onEdit(contact);
  }, [contact, onEdit]);
  
  const handleDelete = useCallback(() => {
    onDelete(contact.id);
  }, [contact.id, onDelete]);
  
  // Memoization des calculs coûteux
  const displayName = useMemo(() => {
    return `${contact.firstName} ${contact.lastName}`.trim();
  }, [contact.firstName, contact.lastName]);
  
  return (
    <div className="border rounded p-4">
      <h3>{displayName}</h3>
      <p>{contact.email}</p>
      <div className="mt-2">
        <Button onClick={handleEdit}>Éditer</Button>
        <Button onClick={handleDelete} variant="destructive">
          Supprimer
        </Button>
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  // Comparaison personnalisée pour éviter les re-renders inutiles
  return (
    prevProps.contact.id === nextProps.contact.id &&
    prevProps.contact.updatedAt === nextProps.contact.updatedAt
  );
});
```

### 2. Virtual Scrolling Pattern

```typescript
// Pour de grandes listes
import { VariableSizeList as List } from 'react-window';

interface VirtualContactListProps {
  contacts: Contact[];
  onEdit: (contact: Contact) => void;
  onDelete: (id: string) => void;
}

const VirtualContactList = ({ contacts, onEdit, onDelete }: VirtualContactListProps) => {
  const getItemSize = useCallback((index: number) => {
    // Hauteur basée sur le contenu du contact
    const contact = contacts[index];
    return contact.description ? 120 : 80;
  }, [contacts]);
  
  const ContactItem = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const contact = contacts[index];
    
    return (
      <div style={style}>
        <ContactCard
          contact={contact}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </div>
    );
  };
  
  return (
    <List
      height={600}
      itemCount={contacts.length}
      itemSize={getItemSize}
      width="100%"
    >
      {ContactItem}
    </List>
  );
};
```

## 📚 Pattern Summary

### Quand Utiliser Chaque Pattern

| Pattern | Cas d'Usage | Avantages |
|---------|-------------|-----------|
| **Composition** | Composants flexibles et réutilisables | Réutilisabilité, maintenabilité |
| **Render Props** | Logique réutilisable avec UI flexible | Séparation logique/présentation |
| **Custom Hooks** | État et logique réutilisables | Testabilité, réutilisabilité |
| **Compound Components** | APIs de composants intuitives | API propre, flexibilité |
| **Error Boundaries** | Gestion d'erreurs robuste | Isolation des erreurs |
| **Memoization** | Optimisation des performances | Performance, évite re-renders |

### Anti-Patterns à Éviter

```typescript
// ❌ Props drilling excessif
<Parent>
  <Child1 data={data} onUpdate={onUpdate}>
    <Child2 data={data} onUpdate={onUpdate}>
      <Child3 data={data} onUpdate={onUpdate} />
    </Child2>
  </Child1>
</Parent>

// ✅ Context ou composition
<DataProvider value={{ data, onUpdate }}>
  <Parent>
    <Child1>
      <Child2>
        <Child3 />
      </Child2>
    </Child1>
  </Parent>
</DataProvider>

// ❌ Composants trop larges
const MegaComponent = () => {
  // 500+ lignes de code
  // Multiples responsabilités
};

// ✅ Décomposition
const ContactManager = () => (
  <div>
    <ContactHeader />
    <ContactFilters />
    <ContactList />
    <ContactPagination />
  </div>
);
```
