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
