
export interface Partner {
  id: string;
  partner_name: string;
  logo_url: string;
  website_url: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface CreatePartnerData {
  partner_name: string;
  logo_url: string;
  website_url?: string;
  display_order?: number;
}

export interface UpdatePartnerData {
  partner_name?: string;
  logo_url?: string;
  website_url?: string;
  display_order?: number;
  updated_at: string;
}

export interface IPartnerRepository {
  getAllPartners(): Promise<Partner[]>;
  getPartnerById(id: string): Promise<Partner | null>;
  createPartner(data: CreatePartnerData): Promise<Partner>;
  updatePartner(id: string, data: UpdatePartnerData): Promise<Partner>;
  deletePartner(id: string): Promise<void>;
  updatePartnerOrder(partnerId: string, newOrder: number): Promise<void>;
}
