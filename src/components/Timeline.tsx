
import { useEffect, useRef } from 'react';

interface TimelineEvent {
  year: string;
  title: string;
  description: string;
}

const Timeline = () => {
  const events: TimelineEvent[] = [
    {
      year: "2010",
      title: "Chef de Rang - Le Grand Véfour",
      description: "Début de carrière dans un restaurant étoilé à Paris. Formation auprès des plus grands professionnels du service."
    },
    {
      year: "2013",
      title: "Maître d'Hôtel - L'Ambroisie",
      description: "Évolution vers un poste de management d'équipe dans un établissement 3 étoiles Michelin."
    },
    {
      year: "2016",
      title: "Directeur de Restaurant - Groupe Ducasse",
      description: "Prise en charge de la supervision complète d'un établissement de haute gastronomie."
    },
    {
      year: "2018",
      title: "Consultant Restaurant - Création de PRESTA Consulting",
      description: "Lancement de l'activité de conseil pour accompagner les établissements dans leur développement."
    },
    {
      year: "2021",
      title: "Formateur & Conférencier",
      description: "Développement de l'activité de formation et interventions régulières dans les écoles hôtelières."
    }
  ];

  const timelineRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -100px 0px' }
    );

    itemsRef.current.forEach((item) => {
      if (item) observer.observe(item);
    });

    return () => {
      itemsRef.current.forEach((item) => {
        if (item) observer.unobserve(item);
      });
    };
  }, []);

  return (
    <div 
      ref={timelineRef}
      className="relative py-8 px-4"
    >
      {/* Timeline central line */}
      <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-px bg-gray-200 z-0"></div>
      
      {events.map((event, index) => (
        <div
          key={index}
          ref={(el) => (itemsRef.current[index] = el)}
          className={`relative flex items-center mb-12 last:mb-0 reveal ${
            index % 2 === 0 ? 'justify-start md:justify-end' : 'justify-start'
          }`}
        >
          {/* Timeline content */}
          <div 
            className={`glass-card p-6 md:p-8 max-w-md w-full md:w-[calc(50%-2rem)] relative z-10 ${
              index % 2 === 0 
                ? 'md:text-right md:mr-8' 
                : 'md:ml-8'
            }`}
          >
            <span className="text-sm font-semibold inline-block px-3 py-1 rounded-full bg-primary/10 text-primary mb-3">
              {event.year}
            </span>
            <h3 className="text-xl font-montserrat font-semibold text-primary mb-2">
              {event.title}
            </h3>
            <p className="text-gray-600">
              {event.description}
            </p>
          </div>
          
          {/* Timeline dot */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-5 h-5 rounded-full bg-secondary border-4 border-white z-20"></div>
        </div>
      ))}
    </div>
  );
};

export default Timeline;
