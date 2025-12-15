import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
const API_URL = `${API_BASE_URL}/suppliers/`;

export interface SupplierData {
  id?: number;
  supplier_id: string;
  supplier_name: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  location?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  country?: string;
  rating?: number;
  status: string;
  payment_terms?: string;
  website?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export const suppliersApi = {
  getAll: async (): Promise<SupplierData[]> => {
    const response = await axios.get(API_URL);
    return response.data;
  },

  getById: async (id: number): Promise<SupplierData> => {
    const response = await axios.get(`${API_URL}${id}`);
    return response.data;
  },

  create: async (data: Partial<SupplierData>): Promise<SupplierData> => {
    const response = await axios.post(API_URL, data);
    return response.data;
  },

  update: async (id: number, data: Partial<SupplierData>): Promise<SupplierData> => {
    const response = await axios.put(`${API_URL}${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}${id}`);
  },
};
