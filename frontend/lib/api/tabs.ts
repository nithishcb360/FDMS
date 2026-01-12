import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
const API_URL = `${API_BASE_URL}/tab-settings`;

const getAuthHeader = () => {
  const token = localStorage.getItem('access_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export interface TabSettingData {
  id?: number;
  name: string;
  label: string;
  path?: string;
  parent?: string;
  icon?: string;
  is_enabled: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export const tabsApi = {
  getAll: async (): Promise<TabSettingData[]> => {
    const response = await axios.get(`${API_URL}/`, { headers: getAuthHeader() });
    return response.data;
  },

  getById: async (id: number): Promise<TabSettingData> => {
    const response = await axios.get(`${API_URL}/${id}`, { headers: getAuthHeader() });
    return response.data;
  },

  create: async (data: Omit<TabSettingData, 'id' | 'created_at' | 'updated_at'>): Promise<TabSettingData> => {
    const response = await axios.post(`${API_URL}/`, data, { headers: getAuthHeader() });
    return response.data;
  },

  update: async (id: number, data: Partial<TabSettingData>): Promise<TabSettingData> => {
    const response = await axios.put(`${API_URL}/${id}`, data, { headers: getAuthHeader() });
    return response.data;
  },

  toggle: async (id: number): Promise<TabSettingData> => {
    const response = await axios.patch(`${API_URL}/${id}/toggle`, {}, { headers: getAuthHeader() });
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`, { headers: getAuthHeader() });
  },
};
