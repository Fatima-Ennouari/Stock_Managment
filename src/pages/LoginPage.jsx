import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Hotel, Lock, Mail, AlertCircle } from 'lucide-react'
import useAuthStore from '../store/authStore'
import { Spinner } from '../components/ui'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login, loading } = useAuthStore()

  const [form, setForm]     = useState({ email: 'admin@hotelstock.com', password: 'password' })
  const [showPw, setShowPw] = useState(false)
  const [error, setError]   = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const res = await login(form)
    if (res.success) {
      toast.success('Welcome back!')
      navigate('/dashboard')
    } else {
      setError(res.message)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-brand-800 to-brand-600 flex-col justify-between p-12 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/5 rounded-full" />
        <div className="absolute -bottom-32 -left-12 w-80 h-80 bg-white/5 rounded-full" />

        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
            <Hotel size={20} className="text-white" />
          </div>
          <span className="text-white font-bold text-lg">HotelStock</span>
        </div>

        <div className="relative z-10">
          <p className="font-display text-4xl font-bold text-white leading-tight mb-4">
            Smart Inventory<br />for Modern Hotels
          </p>
          <p className="text-brand-200 text-base leading-relaxed max-w-sm">
            Manage all your hotel stock — from food & beverages to room supplies
            and cleaning products — in one elegant dashboard.
          </p>

          <div className="flex items-center gap-6 mt-10">
            {[
              { num: '28+', label: 'Product Types' },
              { num: '7',   label: 'Categories' },
              { num: '100%', label: 'Real-time' },
            ].map(({ num, label }) => (
              <div key={label}>
                <p className="text-2xl font-bold text-white">{num}</p>
                <p className="text-xs text-brand-300 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-brand-300 text-xs relative z-10">
          © {new Date().getFullYear()} HotelStock Management System
        </p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-sm animate-fade-in">

          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
              <Hotel size={16} className="text-white" />
            </div>
            <span className="font-bold text-slate-900">HotelStock</span>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mb-1">Admin Sign In</h2>
          <p className="text-sm text-slate-500 mb-8">Enter your credentials to access the dashboard</p>

          {error && (
            <div className="flex items-center gap-2.5 p-3.5 mb-5 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm">
              <AlertCircle size={16} className="flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="form-label">Email address</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  className="form-input pl-10"
                  placeholder="admin@hotel.com"
                />
              </div>
            </div>

            <div>
              <label className="form-label">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPw ? 'text' : 'password'}
                  required
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  className="form-input pl-10 pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-3 text-sm font-semibold mt-2"
            >
              {loading ? <><Spinner size={16} />Signing in…</> : 'Sign In to Dashboard'}
            </button>
          </form>

          <p className="text-xs text-slate-400 text-center mt-6">
            Default: admin@hotelstock.com / password
          </p>
        </div>
      </div>
    </div>
  )
}