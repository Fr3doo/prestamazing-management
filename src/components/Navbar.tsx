
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Phone } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-md py-3' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link 
          to="/" 
          className="text-2xl font-montserrat font-bold text-primary"
        >
          <span className="text-secondary">S</span>teve <span className="text-secondary">PRESTA</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className="font-montserrat font-medium text-primary hover:text-secondary transition-colors">
            Accueil
          </Link>
          <Link to="/services" className="font-montserrat font-medium text-primary hover:text-secondary transition-colors">
            Services
          </Link>
          <Link to="/about" className="font-montserrat font-medium text-primary hover:text-secondary transition-colors">
            À propos
          </Link>
          <Link to="/contact" className="font-montserrat font-medium text-primary hover:text-secondary transition-colors">
            Contact
          </Link>
          <a 
            href="tel:+33600000000" 
            className="flex items-center space-x-2 bg-secondary text-white px-4 py-2 rounded-lg transition-transform hover:translate-y-[-2px]"
          >
            <Phone size={18} />
            <span className="font-medium">Consultation gratuite</span>
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-primary"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-white z-40 pt-20 p-6 md:hidden animate-fade-in">
          <div className="flex flex-col space-y-6">
            <Link 
              to="/" 
              className="font-montserrat text-xl font-medium text-primary py-3 border-b border-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Accueil
            </Link>
            <Link 
              to="/services" 
              className="font-montserrat text-xl font-medium text-primary py-3 border-b border-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Services
            </Link>
            <Link 
              to="/about" 
              className="font-montserrat text-xl font-medium text-primary py-3 border-b border-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              À propos
            </Link>
            <Link 
              to="/contact" 
              className="font-montserrat text-xl font-medium text-primary py-3 border-b border-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            <a 
              href="tel:+33600000000" 
              className="flex items-center justify-center space-x-2 bg-secondary text-white px-4 py-3 rounded-lg mt-4"
              onClick={() => setIsMenuOpen(false)}
            >
              <Phone size={18} />
              <span className="font-medium">Consultation gratuite</span>
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
