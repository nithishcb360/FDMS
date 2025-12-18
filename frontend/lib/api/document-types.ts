import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface DocumentTypeData {
  id: number;
  name: string;
  description?: string;
  category: string;
  allowed_extensions?: string;
  max_size_mb?: number;
  retention_years?: number;
  require_signature: boolean;
  require_approval: boolean;
  status: string;
  document_count: number;
  created_at: string;
  updated_at?: string;
}

export interface DocumentTypeStats {
  total_types: number;
  active_types: number;
  require_signature: number;
  require_approval: number;
}

export interface CreateDocumentTypeData {
  name: string;
  description?: string;
  category: string;
  allowed_extensions?: string;
  max_size_mb?: number;
  retention_years?: number;
  require_signature?: boolean;
  require_approval?: boolean;
  status?: string;
}

export interface UpdateDocumentTypeData {
  name?: string;
  description?: string;
  category?: string;
  allowed_extensions?: string;
  max_size_mb?: number;
  retention_years?: number;
  require_signature?: boolean;
  require_approval?: boolean;
  status?: string;
}

export const documentTypesApi = {
  getAll: async (params?: {
    search?: string;
    category?: string;
    status?: string;
  }): Promise<DocumentTypeData[]> => {
    const response = await axios.get(`${API_URL}/api/document-types/`, { params });
    return response.data;
  },

  getStats: async (): Promise<DocumentTypeStats> => {
    const response = await axios.get(`${API_URL}/api/document-types/stats`);
    return response.data;
  },

  getCategories: async (): Promise<string[]> => {
    const response = await axios.get(`${API_URL}/api/document-types/categories`);
    return response.data;
  },

  getById: async (id: number): Promise<DocumentTypeData> => {
    const response = await axios.get(`${API_URL}/api/document-types/${id}`);
    return response.data;
  },

  create: async (data: CreateDocumentTypeData): Promise<DocumentTypeData> => {
    const response = await axios.post(`${API_URL}/api/document-types/`, data);
    return response.data;
  },

  update: async (id: number, data: UpdateDocumentTypeData): Promise<DocumentTypeData> => {
    const response = await axios.put(`${API_URL}/api/document-types/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/api/document-types/${id}`);
  },
};
