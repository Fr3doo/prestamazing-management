
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Calendar, Instagram, Facebook, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-primary text-white pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* About Column */}
          <div>
            <h3 className="text-2xl font-montserrat font-bold mb-6">
              <span className="text-secondary">S</span>teve <span className="text-secondary">PREST'A</span>
            </h3>
            <p className="text-gray-300 mb-6">
              Expert en management de la restauration, accompagnant les établissements vers l'excellence opérationnelle et l'optimisation de l'expérience client.
            </p>
            <div className="flex space-x-4">
              <a href="https://instagram.com" className="hover:text-secondary transition-colors" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="https://facebook.com" className="hover:text-secondary transition-colors" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="https://linkedin.com" className="hover:text-secondary transition-colors" aria-label="LinkedIn">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Navigation Column */}
          <div>
            <h4 className="text-xl font-montserrat font-semibold mb-6">Navigation</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-300 hover:text-secondary transition-colors">
                  Accueil
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-300 hover:text-secondary transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-secondary transition-colors">
                  À propos
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-secondary transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-secondary transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Services Column */}
          <div>
            <h4 className="text-xl font-montserrat font-semibold mb-6">Services</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/services" className="text-gray-300 hover:text-secondary transition-colors">
                  Management d'équipe
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-300 hover:text-secondary transition-colors">
                  Organisation événementielle
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-300 hover:text-secondary transition-colors">
                  Supervision opérationnelle
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-300 hover:text-secondary transition-colors">
                  Expérience client & fidélisation
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="text-xl font-montserrat font-semibold mb-6">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <Phone size={20} className="text-secondary mt-1 flex-shrink-0" />
                <a href="tel:+33600000000" className="text-gray-300 hover:text-white transition-colors">
                  +33 6 00 00 00 00
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <Mail size={20} className="text-secondary mt-1 flex-shrink-0" />
                <a href="mailto:contact@stevepresta.com" className="text-gray-300 hover:text-white transition-colors">
                  contact@stevepresta.com
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin size={20} className="text-secondary mt-1 flex-shrink-0" />
                <span className="text-gray-300">
                  Paris et région parisienne
                </span>
              </li>
              <li className="flex items-start space-x-3">
                <Calendar size={20} className="text-secondary mt-1 flex-shrink-0" />
                <span className="text-gray-300">
                  Lun-Ven: 9h-19h
                </span>
              </li>
            </ul>
          </div>
        </div>

        <hr className="border-gray-800 my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Steve PREST'A. Tous droits réservés.
          </p>
          <div className="flex space-x-6 text-sm text-gray-400">
            <Link to="/mentions-legales" className="hover:text-secondary transition-colors">
              Mentions légales
            </Link>
            <Link to="/politique-confidentialite" className="hover:text-secondary transition-colors">
              Politique de confidentialité
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
