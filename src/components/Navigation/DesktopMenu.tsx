
import { useLocation } from 'react-router-dom';
import { Phone } from 'lucide-react';
import NavLink from './NavLink';
import { useIsMobile } from '@/hooks/use-mobile';

interface DesktopMenuProps {
  isScrolled: boolean;
}

const DesktopMenu = ({ isScrolled }: DesktopMenuProps) => {
  const location = useLocation();
  const isMobile = useIsMobile();
  
  // Helper function to determine if a link is active
  const isLinkActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="hidden md:flex items-center lg:space-x-8 md:space-x-6">
      <NavLink to="/" isScrolled={isScrolled} isActive={isLinkActive('/')}>
        Accueil
      </NavLink>
      <NavLink to="/services" isScrolled={isScrolled} isActive={isLinkActive('/services')}>
        Services
      </NavLink>
      <NavLink to="/about" isScrolled={isScrolled} isActive={isLinkActive('/about')}>
        À propos
      </NavLink>
      <NavLink to="/contact" isScrolled={isScrolled} isActive={isLinkActive('/contact')}>
        Contact
      </NavLink>
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
  );
};

export default DesktopMenu;
