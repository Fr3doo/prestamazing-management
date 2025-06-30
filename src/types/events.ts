
export interface AuthEvents {
  'auth:login-success': { userId: string; isAdmin: boolean };
  'auth:login-failed': { error: string };
  'auth:logout': void;
  'auth:admin-check-complete': { userId: string; isAdmin: boolean };
}

export interface NavigationEvents {
  'navigation:redirect-to-admin': void;
  'navigation:redirect-to-auth': void;
}

export type AppEvents = AuthEvents & NavigationEvents;
