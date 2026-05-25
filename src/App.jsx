import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import useAuthStore from './store/authStore'
import Layout from './components/layout/Layout'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import StockPage from './pages/StockPage'
import CategoriesPage from './pages/CategoriesPage'
import ProfilePage from './pages/ProfilePage'

// Guard: redirect to login if not authenticated
function PrivateRoute({ children }) {
  const token = useAuthStore((s) => s.token)
  return token ? children : <Navigate to="/login" replace />
}

// Guard: redirect to dashboard if already authenticated
function GuestRoute({ children }) {
  const token = useAuthStore((s) => s.token)
  return token ? <Navigate to="/dashboard" replace /> : children
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
      <Route
        path="/"
        element={<PrivateRoute><Layout /></PrivateRoute>}
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard"   element={<DashboardPage />} />
        <Route path="stock"       element={<StockPage />} />
        <Route path="categories"  element={<CategoriesPage />} />
        <Route path="profile"     element={<ProfilePage />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}