
# Patterns de Performance

## 🚀 Memoization Pattern

### React.memo pour Composants
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

### useMemo et useCallback
```typescript
// Hook optimisé avec memoization
export const useOptimizedContactList = (contacts: Contact[]) => {
  // Memoization des calculs coûteux
  const processedContacts = useMemo(() => {
    return contacts
      .filter(contact => contact.isActive)
      .sort((a, b) => a.name.localeCompare(b.name))
      .map(contact => ({
        ...contact,
        displayName: `${contact.firstName} ${contact.lastName}`,
        initials: `${contact.firstName[0]}${contact.lastName[0]}`.toUpperCase()
      }));
  }, [contacts]);
  
  // Memoization des callbacks
  const handleContactSelect = useCallback((contactId: string) => {
    console.log('Selected contact:', contactId);
    // Logique de sélection
  }, []);
  
  const handleBulkAction = useCallback((action: string, contactIds: string[]) => {
    console.log(`Bulk ${action} for:`, contactIds);
    // Logique d'action en lot
  }, []);
  
  return {
    processedContacts,
    handleContactSelect,
    handleBulkAction
  };
};
```

## 📜 Virtual Scrolling Pattern

```typescript
// Pour de grandes listes
import { VariableSizeList as List } from 'react-window';

interface VirtualContactListProps {
  contacts: Contact[];
  onEdit: (contact: Contact) => void;
  onDelete: (id: string) => void;
}

const VirtualContactList = ({ contacts, onEdit, onDelete }: VirtualContactListProps) => {
  const listRef = useRef<List>(null);
  
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
  
  // Scroll to specific item
  const scrollToContact = useCallback((contactId: string) => {
    const index = contacts.findIndex(c => c.id === contactId);
    if (index !== -1 && listRef.current) {
      listRef.current.scrollToItem(index, 'center');
    }
  }, [contacts]);
  
  return (
    <div>
      <List
        ref={listRef}
        height={600}
        itemCount={contacts.length}
        itemSize={getItemSize}
        width="100%"
        overscanCount={5} // Précharge 5 éléments avant/après la vue
      >
        {ContactItem}
      </List>
    </div>
  );
};
```

## ⚡ Lazy Loading Pattern

### Composants Lazy
```typescript
// Chargement différé des composants
const AdminDashboard = lazy(() => import('../pages/AdminDashboard'));
const ContactDetails = lazy(() => import('../components/ContactDetails'));
const ReportsPage = lazy(() => import('../pages/ReportsPage'));

// Composant avec Suspense
const LazyRoute = ({ component: Component, fallback, ...props }: LazyRouteProps) => (
  <Suspense fallback={fallback || <LoadingSpinner />}>
    <Component {...props} />
  </Suspense>
);

// Usage dans le router
<Routes>
  <Route 
    path="/admin" 
    element={
      <LazyRoute 
        component={AdminDashboard} 
        fallback={<AdminLoadingSkeleton />} 
      />
    } 
  />
  <Route 
    path="/contact/:id" 
    element={
      <LazyRoute 
        component={ContactDetails} 
        fallback={<ContactDetailsSkeleton />} 
      />
    } 
  />
</Routes>
```

### Images Lazy
```typescript
// Composant d'image avec lazy loading
interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
}

export const LazyImage = ({ src, alt, className, placeholder }: LazyImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    
    if (imgRef.current) {
      observer.observe(imgRef.current);
    }
    
    return () => observer.disconnect();
  }, []);
  
  return (
    <div ref={imgRef} className={className}>
      {isInView && (
        <img
          src={src}
          alt={alt}
          className={cn(
            'transition-opacity duration-300',
            isLoaded ? 'opacity-100' : 'opacity-0'
          )}
          onLoad={() => setIsLoaded(true)}
        />
      )}
      {(!isInView || !isLoaded) && placeholder && (
        <div className="bg-gray-200 animate-pulse">{placeholder}</div>
      )}
    </div>
  );
};
```

## 🔄 Data Fetching Optimization

