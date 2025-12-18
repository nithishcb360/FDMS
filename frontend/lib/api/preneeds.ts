import axios from 'axios';

const API_URL = 'http://localhost:8001/api/preneeds';

export interface PreneedData {
  id?: number;
  family_id?: number | null;
  plan_holder_name: string;
  date_of_birth: string;
  relationship_to_primary?: string | null;
  service_type: string;
  package: string;
  service_preferences?: any;
  estimated_cost: number;
  amount_paid?: number;
  payment_plan: string;
  status?: string;
  contract_document?: string | null;
  special_instructions?: string | null;
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface PreneedStats {
  total_plans: number;
  active_plans: number;
  total_value: number;
  total_paid: number;
}

export const preneedsApi = {
  getAll: async (params?: {
    skip?: number;
    limit?: number;
    status?: string;
    payment_plan?: string;
    search?: string;
  }): Promise<PreneedData[]> => {
    const response = await axios.get(`${API_URL}/`, { params });
    return response.data;
  },

  getStats: async (): Promise<PreneedStats> => {
    const response = await axios.get(`${API_URL}/stats`);
    return response.data;
  },

  getById: async (id: number): Promise<PreneedData> => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  },

  create: async (data: PreneedData): Promise<PreneedData> => {
    const response = await axios.post(`${API_URL}/`, data);
    return response.data;
  },

  update: async (id: number, data: Partial<PreneedData>): Promise<PreneedData> => {
    const response = await axios.put(`${API_URL}/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`);
  },
};
