
export interface INavigationService {
  navigateTo(path: string, options?: { replace?: boolean }): void;
  goBack(): void;
  getCurrentPath(): string;
  setCurrentPath(path: string): void;
}
