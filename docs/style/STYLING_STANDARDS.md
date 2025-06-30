
# Standards de Styling

## 🎨 Classes Tailwind Standardisées

### Styles de Base
```typescript
// Constantes de styles réutilisables
export const styles = {
  // Cards
  card: "bg-white border border-gray-200 rounded-lg shadow-sm p-6",
  cardHover: "bg-white border border-gray-200 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow",
  
  // Buttons
  button: {
    primary: "bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded font-medium transition-colors",
    secondary: "bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded font-medium transition-colors",
    destructive: "bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded font-medium transition-colors",
    ghost: "hover:bg-gray-100 text-gray-700 px-4 py-2 rounded font-medium transition-colors"
  },
  
  // Inputs
  input: "w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent",
  inputError: "w-full p-2 border border-red-300 rounded focus:ring-2 focus:ring-red-500 focus:border-transparent",
  
  // Labels
  label: "block text-sm font-medium text-gray-700 mb-1",
  labelRequired: "block text-sm font-medium text-gray-700 mb-1 after:content-['*'] after:text-red-500 after:ml-1",
  
  // Layout
  container: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
  section: "py-12 sm:py-16 lg:py-20",
  
  // Spacing
  spacing: {
    form: "space-y-6",
    formField: "space-y-2",
    buttonGroup: "flex space-x-4",
    list: "space-y-4"
  }
} as const;

// Usage
<div className={styles.card}>
  <button className={styles.button.primary}>Sauvegarder</button>
</div>
```

### Classes Utilitaires Personnalisées
```css
/* styles/utilities.css */

/* Layout utilities */
.layout-centered {
  @apply flex items-center justify-center min-h-screen;
}

.layout-sidebar {
  @apply flex h-screen bg-gray-50;
}

.layout-main-content {
  @apply flex-1 flex flex-col overflow-hidden;
}

/* Form utilities */
.form-group {
  @apply space-y-2;
}

.form-error {
  @apply text-sm text-red-600 mt-1;
}

.form-help {
  @apply text-sm text-gray-500 mt-1;
}

/* Card utilities */
.card-shadow {
  @apply shadow-sm hover:shadow-md transition-shadow duration-200;
}

.card-interactive {
  @apply cursor-pointer transform hover:scale-[1.02] transition-transform duration-200;
}

/* Loading states */
.skeleton {
  @apply animate-pulse bg-gray-200 rounded;
}

.skeleton-text {
  @apply skeleton h-4 w-full;
}

.skeleton-circle {
  @apply skeleton rounded-full;
}
```

## 📱 Responsive Design

### Breakpoints Standardisés
```typescript
// Utiliser les breakpoints Tailwind de manière cohérente
const responsiveClasses = {
  // sm: 640px, md: 768px, lg: 1024px, xl: 1280px, 2xl: 1536px
  
  // Layout responsive
  container: "w-full sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl mx-auto",
  grid: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4",
  
  // Typography responsive
  heading: "text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold",
  body: "text-sm sm:text-base md:text-lg",
  
  // Spacing responsive
  padding: "p-4 sm:p-6 md:p-8 lg:p-10",
  margin: "m-4 sm:m-6 md:m-8 lg:m-10"
};

// Mobile-first approach
<div className="w-full md:w-1/2 lg:w-1/3">
  <h1 className="text-xl md:text-2xl lg:text-3xl">Titre</h1>
  <p className="text-sm md:text-base">Contenu</p>
</div>
```

### Composants Responsifs
```typescript
// Composant avec props responsive
interface ResponsiveCardProps {
  children: React.ReactNode;
  cols?: {
    sm?: number;
    md?: number;
    lg?: number;
  };
}

const ResponsiveCard = ({ children, cols = { sm: 1, md: 2, lg: 3 } }: ResponsiveCardProps) => {
  const gridClasses = cn(
    "grid gap-4",
    `grid-cols-${cols.sm}`,
    `sm:grid-cols-${cols.md}`,
    `lg:grid-cols-${cols.lg}`
  );
  
  return (
    <div className={gridClasses}>
      {children}
    </div>
  );
};
```

## 🌈 Système de Couleurs

### Palette Standardisée
```typescript
// Configuration des couleurs dans tailwind.config.ts
const colors = {
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    500: '#3b82f6',  // Couleur principale
    600: '#2563eb',
    700: '#1d4ed8',
    900: '#1e3a8a'
  },
  secondary: {
    50: '#f9fafb',
    100: '#f3f4f6',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    900: '#111827'
  },
  success: {
    50: '#f0fdf4',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d'
  },
  warning: {
    50: '#fffbeb',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309'
  },
  danger: {
    50: '#fef2f2',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c'
  }
};

// Usage cohérent
<button className="bg-primary-500 hover:bg-primary-600 text-white">
  Action Principale
</button>
<button className="bg-secondary-100 hover:bg-secondary-200 text-secondary-700">
  Action Secondaire
</button>
```

