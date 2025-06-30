
import { IAuthService, SignInResult } from '@/interfaces/IAuthService';

export interface UseAuthActionsReturn {
  signIn: (email: string, password: string) => Promise<SignInResult>;
  signOut: () => Promise<void>;
}

export const useAuthActions = (authService: IAuthService): UseAuthActionsReturn => {
  const signIn = async (email: string, password: string): Promise<SignInResult> => {
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
