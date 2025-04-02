
import { useState } from 'react';
import { Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import FAQItem from './FAQItem';

interface FAQ {
  question: string;
  answer: string;
}

const FAQSection = () => {
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
            <FAQItem 
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openFaq === index}
              toggleFaq={() => toggleFaq(index)}
            />
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
  );
};

export default FAQSection;
