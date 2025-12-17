import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001/api';
const API_URL = `${API_BASE_URL}/tasks`;

export interface TaskData {
  id?: number;

  // Basic Information
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;

  // Reference Information
  case_reference?: string;
  client_reference?: string;
  branch?: string;

  // Timing & Effort
  due_date: string;
  due_time?: string;
  estimated_hours?: number;
  actual_hours?: number;

  // Supervision
  supervisor?: string;
  supervision_required?: boolean;

  // Additional Notes
  notes?: string;

  created_at?: string;
  updated_at?: string;
}

export interface TaskStats {
  total_tasks: number;
  pending: number;
  in_progress: number;
  completed: number;
}

export const tasksApi = {
  getAll: async (params?: {
    search?: string;
    status?: string;
    priority?: string;
    category?: string;
  }): Promise<TaskData[]> => {
    const response = await axios.get(API_URL, { params });
    return response.data;
  },

  getById: async (id: number): Promise<TaskData> => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  },

  getStats: async (): Promise<TaskStats> => {
    const response = await axios.get(`${API_URL}/stats`);
    return response.data;
  },

  create: async (data: Omit<TaskData, 'id' | 'created_at' | 'updated_at'>): Promise<TaskData> => {
    const response = await axios.post(API_URL, data);
    return response.data;
  },

  update: async (id: number, data: Partial<TaskData>): Promise<TaskData> => {
    const response = await axios.put(`${API_URL}/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`);
  },
};
