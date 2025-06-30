
# Gestion d'État

## 🎯 État Local vs Global

### Quand Utiliser l'État Local
```typescript
// ✅ État local pour données de formulaire
const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [errors, setErrors] = useState({});
  
  // Logique de formulaire...
};

// ✅ État local pour interactions UI
const CollapsibleCard = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  
  // Logique d'affichage...
};
```

### Quand Utiliser l'État Global
```typescript
// ✅ État global pour données partagées
const { user, isAuthenticated, login, logout } = useAuth();
const { theme, toggleTheme } = useTheme();

// ✅ État global pour données serveur (React Query)
const { data: contacts, loading, error, refetch } = useQuery({
  queryKey: ['contacts'],
  queryFn: fetchContacts
});
```

## 🔄 Patterns de Mise à Jour d'État

### État Immutable
```typescript
// ✅ Mise à jour immutable correcte
const [formData, setFormData] = useState({
  user: { name: '', email: '' },
  preferences: { theme: 'light', notifications: true }
});

// Mise à jour d'un champ nested
const updateUserName = (name: string) => {
  setFormData(prev => ({
    ...prev,
    user: {
      ...prev.user,
      name
    }
  }));
};

// Mise à jour d'un array
const [items, setItems] = useState([]);

const addItem = (newItem) => {
  setItems(prev => [...prev, newItem]);
};

const updateItem = (id, updates) => {
  setItems(prev => prev.map(item => 
    item.id === id ? { ...item, ...updates } : item
  ));
};

const removeItem = (id) => {
  setItems(prev => prev.filter(item => item.id !== id));
};
```

### Optimisation avec useCallback
```typescript
// ✅ Callback pour éviter les re-renders
const ContactForm = ({ onSubmit }: ContactFormProps) => {
  const [formData, setFormData] = useState(initialData);
  
  const handleFieldChange = useCallback((field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []); // Pas de dépendances car on utilise la fonction form
  
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Submission failed:', error);
    }
  }, [formData, onSubmit]);
  
  return (
    <form onSubmit={handleSubmit}>
      <input onChange={(e) => handleFieldChange('name', e.target.value)} />
    </form>
  );
};
```

### Réinitialisation Propre
```typescript
// ✅ Réinitialisation avec dépendances
const ContactForm = ({ initialData, isEditing }: ContactFormProps) => {
  const [formData, setFormData] = useState(initialData || DEFAULT_VALUES);
  const [errors, setErrors] = useState({});
  
  const resetForm = useCallback(() => {
    setFormData(initialData || DEFAULT_VALUES);
    setErrors({});
  }, [initialData]);
  
  // Réinitialiser quand les props changent
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      setErrors({});
    }
  }, [initialData]);
  
  return (
    <form>
      {/* Formulaire */}
      <Button type="button" onClick={resetForm}>
        Réinitialiser
      </Button>
    </form>
  );
};
```

## 🎣 Hooks Personnalisés

### Hook de Formulaire Générique
```typescript
interface UseFormOptions<T> {
  initialData?: T;
  validationSchema?: any;
  onSubmit?: (data: T) => Promise<void>;
}

export const useForm = <T extends Record<string, any>>({
  initialData,
  validationSchema,
  onSubmit
}: UseFormOptions<T>) => {
  const [formData, setFormData] = useState<T>(initialData || {} as T);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  
  const updateField = useCallback((field: keyof T, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
    
    // Clear error when user starts typing
    if (errors[field as string]) {
      setErrors(prev => ({ ...prev, [field as string]: '' }));
    }
  }, [errors]);
  
  const validateForm = useCallback(() => {
    if (!validationSchema) return true;
    
    const result = validationSchema.safeParse(formData);
    if (!result.success) {
      const formattedErrors = result.error.errors.reduce((acc, err) => ({
        ...acc,
        [err.path[0]]: err.message
      }), {});
      setErrors(formattedErrors);
      return false;
    }
    
    setErrors({});
    return true;
  }, [formData, validationSchema]);
  
  const submitForm = useCallback(async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit?.(formData);
      setIsDirty(false);
    } catch (error) {
      console.error('Form submission failed:', error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validateForm, onSubmit]);
  
  const resetForm = useCallback(() => {
    setFormData(initialData || {} as T);
    setErrors({});
    setIsDirty(false);
  }, [initialData]);
  
  return {
    formData,
    errors,
    isSubmitting,
    isDirty,
    isValid: Object.keys(errors).length === 0,
    updateField,
    submitForm,
    resetForm,
    validateForm
  };
};
```

