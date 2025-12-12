import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
const API_URL = `${API_BASE_URL}/products`;

export interface ProductData {
  id?: number;
  product_id: string;
  sku: string;
  product_name: string;
  category: string;
  product_type?: string;
  stock: number;
  cost_price: number;
  selling_price: number;
  status: string;
  unit?: string;
  description?: string;
  supplier?: string;
  reorder_level?: number;
  created_at?: string;
  updated_at?: string;
}

export const productsApi = {
  getAll: async (): Promise<ProductData[]> => {
    const response = await axios.get(API_URL);
    return response.data;
  },

  getById: async (id: number): Promise<ProductData> => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  },

  create: async (data: ProductData): Promise<ProductData> => {
    const response = await axios.post(API_URL, data);
    return response.data;
  },

  update: async (id: number, data: Partial<ProductData>): Promise<ProductData> => {
    const response = await axios.put(`${API_URL}/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`);
  },
};
