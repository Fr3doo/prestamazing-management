
import React from 'react';
import ContactInfoForm from './ContactInfoForm';

interface ContactInfo {
  id: string;
  type: string;
  value: string;
  label: string | null;
  created_at: string;
  updated_at: string;
}

interface ContactFormWrapperProps {
  editingContact: ContactInfo | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const ContactFormWrapper = ({ editingContact, onSuccess, onCancel }: ContactFormWrapperProps) => {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          {editingContact ? 'Modifier le contact' : 'Ajouter un contact'}
        </h2>
      </div>
      <ContactInfoForm
        contact={editingContact}
        onSuccess={onSuccess}
        onCancel={onCancel}
      />
    </div>
  );
};

export default ContactFormWrapper;
