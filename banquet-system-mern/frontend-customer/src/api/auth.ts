import apiClient from './client';
import type { AuthResponse, LoginCredentials, RegisterData } from '@/types';

export const authAPI = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>('/auth/login', credentials);
    return data;
  },

  register: async (userData: RegisterData): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>('/auth/register', userData);
    return data;
  },

  logout: (): void => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },

  getCurrentUser: (): string | null => {
    return localStorage.getItem('user');
  },

  getToken: (): string | null => {
    return localStorage.getItem('authToken');
  },

  setAuthData: (token: string, user: string): void => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', user);
  },
};
