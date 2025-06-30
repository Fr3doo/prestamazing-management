
import { useState, useEffect, useCallback, memo } from 'react';
import TestimonialCard from './TestimonialCard';
import TestimonialControls from './TestimonialControls';
import { Testimonial } from './types';

interface TestimonialCarouselProps {
  testimonials: Testimonial[];
}

const TestimonialCarousel = memo(({ testimonials }: TestimonialCarouselProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const goToNextSlide = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    setTimeout(() => setIsAnimating(false), 500);
  }, [isAnimating, testimonials.length]);

  const goToPrevSlide = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
    setTimeout(() => setIsAnimating(false), 500);
  }, [isAnimating, testimonials.length]);

  const handleSetActiveIndex = useCallback((index: number) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex(index);
    setTimeout(() => setIsAnimating(false), 500);
  }, [isAnimating]);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      goToNextSlide();
    }, 8000);

    return () => clearInterval(interval);
  }, [goToNextSlide]);

  return (
    <div className="relative max-w-4xl mx-auto">
      <div className="overflow-hidden">
        <div 
          className={`flex transition-all duration-500 ease-in-out ${isAnimating ? 'opacity-0' : 'opacity-100'}`}
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} testimonial={testimonial} />
          ))}
        </div>
      </div>

      <TestimonialControls 
        goToPrevSlide={goToPrevSlide}
        goToNextSlide={goToNextSlide}
        activeIndex={activeIndex}
        totalCount={testimonials.length}
        setActiveIndex={handleSetActiveIndex}
      />
    </div>
  );
});

TestimonialCarousel.displayName = 'TestimonialCarousel';

export default TestimonialCarousel;