### Optimistic Updates
```typescript
export const useOptimisticContacts = () => {
  const queryClient = useQueryClient();
  
  const createContactMutation = useMutation({
    mutationFn: (newContact: CreateContactData) => 
      contactRepository.create(newContact),
    
    // Update optimiste
    onMutate: async (newContact) => {
      // Annuler les queries en cours
      await queryClient.cancelQueries({ queryKey: ['contacts'] });
      
      // Snapshot de l'état précédent
      const previousContacts = queryClient.getQueryData(['contacts']);
      
      // Update optimiste
      const optimisticContact = {
        id: `temp-${Date.now()}`,
        ...newContact,
        createdAt: new Date(),
      };
      
      queryClient.setQueryData(['contacts'], (old: Contact[] = []) => [
        ...old,
        optimisticContact
      ]);
      
      return { previousContacts, optimisticContact };
    },
    
    // Rollback en cas d'erreur
    onError: (err, newContact, context) => {
      if (context?.previousContacts) {
        queryClient.setQueryData(['contacts'], context.previousContacts);
      }
    },
    
    // Sync finale
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
  });
  
  return { createContact: createContactMutation.mutateAsync };
};
```

### Background Refetch
```typescript
export const useBackgroundSync = () => {
  const queryClient = useQueryClient();
  
  // Sync périodique en arrière-plan
  useEffect(() => {
    const interval = setInterval(() => {
      // Refetch silencieux des données importantes
      queryClient.refetchQueries({
        queryKey: ['contacts'],
        type: 'active', // Seulement les queries actives
      });
    }, 5 * 60 * 1000); // Toutes les 5 minutes
    
    return () => clearInterval(interval);
  }, [queryClient]);
  
  // Sync au focus de la fenêtre
  useEffect(() => {
    const handleFocus = () => {
      queryClient.refetchQueries({
        stale: true, // Seulement les données stale
      });
    };
    
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [queryClient]);
};
```

## 🎯 Code Splitting Pattern

### Route-based Splitting
```typescript
// Splitting par route
const routes = [
  {
    path: '/dashboard',
    component: lazy(() => import('../pages/Dashboard')),
  },
  {
    path: '/contacts',
    component: lazy(() => import('../pages/Contacts')),
  },
  {
    path: '/reports',
    component: lazy(() => import('../pages/Reports')),
  },
] as const;

// Router avec splitting automatique
export const AppRouter = () => (
  <Router>
    <Routes>
      {routes.map(({ path, component: Component }) => (
        <Route
          key={path}
          path={path}
          element={
            <Suspense fallback={<PageLoadingSkeleton />}>
              <Component />
            </Suspense>
          }
        />
      ))}
    </Routes>
  </Router>
);
```

### Feature-based Splitting
```typescript
// Splitting par feature
export const ContactFeature = {
  ContactList: lazy(() => import('./ContactList')),
  ContactForm: lazy(() => import('./ContactForm')),
  ContactDetails: lazy(() => import('./ContactDetails')),
};

// Dynamic import conditionnel
export const useFeatureImport = () => {
  const importFeature = useCallback(async (featureName: string) => {
    switch (featureName) {
      case 'admin':
        return import('../features/admin');
      case 'reports':
        return import('../features/reports');
      case 'analytics':
        return import('../features/analytics');
      default:
        throw new Error(`Unknown feature: ${featureName}`);
    }
  }, []);
  
  return { importFeature };
};
```

## 📊 Performance Monitoring

```typescript
// Hook de monitoring des performances
export const usePerformanceMonitor = (label: string) => {
  const startTime = useRef<number>(Date.now());
  const [metrics, setMetrics] = useState<{
    renderTime: number;
    mountTime: number;
  }>({ renderTime: 0, mountTime: 0 });
  
  useEffect(() => {
    // Temps de montage
    const mountTime = Date.now() - startTime.current;
    setMetrics(prev => ({ ...prev, mountTime }));
    
    console.log(`[${label}] Mount time: ${mountTime}ms`);
  }, [label]);
  
  useLayoutEffect(() => {
    // Temps de rendu
    const renderTime = Date.now() - startTime.current;
    setMetrics(prev => ({ ...prev, renderTime }));
    
    console.log(`[${label}] Render time: ${renderTime}ms`);
  });
  
  // Reset timer pour le prochain rendu
  useEffect(() => {
    startTime.current = Date.now();
  });
  
  return metrics;
};

// Usage
const ContactList = () => {
  const metrics = usePerformanceMonitor('ContactList');
  // ... reste du composant
};
```

## 🔧 Bundle Optimization

```typescript
// Analyse de bundle avec Webpack Bundle Analyzer
// package.json
{
  "scripts": {
    "analyze": "npm run build && npx webpack-bundle-analyzer build/static/js/*.js"
  }
}

// Optimisation des imports
// ❌ Import complet
import * as lodash from 'lodash';

// ✅ Import sélectif
import { debounce, throttle } from 'lodash';

// ❌ Import de toute la librairie d'icônes
import * as Icons from 'lucide-react';

// ✅ Import sélectif
import { Search, User, Settings } from 'lucide-react';
```
