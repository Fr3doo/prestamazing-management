
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@/test/utils/test-utils';
import TestimonialControls from '../TestimonialControls';

describe('TestimonialControls', () => {
  const defaultProps = {
    goToPrevSlide: vi.fn(),
    goToNextSlide: vi.fn(),
    activeIndex: 0,
    totalCount: 3,
    setActiveIndex: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render navigation buttons', () => {
    render(<TestimonialControls {...defaultProps} />);
    
    expect(screen.getByLabelText('Témoignage précédent')).toBeInTheDocument();
    expect(screen.getByLabelText('Témoignage suivant')).toBeInTheDocument();
  });

  it('should call goToPrevSlide when previous button is clicked', () => {
    render(<TestimonialControls {...defaultProps} />);
    
    fireEvent.click(screen.getByLabelText('Témoignage précédent'));
    expect(defaultProps.goToPrevSlide).toHaveBeenCalled();
  });

  it('should call goToNextSlide when next button is clicked', () => {
    render(<TestimonialControls {...defaultProps} />);
    
    fireEvent.click(screen.getByLabelText('Témoignage suivant'));
    expect(defaultProps.goToNextSlide).toHaveBeenCalled();
  });

  it('should render correct number of dots', () => {
    render(<TestimonialControls {...defaultProps} />);
    
    const dots = screen.getAllByRole('button').filter(button => 
      button.getAttribute('aria-label')?.startsWith('Aller au témoignage')
    );
    expect(dots).toHaveLength(3);
  });

  it('should highlight active dot', () => {
    render(<TestimonialControls {...defaultProps} activeIndex={1} />);
    
    const dots = screen.getAllByRole('button').filter(button => 
      button.getAttribute('aria-label')?.startsWith('Aller au témoignage')
    );
    
    // Second dot should be active (index 1)
    expect(dots[1]).toHaveClass('bg-secondary', 'w-6');
    expect(dots[0]).toHaveClass('bg-gray-300');
    expect(dots[2]).toHaveClass('bg-gray-300');
  });

  it('should call setActiveIndex when dot is clicked', () => {
    render(<TestimonialControls {...defaultProps} />);
    
    const secondDot = screen.getByLabelText('Aller au témoignage 2');
    fireEvent.click(secondDot);
    
    expect(defaultProps.setActiveIndex).toHaveBeenCalledWith(1);
  });

  it('should have proper accessibility labels', () => {
    render(<TestimonialControls {...defaultProps} />);
    
    expect(screen.getByLabelText('Témoignage précédent')).toBeInTheDocument();
    expect(screen.getByLabelText('Témoignage suivant')).toBeInTheDocument();
    expect(screen.getByLabelText('Aller au témoignage 1')).toBeInTheDocument();
    expect(screen.getByLabelText('Aller au témoignage 2')).toBeInTheDocument();
    expect(screen.getByLabelText('Aller au témoignage 3')).toBeInTheDocument();
  });
});
