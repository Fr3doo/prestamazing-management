
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { z } from 'zod';
import { useGenericForm } from '@/hooks/useGenericForm';

const mockSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
});

describe('useGenericForm', () => {
  const mockSubmitFunction = vi.fn();
  const mockOnSuccess = vi.fn();
  const mockOnError = vi.fn();

  const defaultConfig = {
    initialData: { name: '', email: '' },
    validationSchema: mockSchema,
    submitFunction: mockSubmitFunction,
    onSuccess: mockOnSuccess,
    onError: mockOnError,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with correct initial data', () => {
    const { result } = renderHook(() => useGenericForm(defaultConfig));

    expect(result.current.formData).toEqual({ name: '', email: '' });
    expect(result.current.errors).toEqual({});
    expect(result.current.loading).toBe(false);
  });

  it('should update form data when handleInputChange is called', () => {
    const { result } = renderHook(() => useGenericForm(defaultConfig));

    act(() => {
      result.current.handleInputChange('name', 'John Doe');
    });

    expect(result.current.formData.name).toBe('John Doe');
  });

  it('should validate field and set error when validation fails', () => {
    const { result } = renderHook(() => useGenericForm(defaultConfig));

    act(() => {
      result.current.handleInputChange('email', 'invalid-email');
    });

    expect(result.current.errors.email).toBe('Invalid email format');
  });

  it('should clear error when field becomes valid', () => {
    const { result } = renderHook(() => useGenericForm(defaultConfig));

    // First set invalid value
    act(() => {
      result.current.handleInputChange('email', 'invalid-email');
    });
    
    expect(result.current.errors.email).toBe('Invalid email format');

    // Then set valid value
    act(() => {
      result.current.handleInputChange('email', 'john@example.com');
    });

    expect(result.current.errors.email).toBe('');
  });

  it('should reset form when resetForm is called', () => {
    const { result } = renderHook(() => useGenericForm(defaultConfig));

    // Change form data
    act(() => {
      result.current.handleInputChange('name', 'John Doe');
      result.current.handleInputChange('email', 'john@example.com');
    });

    expect(result.current.formData.name).toBe('John Doe');

    // Reset form
    act(() => {
      result.current.resetForm();
    });

    expect(result.current.formData).toEqual({ name: '', email: '' });
    expect(result.current.errors).toEqual({});
  });
});
