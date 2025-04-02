import Hero from '@/components/Hero';
import Timeline from '@/components/Timeline';
import { Award, BookOpen, Briefcase, Heart } from 'lucide-react';
import { useEffect, useRef } from 'react';

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

const About = () => {
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

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach((el) => observer.observe(el));

    return () => {
      revealElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <div>
      <Hero 
        title="À propos de Steve PRESTA"
        subtitle="Expert en management de la restauration, passionné par l'excellence du service et l'optimisation de l'expérience client."
        ctaText="Contactez-moi"
        ctaLink="/contact"
        backgroundImage="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
      />
      
      <section className="section-padding bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="reveal">
            <div className="rounded-xl overflow-hidden shadow-elegant">
              <img 
                src="https://images.unsplash.com/photo-1571805529673-cf2d698fb5fc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80" 
                alt="Steve PRESTA" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          <div className="reveal">
            <h5 className="text-secondary font-montserrat font-semibold mb-2">Mon histoire</h5>
            <h2 className="text-primary mb-6">Parcours & Expertise</h2>
            <p className="text-gray-600 mb-6">
              Avec plus de 15 années d'expérience dans l'industrie de la restauration haut de gamme, 
              j'ai développé une expertise pointue en management, supervision opérationnelle et optimisation 
              de l'expérience client.
            </p>
            <p className="text-gray-600 mb-6">
              Mon parcours m'a mené des plus grands établissements étoilés de Paris aux postes de direction 
              dans des groupes internationaux reconnus. Cette riche expérience m'a permis de développer une 
              vision globale et stratégique du management en restauration.
            </p>
            <p className="text-gray-600">
              Aujourd'hui, je mets mon expertise au service des établissements qui souhaitent transformer 
              leur approche managériale, optimiser leurs opérations et créer des expériences clients mémorables.
            </p>
          </div>
        </div>
      </section>
      
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-primary mb-6 reveal">
              Mes <span className="text-secondary">Valeurs</span>
            </h2>
            <p className="max-w-3xl mx-auto text-gray-600 reveal">
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
      
      <section className="section-padding bg-white">
        <div className="text-center mb-16">
          <h2 className="text-primary mb-6 reveal">
            Parcours <span className="text-secondary">Professionnel</span>
          </h2>
          <p className="max-w-3xl mx-auto text-gray-600 reveal">
            Découvrez les étapes clés de mon évolution professionnelle et les expériences 
            qui ont forgé mon expertise en management de la restauration.
          </p>
        </div>
        
        <Timeline />
      </section>
      
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-montserrat font-bold mb-8">
              Certifications & <span className="text-secondary">Formations</span>
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/10">
                <h3 className="text-xl font-semibold mb-3">Diplôme de l'École Hôtelière</h3>
                <p className="text-gray-300">Gestion Hôtelière et Restauration</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/10">
                <h3 className="text-xl font-semibold mb-3">Master en Management</h3>
                <p className="text-gray-300">Spécialisation Hôtellerie-Restauration</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/10">
                <h3 className="text-xl font-semibold mb-3">Certification WSET</h3>
                <p className="text-gray-300">Wine & Spirit Education Trust - Niveau 3</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/10">
                <h3 className="text-xl font-semibold mb-3">Leadership & Management</h3>
                <p className="text-gray-300">Certification en Excellence Opérationnelle</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="section-padding bg-white">
        <div className="text-center mb-16">
          <h2 className="text-primary mb-6 reveal">
            Partenaires & <span className="text-secondary">Références</span>
          </h2>
          <p className="max-w-3xl mx-auto text-gray-600 reveal">
            J'ai eu le privilège de collaborer avec ces établissements prestigieux et organisations de référence.
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 items-center justify-items-center">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="glass-card p-6 w-full h-32 flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity">
              <div className="text-center text-gray-500">Logo Partenaire {i+1}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default About;
