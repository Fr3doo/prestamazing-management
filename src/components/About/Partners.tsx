
import React from 'react';

const Partners = () => {
  return (
    <section className="section-padding bg-white">
      <div className="text-center mb-16">
        <h2 className="text-primary mb-6">
          Partenaires & <span className="text-secondary">Références</span>
        </h2>
        <p className="max-w-3xl mx-auto text-gray-600">
          J'ai eu le privilège de collaborer avec ces établissements prestigieux et organisations de référence.
        </p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 items-center justify-items-center">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="glass-card p-6 w-full h-32 flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity">
            <div className="text-center text-gray-500">Logo Partenaire {i+1}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Partners;
