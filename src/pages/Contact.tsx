
import Hero from '@/components/Hero';
import ContactForm from '@/components/ContactForm';
import { MapPin, Phone, Mail, Clock, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

interface FAQ {
  question: string;
  answer: string;
}

const Contact = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  
  const toggleFaq = (index: number) => {
    if (openFaq === index) {
      setOpenFaq(null);
    } else {
      setOpenFaq(index);
    }
  };

  const faqs: FAQ[] = [
    {
      question: "Quelles sont les zones géographiques où vous intervenez ?",
      answer: "J'interviens principalement à Paris et en région parisienne. Pour des missions spécifiques, je peux également me déplacer dans toute la France et à l'international selon les besoins."
    },
    {
      question: "Comment se déroule une première consultation ?",
      answer: "La première consultation gratuite dure environ 1 heure et peut se faire en présentiel ou en visioconférence. Nous discutons de votre établissement, vos objectifs et vos défis actuels. À l'issue de cet échange, je vous propose une approche adaptée à vos besoins spécifiques."
    },
    {
      question: "Quelle est la durée moyenne d'un accompagnement ?",
      answer: "La durée varie selon vos besoins et objectifs. Certaines missions ponctuelles peuvent être réalisées en quelques jours, tandis que les accompagnements complets s'étendent généralement sur 3 à 6 mois pour des résultats optimaux et durables."
    },
    {
      question: "Proposez-vous des formules d'abonnement ?",
      answer: "Oui, je propose des formules d'accompagnement régulier pour les établissements souhaitant un suivi continu. Ces formules incluent généralement des visites mensuelles, un suivi des KPIs et un accompagnement stratégique adapté à l'évolution de votre activité."
    },
    {
      question: "Comment mesurez-vous les résultats de vos interventions ?",
      answer: "Je mets en place des indicateurs de performance clés (KPIs) adaptés à vos objectifs : taux de satisfaction client, chiffre d'affaires, panier moyen, rotation du personnel, etc. Ces indicateurs sont suivis avant, pendant et après l'intervention pour mesurer les progrès réalisés."
    }
  ];

  return (
    <div>
      <Hero 
        title="Contactez-nous"
        subtitle="Prenez rendez-vous pour une consultation gratuite et découvrez comment transformer votre établissement."
        ctaText="Réserver maintenant"
        ctaLink="#contact-form"
        backgroundImage="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80"
      />
      
      <section className="section-padding bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-primary mb-8">
              Prenons <span className="text-secondary">contact</span>
            </h2>
            
            <div className="space-y-6 mb-10">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-secondary">
                  <Phone size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-primary mb-1">Téléphone</h3>
                  <a href="tel:+33600000000" className="text-gray-600 hover:text-secondary transition-colors">
                    +33 6 00 00 00 00
                  </a>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-secondary">
                  <Mail size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-primary mb-1">Email</h3>
                  <a href="mailto:contact@stevepresta.com" className="text-gray-600 hover:text-secondary transition-colors">
                    contact@stevepresta.com
                  </a>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-secondary">
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-primary mb-1">Zone d'intervention</h3>
                  <p className="text-gray-600">
                    Paris et région parisienne<br />
                    Déplacements possibles dans toute la France
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-secondary">
                  <Clock size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-primary mb-1">Heures de disponibilité</h3>
                  <p className="text-gray-600">
                    Lundi - Vendredi: 9h00 - 19h00<br />
                    Samedi: Sur rendez-vous
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-secondary">
                  <MessageSquare size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-primary mb-1">WhatsApp</h3>
                  <a href="https://wa.me/33600000000" className="text-gray-600 hover:text-secondary transition-colors">
                    Message direct
                  </a>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-100 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-primary mb-4">Carte d'intervention</h3>
              <div className="h-64 bg-gray-300 rounded-lg flex items-center justify-center">
                <p className="text-gray-600">Carte interactive</p>
              </div>
            </div>
          </div>
          
          <div id="contact-form">
            <h2 className="text-primary mb-8">
              Formulaire de <span className="text-secondary">contact</span>
            </h2>
            <ContactForm />
          </div>
        </div>
      </section>
      
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-primary mb-6">
              Questions <span className="text-secondary">fréquentes</span>
            </h2>
            <p className="max-w-3xl mx-auto text-gray-600">
              Retrouvez les réponses aux questions les plus courantes concernant mes services et mon approche.
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className="glass-card mb-4 overflow-hidden transition-all duration-300"
              >
                <button 
                  className="w-full p-6 text-left flex items-center justify-between"
                  onClick={() => toggleFaq(index)}
                >
                  <h3 className="text-lg font-montserrat font-semibold text-primary">{faq.question}</h3>
                  <span className={`transition-transform duration-300 ${openFaq === index ? 'rotate-180' : ''}`}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </button>
                
                <div 
                  className={`px-6 transition-all duration-300 ${
                    openFaq === index ? 'max-h-96 pb-6' : 'max-h-0 overflow-hidden'
                  }`}
                >
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <p className="text-gray-600 mb-6">
              Vous avez d'autres questions ? N'hésitez pas à me contacter directement.
            </p>
            <Link 
              to="tel:+33600000000"
              className="btn-primary inline-flex items-center"
            >
              <Phone size={18} className="mr-2" />
              <span>Appelez-moi</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
