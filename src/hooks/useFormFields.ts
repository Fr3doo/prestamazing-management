import { useCallback, useState } from 'react';

/**
 * Manage form fields with dedicated getters and setters.
 */
export function useFormFields<T extends Record<string, any>>(initialState: T) {
  const [fields, setFields] = useState<T>(initialState);

  const getField = useCallback(<K extends keyof T>(key: K): T[K] => fields[key], [fields]);

  const setField = useCallback(<K extends keyof T>(key: K, value: T[K]) => {
    setFields(prev => ({ ...prev, [key]: value }));
  }, []);

  return { fields, setFields, getField, setField };
}

export type UseFormFieldsReturn<T extends Record<string, any>> = ReturnType<typeof useFormFields<T>>;
