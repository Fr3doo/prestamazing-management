
import { useEffect, useRef, useState } from 'react';

interface Stat {
  value: number;
  label: string;
  suffix?: string;
}

const KeyStats = () => {
  const stats: Stat[] = [
    { value: 15, label: "Années d'expérience", suffix: "+" },
    { value: 120, label: "Établissements accompagnés", suffix: "+" },
    { value: 98, label: "Taux de satisfaction", suffix: "%" },
    { value: 25, label: "Événements organisés par an", suffix: "+" }
  ];

  const sectionRef = useRef<HTMLDivElement>(null);
  const [counters, setCounters] = useState<number[]>(stats.map(() => 0));
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;
      if (entry.isIntersecting && !hasAnimated) {
        startCounting();
        setHasAnimated(true);
      }
    }, { threshold: 0.1 });

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [hasAnimated]);

  const startCounting = () => {
    stats.forEach((stat, index) => {
      const duration = 2000; // 2 seconds
      const framesPerSecond = 60;
      const totalFrames = duration / 1000 * framesPerSecond;
      const increment = stat.value / totalFrames;
      
      let frame = 0;
      
      const counter = setInterval(() => {
        frame++;
        
        setCounters(prev => {
          const newCounters = [...prev];
          newCounters[index] = Math.min(Math.ceil(frame * increment), stat.value);
          return newCounters;
        });
        
        if (frame >= totalFrames) {
          clearInterval(counter);
        }
      }, 1000 / framesPerSecond);
    });
  };

  return (
    <section ref={sectionRef} className="py-20 bg-primary text-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-montserrat font-bold mb-6">
            Chiffres <span className="text-secondary">Clés</span>
          </h2>
          <p className="max-w-3xl mx-auto text-lg text-gray-300">
            Des résultats tangibles qui témoignent de notre expertise et de notre engagement envers l'excellence.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center transform transition-transform hover:scale-105">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 h-full border border-white/10">
                <div className="text-5xl font-montserrat font-bold text-secondary mb-2">
                  {counters[index]}{stat.suffix}
                </div>
                <p className="text-gray-300">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default KeyStats;
