import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import type { AuthContextType, AuthState, AuthTokens } from '@/types/auth.types';
import { tokenStorage } from '../utils/tokenStorage';
import { authService } from '../api/services/auth.service';
import { message } from 'antd';
import type { IUser } from '@shared/types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const navigate = useNavigate();

    const [authState, setAuthState] = useState<AuthState>({
        user: null,
        accessToken: null,
        isAuthenticated: false,
        isLoading: true,
    });

    // load cached data immediately, verify in background
    useEffect(() => {
        const initializeAuth = async () => {
            const accessToken = tokenStorage.getAccessToken();
            const cachedUser = tokenStorage.getUser();

            // If no token, not authenticated
            if (!accessToken) {
                setAuthState({
                    user: null,
                    accessToken: null,
                    isAuthenticated: false,
                    isLoading: false,
                });
                return;
            }

            // step 1: immediately load cached data for fast UI render
            if (cachedUser) {
                setAuthState({
                    user: cachedUser,
                    accessToken,
                    isAuthenticated: true,
                    isLoading: false, // ← UI renders immediately
                });
            } else {
                // No cached user, show loading while we fetch
                setAuthState(prev => ({
                    ...prev,
                    isLoading: true,
                }));
            }

            // STEP 2: verify session in background (non-blocking procedure)...
            try {
                const response = await authService.getCurrentUser();

                if (response.success && response.data) {
                    const freshUser = response.data;

                    // Check if user data actually changed
                    const userChanged = JSON.stringify(freshUser) !== JSON.stringify(cachedUser);

                    if (userChanged) {
                        // silently update with fresh data
                        tokenStorage.setUser(freshUser);
                        setAuthState({
                            user: freshUser,
                            accessToken,
                            isAuthenticated: true,
                            isLoading: false,
                        });

                        // optional thingy.. show subtle notification if profile changed significantly
                        if (cachedUser?.fullName !== freshUser.fullName ||
                            cachedUser?.username !== freshUser.username) {
                            message.info('Profile updated', 2);
                        }
                    } else {
                        // data hasn't changed, keep using cached (already set above)
                        setAuthState(prev => ({ ...prev, isLoading: false }));
                    }
                } else {
                    // Token invalid, logout
                    tokenStorage.clearAll();
                    setAuthState({
                        user: null,
                        accessToken: null,
                        isAuthenticated: false,
                        isLoading: false,
                    });
                    message.warning('Session expired. Please sign in again.');
                }
            } catch (error: any) {
                console.error('Background session validation failed:', error);

                // handling different error scenarios
                if (error.response?.status === 401) {
                    // Token is definitely invalid - logout
                    tokenStorage.clearAll();
                    setAuthState({
                        user: null,
                        accessToken: null,
                        isAuthenticated: false,
                        isLoading: false,
                    });
                    message.error('Session expired. Please sign in again.');
                } else {
                    // Network error or server issue
                    if (cachedUser) {
                        // use cached data, don't block user..
                        // state already set above, we just update loading 
                        setAuthState(prev => ({ ...prev, isLoading: false }));

                        // no error display on initial load - might just be offline
                        console.warn('Using cached profile data - could not verify session');
                    } else {
                        // No cached data and can't verify - logout
                        tokenStorage.clearAll();
                        setAuthState({
                            user: null,
                            accessToken: null,
                            isAuthenticated: false,
                            isLoading: false,
                        });
                    }
                }
            }
        };

        initializeAuth();
    }, []);

    // login function 
    const login = useCallback((accessToken: string, user: IUser) => {
        // Store only access token and user in localStorage
        tokenStorage.setAccessToken(accessToken);
        tokenStorage.setUser(user);

        // Update state
        setAuthState({
            user,
            accessToken,
            isAuthenticated: true,
            isLoading: false,
        });

        // Redirect based on onboarding status
        if (user.isOnboarded) {
            navigate('/dashboard');
        } else {
            navigate('/onboarding');
        }
    }, [navigate]);

    // Logout function
    const logout = useCallback(async () => {
        try {
            await authService.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            // Clear localStorage
            tokenStorage.clearAll();

            // update state
            setAuthState({
                user: null,
                accessToken: null,
                isAuthenticated: false,
                isLoading: false,
            });

            // Redirect to home
            navigate('/');
        }
    }, [navigate]);

    // update user function (after profile updates)
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

    // refresh access token using HTTP-only cookie
    const refreshAccessToken = useCallback(async (): Promise<boolean> => {
        try {

            const response = await authService.refresh();

            if (response.success && response.data) {
                const newAccessToken = response.data.accessToken;

                // update only access token in localStorage
                tokenStorage.setAccessToken(newAccessToken);
                setAuthState(prev => ({
                    ...prev,
                    accessToken: newAccessToken,
                }));

                return true;
            } else {
                // refresh token is invalid, logout
                logout();
                return false;
            }
        } catch (error) {
            console.error('Token refresh error:', error);
            logout();
            return false;
        }
    }, [logout]);

    const value: AuthContextType = {
        ...authState,
        login,
        logout,
        updateUser,
        refreshAccessToken,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
