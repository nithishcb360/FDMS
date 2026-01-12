import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  message?: string;
}

export const submitContact = async (data: ContactFormData) => {
  const response = await api.post('/contacts/', data);
  return response.data;
};

// Authentication types and functions
export interface SignUpData {
  email: string;
  password: string;
  full_name?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: UserResponse;
}

export interface UserResponse {
  id: number;
  email: string;
  full_name?: string;
  is_active: boolean;
  is_superuser: boolean;
  role_id?: number;
  role_name?: string;
  role_display_name?: string;
  created_at: string;
  updated_at?: string;
}

export const signUp = async (data: SignUpData): Promise<UserResponse> => {
  const response = await api.post('/auth/signup', data);
  return response.data;
};

export const login = async (data: LoginData): Promise<AuthResponse> => {
  const response = await api.post('/auth/login', data);
  return response.data;
};

export const getCurrentUser = async (token: string): Promise<UserResponse> => {
  const response = await api.get('/auth/me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
