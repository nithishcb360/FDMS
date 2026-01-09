import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
const API_URL = `${API_BASE_URL}/categories/`;

const getAuthHeader = () => {
  const token = localStorage.getItem('access_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export interface CategoryData {
  id?: number;
  category_id: string;
  category_name: string;
  category_type: string;
  parent_category?: string;
  description?: string;
  display_order?: number;
  status: string;
  created_at?: string;
  updated_at?: string;
}

export const categoriesApi = {
  getAll: async (): Promise<CategoryData[]> => {
    const response = await axios.get(API_URL, { headers: getAuthHeader() });
    return response.data;
  },

  getById: async (id: number): Promise<CategoryData> => {
    const response = await axios.get(`${API_URL}${id}`, { headers: getAuthHeader() });
    return response.data;
  },

  create: async (data: CategoryData): Promise<CategoryData> => {
    const response = await axios.post(API_URL, data, { headers: getAuthHeader() });
    return response.data;
  },

  update: async (id: number, data: Partial<CategoryData>): Promise<CategoryData> => {
    const response = await axios.put(`${API_URL}${id}`, data, { headers: getAuthHeader() });
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}${id}`, { headers: getAuthHeader() });
  },
};
