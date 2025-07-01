
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@/test/utils/test-utils';
import TestimonialCarousel from '../TestimonialCarousel';
import { Testimonial } from '../types';

// Mock timers
vi.useFakeTimers();

describe('TestimonialCarousel', () => {
  const mockTestimonials: Testimonial[] = [
    {
      content: 'First testimonial',
      author: 'John Doe',
      position: 'CEO',
      company: 'Company 1',
    },
    {
      content: 'Second testimonial',
      author: 'Jane Smith',
      position: 'CTO',
      company: 'Company 2',
    },
    {
      content: 'Third testimonial',
      author: 'Bob Johnson',
      position: 'Manager',
      company: 'Company 3',
    },
  ];

  beforeEach(() => {
    vi.clearAllTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    vi.useFakeTimers();
  });

  it('should render all testimonials', () => {
    render(<TestimonialCarousel testimonials={mockTestimonials} />);
    
    expect(screen.getByText('"First testimonial"')).toBeInTheDocument();
    expect(screen.getByText('"Second testimonial"')).toBeInTheDocument();
    expect(screen.getByText('"Third testimonial"')).toBeInTheDocument();
  });

  it('should render navigation controls', () => {
    render(<TestimonialCarousel testimonials={mockTestimonials} />);
    
    expect(screen.getByLabelText('Témoignage précédent')).toBeInTheDocument();
    expect(screen.getByLabelText('Témoignage suivant')).toBeInTheDocument();
  });

  it('should advance to next slide when next button is clicked', () => {
    render(<TestimonialCarousel testimonials={mockTestimonials} />);
    
    const nextButton = screen.getByLabelText('Témoignage suivant');
    
    act(() => {
      fireEvent.click(nextButton);
    });
    
    // Wait for animation
    act(() => {
      vi.advanceTimersByTime(500);
    });
    
    // Check if the transform has changed (indicating slide movement)
    const carousel = screen.getByText('"First testimonial"').closest('.flex');
    expect(carousel).toHaveStyle({ transform: 'translateX(-100%)' });
  });

  it('should go to previous slide when previous button is clicked', () => {
    render(<TestimonialCarousel testimonials={mockTestimonials} />);
    
    const prevButton = screen.getByLabelText('Témoignage précédent');
    
    act(() => {
      fireEvent.click(prevButton);
    });
    
    // Wait for animation
    act(() => {
      vi.advanceTimersByTime(500);
    });
    
    // Should wrap to last slide (index 2)
    const carousel = screen.getByText('"First testimonial"').closest('.flex');
    expect(carousel).toHaveStyle({ transform: 'translateX(-200%)' });
  });

  it('should auto-advance slides', () => {
    render(<TestimonialCarousel testimonials={mockTestimonials} />);
    
    const carousel = screen.getByText('"First testimonial"').closest('.flex');
    
    // Initially at first slide
    expect(carousel).toHaveStyle({ transform: 'translateX(-0%)' });
    
    // Advance timer to trigger auto-rotation
    act(() => {
      vi.advanceTimersByTime(8000);
    });
    
    // Wait for animation
    act(() => {
      vi.advanceTimersByTime(500);
    });
    
    // Should be at second slide
    expect(carousel).toHaveStyle({ transform: 'translateX(-100%)' });
  });

  it('should handle dot navigation', () => {
    render(<TestimonialCarousel testimonials={mockTestimonials} />);
    
    const thirdDot = screen.getByLabelText('Aller au témoignage 3');
    
    act(() => {
      fireEvent.click(thirdDot);
    });
    
    // Wait for animation
    act(() => {
      vi.advanceTimersByTime(500);
    });
    
    const carousel = screen.getByText('"First testimonial"').closest('.flex');
    expect(carousel).toHaveStyle({ transform: 'translateX(-200%)' });
  });

  it('should prevent multiple clicks during animation', () => {
    render(<TestimonialCarousel testimonials={mockTestimonials} />);
    
    const nextButton = screen.getByLabelText('Témoignage suivant');
    
    // Click multiple times quickly
    act(() => {
      fireEvent.click(nextButton);
      fireEvent.click(nextButton);
      fireEvent.click(nextButton);
    });
    
    // Wait for animation
    act(() => {
      vi.advanceTimersByTime(500);
    });
    
    // Should only advance one slide
    const carousel = screen.getByText('"First testimonial"').closest('.flex');
    expect(carousel).toHaveStyle({ transform: 'translateX(-100%)' });
  });

  it('should wrap around at the end', () => {
    render(<TestimonialCarousel testimonials={mockTestimonials} />);
    
    const nextButton = screen.getByLabelText('Témoignage suivant');
    
    // Go to last slide
    act(() => {
      fireEvent.click(nextButton);
      vi.advanceTimersByTime(500);
      fireEvent.click(nextButton);
      vi.advanceTimersByTime(500);
    });
    
    // Now click next again to wrap around
    act(() => {
      fireEvent.click(nextButton);
      vi.advanceTimersByTime(500);
    });
    
    const carousel = screen.getByText('"First testimonial"').closest('.flex');
    expect(carousel).toHaveStyle({ transform: 'translateX(-0%)' });
  });

  it('should cleanup interval on unmount', () => {
    const { unmount } = render(<TestimonialCarousel testimonials={mockTestimonials} />);
    
    const clearIntervalSpy = vi.spyOn(global, 'clearInterval');
    
    unmount();
    
    expect(clearIntervalSpy).toHaveBeenCalled();
    
    clearIntervalSpy.mockRestore();
  });
});
