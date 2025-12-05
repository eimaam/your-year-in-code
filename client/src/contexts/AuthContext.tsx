import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import type { AuthContextType, AuthState } from '@/types/auth.types';
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
            try {
                const response = await authService.getCurrentUser();

                if (response.success && response.data) {
                    setAuthState({
                        user: response.data,
                        isAuthenticated: true,
                        isLoading: false,
                    });
                } else {
                    setAuthState({
                        user: null,
                        isAuthenticated: false,
                        isLoading: false,
                    });
                }
            } catch (error: any) {
                setAuthState({
                    user: null,
                    isAuthenticated: false,
                    isLoading: false,
                });
            }
        };

        initializeAuth();
    }, []);

    const login = useCallback((user: IUser) => {
        setAuthState({
            user,
            isAuthenticated: true,
            isLoading: false,
        });

        if (user.username) {
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

            return {
                ...prev,
                user: { ...prev.user, ...updates },
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
