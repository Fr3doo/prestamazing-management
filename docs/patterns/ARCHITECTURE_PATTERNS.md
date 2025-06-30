
# Patterns d'Architecture

## 🏗️ Layered Architecture

### Structure Recommandée
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

### Implémentation
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

## 🔄 Composition Pattern

### Problème - Composant Monolithique
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

### Solution - Composition
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

## 📊 Render Props Pattern

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

## 🎣 Hook Composition Pattern

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

## 📋 Patterns de Gestion d'État

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
