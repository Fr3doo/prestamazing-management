
import { Link } from 'react-router-dom';

const ServicesCTA = () => {
  return (
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
  );
};

export default ServicesCTA;
