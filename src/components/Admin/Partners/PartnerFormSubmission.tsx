
import { useServices } from '@/providers/ServiceProvider';
import { useRepositories } from '@/hooks/useRepositories';
import { PartnerSelectors } from '@/utils/selectors';
import { Partner } from '@/interfaces/repositories/IPartnerRepository';

interface PartnerFormSubmissionProps {
  partner?: Partner | null;
  partnerName: string;
  websiteUrl: string;
  logoFile: File | null;
  onSuccess: () => void;
  showSuccess: (title: string, description: string) => void;
  showError: (title: string, description: string) => void;
}

export const usePartnerFormSubmission = ({
  partner,
  partnerName,
  websiteUrl,
  logoFile,
  onSuccess,
  showSuccess,
  showError
}: PartnerFormSubmissionProps) => {
  const { partnerService } = useServices();
  const { partnerRepository } = useRepositories();

  const submitForm = async () => {
    try {
      let logoUrl = partner?.logo_url || '';

      if (logoFile) {
        logoUrl = await partnerService.uploadPartnerLogo(logoFile);
      }

      const formData = {
        partner_name: partnerName.trim(),
        website_url: websiteUrl.trim() || null,
        logo_url: logoUrl,
      };

      if (partner) {
        await partnerRepository.updatePartner(partner.id, {
          ...formData,
          updated_at: new Date().toISOString(),
        });

        showSuccess("Succès", "Partenaire mis à jour avec succès");
      } else {
        const nextOrder = await partnerService.getNextDisplayOrder();
        await partnerRepository.createPartner({
          ...formData,
          display_order: nextOrder,
        });

        showSuccess("Succès", "Partenaire ajouté avec succès");
      }

      onSuccess();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      showError("Erreur", "Impossible de sauvegarder le partenaire");
      throw error;
    }
  };

  return { submitForm };
};
