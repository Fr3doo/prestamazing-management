
import React from 'react';
import { HelmetProvider } from 'react-helmet-async';
import Navbar from './Navbar';
import Footer from './Footer';
import SEOHead from './SEO/SEOHead';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <HelmetProvider>
      <div className="min-h-screen flex flex-col">
        <SEOHead />
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </div>
    </HelmetProvider>
  );
};

export default Layout;
