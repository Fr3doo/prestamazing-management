
import React, { useRef, useEffect } from 'react';

const BioSection = () => {
  const bioRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

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

    if (bioRef.current) observer.observe(bioRef.current);
    if (imageRef.current) observer.observe(imageRef.current);

    return () => {
      if (bioRef.current) observer.unobserve(bioRef.current);
      if (imageRef.current) observer.unobserve(imageRef.current);
    };
  }, []);

  return (
    <section className="section-padding bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div ref={imageRef} className="reveal">
          <div className="rounded-xl overflow-hidden shadow-elegant">
            <img 
              src="https://images.unsplash.com/photo-1571805529673-cf2d698fb5fc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80" 
              alt="Steve PRESTA" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        
        <div ref={bioRef} className="reveal">
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
  );
};

export default BioSection;
