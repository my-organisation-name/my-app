export interface AuthUser {
  sub: string;
  name: string;
  email: string;
  picture?: string;
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error?: Error;
}

export interface AuthActions {
  login: () => void;
  loginWithRedirect: () => void;
  logout: () => void;
  getAccessTokenSilently: () => string | null;
}

export type AuthContextValue = AuthState & AuthActions;
