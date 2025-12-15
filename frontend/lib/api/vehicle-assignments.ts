import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
const API_URL = `${API_BASE_URL}/vehicle-assignments`;

export interface VehicleAssignmentData {
  id?: number;

  // Basic Information
  vehicle_id: number;
  assignment_type: string;
  case_reference?: string;
  service_reference?: string;

  // Schedule
  scheduled_start: string;
  scheduled_end: string;
  actual_start?: string;
  actual_end?: string;

  // Location & Distance
  pickup_location: string;
  dropoff_location: string;
  estimated_distance?: number;
  actual_distance?: number;

  // Driver & Mileage
  driver?: string;
  backup_driver?: string;
  start_mileage?: number;
  end_mileage?: number;

  // Status & Priority
  status?: string;
  priority?: string;

  // Additional Information
  notes?: string;

  created_at?: string;
  updated_at?: string;
}

export interface VehicleAssignmentStats {
  total: number;
  scheduled: number;
  in_progress: number;
  completed: number;
}

export const vehicleAssignmentsApi = {
  getAll: async (params?: {
    search?: string;
    status?: string;
    assignment_type?: string;
  }): Promise<VehicleAssignmentData[]> => {
    const response = await axios.get(API_URL, { params });
    return response.data;
  },

  getStats: async (): Promise<VehicleAssignmentStats> => {
    const response = await axios.get(`${API_URL}/stats`);
    return response.data;
  },

  getAssignmentTypes: async (): Promise<string[]> => {
    const response = await axios.get(`${API_URL}/assignment-types`);
    return response.data;
  },

  getById: async (id: number): Promise<VehicleAssignmentData> => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  },

  create: async (assignmentData: Omit<VehicleAssignmentData, 'id' | 'created_at' | 'updated_at'>): Promise<VehicleAssignmentData> => {
    const response = await axios.post(API_URL, assignmentData);
    return response.data;
  },

  update: async (id: number, assignmentData: Partial<Omit<VehicleAssignmentData, 'id' | 'created_at' | 'updated_at'>>): Promise<VehicleAssignmentData> => {
    const response = await axios.put(`${API_URL}/${id}`, assignmentData);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`);
  },
};
