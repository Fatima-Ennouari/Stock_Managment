import React, { useEffect, useState } from 'react'
import { Plus, Edit2, Trash2, Grid3x3, Package } from 'lucide-react'
import { categoriesApi } from '../api/services'
import { Modal, Spinner, ConfirmDialog, SectionHeader, EmptyState } from '../components/ui'
import toast from 'react-hot-toast'

const COLORS = ['#0ea5e9','#10b981','#f59e0b','#ef4444','#8b5cf6','#ec4899','#f97316','#06b6d4']

function CategoryForm({ open, onClose, category, onSaved }) {
  const [form, setForm]     = useState({ name: '', description: '', color: '#0ea5e9', icon: 'package' })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors]   = useState({})
  const isEdit = Boolean(category?.id)

  useEffect(() => {
    if (category) setForm({ name: category.name, description: category.description || '', color: category.color || '#0ea5e9', icon: category.icon || 'package' })
    else setForm({ name: '', description: '', color: '#0ea5e9', icon: 'package' })
    setErrors({})
  }, [category, open])

  const submit = async (e) => {
    e.preventDefault()
    setErrors({})
    setLoading(true)
    try {
      if (isEdit) await categoriesApi.update(category.id, form)
      else        await categoriesApi.create(form)
      toast.success(isEdit ? 'Category updated!' : 'Category created!')
      onSaved()
      onClose()
    } catch (err) {
      if (err.response?.status === 422) setErrors(err.response.data.errors || {})
      else toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'Edit Category' : 'New Category'} size="sm">
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="form-label">Category Name *</label>
          <input className="form-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            placeholder="e.g. Beverages" required />
          {errors.name && <p className="form-error">{errors.name[0]}</p>}
        </div>
        <div>
          <label className="form-label">Description</label>
          <textarea rows={2} className="form-input resize-none" value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            placeholder="Short description…" />
        </div>
        <div>
          <label className="form-label">Color</label>
          <div className="flex gap-2 flex-wrap">
            {COLORS.map(c => (
              <button key={c} type="button" onClick={() => setForm(f => ({ ...f, color: c }))}
                className={`w-7 h-7 rounded-full border-2 transition-transform hover:scale-110 ${form.color === c ? 'border-slate-900 scale-110' : 'border-transparent'}`}
                style={{ backgroundColor: c }} />
            ))}
          </div>
        </div>
        <div className="flex gap-3 justify-end pt-2">
          <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? <><Spinner size={14} /> Saving…</> : (isEdit ? 'Update' : 'Create')}
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading]       = useState(true)
  const [formOpen, setFormOpen]     = useState(false)
  const [editItem, setEditItem]     = useState(null)
  const [deleteId, setDeleteId]     = useState(null)
  const [deleting, setDeleting]     = useState(false)

  const load = async () => {
    setLoading(true)
    try { const r = await categoriesApi.list(); setCategories(r.data) }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const openAdd  = () => { setEditItem(null); setFormOpen(true) }
  const openEdit = (c) => { setEditItem(c); setFormOpen(true) }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await categoriesApi.delete(deleteId)
      toast.success('Category deleted')
      setDeleteId(null)
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-5 animate-fade-in">
      <SectionHeader
        title="Categories"
        description="Organize your hotel stock into logical groups"
        action={
          <button onClick={openAdd} className="btn-primary">
            <Plus size={16} /> New Category
          </button>
        }
      />

      {loading ? (
        <div className="flex justify-center py-16"><Spinner size={30} /></div>
      ) : categories.length === 0 ? (
        <EmptyState title="No categories yet" description="Create your first category to start organizing stock."
          icon={Grid3x3}
          action={<button onClick={openAdd} className="btn-primary mt-2"><Plus size={15} /> Add Category</button>}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {categories.map(cat => (
            <div key={cat.id} className="card p-5 group hover:shadow-card-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: cat.color + '20', color: cat.color }}>
                  <Package size={18} />
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(cat)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-brand-50 transition-colors">
                    <Edit2 size={13} />
                  </button>
                  <button onClick={() => setDeleteId(cat.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
              <p className="text-sm font-semibold text-slate-800 mb-1">{cat.name}</p>
              <p className="text-xs text-slate-400 line-clamp-2 mb-3">{cat.description || 'No description'}</p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                <span className="text-xs text-slate-500 font-medium">
                  {cat.products_count ?? 0} product{(cat.products_count ?? 0) !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <CategoryForm
        open={formOpen} onClose={() => setFormOpen(false)}
        category={editItem} onSaved={load}
      />
      <ConfirmDialog
        open={Boolean(deleteId)} onClose={() => setDeleteId(null)}
        onConfirm={handleDelete} loading={deleting}
        title="Delete Category"
        message="Deleting this category will fail if it has associated products. Remove or reassign them first."
        confirmLabel="Delete"
      />
    </div>
  )
}