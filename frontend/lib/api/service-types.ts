import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
const API_URL = `${API_BASE_URL}/service-types/`;

const getAuthHeader = () => {
  const token = localStorage.getItem('access_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export interface ServiceTypeData {
  id?: number;
  service_type: string;
  display_name: string;
  description?: string;
  base_price: number;
  estimated_duration: number;
  requires_venue: boolean;
  requires_vehicle: boolean;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export const serviceTypesApi = {
  getAll: async (): Promise<ServiceTypeData[]> => {
    const response = await axios.get(API_URL, { headers: getAuthHeader() });
    return response.data;
  },

  getById: async (id: number): Promise<ServiceTypeData> => {
    const response = await axios.get(`${API_URL}${id}`, { headers: getAuthHeader() });
    return response.data;
  },

  create: async (data: Partial<ServiceTypeData>): Promise<ServiceTypeData> => {
    const response = await axios.post(API_URL, data, { headers: getAuthHeader() });
    return response.data;
  },

  update: async (id: number, data: Partial<ServiceTypeData>): Promise<ServiceTypeData> => {
    const response = await axios.put(`${API_URL}${id}`, data, { headers: getAuthHeader() });
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}${id}`, { headers: getAuthHeader() });
  },
};
