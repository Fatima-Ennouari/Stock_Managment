import React, { useEffect, useState } from 'react'
import {
  Package, AlertTriangle, XCircle, Activity,
  TrendingUp, Clock, ArrowUpRight
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts'
import { dashboardApi } from '../api/services'
import { StatCard, StatusBadge, LoadingOverlay } from '../components/ui'
import useAuthStore from '../store/authStore'

const ACTION_ICON = {
  created: { bg: 'bg-emerald-50', text: 'text-emerald-600', label: 'Created' },
  updated: { bg: 'bg-brand-50',   text: 'text-brand-600',   label: 'Updated' },
  deleted: { bg: 'bg-red-50',     text: 'text-red-500',     label: 'Deleted' },
}

export default function DashboardPage() {
  const user = useAuthStore(s => s.user)

  const [stats,     setStats]     = useState(null)
  const [activity,  setActivity]  = useState([])
  const [lowStock,  setLowStock]  = useState([])
  const [loading,   setLoading]   = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [s, a, l] = await Promise.all([
          dashboardApi.stats(),
          dashboardApi.recentActivity(),
          dashboardApi.lowStock(),
        ])
        setStats(s.data)
        setActivity(a.data)
        setLowStock(l.data)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return <LoadingOverlay />

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            {greeting}, {user?.name?.split(' ')[0]} 👋
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Here's what's happening in your hotel inventory today.
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 bg-slate-100 px-3 py-1.5 rounded-full">
          <Clock size={12} />
          {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Products"
          value={stats?.total_products ?? 0}
          sub={`${stats?.in_stock ?? 0} in stock`}
          icon={Package}
          colorClass="bg-brand-50 text-brand-600"
        />
        <StatCard
          label="Low Stock"
          value={stats?.low_stock ?? 0}
          sub="Need reordering"
          icon={AlertTriangle}
          colorClass="bg-amber-50 text-amber-500"
        />
        <StatCard
          label="Out of Stock"
          value={stats?.out_of_stock ?? 0}
          sub="Urgent attention"
          icon={XCircle}
          colorClass="bg-red-50 text-red-500"
        />
        <StatCard
          label="Total Value"
          value={`${Number(stats?.total_value ?? 0).toLocaleString()} MAD`}
          sub="Current inventory"
          icon={TrendingUp}
          colorClass="bg-emerald-50 text-emerald-600"
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Bar chart - stock by category */}
        <div className="card p-5 lg:col-span-2">
          <p className="text-sm font-semibold text-slate-800 mb-4">Stock by Category</p>
          {stats?.by_category?.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={stats.by_category} barSize={28}>
                <XAxis dataKey="category" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,.1)', fontSize: 12 }}
                  cursor={{ fill: '#f1f5f9' }}
                />
                <Bar dataKey="total_qty" name="Quantity" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-sm text-slate-400">No data yet</div>
          )}
        </div>

        {/* Pie chart - stock status */}
        <div className="card p-5">
          <p className="text-sm font-semibold text-slate-800 mb-4">Stock Status</p>
          {stats?.status_breakdown ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={stats.status_breakdown}
                  cx="50%" cy="50%"
                  innerRadius={52} outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {stats.status_breakdown.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,.1)', fontSize: 12 }}
                />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-sm text-slate-400">No data yet</div>
          )}
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Recent activity */}
        <div className="card">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-800">Recent Activity</p>
            <Activity size={15} className="text-slate-400" />
          </div>
          <div className="divide-y divide-slate-50">
            {activity.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-8">No activity yet</p>
            ) : (
              activity.slice(0, 8).map((log) => {
                const cfg = ACTION_ICON[log.action] || ACTION_ICON.updated
                return (
                  <div key={log.id} className="flex items-start gap-3 px-5 py-3">
                    <span className={`mt-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${cfg.bg} ${cfg.text}`}>
                      {cfg.label}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-700 leading-snug">{log.description}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{log.created_at}</p>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Low stock alerts */}
        <div className="card">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-800">Low Stock Alerts</p>
            <AlertTriangle size={15} className="text-amber-500" />
          </div>
          <div className="divide-y divide-slate-50">
            {lowStock.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-8">All stock levels are good ✓</p>
            ) : (
              lowStock.map((p) => (
                <div key={p.id} className="flex items-center gap-3 px-5 py-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0 text-sm font-bold text-slate-500">
                    {p.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-slate-800 truncate">{p.name}</p>
                    <p className="text-[11px] text-slate-400">{p.category}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs font-semibold text-slate-900">{p.quantity}</p>
                    <p className="text-[11px] text-slate-400">min: {p.minimum_stock}</p>
                  </div>
                  <StatusBadge status={p.status} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}