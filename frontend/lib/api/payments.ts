import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001/api';
const API_URL = `${API_BASE_URL}/payments`;

const getAuthHeader = () => {
  const token = localStorage.getItem('access_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export interface PaymentData {
  id?: number;
  payment_number: string;
  invoice_id?: number;
  invoice_number?: string;
  payer_name: string;
  payment_method: string;
  amount: number;
  payment_date: string;
  reference_number?: string;
  status: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface PaymentStats {
  total_payments: number;
  total_received: number;
  pending: number;
  processing: number;
}

export const paymentsApi = {
  getAll: async (params?: {
    search?: string;
    status?: string;
    payment_method?: string;
  }): Promise<PaymentData[]> => {
    const response = await axios.get(`${API_URL}/`, { params, headers: getAuthHeader() });
    return response.data;
  },

  getById: async (id: number): Promise<PaymentData> => {
    const response = await axios.get(`${API_URL}/${id}`, { headers: getAuthHeader() });
    return response.data;
  },

  getStats: async (): Promise<PaymentStats> => {
    const response = await axios.get(`${API_URL}/stats`, { headers: getAuthHeader() });
    return response.data;
  },

  create: async (data: Omit<PaymentData, 'id' | 'created_at' | 'updated_at'>): Promise<PaymentData> => {
    const response = await axios.post(`${API_URL}/`, data, { headers: getAuthHeader() });
    return response.data;
  },

  update: async (id: number, data: Partial<PaymentData>): Promise<PaymentData> => {
    const response = await axios.put(`${API_URL}/${id}`, data, { headers: getAuthHeader() });
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`, { headers: getAuthHeader() });
  },
};
