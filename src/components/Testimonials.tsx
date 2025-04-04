
import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

interface Testimonial {
  content: string;
  author: string;
  position: string;
  company: string;
}

const Testimonials = () => {
  const testimonials: Testimonial[] = [
    {
      content: "Steve a transformé la dynamique de notre équipe en cuisine et en salle. Sa méthode de management a permis d'améliorer significativement la qualité de service et la satisfaction client.",
      author: "Marie Laurent",
      position: "Directrice",
      company: "La Table d'Eugène"
    },
    {
      content: "Nous avons fait appel à Steve pour restructurer notre organisation. En 3 mois, notre taux de satisfaction client a augmenté de 30% et notre équipe est plus motivée que jamais.",
      author: "Thomas Rivière",
      position: "Propriétaire",
      company: "Bistro Parisien"
    },
    {
      content: "L'organisation de notre gala annuel par Steve a été impeccable. Son professionnalisme et son souci du détail ont fait de notre événement un succès mémorable pour nos clients VIP.",
      author: "Sophie Marchand",
      position: "Responsable Événementiel",
      company: "Grand Hôtel Paris"
    },
    {
      content: "La formation de notre personnel par Steve a complètement changé l'ambiance de notre établissement. Les clients remarquent la différence et nos réservations ont augmenté de 40% en seulement deux mois.",
      author: "Jean Dupont",
      position: "Chef propriétaire",
      company: "L'Atelier Gourmand"
    },
    {
      content: "Steve a su identifier rapidement les points faibles de notre service et proposer des solutions concrètes. Sa vision stratégique et son approche personnalisée ont été déterminantes pour retrouver notre excellence opérationnelle.",
      author: "Isabelle Moreau",
      position: "Directrice Générale",
      company: "Le Comptoir des Saveurs"
    }
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const testimonialRef = useRef<HTMLDivElement>(null);

  const goToNextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const goToPrevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      goToNextSlide();
    }, 8000);

    return () => clearInterval(interval);
  }, [activeIndex, isAnimating]);

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

      <div className="relative max-w-4xl mx-auto">
        <div className="overflow-hidden">
          <div 
            className={`flex transition-all duration-500 ease-in-out ${isAnimating ? 'opacity-0' : 'opacity-100'}`}
            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
          >
            {testimonials.map((testimonial, index) => (
              <div key={index} className="w-full flex-shrink-0">
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
            ))}
          </div>
        </div>

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
          {testimonials.map((_, index) => (
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
      </div>
    </section>
  );
};

export default Testimonials;