### Hook de Gestion de Liste
```typescript
export const useListManagement = <T extends { id: string }>(
  initialItems: T[] = []
) => {
  const [items, setItems] = useState<T[]>(initialItems);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  
  const addItem = useCallback((item: T) => {
    setItems(prev => [...prev, item]);
  }, []);
  
  const updateItem = useCallback((id: string, updates: Partial<T>) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  }, []);
  
  const removeItem = useCallback((id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);
  
  const toggleSelection = useCallback((id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);
  
  const selectAll = useCallback(() => {
    setSelectedIds(new Set(items.map(item => item.id)));
  }, [items]);
  
  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);
  
  const filteredItems = useMemo(() => {
    if (!searchTerm) return items;
    return items.filter(item => 
      Object.values(item).some(value => 
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [items, searchTerm]);
  
  return {
    items,
    filteredItems,
    selectedIds,
    selectedItems: items.filter(item => selectedIds.has(item.id)),
    searchTerm,
    setSearchTerm,
    addItem,
    updateItem,
    removeItem,
    toggleSelection,
    selectAll,
    clearSelection,
    hasSelection: selectedIds.size > 0,
    selectionCount: selectedIds.size
  };
};
```

## 🌐 Server State avec React Query

### Configuration de Base
```typescript
// hooks/useContacts.ts
export const useContacts = () => {
  return useQuery({
    queryKey: ['contacts'],
    queryFn: async () => {
      const response = await fetch('/api/contacts');
      if (!response.ok) throw new Error('Failed to fetch contacts');
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000,   // 10 minutes
  });
};

export const useCreateContact = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (contactData: ContactFormData) => {
      const response = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactData)
      });
      if (!response.ok) throw new Error('Failed to create contact');
      return response.json();
    },
    onSuccess: () => {
      // Invalider le cache pour refetch
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    }
  });
};
```

### Optimistic Updates
```typescript
export const useUpdateContact = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Contact> }) => {
      const response = await fetch(`/api/contacts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to update contact');
      return response.json();
    },
    onMutate: async ({ id, data }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['contacts'] });
      
      // Snapshot previous value
      const previousContacts = queryClient.getQueryData(['contacts']);
      
      // Optimistically update
      queryClient.setQueryData(['contacts'], (old: Contact[]) =>
        old?.map(contact => 
          contact.id === id ? { ...contact, ...data } : contact
        )
      );
      
      return { previousContacts };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousContacts) {
        queryClient.setQueryData(['contacts'], context.previousContacts);
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    }
  });
};
```

### Hook Composé pour CRUD
```typescript
export const useContactManagement = () => {
  const contactsQuery = useContacts();
  const createMutation = useCreateContact();
  const updateMutation = useUpdateContact();
  const deleteMutation = useDeleteContact();
  
  const createContact = useCallback(async (data: ContactFormData) => {
    try {
      await createMutation.mutateAsync(data);
      toast.success('Contact créé avec succès');
    } catch (error) {
      toast.error('Erreur lors de la création');
      throw error;
    }
  }, [createMutation]);
  
  const updateContact = useCallback(async (id: string, data: Partial<Contact>) => {
    try {
      await updateMutation.mutateAsync({ id, data });
      toast.success('Contact mis à jour');
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
      throw error;
    }
  }, [updateMutation]);
  
  const deleteContact = useCallback(async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success('Contact supprimé');
    } catch (error) {
      toast.error('Erreur lors de la suppression');
      throw error;
    }
  }, [deleteMutation]);
  
  return {
    // Data
    contacts: contactsQuery.data,
    isLoading: contactsQuery.isLoading,
    error: contactsQuery.error,
    
    // Actions
    createContact,
    updateContact,
    deleteContact,
    refetch: contactsQuery.refetch,
    
    // States
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isMutating: createMutation.isPending || updateMutation.isPending || deleteMutation.isPending
  };
};
```

## 🔄 Patterns de Synchronisation

### Synchronisation Props → État Local
```typescript
const EditableContactForm = ({ contact, isEditing }: Props) => {
  const [formData, setFormData] = useState(contact);
  
  // Synchroniser quand le contact change
  useEffect(() => {
    setFormData(contact);
  }, [contact]);
  
  // Réinitialiser quand on sort du mode édition
  useEffect(() => {
    if (!isEditing) {
      setFormData(contact);
    }
  }, [isEditing, contact]);
  
  return (
    // Formulaire...
  );
};
```

### Debouncing pour Recherche
```typescript
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  
  return debouncedValue;
};

// Usage dans un composant de recherche
const ContactSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  
  const { data: contacts } = useQuery({
    queryKey: ['contacts', 'search', debouncedSearchTerm],
    queryFn: () => searchContacts(debouncedSearchTerm),
    enabled: !!debouncedSearchTerm
  });
  
  return (
    <input 
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Rechercher des contacts..."
    />
  );
};
```

