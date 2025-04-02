
import { ArrowDown } from 'lucide-react';
import { useEffect, useRef } from 'react';

interface HeroProps {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  backgroundImage?: string;
}

const Hero = ({ title, subtitle, ctaText, ctaLink, backgroundImage }: HeroProps) => {
  const observer = useRef<IntersectionObserver | null>(null);
  const elementsRef = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    observer.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.1 });

    const elements = elementsRef.current.filter((el) => el !== null);
    elements.forEach((el) => {
      if (el) observer.current?.observe(el);
    });

    return () => {
      elements.forEach((el) => {
        if (el) observer.current?.unobserve(el);
      });
    };
  }, []);

  return (
    <section 
      className="relative flex flex-col items-center justify-center overflow-hidden"
      style={{
        height: '100vh', // Fixed height instead of min-height
        backgroundImage: backgroundImage 
          ? `linear-gradient(rgba(27, 60, 89, 0.85), rgba(27, 60, 89, 0.95)), url(${backgroundImage})` 
          : 'linear-gradient(rgba(27, 60, 89, 1), rgba(27, 60, 89, 0.9))',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(196,167,125,0.1)_0,rgba(27,60,89,0)_70%)]"></div>
      </div>
      
      <div className="container mx-auto px-6 text-center text-white z-10 flex-grow flex flex-col justify-center items-center overflow-auto">
        <div className="max-w-4xl mx-auto">
          <h1 
            ref={el => elementsRef.current[0] = el}
            className="font-montserrat font-bold mb-6 tracking-tight reveal"
          >
            {title}
          </h1>
          
          <p 
            ref={el => elementsRef.current[1] = el}
            className="text-xl md:text-2xl text-gray-200 mb-10 max-w-3xl mx-auto reveal"
          >
            {subtitle}
          </p>
          
          <a
            ref={el => elementsRef.current[2] = el}
            href={ctaLink}
            className="inline-block bg-secondary text-white font-montserrat font-semibold py-4 px-8 rounded-lg text-lg transition-all duration-300 hover:shadow-[0_10px_25px_-10px_rgba(196,167,125,0.5)] hover:translate-y-[-3px] reveal"
          >
            {ctaText}
          </a>
        </div>
      </div>
      
      {/* Arrow down with mt-auto to push it to the bottom */}
      <div className="mt-auto mb-12 z-10 animate-bounce">
        <a 
          href="#key-features"
          className="text-white opacity-80 hover:opacity-100 transition-opacity"
        >
          <ArrowDown size={32} />
        </a>
      </div>
      
      {/* Premium design element: Decorative line */}
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-secondary to-transparent opacity-50"></div>
    </section>
  );
};

export default Hero;
