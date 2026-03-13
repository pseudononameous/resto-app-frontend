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

const base = (path: string) => ({
  list: (params?: Record<string, unknown>) => axios.get(`/v1/${path}`, { params }),
  get: (id: number) => axios.get(`/v1/${path}/${id}`),
  create: (data: object) => axios.post(`/v1/${path}`, data),
  update: (id: number, data: object) => axios.put(`/v1/${path}/${id}`, data),
  delete: (id: number) => axios.delete(`/v1/${path}/${id}`),
});

export const crudApi = {
  brands: base('brands'),
  categories: base('categories'),
  stores: base('stores'),
  products: {
    ...base('products'),
    import: (formData: FormData) =>
      axios.post('/v1/products/import', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  },
  menuCategories: base('menu-categories'),
  menuItems: base('menu-items'),
  deliveryZones: base('delivery-zones'),
  orderTypes: base('order-types'),
  groups: base('groups'),
  customers: base('customers'),
  comboMeals: base('combo-meals'),
  carts: {
    ...base('carts'),
    addItem: (cartId: number, data: { menu_item_id: number; quantity: number }) =>
      axios.post(`/v1/carts/${cartId}/items`, data),
    removeItem: (cartId: number, cartItemId: number) =>
      axios.delete(`/v1/carts/${cartId}/items/${cartItemId}`),
  },
  checkout: (data: {
    cart_id: number;
    order_type_id: number;
    customer_id?: number;
    store_id?: number;
    address_id?: number;
    zone_id?: number;
  }) => axios.post('/v1/checkout', data),
  orders: base('orders'),
  kitchenTickets: base('kitchen-tickets'),
  stockMovements: base('stock-movements'),
  stockBatches: base('stock-batches'),
  reservations: base('reservations'),
  wasteLogs: base('waste-logs'),
  deliveries: base('deliveries'),
};

export const usersApi = {
  ...base('users'),
};

export const rolesApi = {
  ...base('roles'),
  syncPermissions: (roleId: number, permissionIds: number[]) =>
    axios.put(`/v1/roles/${roleId}/permissions`, { permission_ids: permissionIds }),
};

export const permissionsApi = {
  list: (params?: Record<string, unknown>) => axios.get('/v1/permissions', { params }),
};

/** App Preview (Turn your website into an app). Uses OpenAI on backend — same pattern as intellect-edge. */
export const appPreviewApi = {
  generate: (formData: FormData) =>
    axios.post<{ data: { preview_image_url?: string; preview_image_base64?: string } }>(
      '/v1/app-preview',
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 120000,
      }
    ),
};
