import { CreatePartnerData, Partner, UpdatePartnerData } from './repositories/IPartnerRepository';

export interface IPartnerService {
  uploadPartnerLogo(file: File): Promise<string>;
  getNextDisplayOrder(): Promise<number>;
  createPartner(data: CreatePartnerData): Promise<Partner>;
  updatePartner(id: string, data: UpdatePartnerData): Promise<Partner>;
}
