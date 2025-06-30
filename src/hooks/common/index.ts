export { useErrorHandler } from '../useErrorHandler';
export { useFormSubmission } from '../useFormSubmission';
export { useDataFetching } from '../useDataFetching';
export { useLoadingState } from '../useLoadingState';
export { useLoadingSpinner } from '../useLoadingSpinner';

// Types communs pour les hooks
export type { ErrorHandlerOptions } from '../useErrorHandler';
export type { FormSubmissionOptions } from '../useFormSubmission';
export type { DataFetchingOptions } from '../useDataFetching';
export type { LoadingStateOptions } from '../useLoadingState';

// Nouveau système de gestion d'erreurs
export { useSimpleErrorHandler } from '../useSimpleErrorHandler';
export { useErrorLevels } from '../useErrorLevels';
export { useFormErrorHandler } from '../useFormErrorHandler';
export { useDataErrorHandler } from '../useDataErrorHandler';

// Types pour la gestion d'erreurs
export type { ErrorLevel, SimpleErrorOptions } from '../useSimpleErrorHandler';
export type { ErrorMessageKey } from '@/utils/errorMessages';
