import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
const API_URL = `${API_BASE_URL}/venue-bookings`;

export interface VenueBookingData {
  id?: number;
  case_id: number;
  case_number?: string;
  deceased_name?: string;
  venue: string;
  booking_date: string;
  booking_time?: string;
  duration_hours?: number;
  contact_person?: string;
  contact_phone?: string;
  contact_email?: string;
  cost?: number;
  status?: string;
  special_requirements?: string;
  setup_notes?: string;
  is_paid?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface VenueBookingStats {
  total: number;
  confirmed: number;
  tentative: number;
  total_revenue: number;
}

export const venueBookingsApi = {
  getAll: async (params?: {
    search?: string;
    venue?: string;
    status?: string;
  }): Promise<VenueBookingData[]> => {
    const response = await axios.get(API_URL, { params });
    return response.data;
  },

  getStats: async (): Promise<VenueBookingStats> => {
    const response = await axios.get(`${API_URL}/stats`);
    return response.data;
  },

  getById: async (id: number): Promise<VenueBookingData> => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  },

  create: async (bookingData: Omit<VenueBookingData, 'id' | 'case_number' | 'deceased_name' | 'created_at' | 'updated_at'>): Promise<VenueBookingData> => {
    const response = await axios.post(API_URL, bookingData);
    return response.data;
  },

  update: async (id: number, bookingData: Partial<Omit<VenueBookingData, 'id' | 'case_number' | 'deceased_name' | 'created_at' | 'updated_at'>>): Promise<VenueBookingData> => {
    const response = await axios.put(`${API_URL}/${id}`, bookingData);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`);
  },
};
