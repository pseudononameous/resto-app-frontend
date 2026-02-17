import axios from '@utils/axios';
import { API_DOMAIN } from '@config/api';

export const authApi = {
  login: (email: string, password: string) =>
    axios.post('/v1/auth/login', { email, password }),
  logout: () => axios.post('/v1/auth/logout'),
  register: (data: { name: string; email: string; password: string; password_confirmation: string }) =>
    axios.post('/v1/auth/register', data),
  forgotPassword: (email: string) =>
    axios.post('/v1/auth/forgot-password', { email }),
  resetPassword: (data: { token: string; email: string; password: string; password_confirmation: string }) =>
    axios.post('/v1/auth/reset-password', data),
  me: () => axios.get('/v1/auth/me'),
  changePassword: (data: { current_password: string; password: string; password_confirmation: string }) =>
    axios.put('/v1/auth/change-password', data),
  csrf: () =>
    axios.get(
      API_DOMAIN ? `${API_DOMAIN}/sanctum/csrf-cookie` : '/sanctum/csrf-cookie',
      { withCredentials: true }
    ),
};
