import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
const API_URL = `${API_BASE_URL}/documents`;

export interface DocumentData {
  id?: number;
  title: string;
  description?: string;
  document_type: string;
  file_name: string;
  file_path: string;
  file_size: number;
  file_type: string;
  mime_type?: string;
  case_id?: number;
  client_name?: string;
  status?: string;
  visibility?: string;
  tags?: string;
  uploaded_by?: string;
  is_deleted?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface DocumentStats {
  total: number;
  draft: number;
  approved: number;
  total_storage_mb: number;
}

export const documentsApi = {
  upload: async (file: File, data: {
    title: string;
    document_type: string;
    description?: string;
    case_id?: number;
    client_name?: string;
    status?: string;
    visibility?: string;
    tags?: string;
    uploaded_by?: string;
  }): Promise<DocumentData> => {
    const formData = new FormData();
    formData.append('file', file);

    const params = new URLSearchParams();
    params.append('title', data.title);
    params.append('document_type', data.document_type);
    if (data.description) params.append('description', data.description);
    if (data.case_id) params.append('case_id', data.case_id.toString());
    if (data.client_name) params.append('client_name', data.client_name);
    params.append('status', data.status || 'Draft');
    params.append('visibility', data.visibility || 'Private');
    if (data.tags) params.append('tags', data.tags);
    if (data.uploaded_by) params.append('uploaded_by', data.uploaded_by);

    const response = await axios.post(`${API_URL}/upload?${params.toString()}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getAll: async (params?: {
    search?: string;
    document_type?: string;
    status?: string;
    visibility?: string;
  }): Promise<DocumentData[]> => {
    const response = await axios.get(API_URL, { params });
    return response.data;
  },

  getStats: async (): Promise<DocumentStats> => {
    const response = await axios.get(`${API_URL}/stats`);
    return response.data;
  },

  getTypes: async (): Promise<string[]> => {
    const response = await axios.get(`${API_URL}/types`);
    return response.data;
  },

  getById: async (id: number): Promise<DocumentData> => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  },

  update: async (id: number, documentData: Partial<DocumentData>): Promise<DocumentData> => {
    const response = await axios.put(`${API_URL}/${id}`, documentData);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`);
  },

  getDownloadUrl: async (id: number): Promise<{ file_path: string; file_name: string; mime_type: string }> => {
    const response = await axios.get(`${API_URL}/${id}/download`);
    return response.data;
  },
};