### States et Variantes
```typescript
// Variantes de composants avec couleurs cohérentes
const buttonVariants = {
  primary: "bg-primary-500 hover:bg-primary-600 text-white",
  secondary: "bg-secondary-100 hover:bg-secondary-200 text-secondary-700",
  success: "bg-success-500 hover:bg-success-600 text-white",
  warning: "bg-warning-500 hover:bg-warning-600 text-white",
  danger: "bg-danger-500 hover:bg-danger-600 text-white",
  ghost: "hover:bg-secondary-100 text-secondary-700"
};

const alertVariants = {
  info: "bg-primary-50 border-primary-200 text-primary-800",
  success: "bg-success-50 border-success-200 text-success-800",
  warning: "bg-warning-50 border-warning-200 text-warning-800",
  error: "bg-danger-50 border-danger-200 text-danger-800"
};
```

## 🎭 Animations et Transitions

### Transitions Standards
```typescript
// Classes d'animation réutilisables
const animations = {
  transition: "transition-all duration-200 ease-in-out",
  fadeIn: "animate-in fade-in duration-200",
  fadeOut: "animate-out fade-out duration-200",
  slideIn: "animate-in slide-in-from-bottom-4 duration-300",
  slideOut: "animate-out slide-out-to-bottom-4 duration-300",
  scaleIn: "animate-in zoom-in-95 duration-200",
  scaleOut: "animate-out zoom-out-95 duration-200"
};

// States interactifs
const interactiveStates = {
  hover: "hover:scale-105 hover:shadow-lg transition-all duration-200",
  active: "active:scale-95 transition-all duration-100",
  focus: "focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 outline-none",
  disabled: "disabled:opacity-50 disabled:cursor-not-allowed"
};

// Usage
<button className={cn(
  "px-4 py-2 rounded",
  buttonVariants.primary,
  interactiveStates.hover,
  interactiveStates.focus,
  interactiveStates.disabled
)}>
  Action
</button>
```

### Composants Animés
```typescript
// Composant avec animations intégrées
const AnimatedCard = ({ children, isVisible }: AnimatedCardProps) => (
  <div className={cn(
    "bg-white rounded-lg shadow-sm p-6",
    "transform transition-all duration-300",
    isVisible 
      ? "opacity-100 scale-100 translate-y-0" 
      : "opacity-0 scale-95 translate-y-4"
  )}>
    {children}
  </div>
);

// Loading states animés
const LoadingButton = ({ isLoading, children, ...props }: LoadingButtonProps) => (
  <button 
    {...props}
    disabled={isLoading}
    className={cn(
      "relative px-4 py-2 rounded",
      "transition-all duration-200",
      isLoading && "cursor-not-allowed"
    )}
  >
    {isLoading && (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
      </div>
    )}
    <span className={isLoading ? "opacity-0" : "opacity-100"}>
      {children}
    </span>
  </button>
);
```

## 🎯 Organisation CSS

### Structure des Fichiers CSS
```
styles/
├── base.css           # Reset, typography, base styles
├── components.css     # Styles de composants
├── utilities.css      # Classes utilitaires
├── variables.css      # Variables CSS custom
├── animations.css     # Animations et keyframes
└── tailwind.css       # Import et configuration Tailwind
```

### Variables CSS Personnalisées
```css
/* styles/variables.css */
:root {
  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  
  /* Border radius */
  --radius-sm: 0.25rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  
  /* Z-index scale */
  --z-dropdown: 1000;
  --z-modal: 1020;
  --z-popover: 1030;
  --z-tooltip: 1040;
}

/* Dark mode variables */
@media (prefers-color-scheme: dark) {
  :root {
    --color-background: #0f1419;
    --color-foreground: #f1f5f9;
    --color-muted: #64748b;
  }
}
```

### Composants CSS Réutilisables
```css
/* styles/components.css */

/* Form components */
.form-field {
  @apply space-y-2;
}

.form-input {
  @apply w-full px-3 py-2 border border-gray-300 rounded-md;
  @apply focus:ring-2 focus:ring-primary-500 focus:border-transparent;
  @apply transition-all duration-200;
}

.form-input--error {
  @apply border-red-300 focus:ring-red-500;
}

.form-label {
  @apply block text-sm font-medium text-gray-700 mb-1;
}

.form-error {
  @apply text-sm text-red-600 mt-1;
}

/* Card components */
.card {
  @apply bg-white border border-gray-200 rounded-lg shadow-sm;
}

.card--interactive {
  @apply cursor-pointer transition-all duration-200;
  @apply hover:shadow-md hover:scale-[1.01];
}

.card--elevated {
  @apply shadow-lg;
}

/* Button components */
.btn {
  @apply inline-flex items-center justify-center px-4 py-2 text-sm font-medium;
  @apply rounded-md transition-all duration-200 focus:outline-none focus:ring-2;
}

.btn--primary {
  @apply bg-primary-500 text-white hover:bg-primary-600;
  @apply focus:ring-primary-500 focus:ring-offset-2;
}

.btn--secondary {
  @apply bg-gray-100 text-gray-700 hover:bg-gray-200;
  @apply focus:ring-gray-500 focus:ring-offset-2;
}
```

## 🎨 Thèmes et Mode Sombre

### Configuration des Thèmes
```typescript
// providers/ThemeProvider.tsx
const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches 
        ? 'dark' 
        : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Usage dans les composants
const ThemedCard = () => (
  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
    <h2 className="text-gray-900 dark:text-gray-100">Titre</h2>
    <p className="text-gray-600 dark:text-gray-300">Contenu</p>
  </div>
);
```

