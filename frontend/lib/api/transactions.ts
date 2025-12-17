import axios from 'axios';

const API_URL = 'http://localhost:8001/api/transactions';

export interface TransactionData {
  id?: number;
  transaction_id: string;
  transaction_type: string;
  category: string;
  amount: number;
  transaction_date: string;
  description: string;
  invoice_id?: number | null;
  payment_id?: number | null;
  reference_number?: string | null;
  account_name?: string | null;
  branch?: string | null;
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface TransactionStats {
  total_transactions: number;
  income: number;
  expenses: number;
  net: number;
}

export const transactionsApi = {
  getAll: async (params?: {
    search?: string;
    transaction_type?: string;
    category?: string;
  }): Promise<TransactionData[]> => {
    const response = await axios.get(`${API_URL}/`, { params });
    return response.data;
  },

  getStats: async (): Promise<TransactionStats> => {
    const response = await axios.get(`${API_URL}/stats`);
    return response.data;
  },

  getById: async (id: number): Promise<TransactionData> => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  },

  create: async (data: Omit<TransactionData, 'id' | 'transaction_id' | 'created_at' | 'updated_at'>): Promise<TransactionData> => {
    const response = await axios.post(`${API_URL}/`, data);
    return response.data;
  },

  update: async (id: number, data: Partial<TransactionData>): Promise<TransactionData> => {
    const response = await axios.put(`${API_URL}/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`);
  }
};
