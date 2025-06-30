
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@/test/utils/test-utils';
import FormField from '@/components/common/FormField';

describe('FormField', () => {
  const defaultProps = {
    label: 'Test Label',
    value: '',
    onChange: vi.fn(),
    error: '',
  };

  it('should render input field with label', () => {
    render(<FormField {...defaultProps} />);
    
    expect(screen.getByLabelText('Test Label')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('should display error message when error prop is provided', () => {
    const errorMessage = 'This field is required';
    render(<FormField {...defaultProps} error={errorMessage} />);
    
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('should call onChange when input value changes', () => {
    const mockOnChange = vi.fn();
    render(<FormField {...defaultProps} onChange={mockOnChange} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'new value' } });
    
    expect(mockOnChange).toHaveBeenCalledWith('new value');
  });

  it('should render textarea when type is textarea', () => {
    render(<FormField {...defaultProps} type="textarea" />);
    
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('should show required indicator when required prop is true', () => {
    render(<FormField {...defaultProps} required />);
    
    expect(screen.getByText('*')).toBeInTheDocument();
  });
});
