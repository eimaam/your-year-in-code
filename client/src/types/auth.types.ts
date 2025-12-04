import type { IUser } from "@shared/types";

export interface AuthTokens {
  accessToken: string;
}

export interface AuthState {
  user: IUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AuthContextType extends AuthState {
  login: (accessToken: string, user: IUser) => void;
  logout: () => void;
  updateUser: (user: Partial<IUser>) => void;
  refreshAccessToken: () => Promise<boolean>;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
    user: IUser;
  };
}
