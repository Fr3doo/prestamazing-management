import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@/test/utils/test-utils';
import PartnerForm from '../PartnerForm';

describe('PartnerForm', () => {
  it('updates partner_name field correctly', () => {
    render(<PartnerForm onSuccess={vi.fn()} onCancel={vi.fn()} />);
    const input = screen.getByLabelText('Nom du partenaire *');
    fireEvent.change(input, { target: { value: 'Test Partner' } });
    expect(input).toHaveValue('Test Partner');
  });
});
