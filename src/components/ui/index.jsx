import React from 'react'
import { X, AlertTriangle, PackageX, Search } from 'lucide-react'

// ── Modal ────────────────────────────────────────────────────────────────
export function Modal({ open, onClose, title, children, size = 'md' }) {
  if (!open) return null

  const widths = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-3xl' }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative min-h-full flex items-center justify-center p-4">
        <div className={`relative bg-white rounded-2xl shadow-2xl w-full ${widths[size]} animate-slide-up`}>
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h2 className="text-base font-semibold text-slate-900">{title}</h2>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
          <div className="p-6">{children}</div>
        </div>
      </div>
    </div>
  )
}

// ── Status Badge ─────────────────────────────────────────────────────────
export function StatusBadge({ status }) {
  const map = {
    in_stock:     { label: 'In Stock',     dot: 'bg-emerald-500', cls: 'badge-in_stock' },
    low_stock:    { label: 'Low Stock',    dot: 'bg-amber-500',   cls: 'badge-low_stock' },
    out_of_stock: { label: 'Out of Stock', dot: 'bg-red-500',     cls: 'badge-out_of_stock' },
  }
  const cfg = map[status] || map.in_stock

  return (
    <span className={cfg.cls}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  )
}

// ── Spinner ───────────────────────────────────────────────────────────────
export function Spinner({ size = 20, className = '' }) {
  return (
    <svg
      className={`animate-spin text-brand-600 ${className}`}
      width={size} height={size}
      viewBox="0 0 24 24" fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

// ── Loading overlay ───────────────────────────────────────────────────────
export function LoadingOverlay() {
  return (
    <div className="flex items-center justify-center py-20">
      <Spinner size={32} />
    </div>
  )
}

// ── Empty state ───────────────────────────────────────────────────────────
export function EmptyState({ title = 'No data found', description, icon: Icon = PackageX, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mb-4">
        <Icon size={24} className="text-slate-400" />
      </div>
      <p className="text-sm font-semibold text-slate-700 mb-1">{title}</p>
      {description && <p className="text-xs text-slate-400 mb-4 max-w-xs">{description}</p>}
      {action}
    </div>
  )
}

// ── Stat Card ─────────────────────────────────────────────────────────────
export function StatCard({ label, value, sub, icon: Icon, colorClass = 'bg-brand-50 text-brand-600', trend }) {
  return (
    <div className="card p-5 flex items-start gap-4 hover:shadow-card-md transition-shadow">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${colorClass}`}>
        <Icon size={20} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">{label}</p>
        <p className="text-2xl font-bold text-slate-900 leading-none">{value}</p>
        {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
      </div>
    </div>
  )
}

// ── Confirm Dialog ────────────────────────────────────────────────────────
export function ConfirmDialog({ open, onClose, onConfirm, title, message, confirmLabel = 'Delete', loading }) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm">
      <div className="text-center">
        <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle size={22} className="text-red-500" />
        </div>
        <p className="text-sm text-slate-600 mb-6">{message}</p>
        <div className="flex gap-3">
          <button onClick={onClose} className="btn-secondary flex-1 justify-center">Cancel</button>
          <button onClick={onConfirm} disabled={loading} className="btn-danger flex-1 justify-center">
            {loading ? <Spinner size={16} /> : confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  )
}

// ── Pagination ────────────────────────────────────────────────────────────
export function Pagination({ meta, onPageChange }) {
  if (!meta || meta.last_page <= 1) return null
  const { current_page, last_page, total, per_page } = meta
  const from = (current_page - 1) * per_page + 1
  const to   = Math.min(current_page * per_page, total)

  const pages = []
  for (let i = 1; i <= last_page; i++) {
    if (i === 1 || i === last_page || Math.abs(i - current_page) <= 1) {
      pages.push(i)
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...')
    }
  }

  return (
    <div className="flex items-center justify-between px-1 py-3">
      <p className="text-xs text-slate-500">Showing {from}–{to} of {total} results</p>
      <div className="flex items-center gap-1">
        <button
          disabled={current_page === 1}
          onClick={() => onPageChange(current_page - 1)}
          className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Prev
        </button>
        {pages.map((p, i) =>
          p === '...' ? (
            <span key={`dots-${i}`} className="px-2 text-slate-400 text-xs">…</span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`w-8 h-8 text-xs rounded-lg font-medium transition-colors
                ${p === current_page
                  ? 'bg-brand-600 text-white'
                  : 'text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
            >
              {p}
            </button>
          )
        )}
        <button
          disabled={current_page === last_page}
          onClick={() => onPageChange(current_page + 1)}
          className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  )
}

// ── Section Header ────────────────────────────────────────────────────────
export function SectionHeader({ title, description, action }) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div>
        <h2 className="text-lg font-bold text-slate-900">{title}</h2>
        {description && <p className="text-sm text-slate-500 mt-0.5">{description}</p>}
      </div>
      {action}
    </div>
  )
}