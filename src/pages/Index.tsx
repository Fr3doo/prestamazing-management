
import { useEffect } from 'react';
import Hero from '@/components/Hero';
import KeyFeatures from '@/components/KeyFeatures';
import KeyStats from '@/components/KeyStats';
import Testimonials from '@/components/Testimonials';
import ServiceCard from '@/components/ServiceCard';
import { Users, Calendar, BarChart3, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  // Reveal animations on scroll
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

  const services = [
    {
      title: "Management d'équipe",
      description: "Formation, supervision et motivation des chefs de rang, commis de salle et équipes de cuisine pour optimiser le service.",
      icon: <Users size={36} />,
      link: "/services#team-management",
    },
    {
      title: "Organisation événementielle",
      description: "Planification méticuleuse, coordination précise et animation professionnelle de vos événements spéciaux.",
      icon: <Calendar size={36} />,
      link: "/services#event-organization",
    },
    {
      title: "Supervision opérationnelle",
      description: "Optimisation des process, mise en place des standards et suivi des performances pour maximiser l'efficacité.",
      icon: <BarChart3 size={36} />,
      link: "/services#operational-supervision",
    },
    {
      title: "Expérience client & fidélisation",
      description: "Stratégies innovantes pour améliorer l'accueil, la satisfaction et la fidélisation de votre clientèle.",
      icon: <Heart size={36} />,
      link: "/services#customer-experience",
    }
  ];

  return (
    <div className="min-h-screen">
      <Hero 
        title="L'excellence en management de restauration"
        subtitle="Transformez votre établissement grâce à une expertise reconnue en gestion d'équipe, optimisation opérationnelle et expérience client."
        ctaText="Consultation gratuite"
        ctaLink="/contact"
        backgroundImage="https://images.unsplash.com/photo-1555244162-803834f70033?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80"
      />
      
      <KeyFeatures />
      
      <KeyStats />
      
      <section className="section-padding bg-white">
        <div className="text-center mb-16">
          <h2 className="text-primary mb-6 reveal">
            Nos <span className="text-secondary">Services</span>
          </h2>
          <p className="max-w-3xl mx-auto text-gray-600 reveal">
            Des solutions de management sur mesure pour transformer votre établissement 
            et élever l'expérience de vos clients à un niveau d'excellence.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          {services.map((service, index) => (
            <ServiceCard 
              key={index}
              title={service.title}
              description={service.description}
              icon={service.icon}
              link={service.link}
              index={index}
            />
          ))}
        </div>
        
        <div className="text-center">
          <Link 
            to="/services"
            className="btn-primary inline-flex items-center space-x-2 reveal"
          >
            <span>Découvrir tous nos services</span>
          </Link>
        </div>
      </section>
      
      <Testimonials />
      
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-montserrat font-bold mb-6 reveal">
            Prêt à transformer votre <span className="text-secondary">établissement</span> ?
          </h2>
          <p className="max-w-3xl mx-auto text-lg text-gray-300 mb-10 reveal">
            Prenez rendez-vous dès maintenant pour une consultation gratuite et découvrez comment 
            notre expertise peut vous aider à atteindre l'excellence.
          </p>
          <Link 
            to="/contact"
            className="inline-block bg-secondary text-white font-montserrat font-semibold py-4 px-8 rounded-lg text-lg transition-all duration-300 hover:shadow-[0_10px_25px_-10px_rgba(196,167,125,0.5)] hover:translate-y-[-3px] reveal"
          >
            Demander une consultation
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Index;
