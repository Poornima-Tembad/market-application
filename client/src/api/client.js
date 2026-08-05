const API_BASE =
    import.meta.env.VITE_API_URL ||
    "http://44.255.68.238:5000/api";

export async function api(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || data.errors?.[0]?.msg || 'Request failed');
  }
  return data;
}

export const authAPI = {
  register: (body) => api('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => api('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  me: () => api('/auth/me'),
  updateProfile: (body) => api('/auth/profile', { method: 'PUT', body: JSON.stringify(body) }),
  buyerOnboarding: (body) => api('/auth/onboarding/buyer', { method: 'PUT', body: JSON.stringify(body) }),
  supplierOnboarding: (body) => api('/auth/onboarding/supplier', { method: 'PUT', body: JSON.stringify(body) }),
};

export const productAPI = {
  list: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return api(`/products?${q}`);
  },
  featured: () => api('/products/featured'),
  categories: () => api('/products/categories'),
  get: (id) => api(`/products/${id}`),
  mine: () => api('/products/supplier/mine'),
  create: (body) => api('/products', { method: 'POST', body: JSON.stringify(body) }),
  update: (id, body) => api(`/products/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  remove: (id) => api(`/products/${id}`, { method: 'DELETE' }),
};

export const cartAPI = {
  get: () => api('/cart'),
  add: (body) => api('/cart/add', { method: 'POST', body: JSON.stringify(body) }),
  update: (body) => api('/cart/update', { method: 'PUT', body: JSON.stringify(body) }),
  remove: (itemId) => api(`/cart/remove/${itemId}`, { method: 'DELETE' }),
  clear: () => api('/cart/clear', { method: 'DELETE' }),
};

export const orderAPI = {
  place: (body) => api('/orders', { method: 'POST', body: JSON.stringify(body) }),
  buyerOrders: () => api('/orders/buyer'),
  supplierOrders: () => api('/orders/supplier'),
  supplierStats: () => api('/orders/supplier/stats'),
  get: (id) => api(`/orders/${id}`),
  updateStatus: (id, status) => api(`/orders/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
};

export const aiAPI = {
  chat: (body) => api('/ai/chat', { method: 'POST', body: JSON.stringify(body) }),
  search: (query) => api('/ai/search', { method: 'POST', body: JSON.stringify({ query }) }),
};
