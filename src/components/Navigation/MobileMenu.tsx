
import { useLocation } from 'react-router-dom';
import { Phone } from 'lucide-react';
import NavLink from './NavLink';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  const location = useLocation();
  
  // Helper function to determine if a link is active
  const isLinkActive = (path: string) => {
    return location.pathname === path;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white z-40 pt-16 p-6 md:hidden animate-fade-in overflow-y-auto">
      <div className="flex flex-col space-y-4 sm:space-y-6">
        <NavLink 
          to="/" 
          isScrolled={false} 
          isActive={isLinkActive('/')} 
          onClick={onClose}
          isMobile
        >
          Accueil
        </NavLink>
        <NavLink 
          to="/services" 
          isScrolled={false} 
          isActive={isLinkActive('/services')} 
          onClick={onClose}
          isMobile
        >
          Services
        </NavLink>
        <NavLink 
          to="/about" 
          isScrolled={false} 
          isActive={isLinkActive('/about')} 
          onClick={onClose}
          isMobile
        >
          À propos
        </NavLink>
        <NavLink 
          to="/contact" 
          isScrolled={false} 
          isActive={isLinkActive('/contact')} 
          onClick={onClose}
          isMobile
        >
          Contact
        </NavLink>
        <a 
          href="tel:+33600000000" 
          className="flex items-center justify-center space-x-2 bg-secondary text-white px-4 py-3 rounded-lg mt-2 active:bg-secondary/80 active:scale-95 transition-all"
          onClick={onClose}
        >
          <Phone size={18} />
          <span className="font-medium">Consultation gratuite</span>
        </a>
      </div>
    </div>
  );
};

export default MobileMenu;
