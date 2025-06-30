
// Messages d'erreur standardisés
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Erreur de connexion réseau',
  VALIDATION_ERROR: 'Erreur de validation des données',
  PERMISSION_DENIED: 'Accès refusé',
  RESOURCE_NOT_FOUND: 'Ressource non trouvée',
  GENERIC_ERROR: 'Une erreur inattendue s\'est produite'
} as const;

// Messages de succès standardisés
export const SUCCESS_MESSAGES = {
  CREATED: 'Création réussie',
  UPDATED: 'Mise à jour réussie',
  DELETED: 'Suppression réussie',
  SAVED: 'Sauvegarde réussie'
} as const;

// Configuration des timeouts
export const TIMEOUTS = {
  API_REQUEST: 30000,
  TOAST_DURATION: 5000,
  DEBOUNCE_DELAY: 300
} as const;

// Patterns de validation communes
export const VALIDATION_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  URL: /^https?:\/\/.+/,
  PHONE: /^[+]?[\d\s-()]+$/
} as const;
