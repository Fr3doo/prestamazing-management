
import { useEffect } from 'react';
import Hero from '@/components/Hero';
import ServiceDetail from '@/components/ServiceDetail';
import ServicesCTA from '@/components/ServicesCTA';
import { servicesData } from '@/data/servicesData';

const Services = () => {
  useEffect(() => {
    // Scroll to section if hash is present in URL
    if (window.location.hash) {
      const id = window.location.hash.substring(1);
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }

    // Add this to ensure content is visible
    document.body.style.overflow = 'auto';
  }, []);

  return (
    <div className="pt-16">
      <Hero 
        title="Nos Services"
        subtitle="Des solutions de management sur mesure pour transformer votre établissement et élever l'expérience client."
        ctaText="Contactez-moi"
        ctaLink="/contact"
        backgroundImage="https://images.unsplash.com/photo-1581349485608-9469926a8e5e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1464&q=80"
      />
      
      <div className="bg-white relative z-10">
        {servicesData.map((service) => (
          <ServiceDetail 
            key={service.id}
            id={service.id}
            title={service.title}
            description={service.description}
            benefits={service.benefits}
            image={service.image}
            icon={service.icon}
            reverse={service.reverse}
          />
        ))}
      </div>
      
      <ServicesCTA />
    </div>
  );
};

export default Services;
