import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useFormFields } from '@/hooks/useFormFields';

describe('useFormFields', () => {
  it('should update field with setField and retrieve with getField', () => {
    const { result } = renderHook(() => useFormFields({ name: '', email: '' }));

    act(() => {
      result.current.setField('name', 'John');
    });

    expect(result.current.getField('name')).toBe('John');
    expect(result.current.fields.name).toBe('John');
  });
});
