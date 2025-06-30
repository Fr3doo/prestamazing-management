
import { NavigateFunction } from 'react-router-dom';
import { INavigationService } from '@/interfaces/INavigationService';

export class NavigationServiceImpl implements INavigationService {
  private navigate: NavigateFunction | null = null;
  private currentPath: string = '/';

  setNavigateFunction(navigate: NavigateFunction) {
    this.navigate = navigate;
  }

  setCurrentPath(path: string) {
    this.currentPath = path;
  }

  navigateTo(path: string, options?: { replace?: boolean }): void {
    if (this.navigate) {
      this.navigate(path, options);
    }
  }

  goBack(): void {
    if (this.navigate) {
      this.navigate(-1);
    }
  }

  getCurrentPath(): string {
    return this.currentPath;
  }
}

export const NavigationService = new NavigationServiceImpl();
