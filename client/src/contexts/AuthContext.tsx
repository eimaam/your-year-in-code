import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import type { AuthContextType, AuthState } from '@/types/auth.types';
import { tokenStorage } from '../utils/tokenStorage';
import { authService } from '../api/services/auth.service';
import { message } from 'antd';
import type { IUser } from '@shared/types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const navigate = useNavigate();

    const [authState, setAuthState] = useState<AuthState>({
        user: null,
        isAuthenticated: false,
        isLoading: true,
    });

    useEffect(() => {
        const initializeAuth = async () => {
            const cachedUser = tokenStorage.getUser();

            if (cachedUser) {
                setAuthState({
                    user: cachedUser,
                    isAuthenticated: true,
                    isLoading: false,
                });
            } else {
                setAuthState(prev => ({
                    ...prev,
                    isLoading: true,
                }));
            }

            try {
                const response = await authService.getCurrentUser();

                if (response.success && response.data) {
                    const freshUser = response.data;

                    const userChanged = JSON.stringify(freshUser) !== JSON.stringify(cachedUser);

                    if (userChanged) {
                        tokenStorage.setUser(freshUser);
                        setAuthState({
                            user: freshUser,
                            isAuthenticated: true,
                            isLoading: false,
                        });

                        if (cachedUser?.fullName !== freshUser.fullName ||
                            cachedUser?.username !== freshUser.username) {
                            message.info('Profile updated', 2);
                        }
                    } else {
                        setAuthState(prev => ({ ...prev, isLoading: false }));
                    }
                } else {
                    tokenStorage.clearAll();
                    setAuthState({
                        user: null,
                        isAuthenticated: false,
                        isLoading: false,
                    });
                    message.warning('Session expired. Please sign in again.');
                }
            } catch (error: any) {
                console.error('Background session validation failed:', error);

                if (error.response?.status === 401) {
                    tokenStorage.clearAll();
                    setAuthState({
                        user: null,
                        isAuthenticated: false,
                        isLoading: false,
                    });
                    message.error('Session expired. Please sign in again.');
                } else {
                    if (cachedUser) {
                        setAuthState(prev => ({ ...prev, isLoading: false }));
                        console.warn('Using cached profile data - could not verify session');
                    } else {
                        tokenStorage.clearAll();
                        setAuthState({
                            user: null,
                            isAuthenticated: false,
                            isLoading: false,
                        });
                    }
                }
            }
        };

        initializeAuth();
    }, []);

    const login = useCallback((user: IUser) => {
        tokenStorage.setUser(user);

        setAuthState({
            user,
            isAuthenticated: true,
            isLoading: false,
        });

        if (user) {
            navigate('/dashboard');
        } else {
            navigate('/onboarding');
        }
    }, [navigate]);

    const logout = useCallback(async () => {
        try {
            await authService.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            tokenStorage.clearAll();

            setAuthState({
                user: null,
                isAuthenticated: false,
                isLoading: false,
            });

            navigate('/');
        }
    }, [navigate]);

    const updateUser = useCallback((updates: Partial<IUser>) => {
        setAuthState(prev => {
            if (!prev.user) return prev;

            const updatedUser = { ...prev.user, ...updates };
            tokenStorage.setUser(updatedUser);

            return {
                ...prev,
                user: updatedUser,
            };
        });
    }, []);

    const value: AuthContextType = {
        ...authState,
        login,
        logout,
        updateUser,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
