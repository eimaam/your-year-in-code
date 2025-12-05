import type { IUser } from "@shared/types";

export interface AuthTokens {
  accessToken: string;
}

export interface AuthState {
  user: IUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AuthContextType extends AuthState {
  login: (user: IUser) => void;
  logout: () => void;
  updateUser: (user: Partial<IUser>) => void;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: IUser;
  };
}
