import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
const API_URL = `${API_BASE_URL}/case-notes`;

export interface CaseNoteData {
  id?: number;
  case_number: string;
  note_type: string;
  content: string;
  requires_follow_up: boolean;
  follow_up_date?: string;
  is_private: boolean;
  created_by: string;
  created_at?: string;
  updated_at?: string;
}

export const caseNotesApi = {
  getAll: async (): Promise<CaseNoteData[]> => {
    const response = await axios.get(API_URL);
    return response.data;
  },

  getById: async (id: number): Promise<CaseNoteData> => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  },

  getByCase: async (caseNumber: string): Promise<CaseNoteData[]> => {
    const response = await axios.get(`${API_URL}/by-case/${caseNumber}`);
    return response.data;
  },

  create: async (data: CaseNoteData): Promise<CaseNoteData> => {
    const response = await axios.post(API_URL, data);
    return response.data;
  },

  update: async (id: number, data: Partial<CaseNoteData>): Promise<CaseNoteData> => {
    const response = await axios.put(`${API_URL}/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`);
  },
};
