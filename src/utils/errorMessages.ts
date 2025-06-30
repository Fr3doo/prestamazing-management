
/**
 * Messages d'erreur standardisés pour l'application
 */
export const ERROR_MESSAGES = {
  // Erreurs génériques
  UNKNOWN: 'Une erreur inattendue s\'est produite',
  NETWORK: 'Problème de connexion réseau',
  TIMEOUT: 'L\'opération a pris trop de temps',
  
  // Erreurs d'authentification
  AUTH_FAILED: 'Échec de l\'authentification',
  AUTH_EXPIRED: 'Session expirée, veuillez vous reconnecter',
  AUTH_DENIED: 'Accès non autorisé',
  
  // Erreurs de données
  DATA_NOT_FOUND: 'Données introuvables',
  DATA_INVALID: 'Données non valides',
  DATA_SAVE_FAILED: 'Échec de la sauvegarde',
  
  // Erreurs de formulaire
  FORM_VALIDATION: 'Veuillez corriger les erreurs du formulaire',
  FORM_SUBMIT_FAILED: 'Échec de l\'envoi du formulaire',
  
  // Erreurs de chargement
  LOAD_FAILED: 'Échec du chargement des données',
  LOAD_PARTIAL: 'Chargement partiel des données',
} as const;

export type ErrorMessageKey = keyof typeof ERROR_MESSAGES;

/**
 * Utilitaire pour obtenir un message d'erreur standardisé
 */
export const getErrorMessage = (key: ErrorMessageKey, fallback?: string): string => {
  return ERROR_MESSAGES[key] || fallback || ERROR_MESSAGES.UNKNOWN;
};
