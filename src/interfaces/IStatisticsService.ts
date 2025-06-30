export interface AdminStats {
  reviews: number;
  partners: number;
  contacts: number;
  content: number;
}

export interface IStatisticsService {
  getAdminStats(): Promise<AdminStats>;
}

