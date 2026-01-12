import axios from 'axios';

const API_URL = 'http://localhost:8001/api/expenses';

const getAuthHeader = () => {
  const token = localStorage.getItem('access_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export interface ExpenseData {
  id?: number;
  expense_number: string;
  category: string;
  branch?: string | null;
  description: string;
  amount: number;
  expense_date: string;
  due_date?: string | null;
  vendor_name: string;
  vendor_reference?: string | null;
  payment_method?: string | null;
  check_number?: string | null;
  status: string;
  is_tax_deductible: boolean;
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface ExpenseStats {
  total_expenses: number;
  total_amount: number;
  pending: number;
  paid: number;
}

export const expensesApi = {
  getAll: async (params?: {
    search?: string;
    status?: string;
    category?: string;
  }): Promise<ExpenseData[]> => {
    const response = await axios.get(`${API_URL}/`, { params, headers: getAuthHeader() });
    return response.data;
  },

  getStats: async (): Promise<ExpenseStats> => {
    const response = await axios.get(`${API_URL}/stats`, { headers: getAuthHeader() });
    return response.data;
  },

  getById: async (id: number): Promise<ExpenseData> => {
    const response = await axios.get(`${API_URL}/${id}`, { headers: getAuthHeader() });
    return response.data;
  },

  create: async (data: Omit<ExpenseData, 'id' | 'expense_number' | 'created_at' | 'updated_at'>): Promise<ExpenseData> => {
    const response = await axios.post(`${API_URL}/`, data, { headers: getAuthHeader() });
    return response.data;
  },

  update: async (id: number, data: Partial<ExpenseData>): Promise<ExpenseData> => {
    const response = await axios.put(`${API_URL}/${id}`, data, { headers: getAuthHeader() });
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`, { headers: getAuthHeader() });
  }
};
