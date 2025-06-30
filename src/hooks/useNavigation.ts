
import { useMemo, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

export interface NavigationItem {
  path: string;
  label: string;
  exact?: boolean;
}

export interface UseNavigationOptions {
  items: NavigationItem[];
}

export const useNavigation = ({ items }: UseNavigationOptions) => {
  const location = useLocation();

  const navigationItems = useMemo(() => items, [items]);

  const isActiveRoute = useCallback((path: string, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  }, [location.pathname]);

  const activeItem = useMemo(() => {
    return navigationItems.find(item => 
      isActiveRoute(item.path, item.exact)
    );
  }, [navigationItems, isActiveRoute]);

  return {
    navigationItems,
    isActiveRoute,
    activeItem,
    currentPath: location.pathname
  };
};
