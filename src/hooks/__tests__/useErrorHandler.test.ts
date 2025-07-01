
import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useErrorHandler } from '../useErrorHandler';

// Mock the toast hook
vi.mock('../useStandardToast', () => ({
  useStandardToast: () => ({
    showError: vi.fn(),
  }),
}));

describe('useErrorHandler', () => {
  const mockShowError = vi.fn();
  
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset console.error mock
    vi.spyOn(console, 'error').mockImplementation(() => {});
    
    // Mock the useStandardToast hook
    const { useStandardToast } = require('../useStandardToast');
    useStandardToast.mockReturnValue({ showError: mockShowError });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('handleError', () => {
    it('should handle Error objects correctly', () => {
      const { result } = renderHook(() => useErrorHandler());
      const error = new Error('Test error message');
      
      const message = result.current.handleError(error);
      
      expect(message).toBe('Test error message');
      expect(console.error).toHaveBeenCalledWith('Error:', error);
      expect(mockShowError).toHaveBeenCalledWith('Erreur', 'Test error message');
    });

    it('should handle non-Error objects with default message', () => {
      const { result } = renderHook(() => useErrorHandler());
      
      const message = result.current.handleError('string error');
      
      expect(message).toBe("Une erreur inattendue s'est produite");
      expect(mockShowError).toHaveBeenCalledWith('Erreur', "Une erreur inattendue s'est produite");
    });

    it('should use custom title and default message', () => {
      const { result } = renderHook(() => useErrorHandler());
      
      result.current.handleError(new Error('Test'), {
        title: 'Custom Title',
        defaultMessage: 'Custom default',
      });
      
      expect(mockShowError).toHaveBeenCalledWith('Custom Title', 'Test');
    });

    it('should use custom log context', () => {
      const { result } = renderHook(() => useErrorHandler());
      const error = new Error('Test error');
      
      result.current.handleError(error, { logContext: 'CustomContext' });
      
      expect(console.error).toHaveBeenCalledWith('CustomContext:', error);
    });

    it('should not show toast when showToast is false', () => {
      const { result } = renderHook(() => useErrorHandler());
      
      result.current.handleError(new Error('Test'), { showToast: false });
      
      expect(mockShowError).not.toHaveBeenCalled();
    });
  });

  describe('handleAsyncError', () => {
    it('should return result when async operation succeeds', async () => {
      const { result } = renderHook(() => useErrorHandler());
      const asyncOperation = vi.fn().mockResolvedValue('success');
      
      const resultValue = await result.current.handleAsyncError(asyncOperation);
      
      expect(resultValue).toBe('success');
      expect(asyncOperation).toHaveBeenCalled();
      expect(mockShowError).not.toHaveBeenCalled();
    });

    it('should handle error and return null when async operation fails', async () => {
      const { result } = renderHook(() => useErrorHandler());
      const error = new Error('Async error');
      const asyncOperation = vi.fn().mockRejectedValue(error);
      
      const resultValue = await result.current.handleAsyncError(asyncOperation);
      
      expect(resultValue).toBeNull();
      expect(mockShowError).toHaveBeenCalledWith('Erreur', 'Async error');
      expect(console.error).toHaveBeenCalledWith('Error:', error);
    });

    it('should use custom error options for async errors', async () => {
      const { result } = renderHook(() => useErrorHandler());
      const error = new Error('Async error');
      const asyncOperation = vi.fn().mockRejectedValue(error);
      
      await result.current.handleAsyncError(asyncOperation, {
        title: 'Async Error',
        logContext: 'AsyncContext',
      });
      
      expect(mockShowError).toHaveBeenCalledWith('Async Error', 'Async error');
      expect(console.error).toHaveBeenCalledWith('AsyncContext:', error);
    });
  });
});
