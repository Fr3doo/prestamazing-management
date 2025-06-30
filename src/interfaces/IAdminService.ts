
export interface IAdminService {
  checkAdminStatus(userId: string): Promise<boolean>;
  logAdminAccess(userId: string, adminStatus: boolean): Promise<void>;
}
