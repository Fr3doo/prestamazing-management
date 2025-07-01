
import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/utils/test-utils';
import TestimonialCard from '../TestimonialCard';
import { Testimonial } from '../types';

describe('TestimonialCard', () => {
  const mockTestimonial: Testimonial = {
    content: 'This is a great service!',
    author: 'John Doe',
    position: 'CEO',
    company: 'Tech Corp',
  };

  it('should render testimonial content', () => {
    render(<TestimonialCard testimonial={mockTestimonial} />);
    
    expect(screen.getByText('"This is a great service!"')).toBeInTheDocument();
  });

  it('should render author information', () => {
    render(<TestimonialCard testimonial={mockTestimonial} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('CEO,')).toBeInTheDocument();
    expect(screen.getByText('Tech Corp')).toBeInTheDocument();
  });

  it('should have proper styling classes', () => {
    render(<TestimonialCard testimonial={mockTestimonial} />);
    
    const card = screen.getByText('"This is a great service!"').closest('.glass-card');
    expect(card).toHaveClass('glass-card', 'p-10', 'md:p-12', 'relative');
  });

  it('should render quote icon', () => {
    render(<TestimonialCard testimonial={mockTestimonial} />);
    
    // The Quote icon should be present (Lucide icon)
    const quoteIcon = document.querySelector('[data-lucide="quote"]') || 
                     document.querySelector('.lucide-quote') ||
                     screen.getByText('"This is a great service!"').parentElement?.querySelector('svg');
    
    expect(quoteIcon).toBeInTheDocument();
  });

  it('should render with correct structure', () => {
    render(<TestimonialCard testimonial={mockTestimonial} />);
    
    // Check the main container
    const mainContainer = screen.getByText('"This is a great service!"').closest('.w-full');
    expect(mainContainer).toHaveClass('w-full', 'flex-shrink-0');
  });
});
