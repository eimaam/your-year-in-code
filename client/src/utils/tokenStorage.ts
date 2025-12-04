import type { IUser } from '@shared/types';
import { getFromStorage, setInStorage, removeFromStorage, STORAGE_KEYS } from './storage';

export const tokenStorage = {
  // Access Token
  getAccessToken: (): string | null => {
    return getFromStorage<string | null>(STORAGE_KEYS.ACCESS_TOKEN, null);
  },

  setAccessToken: (token: string): boolean => {
    return setInStorage(STORAGE_KEYS.ACCESS_TOKEN, token);
  },

  removeAccessToken: (): boolean => {
    return removeFromStorage(STORAGE_KEYS.ACCESS_TOKEN);
  },

  // IUser
  getUser: (): IUser | null => {
    return getFromStorage<IUser | null>(STORAGE_KEYS.USER, null);
  },

  setUser: (user: IUser): boolean => {
    return setInStorage(STORAGE_KEYS.USER, user);
  },

  removeUser: (): boolean => {
    return removeFromStorage(STORAGE_KEYS.USER);
  },

  // Clear all auth data
  clearAll: (): boolean => {
    const tokenCleared = tokenStorage.removeAccessToken();
    const userCleared = tokenStorage.removeUser();
    return tokenCleared && userCleared;
  },
};
