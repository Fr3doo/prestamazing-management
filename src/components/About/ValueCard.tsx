
import React, { useRef, useEffect } from 'react';

interface ValueCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
}

const ValueCard = ({ icon, title, description, index }: ValueCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add('active');
            }, index * 150);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, [index]);

  return (
    <div 
      ref={cardRef}
      className="glass-card p-8 text-center transition-all duration-300 hover:shadow-premium reveal"
    >
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-secondary mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-montserrat font-semibold text-primary mb-4">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default ValueCard;
