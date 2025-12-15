import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
const API_URL = `${API_BASE_URL}/purchase-orders/`;

export interface PurchaseOrderData {
  id?: number;
  po_number: string;
  supplier: string;
  branch?: string;
  order_date: string;
  expected_delivery?: string;
  status: string;
  order_items?: any[];
  tax_amount?: number;
  shipping_cost?: number;
  total_amount?: number;
  notes_to_supplier?: string;
  internal_notes?: string;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
}

export const purchaseOrdersApi = {
  getAll: async (): Promise<PurchaseOrderData[]> => {
    const response = await axios.get(API_URL);
    return response.data;
  },

  getById: async (id: number): Promise<PurchaseOrderData> => {
    const response = await axios.get(`${API_URL}${id}`);
    return response.data;
  },

  create: async (data: Partial<PurchaseOrderData>): Promise<PurchaseOrderData> => {
    const response = await axios.post(API_URL, data);
    return response.data;
  },

  update: async (id: number, data: Partial<PurchaseOrderData>): Promise<PurchaseOrderData> => {
    const response = await axios.put(`${API_URL}${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}${id}`);
  },
};
