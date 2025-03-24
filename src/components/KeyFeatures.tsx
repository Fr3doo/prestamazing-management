
import { useEffect, useRef } from 'react';
import { Users, BarChart3, Calendar } from 'lucide-react';

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const KeyFeatures = () => {
  const features: Feature[] = [
    {
      icon: <Users size={42} className="text-secondary mb-6" />,
      title: "Gestion d'équipe",
      description: "Formation, motivation et supervision efficace de vos équipes pour maximiser leur potentiel et leur engagement."
    },
    {
      icon: <BarChart3 size={42} className="text-secondary mb-6" />,
      title: "Optimisation opérationnelle",
      description: "Mise en place de standards, processus et indicateurs de performance pour améliorer l'efficacité et la rentabilité."
    },
    {
      icon: <Calendar size={42} className="text-secondary mb-6" />,
      title: "Organisation événementielle",
      description: "Planification méticuleuse, coordination précise et animation professionnelle de vos événements spéciaux."
    }
  ];

  const observer = useRef<IntersectionObserver | null>(null);
  const elementsRef = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    observer.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.1 });

    const elements = elementsRef.current.filter((el) => el !== null);
    elements.forEach((el) => {
      if (el) observer.current?.observe(el);
    });

    return () => {
      elements.forEach((el) => {
        if (el) observer.current?.unobserve(el);
      });
    };
  }, []);

  return (
    <section id="key-features" className="section-padding bg-white">
      <div className="text-center mb-16">
        <h2 
          ref={el => elementsRef.current[0] = el}
          className="text-primary mb-6 reveal"
        >
          Expertise <span className="text-secondary">à votre service</span>
        </h2>
        <p 
          ref={el => elementsRef.current[1] = el}
          className="max-w-3xl mx-auto text-gray-600 reveal"
        >
          Des solutions de management sur mesure pour transformer votre établissement 
          et élever l'expérience de vos clients à un niveau d'excellence.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {features.map((feature, index) => (
          <div 
            key={index}
            ref={el => elementsRef.current[index + 2] = el}
            className="glass-card p-8 text-center transition-all duration-300 hover:shadow-premium reveal"
          >
            <div className="flex justify-center">
              {feature.icon}
            </div>
            <h3 className="text-primary mb-4 font-semibold">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default KeyFeatures;
