import { supabase } from '@/integrations/supabase/client';
import { IPartnerService } from '@/interfaces/IPartnerService';
import {
  IPartnerRepository,
  CreatePartnerData,
  UpdatePartnerData,
  Partner
} from '@/interfaces/repositories/IPartnerRepository';

export class PartnerService implements IPartnerService {
  constructor(private repository: IPartnerRepository) {}

  async uploadPartnerLogo(file: File): Promise<string> {
    const ext = file.name.split('.').pop();
    const fileName = `partners/${Date.now()}.${ext}`;
    const { error } = await supabase.storage
      .from('partners-logos')
      .upload(fileName, file);
    if (error) throw error;
    const { data: { publicUrl } } = supabase.storage
      .from('partners-logos')
      .getPublicUrl(fileName);
    return publicUrl;
  }

  async getNextDisplayOrder(): Promise<number> {
    const max = await this.repository.getMaxDisplayOrder();
    return max + 1;
  }

  async createPartner(data: CreatePartnerData): Promise<Partner> {
    return this.repository.createPartner(data);
  }

  async updatePartner(id: string, data: UpdatePartnerData): Promise<Partner> {
    return this.repository.updatePartner(id, data);
  }
}
