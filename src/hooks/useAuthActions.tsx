
import { AuthService } from '@/types/services';
import { AuthActions } from '@/types/auth';

export const useAuthActions = (authService: AuthService): AuthActions => {
  const signIn = async (email: string, password: string) => {
    return await authService.signIn(email, password);
  };

  const signOut = async (): Promise<void> => {
    await authService.signOut();
  };

  return {
    signIn,
    signOut,
  };
};
