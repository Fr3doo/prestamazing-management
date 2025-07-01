
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render } from '@/test/utils/test-utils';
import { useLocation } from 'react-router-dom';
import ScrollToTop from '../ScrollToTop';

// Mock react-router-dom
vi.mock('react-router-dom', () => ({
  useLocation: vi.fn(),
}));

describe('ScrollToTop', () => {
  const mockUseLocation = vi.mocked(useLocation);
  
  beforeEach(() => {
    // Mock window.scrollTo
    global.scrollTo = vi.fn();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should scroll to top when pathname changes', () => {
    mockUseLocation.mockReturnValue({ pathname: '/' } as any);
    
    const { rerender } = render(<ScrollToTop />);
    
    expect(global.scrollTo).toHaveBeenCalledWith(0, 0);
    
    // Change pathname
    mockUseLocation.mockReturnValue({ pathname: '/about' } as any);
    rerender(<ScrollToTop />);
    
    expect(global.scrollTo).toHaveBeenCalledTimes(2);
    expect(global.scrollTo).toHaveBeenLastCalledWith(0, 0);
  });

  it('should not render anything visible', () => {
    mockUseLocation.mockReturnValue({ pathname: '/' } as any);
    
    const { container } = render(<ScrollToTop />);
    
    expect(container.firstChild).toBeNull();
  });

  it('should call scrollTo on initial render', () => {
    mockUseLocation.mockReturnValue({ pathname: '/services' } as any);
    
    render(<ScrollToTop />);
    
    expect(global.scrollTo).toHaveBeenCalledWith(0, 0);
  });
});
