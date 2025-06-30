
import { 
  IContactRepository, 
  ContactInfo, 
  ContactSubmission,
  CreateContactInfoData,
  CreateContactSubmissionData
} from '@/interfaces/repositories/IContactRepository';

export class MockContactRepository implements IContactRepository {
  private contacts: ContactInfo[] = [];
  private submissions: ContactSubmission[] = [];
  private nextId = 1;

  async getAllContactInfo(): Promise<ContactInfo[]> {
    return Promise.resolve([...this.contacts]);
  }

  async getContactInfoById(id: string): Promise<ContactInfo | null> {
    const contact = this.contacts.find(c => c.id === id);
    return Promise.resolve(contact || null);
  }

  async createContactInfo(data: CreateContactInfoData): Promise<ContactInfo> {
    const newContact: ContactInfo = {
      id: `mock-${this.nextId++}`,
      type: data.type,
      value: data.value,
      label: data.label || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    this.contacts.push(newContact);
    return Promise.resolve(newContact);
  }

  async updateContactInfo(id: string, data: Partial<CreateContactInfoData>): Promise<ContactInfo> {
    const contactIndex = this.contacts.findIndex(c => c.id === id);
    if (contactIndex === -1) {
      throw new Error(`Contact with id ${id} not found`);
    }

    const updatedContact = {
      ...this.contacts[contactIndex],
      ...data,
      updated_at: new Date().toISOString(),
    };

    this.contacts[contactIndex] = updatedContact;
    return Promise.resolve(updatedContact);
  }

  async deleteContactInfo(id: string): Promise<void> {
    const contactIndex = this.contacts.findIndex(c => c.id === id);
    if (contactIndex === -1) {
      throw new Error(`Contact with id ${id} not found`);
    }

    this.contacts.splice(contactIndex, 1);
    return Promise.resolve();
  }

  async createContactSubmission(data: CreateContactSubmissionData): Promise<ContactSubmission> {
    const newSubmission: ContactSubmission = {
      id: `submission-${this.nextId++}`,
      ...data,
    };
    
    this.submissions.push(newSubmission);
    return Promise.resolve(newSubmission);
  }

  async getAllContactSubmissions(): Promise<ContactSubmission[]> {
    return Promise.resolve([...this.submissions]);
  }

  // Helper methods for testing
  clearData(): void {
    this.contacts = [];
    this.submissions = [];
    this.nextId = 1;
  }

  seedData(contacts: ContactInfo[]): void {
    this.contacts = [...contacts];
  }
}
