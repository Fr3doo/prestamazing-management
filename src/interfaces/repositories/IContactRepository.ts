
export interface ContactInfo {
  id: string;
  type: string;
  value: string;
  label: string | null;
  created_at: string;
  updated_at: string;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  submitted_at: string;
  ip_address?: string;
  user_agent?: string;
}

export interface CreateContactInfoData {
  type: string;
  value: string;
  label?: string;
}

export interface CreateContactSubmissionData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  submitted_at: string;
  ip_address?: string;
  user_agent?: string;
}

export interface IContactRepository {
  // Contact Info methods
  getAllContactInfo(): Promise<ContactInfo[]>;
  getContactInfoById(id: string): Promise<ContactInfo | null>;
  createContactInfo(data: CreateContactInfoData): Promise<ContactInfo>;
  updateContactInfo(id: string, data: Partial<CreateContactInfoData>): Promise<ContactInfo>;
  deleteContactInfo(id: string): Promise<void>;

  // Contact Submissions methods
  createContactSubmission(data: CreateContactSubmissionData): Promise<ContactSubmission>;
  getAllContactSubmissions(): Promise<ContactSubmission[]>;
}
