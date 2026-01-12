import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
const API_URL = `${API_BASE_URL}/roles`;

const getAuthHeader = () => {
  const token = localStorage.getItem('access_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export interface RoleData {
  id?: number;
  name: string;
  display_name: string;
  description?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface RoleWithTabs extends RoleData {
  tab_ids: number[];
}

export const rolesApi = {
  getAll: async (): Promise<RoleData[]> => {
    const response = await axios.get(`${API_URL}/`, { headers: getAuthHeader() });
    return response.data;
  },

  getById: async (id: number): Promise<RoleWithTabs> => {
    const response = await axios.get(`${API_URL}/${id}`, { headers: getAuthHeader() });
    return response.data;
  },

  create: async (data: Omit<RoleData, 'id' | 'created_at' | 'updated_at'>): Promise<RoleData> => {
    const response = await axios.post(`${API_URL}/`, data, { headers: getAuthHeader() });
    return response.data;
  },

  update: async (id: number, data: Partial<RoleData>): Promise<RoleData> => {
    const response = await axios.put(`${API_URL}/${id}`, data, { headers: getAuthHeader() });
    return response.data;
  },

  assignTabs: async (roleId: number, tabIds: number[]): Promise<RoleWithTabs> => {
    const response = await axios.post(`${API_URL}/${roleId}/tabs`, { tab_ids: tabIds }, { headers: getAuthHeader() });
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`, { headers: getAuthHeader() });
  },

  getRoleTabs: async (roleId: number, token?: string): Promise<any[]> => {
    const headers = token ? { Authorization: `Bearer ${token}` } : getAuthHeader();
    const response = await axios.get(`${API_URL}/${roleId}/tabs`, { headers });
    return response.data;
  },
};
