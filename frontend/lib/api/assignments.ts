import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001/api';
const API_URL = `${API_BASE_URL}/assignments`;

export interface AssignmentData {
  id?: number;
  case_number: string;
  staff_member: string;
  role: string;
  instructions?: string;
  status: string;
  assigned_date?: string;
  created_at?: string;
  updated_at?: string;
}

export const assignmentsApi = {
  getAll: async (): Promise<AssignmentData[]> => {
    const response = await axios.get(API_URL);
    return response.data;
  },

  getById: async (id: number): Promise<AssignmentData> => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  },

  getByCase: async (caseNumber: string): Promise<AssignmentData[]> => {
    const response = await axios.get(`${API_URL}/by-case/${caseNumber}`);
    return response.data;
  },

  create: async (data: Omit<AssignmentData, 'id' | 'assigned_date' | 'created_at' | 'updated_at'>): Promise<AssignmentData> => {
    const response = await axios.post(API_URL, data);
    return response.data;
  },

  update: async (id: number, data: Partial<AssignmentData>): Promise<AssignmentData> => {
    const response = await axios.put(`${API_URL}/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`);
  },
};
