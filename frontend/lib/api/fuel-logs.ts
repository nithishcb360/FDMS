import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
const API_URL = `${API_BASE_URL}/fuel-logs`;

export interface FuelLogData {
  id?: number;
  vehicle_id: number;
  date: string;
  fuel_type: string;
  quantity: number;
  cost: number;
  station?: string;
  odometer_reading?: number;
  mpg?: number;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface FuelLogStats {
  total_logs: number;
  total_fuel: number;
  total_cost: number;
  avg_mpg: number;
}

export const fuelLogsApi = {
  getAll: async (params?: {
    search?: string;
    fuel_type?: string;
    vehicle_id?: number;
  }): Promise<FuelLogData[]> => {
    const response = await axios.get(API_URL, { params });
    return response.data;
  },

  getStats: async (): Promise<FuelLogStats> => {
    const response = await axios.get(`${API_URL}/stats`);
    return response.data;
  },

  getFuelTypes: async (): Promise<string[]> => {
    const response = await axios.get(`${API_URL}/fuel-types`);
    return response.data;
  },

  getById: async (id: number): Promise<FuelLogData> => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  },

  create: async (fuelLogData: Omit<FuelLogData, 'id' | 'created_at' | 'updated_at'>): Promise<FuelLogData> => {
    const response = await axios.post(API_URL, fuelLogData);
    return response.data;
  },

  update: async (id: number, fuelLogData: Partial<Omit<FuelLogData, 'id' | 'created_at' | 'updated_at'>>): Promise<FuelLogData> => {
    const response = await axios.put(`${API_URL}/${id}`, fuelLogData);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`);
  },
};
