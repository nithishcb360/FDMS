import axios from 'axios';

const API_URL = 'http://localhost:8001/api/communications';

export interface CommunicationData {
  id?: number;
  family_id?: number | null;
  family_name?: string | null;
  case_id?: number | null;
  case_number?: string | null;
  type: string;
  direction: string;
  status?: string;
  subject?: string | null;
  message: string;
  response?: string | null;
  has_attachments?: boolean;
  attachment_count?: number;
  communication_date?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CommunicationStats {
  total: number;
  sent: number;
  delivered: number;
  failed: number;
}

export const communicationsApi = {
  getAll: async (params?: {
    search?: string;
    type?: string;
    status?: string;
  }): Promise<CommunicationData[]> => {
    const response = await axios.get(`${API_URL}/`, { params });
    return response.data;
  },

  getStats: async (): Promise<CommunicationStats> => {
    const response = await axios.get(`${API_URL}/stats`);
    return response.data;
  },

  getById: async (id: number): Promise<CommunicationData> => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  },

  create: async (data: Omit<CommunicationData, 'id' | 'communication_date' | 'created_at' | 'updated_at'>): Promise<CommunicationData> => {
    const response = await axios.post(`${API_URL}/`, data);
    return response.data;
  },

  update: async (id: number, data: Partial<CommunicationData>): Promise<CommunicationData> => {
    const response = await axios.put(`${API_URL}/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`);
  }
};
