import { create } from 'zustand'
import { authApi } from '../api/services'

const useAuthStore = create((set) => ({
  user:   JSON.parse(localStorage.getItem('user') || 'null'),
  token:  localStorage.getItem('token') || null,
  loading: false,

  login: async (credentials) => {
    set({ loading: true })
    try {
      const res = await authApi.login(credentials)
      const { token, user } = res.data
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
      set({ token, user, loading: false })
      return { success: true }
    } catch (err) {
      set({ loading: false })
      const msg = err.response?.data?.message || 'Login failed'
      return { success: false, message: msg }
    }
  },

  logout: async () => {
    try { await authApi.logout() } catch (_) {}
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    set({ user: null, token: null })
  },

  updateUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user))
    set({ user })
  },
}))

export default useAuthStore