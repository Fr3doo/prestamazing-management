
import { useCallback, useState } from 'react';

/**
 * Hook optimisé pour la gestion des champs de formulaire
 * Respecte la Loi de Déméter en encapsulant l'accès aux champs
 */
export function useFormFields<T extends Record<string, any>>(initialState: T) {
  const [fields, setFields] = useState<T>(initialState);

  // Encapsule l'accès aux champs individuels
  const getField = useCallback(<K extends keyof T>(key: K): T[K] => fields[key], [fields]);

  // Encapsule la modification des champs individuels
  const setField = useCallback(<K extends keyof T>(key: K, value: T[K]) => {
    setFields(prev => ({ ...prev, [key]: value }));
  }, []);

  // Méthodes d'accès encapsulées pour éviter le chaînage
  const getFieldValue = useCallback(<K extends keyof T>(key: K): T[K] => getField(key), [getField]);
  
  const getFieldsSnapshot = useCallback(() => ({ ...fields }), [fields]);
  
  const resetFields = useCallback(() => setFields(initialState), [initialState]);
  
  const updateFields = useCallback((updates: Partial<T>) => {
    setFields(prev => ({ ...prev, ...updates }));
  }, []);

  // Validation encapsulée
  const validateField = useCallback(<K extends keyof T>(
    key: K, 
    validator: (value: T[K]) => boolean
  ): boolean => {
    return validator(getField(key));
  }, [getField]);

  const validateAllFields = useCallback((
    validators: Partial<Record<keyof T, (value: any) => boolean>>
  ): Record<keyof T, boolean> => {
    const results = {} as Record<keyof T, boolean>;
    Object.keys(validators).forEach(key => {
      const validator = validators[key as keyof T];
      if (validator) {
        results[key as keyof T] = validator(getField(key as keyof T));
      }
    });
    return results;
  }, [getField]);

  return { 
    fields, 
    setFields, 
    getField, 
    setField,
    // Méthodes encapsulées
    getFieldValue,
    getFieldsSnapshot,
    resetFields,
    updateFields,
    validateField,
    validateAllFields
  };
}

export type UseFormFieldsReturn<T extends Record<string, any>> = ReturnType<typeof useFormFields<T>>;
