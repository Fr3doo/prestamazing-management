
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@/test/utils/test-utils';
import PartnerFormFields from '../PartnerFormFields';

describe('PartnerFormFields', () => {
  const defaultProps = {
    partnerName: '',
    websiteUrl: '',
    onPartnerNameChange: vi.fn(),
    onWebsiteUrlChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render partner name input', () => {
    render(<PartnerFormFields {...defaultProps} />);
    
    const input = screen.getByLabelText('Nom du partenaire *');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('required');
  });

  it('should render website URL input', () => {
    render(<PartnerFormFields {...defaultProps} />);
    
    const input = screen.getByLabelText('Site web');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'url');
  });

  it('should call onPartnerNameChange when partner name changes', () => {
    render(<PartnerFormFields {...defaultProps} />);
    
    const input = screen.getByLabelText('Nom du partenaire *');
    fireEvent.change(input, { target: { value: 'Test Partner' } });
    
    expect(defaultProps.onPartnerNameChange).toHaveBeenCalledWith('Test Partner');
  });

  it('should call onWebsiteUrlChange when website URL changes', () => {
    render(<PartnerFormFields {...defaultProps} />);
    
    const input = screen.getByLabelText('Site web');
    fireEvent.change(input, { target: { value: 'https://example.com' } });
    
    expect(defaultProps.onWebsiteUrlChange).toHaveBeenCalledWith('https://example.com');
  });

  it('should show website preview link when URL is provided', () => {
    render(<PartnerFormFields {...defaultProps} websiteUrl="https://example.com" />);
    
    const link = screen.getByRole('link', { name: /tester le lien/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'https://example.com');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('should not show website preview link when URL is empty', () => {
    render(<PartnerFormFields {...defaultProps} />);
    
    const link = screen.queryByRole('link', { name: /tester le lien/i });
    expect(link).not.toBeInTheDocument();
  });

  it('should display current values correctly', () => {
    render(
      <PartnerFormFields 
        {...defaultProps} 
        partnerName="Test Partner"
        websiteUrl="https://example.com"
      />
    );
    
    expect(screen.getByDisplayValue('Test Partner')).toBeInTheDocument();
    expect(screen.getByDisplayValue('https://example.com')).toBeInTheDocument();
  });
});
