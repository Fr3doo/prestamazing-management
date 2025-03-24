
import { useState, useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ServiceCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
  index: number;
}

const ServiceCard = ({ title, description, icon, link, index }: ServiceCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add('active');
            }, index * 150); // Staggered animation based on index
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
      className="relative glass-card overflow-hidden reveal"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background gradient */}
      <div 
        className={`absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
      ></div>
      
      {/* Content */}
      <div className="p-8 relative z-10">
        <div className="mb-6 text-secondary">
          {icon}
        </div>
        
        <h3 className="text-2xl font-montserrat font-semibold text-primary mb-4">
          {title}
        </h3>
        
        <p className="text-gray-600 mb-6">
          {description}
        </p>
        
        <Link 
          to={link}
          className="inline-flex items-center text-primary font-medium hover:text-secondary transition-colors"
        >
          <span>En savoir plus</span>
          <ArrowRight 
            size={18} 
            className={`ml-2 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} 
          />
        </Link>
      </div>
      
      {/* Decorative line */}
      <div 
        className={`absolute bottom-0 left-0 h-1 bg-secondary transition-all duration-500 ${
          isHovered ? 'w-full' : 'w-0'
        }`}
      ></div>
    </div>
  );
};

export default ServiceCard;
