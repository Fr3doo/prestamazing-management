
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface TestimonialControlsProps {
  goToPrevSlide: () => void;
  goToNextSlide: () => void;
  activeIndex: number;
  totalCount: number;
  setActiveIndex: (index: number) => void;
}

const TestimonialControls = ({ 
  goToPrevSlide, 
  goToNextSlide, 
  activeIndex, 
  totalCount,
  setActiveIndex 
}: TestimonialControlsProps) => {
  return (
    <>
      {/* Navigation buttons */}
      <button 
        onClick={goToPrevSlide}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 md:-translate-x-12 w-12 h-12 rounded-full bg-white shadow-elegant flex items-center justify-center text-primary hover:text-secondary transition-colors z-20"
        aria-label="Témoignage précédent"
      >
        <ChevronLeft size={24} />
      </button>
      
      <button 
        onClick={goToNextSlide}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 md:translate-x-12 w-12 h-12 rounded-full bg-white shadow-elegant flex items-center justify-center text-primary hover:text-secondary transition-colors z-20"
        aria-label="Témoignage suivant"
      >
        <ChevronRight size={24} />
      </button>

      {/* Dots navigation */}
      <div className="flex justify-center space-x-2 mt-8">
        {Array.from({ length: totalCount }).map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === activeIndex ? 'bg-secondary w-6' : 'bg-gray-300'
            }`}
            aria-label={`Aller au témoignage ${index + 1}`}
          />
        ))}
      </div>
    </>
  );
};

export default TestimonialControls;
