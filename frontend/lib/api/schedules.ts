import axios from 'axios';

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/staff-schedules`;

export interface ScheduleData {
  id?: number;
  staff_member_id: number;
  staff_member_name: string;
  shift_date: string;
  shift_type: string;
  status: string;
  start_time: string;
  end_time: string;
  break_duration?: number;
  is_overtime: boolean;
  is_holiday: boolean;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ScheduleStats {
  total_schedules: number;
  scheduled: number;
  completed: number;
  overtime_shifts: number;
}

export const schedulesApi = {
  getAll: async (params?: {
    skip?: number;
    limit?: number;
    search?: string;
    status?: string;
    shift_type?: string;
    staff_member?: string;
  }): Promise<ScheduleData[]> => {
    const response = await axios.get(`${API_URL}/`, { params });
    return response.data;
  },

  getStats: async (): Promise<ScheduleStats> => {
    const response = await axios.get(`${API_URL}/stats`);
    return response.data;
  },

  getById: async (id: number): Promise<ScheduleData> => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  },

  create: async (schedule: Omit<ScheduleData, 'id' | 'created_at' | 'updated_at'>): Promise<ScheduleData> => {
    const response = await axios.post(`${API_URL}/`, schedule);
    return response.data;
  },

  update: async (id: number, schedule: Partial<ScheduleData>): Promise<ScheduleData> => {
    const response = await axios.put(`${API_URL}/${id}`, schedule);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`);
  }
};
