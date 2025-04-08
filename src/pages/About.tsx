
import React from 'react';
import Hero from '@/components/Hero';
import Timeline from '@/components/Timeline';
import BioSection from '@/components/About/BioSection';
import ValuesSection from '@/components/About/ValuesSection';
import Certifications from '@/components/About/Certifications';
import Partners from '@/components/About/Partners';

const About = () => {
  return (
    <div>
      <Hero 
        title="À propos de Steve PREST'A"
        subtitle="Expert en management de la restauration, passionné par l'excellence du service et l'optimisation de l'expérience client."
        ctaText="Contactez-moi"
        ctaLink="/contact"
        backgroundImage="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
      />
      
      <BioSection />
      <ValuesSection />
      
      <section className="section-padding bg-white">
        <div className="text-center mb-16">
          <h2 className="text-primary mb-6">
            Parcours <span className="text-secondary">Professionnel</span>
          </h2>
          <p className="max-w-3xl mx-auto text-gray-600">
            Découvrez les étapes clés de mon évolution professionnelle et les expériences 
            qui ont forgé mon expertise en management de la restauration.
          </p>
        </div>
        
        <Timeline />
      </section>
      
      <Certifications />
      <Partners />
    </div>
  );
};

export default About;
