import apiClient from './client';
import { jwtDecode } from 'jwt-decode';

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    name: string;
    email: string;
    password: string;
    role: 'ADMIN1' | 'ADMIN2';
}

export interface DecodedToken {
    id: string;
    email: string;
    role: 'SUPERADMIN' | 'ADMIN1' | 'ADMIN2' | 'CUSTOMER';
    iat: number;
    exp: number;
}

export const login = async (credentials: LoginCredentials) => {
    const response = await apiClient.post('/auth/login', credentials);
    const { token } = response.data;

    // Decode token to get user info
    const decoded: DecodedToken = jwtDecode(token);

    // Store token and user info
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(decoded));

    return { token, user: decoded };
};

export const register = async (data: RegisterData) => {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};

export const getCurrentUser = (): DecodedToken | null => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
        return JSON.parse(userStr);
    } catch {
        return null;
    }
};
