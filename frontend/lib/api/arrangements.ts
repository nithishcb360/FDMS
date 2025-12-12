import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
const API_URL = `${API_BASE_URL}/arrangements`;

export interface ArrangementData {
  id?: number;
  case_id: number;
  case_number?: string;
  deceased_name?: string;
  service_package?: string;
  service_date?: string;
  service_time?: string;
  duration_minutes?: number;
  venue?: string;
  estimated_attendees?: number;
  religious_rite?: string;
  clergy_name?: string;
  clergy_contact?: string;
  special_requests?: string;
  music_preferences?: string;
  eulogy_speakers?: string;
  package_customized?: boolean;
  customization_notes?: string;
  approval_status?: string;
  is_confirmed?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ArrangementStats {
  total: number;
  pending_approval: number;
  approved: number;
  confirmed: number;
}

export const arrangementsApi = {
  getAll: async (params?: {
    search?: string;
    approval_status?: string;
    is_confirmed?: boolean;
  }): Promise<ArrangementData[]> => {
    const response = await axios.get(API_URL, { params });
    return response.data;
  },

  getStats: async (): Promise<ArrangementStats> => {
    const response = await axios.get(`${API_URL}/stats`);
    return response.data;
  },

  getById: async (id: number): Promise<ArrangementData> => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  },

  create: async (arrangementData: Omit<ArrangementData, 'id' | 'case_number' | 'deceased_name' | 'created_at' | 'updated_at'>): Promise<ArrangementData> => {
    const response = await axios.post(API_URL, arrangementData);
    return response.data;
  },

  update: async (id: number, arrangementData: Partial<Omit<ArrangementData, 'id' | 'case_number' | 'deceased_name' | 'created_at' | 'updated_at'>>): Promise<ArrangementData> => {
    const response = await axios.put(`${API_URL}/${id}`, arrangementData);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`);
  },
};
