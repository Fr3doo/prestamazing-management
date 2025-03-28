
import Hero from '@/components/Hero';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import ServiceDetail from '@/components/ServiceDetail';
import servicesData from '@/data/servicesData';

const Services = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Scroll to section if hash is present in URL
    if (window.location.hash) {
      const id = window.location.hash.substring(1);
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }

    // Ensure content is visible
    document.body.style.overflow = 'auto';
  }, []);

  return (
    <div className="min-h-screen bg-white">
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
            iconName={service.iconName}
            reverse={service.reverse}
          />
        ))}
      </div>
      
      <section className="py-20 bg-primary text-white relative z-10">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-montserrat font-bold mb-6">
            Une approche <span className="text-secondary">personnalisée</span>
          </h2>
          <p className="max-w-3xl mx-auto text-lg text-gray-300 mb-10">
            Chaque établissement est unique. Je propose des solutions adaptées à vos besoins spécifiques, 
            votre concept et vos objectifs commerciaux.
          </p>
          <Link 
            to="/contact"
            className="inline-block bg-secondary text-white font-montserrat font-semibold py-4 px-8 rounded-lg text-lg transition-all duration-300 hover:shadow-[0_10px_25px_-10px_rgba(196,167,125,0.5)] hover:translate-y-[-3px]"
          >
            Demander un devis personnalisé
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Services;
