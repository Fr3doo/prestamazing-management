
export interface ContentSection {
  id: string;
  section_key: string;
  title: string | null;
  content: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateContentSectionData {
  section_key: string;
  title?: string;
  content?: string;
  image_url?: string;
}

export interface UpdateContentSectionData {
  section_key?: string;
  title?: string;
  content?: string;
  image_url?: string;
  updated_at: string;
}

export interface IContentRepository {
  getAllContentSections(): Promise<ContentSection[]>;
  getContentSectionById(id: string): Promise<ContentSection | null>;
  getContentSectionByKey(key: string): Promise<ContentSection | null>;
  createContentSection(data: CreateContentSectionData): Promise<ContentSection>;
  updateContentSection(id: string, data: UpdateContentSectionData): Promise<ContentSection>;
  deleteContentSection(id: string): Promise<void>;
}
