import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
const API_URL = `${API_BASE_URL}/tax-codes/`;

export interface TaxCodeData {
  id?: number;
  tax_code: string;
  tax_name: string;
  country: string;
  description?: string;
  tax_rate: number;
  applies_to_services: boolean;
  applies_to_products: boolean;
  effective_from: string;
  effective_to?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export const taxCodesApi = {
  getAll: async (): Promise<TaxCodeData[]> => {
    const response = await axios.get(API_URL);
    return response.data;
  },

  getById: async (id: number): Promise<TaxCodeData> => {
    const response = await axios.get(`${API_URL}${id}`);
    return response.data;
  },

  create: async (data: Partial<TaxCodeData>): Promise<TaxCodeData> => {
    const response = await axios.post(API_URL, data);
    return response.data;
  },

  update: async (id: number, data: Partial<TaxCodeData>): Promise<TaxCodeData> => {
    const response = await axios.put(`${API_URL}${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}${id}`);
  },
};
