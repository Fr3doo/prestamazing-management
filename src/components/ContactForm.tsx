
import { useState } from 'react';
import { Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ContactForm = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    establishment: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Message envoyé",
        description: "Nous vous répondrons dans les plus brefs délais.",
        duration: 5000,
      });
      setIsSubmitting(false);
      setFormData({
        name: '',
        establishment: '',
        email: '',
        phone: '',
        message: '',
      });
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card p-8 md:p-10 shadow-elegant">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Nom complet*
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-secondary/50 focus:border-secondary outline-none transition-all"
            placeholder="Votre nom"
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        
        <div>
          <label htmlFor="establishment" className="block text-sm font-medium text-gray-700 mb-2">
            Établissement*
          </label>
          <input
            id="establishment"
            name="establishment"
            type="text"
            required
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-secondary/50 focus:border-secondary outline-none transition-all"
            placeholder="Nom de votre établissement"
            value={formData.establishment}
            onChange={handleChange}
          />
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email*
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-secondary/50 focus:border-secondary outline-none transition-all"
            placeholder="votre@email.com"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
            Téléphone*
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-secondary/50 focus:border-secondary outline-none transition-all"
            placeholder="Votre numéro de téléphone"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>
      </div>
      
      <div className="mb-6">
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
          Message*
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-secondary/50 focus:border-secondary outline-none transition-all"
          placeholder="Comment puis-je vous aider ?"
          value={formData.message}
          onChange={handleChange}
        ></textarea>
      </div>
      
      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full bg-primary text-white font-montserrat font-semibold py-4 px-6 rounded-lg flex items-center justify-center transition-all duration-300 ${
          isSubmitting 
            ? 'opacity-80 cursor-not-allowed' 
            : 'hover:bg-primary/90 hover:shadow-lg hover:translate-y-[-2px]'
        }`}
      >
        {isSubmitting ? (
          <span className="flex items-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Envoi en cours...
          </span>
        ) : (
          <span className="flex items-center">
            Envoyer le message
            <Send size={18} className="ml-2" />
          </span>
        )}
      </button>
    </form>
  );
};

export default ContactForm;
