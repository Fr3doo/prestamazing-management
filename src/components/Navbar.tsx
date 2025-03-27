
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

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

  // Close mobile menu when location changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-md py-2' 
          : 'bg-primary/80 backdrop-blur-md border-b border-secondary/30 py-5'
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link 
          to="/" 
          className={`transition-all duration-300 font-montserrat font-bold flex items-center gap-2 ${
            isScrolled 
              ? 'text-primary text-xl' 
              : 'text-white text-2xl'
          }`}
        >
          <img 
            src="/lovable-uploads/4f776de8-d625-4296-b6aa-bbb3e23769e2.png" 
            alt="Steve Prest'A Logo" 
            className={`transition-all duration-300 rounded-full object-contain ${
              isScrolled ? 'h-10 w-10' : 'h-12 w-12'
            }`}
          />
          <span><span className="text-secondary">S</span>teve <span className="text-secondary">PREST'A</span></span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          <Link 
            to="/" 
            className={`font-montserrat font-medium ${
              isScrolled ? 'text-primary hover:text-secondary text-sm' : 'text-white hover:text-secondary'
            } transition-colors`}
          >
            Accueil
          </Link>
          <Link 
            to="/services" 
            className={`font-montserrat font-medium ${
              isScrolled ? 'text-primary hover:text-secondary text-sm' : 'text-white hover:text-secondary'
            } transition-colors ${location.pathname === '/services' ? 'text-secondary' : ''}`}
          >
            Services
          </Link>
          <Link 
            to="/about" 
            className={`font-montserrat font-medium ${
              isScrolled ? 'text-primary hover:text-secondary text-sm' : 'text-white hover:text-secondary'
            } transition-colors ${location.pathname === '/about' ? 'text-secondary' : ''}`}
          >
            À propos
          </Link>
          <Link 
            to="/contact" 
            className={`font-montserrat font-medium ${
              isScrolled ? 'text-primary hover:text-secondary text-sm' : 'text-white hover:text-secondary'
            } transition-colors ${location.pathname === '/contact' ? 'text-secondary' : ''}`}
          >
            Contact
          </Link>
          <a 
            href="tel:+33600000000" 
            className={`flex items-center space-x-2 bg-secondary text-white transition-all duration-300 rounded-lg hover:translate-y-[-2px] ${
              isScrolled ? 'px-3 py-1.5 text-sm' : 'px-4 py-2'
            }`}
          >
            <Phone size={isScrolled ? 16 : 18} />
            <span className="font-medium">Consultation gratuite</span>
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className={`md:hidden ${isScrolled ? 'text-primary' : 'text-white'}`}
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
              className={`font-montserrat text-xl font-medium py-3 border-b border-gray-100 ${location.pathname === '/' ? 'text-secondary' : 'text-primary'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Accueil
            </Link>
            <Link 
              to="/services" 
              className={`font-montserrat text-xl font-medium py-3 border-b border-gray-100 ${location.pathname === '/services' ? 'text-secondary' : 'text-primary'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Services
            </Link>
            <Link 
              to="/about" 
              className={`font-montserrat text-xl font-medium py-3 border-b border-gray-100 ${location.pathname === '/about' ? 'text-secondary' : 'text-primary'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              À propos
            </Link>
            <Link 
              to="/contact" 
              className={`font-montserrat text-xl font-medium py-3 border-b border-gray-100 ${location.pathname === '/contact' ? 'text-secondary' : 'text-primary'}`}
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
