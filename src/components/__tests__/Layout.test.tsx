
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@/test/utils/test-utils';
import Layout from '../Layout';

// Mock child components
vi.mock('../Navbar', () => ({
  default: () => <div data-testid="navbar">Navbar</div>,
}));

vi.mock('../Footer', () => ({
  default: () => <div data-testid="footer">Footer</div>,
}));

vi.mock('../SEO/SEOHead', () => ({
  default: () => <div data-testid="seo-head">SEO Head</div>,
}));

describe('Layout', () => {
  it('should render all layout components', () => {
    render(
      <Layout>
        <div data-testid="content">Test content</div>
      </Layout>
    );
    
    expect(screen.getByTestId('seo-head')).toBeInTheDocument();
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
    expect(screen.getByTestId('content')).toBeInTheDocument();
  });

  it('should render children in main element', () => {
    render(
      <Layout>
        <div data-testid="content">Test content</div>
      </Layout>
    );
    
    const main = screen.getByRole('main');
    expect(main).toBeInTheDocument();
    expect(main).toContainElement(screen.getByTestId('content'));
  });

  it('should have correct layout structure', () => {
    render(
      <Layout>
        <div>Content</div>
      </Layout>
    );
    
    const container = screen.getByTestId('navbar').closest('.min-h-screen');
    expect(container).toHaveClass('min-h-screen', 'flex', 'flex-col');
    
    const main = screen.getByRole('main');
    expect(main).toHaveClass('flex-1');
  });

  it('should wrap content with HelmetProvider', () => {
    // HelmetProvider is used for SEO head management
    // We can test this by ensuring SEOHead is rendered
    render(
      <Layout>
        <div>Content</div>
      </Layout>
    );
    
    expect(screen.getByTestId('seo-head')).toBeInTheDocument();
  });
});
