
export interface PartnerFormValidation {
  validateFileUpload: (file: File) => { isValid: boolean; error?: string };
  isFormValid: (partnerName: string, hasLogo: boolean) => boolean;
  getValidationErrors: (partnerName: string, hasLogo: boolean) => string[];
}

export const createPartnerFormValidation = (showError: (title: string, description: string) => void): PartnerFormValidation => {
  const validateFileUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      return {
        isValid: false,
        error: "Veuillez sélectionner un fichier image"
      };
    }

    if (file.size > 2 * 1024 * 1024) {
      return {
        isValid: false,
        error: "L'image ne doit pas dépasser 2MB"
      };
    }

    return { isValid: true };
  };

  const isFormValid = (partnerName: string, hasLogo: boolean) => {
    return Boolean(partnerName.trim()) && hasLogo;
  };

  const getValidationErrors = (partnerName: string, hasLogo: boolean) => {
    const errors = [];
    if (!partnerName.trim()) {
      errors.push("Le nom du partenaire est requis");
    }
    if (!hasLogo) {
      errors.push("Veuillez sélectionner un logo");
    }
    return errors;
  };

  return {
    validateFileUpload,
    isFormValid,
    getValidationErrors
  };
};
