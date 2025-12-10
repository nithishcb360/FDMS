import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
const API_URL = `${API_BASE_URL}/cases`;

export interface CaseData {
  id?: number;
  case_number?: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  photo_url?: string;
  gender?: string;
  date_of_birth?: string;
  date_of_death: string;
  place_of_death: string;
  cause_of_death?: string;
  branch: string;
  service_type?: string;
  priority?: string;
  status?: string;
  internal_notes?: string;
  created_at?: string;
  updated_at?: string;
}

export const casesApi = {
  getAll: async (): Promise<CaseData[]> => {
    const response = await axios.get(API_URL);
    return response.data;
  },

  getById: async (id: number): Promise<CaseData> => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  },

  create: async (caseData: CaseData): Promise<CaseData> => {
    const response = await axios.post(API_URL, caseData);
    return response.data;
  },

  update: async (id: number, caseData: Partial<CaseData>): Promise<CaseData> => {
    const response = await axios.put(`${API_URL}/${id}`, caseData);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`);
  },
};
