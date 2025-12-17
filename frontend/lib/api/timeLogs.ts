import axios from 'axios';

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/time-logs`;

export interface TimeLogData {
  id?: number;
  staff_member_id: number;
  staff_member_name: string;
  log_date: string;
  log_type: string;
  related_schedule_id?: number;
  clock_in: string;
  clock_out?: string;
  break_duration?: number;
  hours_worked: number;
  status: string;
  hourly_rate?: number;
  total_pay?: number;
  is_overtime: boolean;
  is_holiday_pay: boolean;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface TimeLogStats {
  total_logs: number;
  total_hours: number;
  total_pay: number;
  overtime_hours: number;
}

export const timeLogsApi = {
  getAll: async (params?: {
    skip?: number;
    limit?: number;
    search?: string;
    status?: string;
    log_type?: string;
    staff_member?: string;
  }): Promise<TimeLogData[]> => {
    const response = await axios.get(`${API_URL}/`, { params });
    return response.data;
  },

  getStats: async (): Promise<TimeLogStats> => {
    const response = await axios.get(`${API_URL}/stats`);
    return response.data;
  },

  getById: async (id: number): Promise<TimeLogData> => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  },

  create: async (timeLog: Omit<TimeLogData, 'id' | 'created_at' | 'updated_at'>): Promise<TimeLogData> => {
    const response = await axios.post(`${API_URL}/`, timeLog);
    return response.data;
  },

  update: async (id: number, timeLog: Partial<TimeLogData>): Promise<TimeLogData> => {
    const response = await axios.put(`${API_URL}/${id}`, timeLog);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`);
  }
};
