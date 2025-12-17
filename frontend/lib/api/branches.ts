import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
const API_URL = `${API_BASE_URL}/branches/`;

export interface BranchData {
  id?: number;
  branch_name: string;
  branch_code: string;
  street_address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  country?: string;
  phone?: string;
  email?: string;
  website?: string;
  tax_id?: string;
  license_number?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export const branchesApi = {
  getAll: async (): Promise<BranchData[]> => {
    const response = await axios.get(API_URL);
    return response.data;
  },

  getById: async (id: number): Promise<BranchData> => {
    const response = await axios.get(`${API_URL}${id}`);
    return response.data;
  },

  create: async (data: Partial<BranchData>): Promise<BranchData> => {
    const response = await axios.post(API_URL, data);
    return response.data;
  },

  update: async (id: number, data: Partial<BranchData>): Promise<BranchData> => {
    const response = await axios.put(`${API_URL}${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}${id}`);
  },
};
