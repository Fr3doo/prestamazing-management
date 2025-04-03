
import React from 'react';

const Certifications = () => {
  return (
    <section className="py-20 bg-primary text-white">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-montserrat font-bold mb-8">
            Certifications & <span className="text-secondary">Formations</span>
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/10">
              <h3 className="text-xl font-semibold mb-3">Diplôme de l'École Hôtelière</h3>
              <p className="text-gray-300">Gestion Hôtelière et Restauration</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/10">
              <h3 className="text-xl font-semibold mb-3">Master en Management</h3>
              <p className="text-gray-300">Spécialisation Hôtellerie-Restauration</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/10">
              <h3 className="text-xl font-semibold mb-3">Certification WSET</h3>
              <p className="text-gray-300">Wine & Spirit Education Trust - Niveau 3</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/10">
              <h3 className="text-xl font-semibold mb-3">Leadership & Management</h3>
              <p className="text-gray-300">Certification en Excellence Opérationnelle</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Certifications;
