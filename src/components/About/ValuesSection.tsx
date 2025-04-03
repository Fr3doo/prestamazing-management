
import React, { useRef, useEffect } from 'react';
import ValueCard from './ValueCard';
import { Award, BookOpen, Briefcase, Heart } from 'lucide-react';

const ValuesSection = () => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      },
      { threshold: 0.1 }
    );

    if (titleRef.current) observer.observe(titleRef.current);
    if (descRef.current) observer.observe(descRef.current);

    return () => {
      if (titleRef.current) observer.unobserve(titleRef.current);
      if (descRef.current) observer.unobserve(descRef.current);
    };
  }, []);

  const values = [
    {
      icon: <Award size={32} />,
      title: "Excellence",
      description: "La recherche constante de la qualité et de la perfection dans chaque aspect du service et de l'expérience client."
    },
    {
      icon: <Heart size={32} />,
      title: "Passion",
      description: "Un amour profond pour le métier de la restauration, source d'inspiration et moteur de l'innovation."
    },
    {
      icon: <Briefcase size={32} />,
      title: "Professionnalisme",
      description: "Une approche rigoureuse, méthodique et éthique dans toutes les missions et relations professionnelles."
    },
    {
      icon: <BookOpen size={32} />,
      title: "Transmission",
      description: "Le partage des connaissances et l'accompagnement des équipes vers leur plein potentiel."
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 ref={titleRef} className="text-primary mb-6 reveal">
            Mes <span className="text-secondary">Valeurs</span>
          </h2>
          <p ref={descRef} className="max-w-3xl mx-auto text-gray-600 reveal">
            Ces principes fondamentaux guident mon approche et définissent ma méthode de travail 
            pour vous accompagner vers l'excellence.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <ValueCard 
              key={index}
              icon={value.icon}
              title={value.title}
              description={value.description}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValuesSection;
