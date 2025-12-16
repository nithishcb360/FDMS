import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001/api';
const API_URL = `${API_BASE_URL}/invoices`;

export interface InvoiceData {
  id?: number;
  invoice_number: string;
  client_name: string;
  client_email?: string;
  client_phone?: string;
  billing_address?: string;
  branch?: string;
  case_reference?: string;
  service_reference?: string;
  invoice_date: string;
  due_date: string;
  status: string;
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
  paid_amount: number;
  balance: number;
  payment_terms?: string;
  internal_notes?: string;
  client_notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface InvoiceStats {
  total_invoices: number;
  total_revenue: number;
  outstanding: number;
  overdue: number;
}

export const invoicesApi = {
  getAll: async (params?: {
    search?: string;
    status?: string;
    branch?: string;
  }): Promise<InvoiceData[]> => {
    const response = await axios.get(`${API_URL}/`, { params });
    return response.data;
  },

  getById: async (id: number): Promise<InvoiceData> => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  },

  getStats: async (): Promise<InvoiceStats> => {
    const response = await axios.get(`${API_URL}/stats`);
    return response.data;
  },

  create: async (data: Omit<InvoiceData, 'id' | 'created_at' | 'updated_at'>): Promise<InvoiceData> => {
    const response = await axios.post(`${API_URL}/`, data);
    return response.data;
  },

  update: async (id: number, data: Partial<InvoiceData>): Promise<InvoiceData> => {
    const response = await axios.put(`${API_URL}/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`);
  },
};
