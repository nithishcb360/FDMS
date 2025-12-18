import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
const API_URL = `${API_BASE_URL}/payment-modes/`;

export interface PaymentModeData {
  id?: number;
  payment_method: string;
  display_name: string;
  payment_type: string;
  description?: string;
  has_processing_fee: boolean;
  percentage_fee: number;
  fixed_fee: number;
  is_online: boolean;
  requires_authorization: boolean;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export const paymentModesApi = {
  getAll: async (): Promise<PaymentModeData[]> => {
    const response = await axios.get(API_URL);
    return response.data;
  },

  getById: async (id: number): Promise<PaymentModeData> => {
    const response = await axios.get(`${API_URL}${id}`);
    return response.data;
  },

  create: async (data: Partial<PaymentModeData>): Promise<PaymentModeData> => {
    const response = await axios.post(API_URL, data);
    return response.data;
  },

  update: async (id: number, data: Partial<PaymentModeData>): Promise<PaymentModeData> => {
    const response = await axios.put(`${API_URL}${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}${id}`);
  },
};
