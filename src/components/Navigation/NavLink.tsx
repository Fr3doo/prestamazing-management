
import { Link } from 'react-router-dom';

interface NavLinkProps {
  to: string;
  isScrolled: boolean;
  isActive: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  isMobile?: boolean;
}

const NavLink = ({ to, isScrolled, isActive, children, onClick, isMobile = false }: NavLinkProps) => {
  if (isMobile) {
    return (
      <Link 
        to={to} 
        className={`font-montserrat text-lg sm:text-xl font-medium py-2 sm:py-3 border-b border-gray-100 active:text-secondary/80 active:translate-x-1 transition-transform ${
          isActive ? 'text-secondary font-bold border-l-4 border-l-secondary pl-3' : 'text-primary'
        }`}
        onClick={onClick}
      >
        {children}
      </Link>
    );
  }

  return (
    <Link 
      to={to} 
      className={`font-montserrat font-medium transition-colors active:scale-95 active:opacity-70 ${
        isScrolled 
          ? isActive
            ? 'text-secondary font-bold border-b-2 border-secondary' 
            : 'text-primary hover:text-secondary text-sm'
          : isActive 
            ? 'text-secondary font-bold border-b-2 border-secondary' 
            : 'text-white hover:text-secondary'
      }`}
      onClick={onClick}
    >
      {children}
    </Link>
  );
};

export default NavLink;
