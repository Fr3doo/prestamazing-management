
# Patterns de Composants

## 🧩 Compound Components Pattern

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

## 🔀 Polymorphic Components Pattern

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

## ✨ Conditional Rendering Pattern

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

## 🎨 Composant avec Variantes

```typescript
// Système de variantes avec cva
import { cva, type VariantProps } from "class-variance-authority";

const cardVariants = cva(
  "rounded-lg border bg-card text-card-foreground shadow-sm",
  {
    variants: {
      variant: {
        default: "border-border",
        destructive: "border-destructive bg-destructive/10",
        success: "border-green-200 bg-green-50",
        warning: "border-yellow-200 bg-yellow-50",
      },
      size: {
        sm: "p-4",
        md: "p-6",
        lg: "p-8",
      },
      interactive: {
        true: "cursor-pointer hover:shadow-md transition-shadow",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      interactive: false,
    },
  }
);

interface CardProps 
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  children: React.ReactNode;
}

export const Card = ({ 
  className, 
  variant, 
  size, 
  interactive, 
  children,
  ...props 
}: CardProps) => {
  return (
    <div
      className={cn(cardVariants({ variant, size, interactive }), className)}
      {...props}
    >
      {children}
    </div>
  );
};

// Usage
<Card variant="success" size="lg" interactive>
  <h3>Succès</h3>
  <p>Opération réussie</p>
</Card>
```

## 🔧 Pattern de Configuration

```typescript
// Configuration centralisée des composants
interface ComponentConfig {
  colors: {
    primary: string;
    secondary: string;
    success: string;
    warning: string;
    error: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  animation: {
    duration: string;
    easing: string;
  };
}

const defaultConfig: ComponentConfig = {
  colors: {
    primary: 'blue-500',
    secondary: 'gray-500',
    success: 'green-500',
    warning: 'yellow-500',
    error: 'red-500',
  },
  spacing: {
    xs: 'p-1',
    sm: 'p-2',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8',
  },
  animation: {
    duration: 'duration-200',
    easing: 'ease-in-out',
  },
};

// Context pour la configuration
const ComponentConfigContext = createContext<ComponentConfig>(defaultConfig);

export const useComponentConfig = () => {
  const context = useContext(ComponentConfigContext);
  if (!context) {
    throw new Error('useComponentConfig must be used within ComponentConfigProvider');
  }
  return context;
};

// Provider
export const ComponentConfigProvider = ({ 
  config = defaultConfig, 
  children 
}: {
  config?: Partial<ComponentConfig>;
  children: React.ReactNode;
}) => {
  const mergedConfig = { ...defaultConfig, ...config };
  
  return (
    <ComponentConfigContext.Provider value={mergedConfig}>
      {children}
    </ComponentConfigContext.Provider>
  );
};

// Usage dans un composant
const ThemedButton = ({ children, variant = 'primary' }: ThemedButtonProps) => {
  const config = useComponentConfig();
  
  return (
    <button 
      className={cn(
        `bg-${config.colors[variant]}`,
        config.spacing.md,
        `transition-colors ${config.animation.duration} ${config.animation.easing}`
      )}
    >
      {children}
    </button>
  );
};
```
