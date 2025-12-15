import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
const API_URL = `${API_BASE_URL}/vehicles`;

export interface VehicleData {
  id?: number;
  // Identification
  vehicle_type: string;
  branch?: string;

  // Vehicle Details
  make: string;
  model: string;
  year: number;
  color?: string;
  vin: string;
  license_plate: string;

  // Technical Specifications
  fuel_type?: string;
  tank_capacity?: number;
  seating_capacity?: number;
  cargo_capacity?: number;

  // Status & Condition
  status?: string;
  condition?: string;
  ownership_type?: string;

  // Mileage Tracking
  current_mileage?: number;
  purchase_mileage?: number;

  // Financial Information
  purchase_price?: number;
  purchase_date?: string;
  monthly_lease_amount?: number;

  // Insurance & Registration
  insurance_company?: string;
  policy_number?: string;
  insurance_expiry_date?: string;
  registration_expiry_date?: string;

  // Maintenance Tracking
  last_service_date?: string;
  last_service_mileage?: number;
  next_service_due_date?: string;
  next_service_due_mileage?: number;

  // Additional Information
  notes?: string;
  is_active?: boolean;

  created_at?: string;
  updated_at?: string;
}

export interface VehicleStats {
  total: number;
  available: number;
  in_use: number;
  maintenance: number;
}

export const vehiclesApi = {
  getAll: async (params?: {
    search?: string;
    status?: string;
    vehicle_type?: string;
    branch?: string;
    ownership?: string;
  }): Promise<VehicleData[]> => {
    const response = await axios.get(API_URL, { params });
    return response.data;
  },

  getStats: async (): Promise<VehicleStats> => {
    const response = await axios.get(`${API_URL}/stats`);
    return response.data;
  },

  getVehicleTypes: async (): Promise<string[]> => {
    const response = await axios.get(`${API_URL}/vehicle-types`);
    return response.data;
  },

  getBranches: async (): Promise<string[]> => {
    const response = await axios.get(`${API_URL}/branches`);
    return response.data;
  },

  getById: async (id: number): Promise<VehicleData> => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  },

  create: async (vehicleData: Omit<VehicleData, 'id' | 'created_at' | 'updated_at'>): Promise<VehicleData> => {
    const response = await axios.post(API_URL, vehicleData);
    return response.data;
  },

  update: async (id: number, vehicleData: Partial<Omit<VehicleData, 'id' | 'created_at' | 'updated_at'>>): Promise<VehicleData> => {
    const response = await axios.put(`${API_URL}/${id}`, vehicleData);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`);
  },
};
