import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
const API_URL = `${API_BASE_URL}/next-of-kin`;

export interface NextOfKinData {
  id?: number;
  case_number: string;
  first_name: string;
  last_name: string;
  relationship: string;
  phone: string;
  email?: string;
  street_address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  is_primary_contact: boolean;
  is_authorized_decision_maker: boolean;
  receive_notifications: boolean;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export const nextOfKinApi = {
  getAll: async (): Promise<NextOfKinData[]> => {
    const response = await axios.get(API_URL);
    return response.data;
  },

  getById: async (id: number): Promise<NextOfKinData> => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  },

  getByCase: async (caseNumber: string): Promise<NextOfKinData[]> => {
    const response = await axios.get(`${API_URL}/by-case/${caseNumber}`);
    return response.data;
  },

  create: async (data: NextOfKinData): Promise<NextOfKinData> => {
    const response = await axios.post(API_URL, data);
    return response.data;
  },

  update: async (id: number, data: Partial<NextOfKinData>): Promise<NextOfKinData> => {
    const response = await axios.put(`${API_URL}/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`);
  },
};
