
import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
}

const SEOHead = ({ 
  title = "Prestamazing Management - Excellence en Management de Restauration",
  description = "Expert en management de restauration. Services de formation d'équipe, supervision opérationnelle et optimisation de l'expérience client. Consultation gratuite.",
  keywords = "management restauration, formation équipe restaurant, supervision restaurant, consultant restaurant, expérience client restaurant",
  image = "https://prestamazing-management.lovable.app/og-image.jpg",
  url = "https://prestamazing-management.lovable.app"
}: SEOHeadProps) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content="index, follow" />
      <meta name="author" content="Prestamazing Management" />
      
      {/* Google Search Console Verification */}
      <meta name="google-site-verification" content="gQviMLWDXnVsKvNaR7CJVqfdbuVl7ikcr_S8b5VOyaY" />
      
      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content="Prestamazing Management" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />
      
      {/* Schema.org structured data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ProfessionalService",
          "name": "Prestamazing Management",
          "description": description,
          "url": url,
          "serviceType": "Management de restauration",
          "areaServed": "France",
          "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Services de management",
            "itemListElement": [
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "Management d'équipe",
                  "description": "Formation, supervision et motivation des équipes de restaurant"
                }
              },
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "Organisation événementielle",
                  "description": "Planification et coordination d'événements spéciaux"
                }
              }
            ]
          }
        })}
      </script>
    </Helmet>
  );
};

export default SEOHead;
