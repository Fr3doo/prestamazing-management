
import { AuthService } from '@/services/AuthService';
import { SignInResult } from '@/interfaces/IAuthService';

export interface UseAuthActionsReturn {
  signIn: (email: string, password: string) => Promise<SignInResult>;
  signOut: () => Promise<void>;
}

export const useAuthActions = (): UseAuthActionsReturn => {
  const signIn = async (email: string, password: string): Promise<SignInResult> => {
    return await AuthService.signIn(email, password);
  };

  const signOut = async (): Promise<void> => {
    await AuthService.signOut();
  };

  return {
    signIn,
    signOut,
  };
};
