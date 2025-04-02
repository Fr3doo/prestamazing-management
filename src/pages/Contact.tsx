
import Hero from '@/components/Hero';
import ContactForm from '@/components/ContactForm';
import ContactInfo from '@/components/Contact/ContactInfo';
import FAQSection from '@/components/FAQ/FAQSection';

const Contact = () => {
  return (
    <div>
      <Hero 
        title="Contactez-nous"
        subtitle="Prenez rendez-vous pour une consultation gratuite et découvrez comment transformer votre établissement."
        ctaText="Réserver maintenant"
        ctaLink="#contact-form"
        backgroundImage="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80"
      />
      
      <section className="section-padding bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <ContactInfo />
          
          <div id="contact-form">
            <h2 className="text-primary mb-8">
              Formulaire de <span className="text-secondary">contact</span>
            </h2>
            <ContactForm />
          </div>
        </div>
      </section>
      
      <FAQSection />
    </div>
  );
};

export default Contact;
