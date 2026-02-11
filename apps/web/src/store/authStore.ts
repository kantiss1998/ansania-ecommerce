import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import apiClient, { getErrorMessage } from '@/lib/api';
import { setTokens, clearTokens } from '@/lib/auth';

/**
 * User type from shared package
 */
interface User {
    id: number;
    email: string;
    role: string;
    phone?: string;
    full_name?: string;
    odoo_user_id?: number;
    odoo_partner_id?: number;
}

/**
 * Auth store state interface
 */
interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;

    // Actions
    login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
    register: (data: RegisterData) => Promise<void>;
    logout: () => Promise<void>;
    fetchProfile: () => Promise<void>;
    updateProfile: (data: Partial<User>) => Promise<void>;
    clearError: () => void;
}

/**
 * Registration data type
 */
interface RegisterData {
    email: string;
    phone: string;
    full_name: string;
    password: string;
}

/**
 * Auth store using Zustand with persistence
 */
export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,

            login: async (email: string, password: string, rememberMe = false) => {
                set({ isLoading: true, error: null });

                try {
                    const response = await apiClient.post('/auth/login', {
                        email,
                        password,
                        remember_me: rememberMe,
                    });

                    const { user, token, refresh_token } = response.data.data;

                    // Store tokens
                    setTokens(token, refresh_token);

                    // Update state
                    set({
                        user,
                        isAuthenticated: true,
                        isLoading: false,
                        error: null,
                    });
                } catch (error) {
                    const message = getErrorMessage(error);
                    set({
                        user: null,
                        isAuthenticated: false,
                        isLoading: false,
                        error: message,
                    });
                    throw error;
                }
            },

            register: async (data: RegisterData) => {
                set({ isLoading: true, error: null });

                try {
                    const response = await apiClient.post('/auth/register', data);

                    const { user, token, refresh_token } = response.data.data;

                    // Store tokens
                    setTokens(token, refresh_token);

                    // Update state
                    set({
                        user,
                        isAuthenticated: true,
                        isLoading: false,
                        error: null,
                    });
                } catch (error) {
                    const message = getErrorMessage(error);
                    set({
                        user: null,
                        isAuthenticated: false,
                        isLoading: false,
                        error: message,
                    });
                    throw error;
                }
            },

            logout: async () => {
                try {
                    // Call logout endpoint (optional)
                    await apiClient.post('/auth/logout');
                } catch (error) {
                    // Ignore logout errors
                    console.error('Logout error:', error);
                } finally {
                    // Clear tokens and state regardless of API call result
                    clearTokens();
                    set({
                        user: null,
                        isAuthenticated: false,
                        error: null,
                    });
                }
            },

            fetchProfile: async () => {
                set({ isLoading: true, error: null });

                try {
                    const response = await apiClient.get('/profile');
                    const user = response.data.data;

                    set({
                        user,
                        isAuthenticated: true,
                        isLoading: false,
                        error: null,
                    });
                } catch (error) {
                    const message = getErrorMessage(error);
                    set({
                        isLoading: false,
                        error: message,
                    });
                    throw error;
                }
            },

            updateProfile: async (data: Partial<User>) => {
                set({ isLoading: true, error: null });

                try {
                    const response = await apiClient.put('/profile', data);
                    const updatedUser = response.data.data;

                    set({
                        user: updatedUser,
                        isLoading: false,
                        error: null,
                    });
                } catch (error) {
                    const message = getErrorMessage(error);
                    set({
                        isLoading: false,
                        error: message,
                    });
                    throw error;
                }
            },

            clearError: () => {
                set({ error: null });
            },
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                user: state.user,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);
