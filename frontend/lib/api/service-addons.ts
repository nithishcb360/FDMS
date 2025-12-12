import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
const API_URL = `${API_BASE_URL}/service-addons`;

export interface ServiceAddonData {
  id?: number;
  // Basic Information
  name: string;
  category?: string;
  description?: string;

  // Pricing & Units
  unit_price?: number;
  unit_of_measure?: string;
  tax_applicable?: boolean;

  // Inventory Management
  requires_inventory_check?: boolean;
  current_stock_quantity?: number;
  minimum_stock_level?: number;

  // Supplier Information
  supplier_name?: string;
  supplier_contact?: string;
  supplier_notes?: string;

  // Additional Settings
  display_order?: number;
  is_active?: boolean;

  created_at?: string;
  updated_at?: string;
}

export interface ServiceAddonStats {
  total: number;
  active: number;
  categories: number;
  avg_price: number;
}

export const serviceAddonsApi = {
  getAll: async (params?: {
    search?: string;
    category?: string;
    status?: string;
  }): Promise<ServiceAddonData[]> => {
    const response = await axios.get(API_URL, { params });
    return response.data;
  },

  getStats: async (): Promise<ServiceAddonStats> => {
    const response = await axios.get(`${API_URL}/stats`);
    return response.data;
  },

  getCategories: async (): Promise<string[]> => {
    const response = await axios.get(`${API_URL}/categories`);
    return response.data;
  },

  getById: async (id: number): Promise<ServiceAddonData> => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  },

  create: async (addonData: Omit<ServiceAddonData, 'id' | 'created_at' | 'updated_at'>): Promise<ServiceAddonData> => {
    const response = await axios.post(API_URL, addonData);
    return response.data;
  },

  update: async (id: number, addonData: Partial<Omit<ServiceAddonData, 'id' | 'created_at' | 'updated_at'>>): Promise<ServiceAddonData> => {
    const response = await axios.put(`${API_URL}/${id}`, addonData);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`);
  },
};
