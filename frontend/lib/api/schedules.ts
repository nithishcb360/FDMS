import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
const API_URL = `${API_BASE_URL}/schedules`;

export interface ScheduleData {
  id?: number;
  case_id: number;
  case_number?: string;
  deceased_name?: string;
  event_type: string;
  title: string;
  description?: string;
  start_datetime: string;
  end_datetime: string;
  venue?: string;
  location_details?: string;
  assigned_staff?: string;
  notes?: string;
  setup_notes?: string;
  confirmation_status?: boolean;
  created_at?: string;
  updated_at?: string;
}

export const schedulesApi = {
  getAll: async (): Promise<ScheduleData[]> => {
    const response = await axios.get(API_URL);
    return response.data;
  },

  getById: async (id: number): Promise<ScheduleData> => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  },

  create: async (scheduleData: Omit<ScheduleData, 'id' | 'case_number' | 'deceased_name' | 'created_at' | 'updated_at'>): Promise<ScheduleData> => {
    const response = await axios.post(API_URL, scheduleData);
    return response.data;
  },

  update: async (id: number, scheduleData: Partial<Omit<ScheduleData, 'id' | 'case_number' | 'deceased_name' | 'created_at' | 'updated_at'>>): Promise<ScheduleData> => {
    const response = await axios.put(`${API_URL}/${id}`, scheduleData);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`);
  },
};
