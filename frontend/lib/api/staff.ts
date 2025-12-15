import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001/api';
const API_URL = `${API_BASE_URL}/staff`;

export interface StaffData {
  id?: number;

  // Personal Information
  first_name: string;
  middle_name?: string;
  last_name: string;
  date_of_birth?: string;
  ssn?: string;

  // Contact Information
  email: string;
  primary_phone?: string;
  secondary_phone?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state?: string;
  zip_code?: string;

  // Emergency Contact
  emergency_contact_name?: string;
  emergency_contact_relationship?: string;
  emergency_contact_phone?: string;

  // Employment Information
  branch?: string;
  department: string;
  position: string;
  employment_type: string;
  status: string;
  hire_date: string;
  termination_date?: string;

  // Compensation
  hourly_rate?: number;
  annual_salary?: number;

  // Work Preferences
  max_hours_per_week?: number;
  can_work_weekends?: boolean;
  can_work_nights?: boolean;
  can_work_holidays?: boolean;

  // Performance & Reviews
  performance_rating?: number;
  last_review_date?: string;
  next_review_date?: string;

  // Additional Information
  notes?: string;
  is_active?: boolean;

  created_at?: string;
  updated_at?: string;
}

export interface StaffStats {
  total_staff: number;
  active_staff: number;
  full_time: number;
  part_time: number;
}

export const staffApi = {
  getAll: async (params?: {
    search?: string;
    department?: string;
    employment_type?: string;
    status?: string;
    branch?: string;
  }): Promise<StaffData[]> => {
    const response = await axios.get(API_URL, { params });
    return response.data;
  },

  getById: async (id: number): Promise<StaffData> => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  },

  getStats: async (): Promise<StaffStats> => {
    const response = await axios.get(`${API_URL}/stats`);
    return response.data;
  },

  create: async (data: Omit<StaffData, 'id' | 'created_at' | 'updated_at'>): Promise<StaffData> => {
    const response = await axios.post(API_URL, data);
    return response.data;
  },

  update: async (id: number, data: Partial<StaffData>): Promise<StaffData> => {
    const response = await axios.put(`${API_URL}/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`);
  },
};
