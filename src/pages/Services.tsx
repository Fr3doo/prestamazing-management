
import Hero from '@/components/Hero';
import { Users, Calendar, BarChart3, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import ServiceDetail from '@/components/ServiceDetail';

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

  const services = [
    {
      id: "team-management",
      title: "Management d'équipe",
      description: "Un service de gestion d'équipe sur mesure qui transforme vos collaborateurs en véritables ambassadeurs de votre établissement. Je forme, supervise et motive vos équipes pour créer une culture d'excellence et de service client irréprochable.",
      benefits: [
        "Formation approfondie et développement des compétences de service",
        "Techniques de motivation et d'engagement des équipes",
        "Systèmes d'évaluation et de feedback constructif",
        "Gestion des conflits et amélioration de la communication interne",
        "Création d'une culture d'entreprise forte et cohérente"
      ],
      image: "https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
      icon: <Users size={32} />
    },
    {
      id: "event-organization",
      title: "Organisation événementielle",
      description: "Transformez vos événements en expériences mémorables grâce à mon expertise en organisation et gestion événementielle. De la conception à l'exécution, je prends en charge chaque détail pour garantir le succès de vos réceptions, lancements et célébrations spéciales.",
      benefits: [
        "Planification stratégique et gestion de projet événementiel",
        "Coordination des prestataires et des équipes",
        "Organisation logistique impeccable",
        "Animation professionnelle et gestion de l'expérience client",
        "Analyse post-événement et recommandations d'amélioration"
      ],
      image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1469&q=80",
      icon: <Calendar size={32} />,
      reverse: true
    },
    {
      id: "operational-supervision",
      title: "Supervision opérationnelle",
      description: "Optimisez chaque aspect de votre établissement grâce à mes services de supervision opérationnelle. J'implémente des processus efficaces, des standards de qualité et des indicateurs de performance pour maximiser votre rentabilité tout en améliorant l'expérience client.",
      benefits: [
        "Audit complet et analyse des opérations existantes",
        "Mise en place de processus optimisés et standards de service",
        "Développement et suivi d'indicateurs de performance (KPIs)",
        "Optimisation des coûts et amélioration de la rentabilité",
        "Formation des équipes aux nouvelles procédures"
      ],
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
      icon: <BarChart3 size={32} />
    },
    {
      id: "customer-experience",
      title: "Expérience client & fidélisation",
      description: "Transformez vos clients en ambassadeurs grâce à une stratégie d'expérience client exceptionnelle. Je développe et implémente des approches innovantes pour améliorer chaque point de contact avec votre clientèle, augmenter la satisfaction et garantir leur fidélité.",
      benefits: [
        "Audit et cartographie du parcours client",
        "Définition d'une signature de service distinctive",
        "Formation aux techniques d'accueil et de fidélisation",
        "Mise en place de programmes de fidélité efficaces",
        "Gestion proactive des avis clients et de la réputation"
      ],
      image: "https://images.unsplash.com/photo-1607117121584-0e34475b7604?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
      icon: <Heart size={32} />,
      reverse: true
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Hero 
        title="Nos Services"
        subtitle="Des solutions de management sur mesure pour transformer votre établissement et élever l'expérience client."
        ctaText="Contactez-moi"
        ctaLink="/contact"
        backgroundImage="https://images.unsplash.com/photo-1581349485608-9469926a8e5e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1464&q=80"
      />
      
      <div className="bg-white flex flex-col relative">
        {services.map((service) => (
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
      
      <section className="py-16 bg-primary text-white relative">
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
