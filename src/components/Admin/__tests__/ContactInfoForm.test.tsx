import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@/test/utils/test-utils';
import ContactInfoForm from '../ContactInfoForm';

describe('ContactInfoForm', () => {
  it('updates label and value fields', () => {
    render(<ContactInfoForm onSuccess={vi.fn()} onCancel={vi.fn()} />);
    const labelInput = screen.getByLabelText('Libellé');
    fireEvent.change(labelInput, { target: { value: 'Principal' } });
    expect(labelInput).toHaveValue('Principal');

    const valueInput = screen.getByLabelText('Valeur *');
    fireEvent.change(valueInput, { target: { value: 'test value' } });
    expect(valueInput).toHaveValue('test value');
  });
});
