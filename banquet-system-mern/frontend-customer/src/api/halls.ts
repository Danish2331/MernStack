import apiClient from './client';
import type { Hall } from '@/types';

export const hallsAPI = {
  getAll: async (): Promise<Hall[]> => {
    const { data } = await apiClient.get<Hall[]>('/halls');
    return data;
  },

  getById: async (id: string): Promise<Hall> => {
    const { data } = await apiClient.get<Hall>(`/halls/${id}`);
    return data;
  },
};

export default hallsAPI;
