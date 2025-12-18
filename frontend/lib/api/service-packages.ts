import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
const API_URL = `${API_BASE_URL}/service-packages/`;

export interface ServicePackageData {
  id?: number;
  package_name: string;
  service_type_id?: number;
  description?: string;
  package_price: number;
  included_items?: string;
  is_customizable: boolean;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export const servicePackagesApi = {
  getAll: async (): Promise<ServicePackageData[]> => {
    const response = await axios.get(API_URL);
    return response.data;
  },

  getById: async (id: number): Promise<ServicePackageData> => {
    const response = await axios.get(`${API_URL}${id}`);
    return response.data;
  },

  create: async (data: Partial<ServicePackageData>): Promise<ServicePackageData> => {
    const response = await axios.post(API_URL, data);
    return response.data;
  },

  update: async (id: number, data: Partial<ServicePackageData>): Promise<ServicePackageData> => {
    const response = await axios.put(`${API_URL}${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}${id}`);
  },
};
