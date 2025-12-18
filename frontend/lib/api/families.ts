import axios from 'axios';

const API_URL = 'http://localhost:8001/api/families';

export interface FamilyData {
  id?: number;
  family_id: string;
  primary_contact_name: string;
  phone: string;
  email: string;
  street_address: string;
  city: string;
  state: string;
  zip_code: string;
  country?: string | null;
  preferred_language?: string | null;
  communication_preference?: string | null;
  tags?: string[] | null;
  notes?: string | null;
  total_cases?: number;
  lifetime_value?: number;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export interface FamilyStats {
  total_families: number;
  active_families: number;
  total_revenue: number;
  avg_lifetime_value: number;
}

export const familiesApi = {
  getAll: async (params?: {
    search?: string;
    status?: string;
  }): Promise<FamilyData[]> => {
    const response = await axios.get(`${API_URL}/`, { params });
    return response.data;
  },

  getStats: async (): Promise<FamilyStats> => {
    const response = await axios.get(`${API_URL}/stats`);
    return response.data;
  },

  getById: async (id: number): Promise<FamilyData> => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  },

  create: async (data: Omit<FamilyData, 'id' | 'family_id' | 'total_cases' | 'lifetime_value' | 'status' | 'created_at' | 'updated_at'>): Promise<FamilyData> => {
    const response = await axios.post(`${API_URL}/`, data);
    return response.data;
  },

  update: async (id: number, data: Partial<FamilyData>): Promise<FamilyData> => {
    const response = await axios.put(`${API_URL}/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`);
  }
};
