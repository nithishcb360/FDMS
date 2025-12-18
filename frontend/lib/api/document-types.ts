import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
const API_URL = `${API_BASE_URL}/document-types/`;

export interface DocumentTypeData {
  id?: number;
  document_type: string;
  type_code: string;
  display_name: string;
  description?: string;
  is_mandatory: boolean;
  has_expiry: boolean;
  has_template: boolean;
  template_file_path?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export const documentTypesApi = {
  getAll: async (): Promise<DocumentTypeData[]> => {
    const response = await axios.get(API_URL);
    return response.data;
  },

  getById: async (id: number): Promise<DocumentTypeData> => {
    const response = await axios.get(`${API_URL}${id}`);
    return response.data;
  },

  create: async (data: Partial<DocumentTypeData>): Promise<DocumentTypeData> => {
    const response = await axios.post(API_URL, data);
    return response.data;
  },

  update: async (id: number, data: Partial<DocumentTypeData>): Promise<DocumentTypeData> => {
    const response = await axios.put(`${API_URL}${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}${id}`);
  },
};
