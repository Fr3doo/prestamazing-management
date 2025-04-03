
import { Link } from 'react-router-dom';

interface LogoProps {
  isScrolled: boolean;
}

const Logo = ({ isScrolled }: LogoProps) => {
  return (
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
  );
};

export default Logo;
