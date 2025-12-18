import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface DocumentTemplateData {
  id: number;
  name: string;
  template_type: string;
  document_type_id?: number;
  content?: string;
  description?: string;
  status: string;
  file_path?: string;
  document_type_name?: string;
  created_at: string;
  updated_at?: string;
}

export interface DocumentTemplateStats {
  total_templates: number;
  active_templates: number;
  word_templates: number;
  pdf_templates: number;
}

export interface CreateDocumentTemplateData {
  name: string;
  template_type: string;
  document_type_id?: number;
  content?: string;
  description?: string;
  status?: string;
}

export interface UpdateDocumentTemplateData {
  name?: string;
  template_type?: string;
  document_type_id?: number;
  content?: string;
  description?: string;
  status?: string;
}

export const documentTemplatesApi = {
  getAll: async (params?: {
    search?: string;
    template_type?: string;
    status?: string;
  }): Promise<DocumentTemplateData[]> => {
    const response = await axios.get(`${API_URL}/api/document-templates/`, { params });
    return response.data;
  },

  getStats: async (): Promise<DocumentTemplateStats> => {
    const response = await axios.get(`${API_URL}/api/document-templates/stats`);
    return response.data;
  },

  getTypes: async (): Promise<string[]> => {
    const response = await axios.get(`${API_URL}/api/document-templates/types`);
    return response.data;
  },

  getById: async (id: number): Promise<DocumentTemplateData> => {
    const response = await axios.get(`${API_URL}/api/document-templates/${id}`);
    return response.data;
  },

  create: async (data: CreateDocumentTemplateData): Promise<DocumentTemplateData> => {
    const response = await axios.post(`${API_URL}/api/document-templates/`, data);
    return response.data;
  },

  update: async (id: number, data: UpdateDocumentTemplateData): Promise<DocumentTemplateData> => {
    const response = await axios.put(`${API_URL}/api/document-templates/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/api/document-templates/${id}`);
  },
};
