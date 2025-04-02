
import { useState } from 'react';

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  toggleFaq: () => void;
}

const FAQItem = ({ question, answer, isOpen, toggleFaq }: FAQItemProps) => {
  return (
    <div className="glass-card mb-4 overflow-hidden transition-all duration-300">
      <button 
        className="w-full p-6 text-left flex items-center justify-between"
        onClick={toggleFaq}
      >
        <h3 className="text-lg font-montserrat font-semibold text-primary">{question}</h3>
        <span className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </button>
      
      <div 
        className={`px-6 transition-all duration-300 ${
          isOpen ? 'max-h-96 pb-6' : 'max-h-0 overflow-hidden'
        }`}
      >
        <p className="text-gray-600">{answer}</p>
      </div>
    </div>
  );
};

export default FAQItem;
