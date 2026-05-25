import React from 'react'
import { useLocation } from 'react-router-dom'
import { Menu, Bell } from 'lucide-react'
import useAuthStore from '../../store/authStore'

const TITLES = {
  '/dashboard':  'Dashboard',
  '/stock':      'Stock Management',
  '/categories': 'Categories',
  '/profile':    'My Profile',
}

export default function Topbar({ onMenuClick }) {
  const location = useLocation()
  const user = useAuthStore((s) => s.user)

  const title = TITLES[location.pathname] || 'HotelStock'

  return (
    <header className="sticky top-0 z-10 bg-white border-b border-slate-100 px-4 lg:px-6 h-14 flex items-center gap-4">
      {/* Mobile menu button */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
      >
        <Menu size={20} />
      </button>

      <div className="flex-1">
        <h1 className="text-base font-semibold text-slate-900">{title}</h1>
      </div>

      <div className="flex items-center gap-2">
        <button className="relative p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xs font-bold ml-1">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  )
}