
import { Quote } from 'lucide-react';
import { Testimonial } from './types';

interface TestimonialCardProps {
  testimonial: Testimonial;
}

const TestimonialCard = ({ testimonial }: TestimonialCardProps) => {
  return (
    <div className="w-full flex-shrink-0">
      <div className="glass-card p-10 md:p-12 relative">
        <Quote className="text-secondary/20 absolute top-6 left-6" size={60} />
        
        <div className="text-lg md:text-xl text-gray-700 mb-8 relative z-10">
          "{testimonial.content}"
        </div>
        
        <div className="flex flex-col items-center">
          <p className="font-montserrat font-semibold text-primary text-lg">
            {testimonial.author}
          </p>
          <p className="text-gray-600">
            {testimonial.position}, <span className="text-secondary">{testimonial.company}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
