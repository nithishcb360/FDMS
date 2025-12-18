import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
const API_URL = `${API_BASE_URL}/religious-rites/`;

export interface ReligiousRiteData {
  id?: number;
  religion: string;
  rite_name: string;
  description?: string;
  duration_minutes: number;
  special_requirements?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export const religiousRitesApi = {
  getAll: async (): Promise<ReligiousRiteData[]> => {
    const response = await axios.get(API_URL);
    return response.data;
  },

  getById: async (id: number): Promise<ReligiousRiteData> => {
    const response = await axios.get(`${API_URL}${id}`);
    return response.data;
  },

  create: async (data: Partial<ReligiousRiteData>): Promise<ReligiousRiteData> => {
    const response = await axios.post(API_URL, data);
    return response.data;
  },

  update: async (id: number, data: Partial<ReligiousRiteData>): Promise<ReligiousRiteData> => {
    const response = await axios.put(`${API_URL}${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}${id}`);
  },
};
