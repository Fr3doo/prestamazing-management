
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@/test/utils/test-utils';
import FormField from '@/components/common/FormField';

describe('FormField', () => {
  it('should render input field with label', () => {
    const mockOnChange = vi.fn();
    render(
      <FormField 
        type="input"
        label="Test Label"
        value=""
        onChange={mockOnChange}
        fieldId="test-field"
      />
    );
    
    expect(screen.getByLabelText('Test Label')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('should display error message when error prop is provided', () => {
    const errorMessage = 'This field is required';
    const mockOnChange = vi.fn();
    render(
      <FormField 
        type="input"
        label="Test Label"
        value=""
        onChange={mockOnChange}
        error={errorMessage}
        fieldId="test-field"
      />
    );
    
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('should call onChange when input value changes', () => {
    const mockOnChange = vi.fn();
    render(
      <FormField 
        type="input"
        label="Test Label"
        value=""
        onChange={mockOnChange}
        fieldId="test-field"
      />
    );
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'new value' } });
    
    expect(mockOnChange).toHaveBeenCalledWith('new value');
  });

  it('should render textarea when type is textarea', () => {
    const mockOnChange = vi.fn();
    render(
      <FormField 
        type="textarea"
        label="Test Label"
        value=""
        onChange={mockOnChange}
        fieldId="test-field"
      />
    );
    
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('should show required indicator when required prop is true', () => {
    const mockOnChange = vi.fn();
    render(
      <FormField 
        type="input"
        label="Test Label"
        value=""
        onChange={mockOnChange}
        required
        fieldId="test-field"
      />
    );
    
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('should render select field with options', () => {
    const mockOnChange = vi.fn();
    const options = [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' }
    ];
    
    render(
      <FormField 
        type="select"
        label="Test Select"
        value=""
        onChange={mockOnChange}
        options={options}
        fieldId="test-select"
      />
    );
    
    expect(screen.getByLabelText('Test Select')).toBeInTheDocument();
  });
});
