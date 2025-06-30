
import { useRef, useEffect, memo } from 'react';
import TestimonialCarousel from './Testimonials/TestimonialCarousel';
import { testimonials } from './Testimonials/testimonialData';

const Testimonials = memo(() => {
  const testimonialRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
          }
        });
      },
      { threshold: 0.1 }
    );

    if (testimonialRef.current) {
      observer.observe(testimonialRef.current);
    }

    return () => {
      if (testimonialRef.current) {
        observer.unobserve(testimonialRef.current);
      }
    };
  }, []);

  return (
    <section ref={testimonialRef} className="section-padding bg-gray-50">
      <div className="text-center mb-16">
        <h2 className="text-primary mb-6">
          Ce que <span className="text-secondary">disent</span> nos clients
        </h2>
        <p className="max-w-3xl mx-auto text-gray-600">
          Découvrez comment notre expertise a transformé des établissements et contribué à leur succès.
        </p>
      </div>

      <TestimonialCarousel testimonials={testimonials} />
    </section>
  );
});

Testimonials.displayName = 'Testimonials';

export default Testimonials;
