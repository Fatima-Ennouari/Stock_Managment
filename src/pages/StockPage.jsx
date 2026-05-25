import React, { useCallback, useEffect, useState } from 'react'
import { Plus, Search, Filter, Edit2, Trash2, Package, ChevronUp, ChevronDown } from 'lucide-react'
import { productsApi, categoriesApi } from '../api/services'
import {
  StatusBadge, LoadingOverlay, EmptyState,
  Pagination, ConfirmDialog, SectionHeader
} from '../components/ui'
import ProductForm from '../components/stock/ProductForm'
import toast from 'react-hot-toast'

const STATUSES = [
  { value: '',            label: 'All Status' },
  { value: 'in_stock',    label: 'In Stock' },
  { value: 'low_stock',   label: 'Low Stock' },
  { value: 'out_of_stock',label: 'Out of Stock' },
]

export default function StockPage() {
  const [products,   setProducts]   = useState([])
  const [categories, setCategories] = useState([])
  const [meta,       setMeta]       = useState(null)
  const [loading,    setLoading]    = useState(true)

  // Filters / sort
  const [search,   setSearch]   = useState('')
  const [catId,    setCatId]    = useState('')
  const [status,   setStatus]   = useState('')
  const [page,     setPage]     = useState(1)
  const [sortBy,   setSortBy]   = useState('created_at')
  const [sortDir,  setSortDir]  = useState('desc')

  // Modals
  const [formOpen,  setFormOpen]  = useState(false)
  const [editItem,  setEditItem]  = useState(null)
  const [deleteId,  setDeleteId]  = useState(null)
  const [deleting,  setDeleting]  = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await productsApi.list({
        search, category_id: catId, status,
        page, per_page: 10, sort_by: sortBy, sort_dir: sortDir,
      })
      setProducts(res.data.data)
      setMeta(res.data.meta)
    } finally {
      setLoading(false)
    }
  }, [search, catId, status, page, sortBy, sortDir])

  useEffect(() => { load() }, [load])

  useEffect(() => {
    categoriesApi.list().then(r => setCategories(r.data))
  }, [])

  // Reset to page 1 when filters change
  useEffect(() => { setPage(1) }, [search, catId, status])

  const toggleSort = (field) => {
    if (sortBy === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortBy(field); setSortDir('asc') }
  }

  const SortIcon = ({ field }) => {
    if (sortBy !== field) return <ChevronUp size={12} className="opacity-30" />
    return sortDir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />
  }

  const openAdd  = () => { setEditItem(null); setFormOpen(true) }
  const openEdit = (p)  => { setEditItem(p);   setFormOpen(true) }
  const onSaved  = () => load()

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await productsApi.delete(deleteId)
      toast.success('Product deleted')
      setDeleteId(null)
      load()
    } catch {
      toast.error('Failed to delete')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-5 animate-fade-in">
      <SectionHeader
        title="Stock Management"
        description="Manage all hotel inventory products"
        action={
          <button onClick={openAdd} className="btn-primary">
            <Plus size={16} /> Add Product
          </button>
        }
      />

      {/* Filters bar */}
      <div className="card p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              className="form-input pl-9"
              placeholder="Search product or supplier…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <select className="form-input sm:w-44" value={catId} onChange={e => setCatId(e.target.value)}>
            <option value="">All Categories</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select className="form-input sm:w-44" value={status} onChange={e => setStatus(e.target.value)}>
            {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-th w-12">#</th>
                <th className="table-th">Product</th>
                <th className="table-th">Category</th>
                <th className="table-th cursor-pointer select-none" onClick={() => toggleSort('quantity')}>
                  <span className="flex items-center gap-1">Qty <SortIcon field="quantity" /></span>
                </th>
                <th className="table-th">Min. Stock</th>
                <th className="table-th cursor-pointer select-none" onClick={() => toggleSort('unit_price')}>
                  <span className="flex items-center gap-1">Price <SortIcon field="unit_price" /></span>
                </th>
                <th className="table-th">Supplier</th>
                <th className="table-th">Expires</th>
                <th className="table-th">Status</th>
                <th className="table-th text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={10}><LoadingOverlay /></td></tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={10}>
                    <EmptyState
                      title="No products found"
                      description="Try adjusting your filters or add a new product."
                      icon={Package}
                      action={
                        <button onClick={openAdd} className="btn-primary mt-2">
                          <Plus size={15} /> Add Product
                        </button>
                      }
                    />
                  </td>
                </tr>
              ) : (
                products.map((p, i) => (
                  <tr key={p.id} className="hover:bg-slate-50/60 transition-colors group">
                    <td className="table-td text-slate-400 text-xs">
                      {(meta.current_page - 1) * meta.per_page + i + 1}
                    </td>
                    <td className="table-td">
                      <div className="flex items-center gap-3">
                        {p.image_url ? (
                          <img src={p.image_url} alt="" className="w-9 h-9 rounded-lg object-cover flex-shrink-0" />
                        ) : (
                          <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0 text-sm font-bold text-slate-400">
                            {p.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium text-slate-800 leading-tight">{p.name}</p>
                          {p.is_expired && (
                            <span className="text-[10px] text-red-500 font-semibold">EXPIRED</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="table-td">
                      <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full font-medium">
                        {p.category?.name}
                      </span>
                    </td>
                    <td className="table-td font-semibold text-slate-800">{p.quantity}</td>
                    <td className="table-td text-slate-500">{p.minimum_stock}</td>
                    <td className="table-td font-medium text-slate-700">
                      {Number(p.unit_price).toFixed(2)} MAD
                    </td>
                    <td className="table-td text-slate-500 text-xs max-w-[120px] truncate">{p.supplier}</td>
                    <td className="table-td text-xs text-slate-500">
                      {p.expiration_date
                        ? new Date(p.expiration_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' })
                        : <span className="text-slate-300">—</span>
                      }
                    </td>
                    <td className="table-td"><StatusBadge status={p.status} /></td>
                    <td className="table-td">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openEdit(p)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-brand-50 transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => setDeleteId(p.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {meta && (
          <div className="px-4 border-t border-slate-100">
            <Pagination meta={meta} onPageChange={setPage} />
          </div>
        )}
      </div>

      {/* Modals */}
      <ProductForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        product={editItem}
        onSaved={onSaved}
      />
      <ConfirmDialog
        open={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
        confirmLabel="Delete"
      />
    </div>
  )
}