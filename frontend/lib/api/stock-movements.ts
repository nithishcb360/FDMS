import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
const API_URL = `${API_BASE_URL}/stock-movements/`;

export interface StockMovementData {
  id?: number;
  movement_id?: string;
  product: string;
  product_sku?: string;
  branch: string;
  movement_type: string;
  direction: string;
  quantity: number;
  stock_before?: number;
  stock_after?: number;
  purchase_order?: string;
  case_id?: string;
  reason?: string;
  movement_date: string;
  additional_notes?: string;
  created_at?: string;
  updated_at?: string;
}

export const stockMovementsApi = {
  async getAll(): Promise<StockMovementData[]> {
    const response = await axios.get(API_URL);
    return response.data;
  },

  async getById(id: number): Promise<StockMovementData> {
    const response = await axios.get(`${API_URL}${id}`);
    return response.data;
  },

  async create(data: StockMovementData): Promise<StockMovementData> {
    const response = await axios.post(API_URL, data);
    return response.data;
  },

  async update(id: number, data: Partial<StockMovementData>): Promise<StockMovementData> {
    const response = await axios.put(`${API_URL}${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await axios.delete(`${API_URL}${id}`);
  },
};
