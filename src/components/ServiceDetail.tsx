
import { Users, Calendar, BarChart3, Heart, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { AspectRatio } from '@/components/ui/aspect-ratio';

export interface ServiceDetailProps {
  id: string;
  title: string;
  description: string;
  benefits: string[];
  image: string;
  icon: React.ReactNode;
  reverse?: boolean;
}

const ServiceDetail = ({ id, title, description, benefits, image, icon, reverse = false }: ServiceDetailProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle('active', entry.isIntersecting);
        });
      },
      { threshold: 0.1 }
    );

    const revealElements = sectionRef.current?.querySelectorAll('.reveal');
    revealElements?.forEach((el) => observer.observe(el));

    return () => {
      revealElements?.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <section 
      id={id} 
      ref={sectionRef} 
      className="py-12 md:py-16 border-b border-gray-100 last:border-0 bg-white relative"
    >
      <div className={`container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center ${reverse ? 'lg:flex-row-reverse' : ''}`}>
        
        <div className={`reveal ${reverse ? 'lg:order-2' : 'lg:order-1'}`}>
          <div className="flex items-center space-x-3 mb-4">
            <div className="text-secondary">
              {icon}
            </div>
            <h2 className="text-3xl md:text-4xl font-montserrat font-bold text-navy">
              {title}
            </h2>
          </div>
          
          <p className="text-navy/80 mb-6">
            {description}
          </p>
          
          <div className="space-y-3 mb-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start space-x-3">
                <CheckCircle className="text-secondary mt-1 flex-shrink-0" size={20} />
                <p className="text-navy/90">{benefit}</p>
              </div>
            ))}
          </div>
          
          <Link 
            to="/contact" 
            className="btn-primary inline-flex items-center"
          >
            En savoir plus
          </Link>
        </div>

        <div className={`reveal ${reverse ? 'lg:order-1' : 'lg:order-2'}`}>
          <div className="rounded-xl overflow-hidden shadow-elegant transform transition-transform hover:scale-[1.02] duration-500 bg-white">
            <AspectRatio ratio={4/3} className="w-full">
              <img 
                src={image} 
                alt={title} 
                className="w-full h-full object-cover"
              />
            </AspectRatio>
          </div>
        </div>

      </div>
    </section>
  );
};

export default ServiceDetail;
