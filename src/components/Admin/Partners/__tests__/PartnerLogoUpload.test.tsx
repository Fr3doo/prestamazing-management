
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@/test/utils/test-utils';
import PartnerLogoUpload from '../PartnerLogoUpload';

describe('PartnerLogoUpload', () => {
  const defaultProps = {
    logoPreview: '',
    logoFile: null,
    onFileChange: vi.fn(),
    onClearLogo: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render upload area when no logo is selected', () => {
    render(<PartnerLogoUpload {...defaultProps} />);
    
    expect(screen.getByText('Logo du partenaire *')).toBeInTheDocument();
    expect(screen.getByText('Cliquez pour télécharger')).toBeInTheDocument();
    expect(screen.getByText('PNG, JPG, GIF (MAX. 2MB)')).toBeInTheDocument();
  });

  it('should render logo preview when logo is selected', () => {
    const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    render(
      <PartnerLogoUpload 
        {...defaultProps} 
        logoPreview="data:image/jpeg;base64,test"
        logoFile={mockFile}
      />
    );
    
    expect(screen.getByAltText('Aperçu du logo')).toBeInTheDocument();
    expect(screen.getByText('test.jpg')).toBeInTheDocument();
  });

  it('should show current logo text when no file but preview exists', () => {
    render(
      <PartnerLogoUpload 
        {...defaultProps} 
        logoPreview="https://example.com/logo.jpg"
      />
    );
    
    expect(screen.getByText('Logo actuel')).toBeInTheDocument();
  });

  it('should display file size when file is selected', () => {
    const mockFile = new File(['x'.repeat(1024)], 'test.jpg', { type: 'image/jpeg' });
    render(
      <PartnerLogoUpload 
        {...defaultProps} 
        logoPreview="data:image/jpeg;base64,test"
        logoFile={mockFile}
      />
    );
    
    expect(screen.getByText('1.0 KB')).toBeInTheDocument();
  });

  it('should call onFileChange when file is selected', () => {
    render(<PartnerLogoUpload {...defaultProps} />);
    
    const input = screen.getByRole('button').querySelector('input[type="file"]');
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    
    if (input) {
      fireEvent.change(input, { target: { files: [file] } });
      expect(defaultProps.onFileChange).toHaveBeenCalled();
    }
  });

  it('should call onClearLogo when clear button is clicked', () => {
    render(
      <PartnerLogoUpload 
        {...defaultProps} 
        logoPreview="data:image/jpeg;base64,test"
      />
    );
    
    const clearButton = screen.getByRole('button');
    fireEvent.click(clearButton);
    
    expect(defaultProps.onClearLogo).toHaveBeenCalled();
  });

  it('should have correct file input attributes', () => {
    render(<PartnerLogoUpload {...defaultProps} />);
    
    const input = screen.getByRole('button').querySelector('input[type="file"]');
    expect(input).toHaveAttribute('accept', 'image/*');
    expect(input).toHaveClass('hidden');
  });
});
