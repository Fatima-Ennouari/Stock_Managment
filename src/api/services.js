import api from './axios'

// ── Auth ──────────────────────────────────────────────────────────────────
export const authApi = {
  login:  (data) => api.post('/login', data),
  logout: ()     => api.post('/logout'),
  me:     ()     => api.get('/me'),
}

// ── Dashboard ─────────────────────────────────────────────────────────────
export const dashboardApi = {
  stats:          () => api.get('/dashboard/stats'),
  recentActivity: () => api.get('/dashboard/recent-activity'),
  lowStock:       () => api.get('/dashboard/low-stock'),
}

// ── Categories ────────────────────────────────────────────────────────────
export const categoriesApi = {
  list:    ()           => api.get('/categories'),
  create:  (data)       => api.post('/categories', data),
  update:  (id, data)   => api.put(`/categories/${id}`, data),
  delete:  (id)         => api.delete(`/categories/${id}`),
}

// ── Products ──────────────────────────────────────────────────────────────
export const productsApi = {
  list:   (params) => api.get('/products', { params }),
  get:    (id)     => api.get(`/products/${id}`),
  create: (data)   => api.post('/products', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  update: (id, data) => api.post(`/products/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  delete: (id) => api.delete(`/products/${id}`),
}

// ── Profile ───────────────────────────────────────────────────────────────
export const profileApi = {
  update:         (data)  => api.patch('/profile', data),
  updatePassword: (data)  => api.patch('/profile/password', data),
  uploadAvatar:   (data)  => api.post('/profile/avatar', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
}