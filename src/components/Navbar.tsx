
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();

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

  // Helper function to determine if a link is active
  const isLinkActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-md py-2' 
          : 'bg-primary/80 backdrop-blur-md border-b border-secondary/30 py-3 sm:py-5'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 flex items-center justify-between">
        <Link 
          to="/" 
          className={`transition-all duration-300 font-montserrat font-bold flex items-center gap-1 sm:gap-2 ${
            isScrolled 
              ? 'text-primary text-lg sm:text-xl' 
              : 'text-white text-xl sm:text-2xl'
          }`}
        >
          <img 
            src="/lovable-uploads/4f776de8-d625-4296-b6aa-bbb3e23769e2.png" 
            alt="Steve Prest'A Logo" 
            className={`transition-all duration-300 rounded-full object-contain ${
              isScrolled ? 'h-8 w-8 sm:h-10 sm:w-10' : 'h-10 w-10 sm:h-12 sm:w-12'
            }`}
          />
          <span><span className="text-secondary">S</span>teve <span className="text-secondary">PREST'A</span></span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center lg:space-x-8 md:space-x-6">
          <Link 
            to="/" 
            className={`font-montserrat font-medium transition-colors active:scale-95 active:opacity-70 ${
              isScrolled 
                ? isLinkActive('/') 
                  ? 'text-secondary font-bold border-b-2 border-secondary' 
                  : 'text-primary hover:text-secondary text-sm'
                : isLinkActive('/') 
                  ? 'text-secondary font-bold border-b-2 border-secondary' 
                  : 'text-white hover:text-secondary'
            }`}
          >
            Accueil
          </Link>
          <Link 
            to="/services" 
            className={`font-montserrat font-medium transition-colors active:scale-95 active:opacity-70 ${
              isScrolled 
                ? isLinkActive('/services') 
                  ? 'text-secondary font-bold border-b-2 border-secondary' 
                  : 'text-primary hover:text-secondary text-sm'
                : isLinkActive('/services') 
                  ? 'text-secondary font-bold border-b-2 border-secondary' 
                  : 'text-white hover:text-secondary'
            }`}
          >
            Services
          </Link>
          <Link 
            to="/about" 
            className={`font-montserrat font-medium transition-colors active:scale-95 active:opacity-70 ${
              isScrolled 
                ? isLinkActive('/about') 
                  ? 'text-secondary font-bold border-b-2 border-secondary' 
                  : 'text-primary hover:text-secondary text-sm' 
                : isLinkActive('/about') 
                  ? 'text-secondary font-bold border-b-2 border-secondary' 
                  : 'text-white hover:text-secondary'
            }`}
          >
            À propos
          </Link>
          <Link 
            to="/contact" 
            className={`font-montserrat font-medium transition-colors active:scale-95 active:opacity-70 ${
              isScrolled 
                ? isLinkActive('/contact') 
                  ? 'text-secondary font-bold border-b-2 border-secondary' 
                  : 'text-primary hover:text-secondary text-sm'
                : isLinkActive('/contact') 
                  ? 'text-secondary font-bold border-b-2 border-secondary' 
                  : 'text-white hover:text-secondary'
            }`}
          >
            Contact
          </Link>
          <a 
            href="tel:+33600000000" 
            className={`flex items-center space-x-1 md:space-x-2 bg-secondary text-white transition-all duration-300 rounded-lg hover:translate-y-[-2px] active:translate-y-[0px] active:bg-secondary/80 ${
              isScrolled ? 'px-2 md:px-3 py-1.5 text-xs md:text-sm' : 'px-3 md:px-4 py-1.5 md:py-2 text-sm'
            }`}
          >
            <Phone size={isMobile ? 14 : isScrolled ? 16 : 18} />
            <span className="font-medium whitespace-nowrap">Consultation gratuite</span>
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className={`md:hidden ${isScrolled ? 'text-primary' : 'text-white'} active:scale-90 transition-transform p-1`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-white z-40 pt-16 p-6 md:hidden animate-fade-in overflow-y-auto">
          <div className="flex flex-col space-y-4 sm:space-y-6">
            <Link 
              to="/" 
              className={`font-montserrat text-lg sm:text-xl font-medium py-2 sm:py-3 border-b border-gray-100 active:text-secondary/80 active:translate-x-1 transition-transform ${
                isLinkActive('/') ? 'text-secondary font-bold border-l-4 border-l-secondary pl-3' : 'text-primary'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Accueil
            </Link>
            <Link 
              to="/services" 
              className={`font-montserrat text-lg sm:text-xl font-medium py-2 sm:py-3 border-b border-gray-100 active:text-secondary/80 active:translate-x-1 transition-transform ${
                isLinkActive('/services') ? 'text-secondary font-bold border-l-4 border-l-secondary pl-3' : 'text-primary'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Services
            </Link>
            <Link 
              to="/about" 
              className={`font-montserrat text-lg sm:text-xl font-medium py-2 sm:py-3 border-b border-gray-100 active:text-secondary/80 active:translate-x-1 transition-transform ${
                isLinkActive('/about') ? 'text-secondary font-bold border-l-4 border-l-secondary pl-3' : 'text-primary'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              À propos
            </Link>
            <Link 
              to="/contact" 
              className={`font-montserrat text-lg sm:text-xl font-medium py-2 sm:py-3 border-b border-gray-100 active:text-secondary/80 active:translate-x-1 transition-transform ${
                isLinkActive('/contact') ? 'text-secondary font-bold border-l-4 border-l-secondary pl-3' : 'text-primary'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            <a 
              href="tel:+33600000000" 
              className="flex items-center justify-center space-x-2 bg-secondary text-white px-4 py-3 rounded-lg mt-2 active:bg-secondary/80 active:scale-95 transition-all"
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
