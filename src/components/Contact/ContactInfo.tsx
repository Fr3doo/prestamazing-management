
import { MapPin, Phone, Mail, Clock, MessageSquare } from 'lucide-react';

const ContactInfo = () => {
  return (
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
  );
};

export default ContactInfo;
