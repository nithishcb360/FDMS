import axios from 'axios';

const API_URL = 'http://localhost:8001/api/followups';

export interface FollowupData {
  id?: number;
  family_id?: number | null;
  case_id?: number | null;
  task_type: string;
  priority?: string;
  title: string;
  description: string;
  assigned_to?: string | null;
  due_date: string;
  reminder_date?: string | null;
  status?: string;
  completed_at?: string | null;
  completion_notes?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface FollowupStats {
  total: number;
  pending: number;
  overdue: number;
  completed: number;
}

export const followupsApi = {
  getAll: async (params?: {
    skip?: number;
    limit?: number;
    status?: string;
    priority?: string;
    search?: string;
  }): Promise<FollowupData[]> => {
    const response = await axios.get(`${API_URL}/`, { params });
    return response.data;
  },

  getStats: async (): Promise<FollowupStats> => {
    const response = await axios.get(`${API_URL}/stats`);
    return response.data;
  },

  getById: async (id: number): Promise<FollowupData> => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  },

  create: async (data: FollowupData): Promise<FollowupData> => {
    const response = await axios.post(`${API_URL}/`, data);
    return response.data;
  },

  update: async (id: number, data: Partial<FollowupData>): Promise<FollowupData> => {
    const response = await axios.put(`${API_URL}/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`);
  },
};
