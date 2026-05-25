import React, { useEffect, useRef, useState } from 'react'
import { Upload, X } from 'lucide-react'
import { Modal, Spinner } from '../ui'
import { productsApi, categoriesApi } from '../../api/services'
import toast from 'react-hot-toast'

const EMPTY = {
  name: '', category_id: '', quantity: 0, minimum_stock: 5,
  unit_price: 0, supplier: '', entry_date: new Date().toISOString().split('T')[0],
  expiration_date: '', notes: '', image: null,
}

export default function ProductForm({ open, onClose, product, onSaved }) {
  const [form, setForm]       = useState(EMPTY)
  const [categories, setCats] = useState([])
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState(null)
  const [errors, setErrors]   = useState({})
  const fileRef               = useRef()

  const isEdit = Boolean(product?.id)

  // Load categories once
  useEffect(() => {
    categoriesApi.list().then(r => setCats(r.data))
  }, [])

  // Populate form when editing
  useEffect(() => {
    if (product) {
      setForm({
        name:            product.name || '',
        category_id:     product.category_id || '',
        quantity:        product.quantity ?? 0,
        minimum_stock:   product.minimum_stock ?? 5,
        unit_price:      product.unit_price ?? 0,
        supplier:        product.supplier || '',
        entry_date:      product.entry_date || EMPTY.entry_date,
        expiration_date: product.expiration_date || '',
        notes:           product.notes || '',
        image:           null,
      })
      setPreview(product.image_url || null)
    } else {
      setForm(EMPTY)
      setPreview(null)
    }
    setErrors({})
  }, [product, open])

  const set = (field, val) => setForm(f => ({ ...f, [field]: val }))

  const handleImage = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setForm(f => ({ ...f, image: file }))
    setPreview(URL.createObjectURL(file))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    setLoading(true)

    const fd = new FormData()
    Object.entries(form).forEach(([k, v]) => {
      if (v !== null && v !== '') fd.append(k, v)
    })
    // Laravel PUT via POST override
    if (isEdit) fd.append('_method', 'PUT')

    try {
      if (isEdit) {
        await productsApi.update(product.id, fd)
        toast.success('Product updated!')
      } else {
        await productsApi.create(fd)
        toast.success('Product added!')
      }
      onSaved()
      onClose()
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {})
      } else {
        toast.error(err.response?.data?.message || 'Something went wrong')
      }
    } finally {
      setLoading(false)
    }
  }

  const Field = ({ label, error, children }) => (
    <div>
      <label className="form-label">{label}</label>
      {children}
      {error && <p className="form-error">{Array.isArray(error) ? error[0] : error}</p>}
    </div>
  )

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'Edit Product' : 'Add New Product'} size="lg">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* Image upload */}
          <div className="sm:col-span-2">
            <label className="form-label">Product Image</label>
            <div
              onClick={() => fileRef.current.click()}
              className="border-2 border-dashed border-slate-200 rounded-xl p-4 flex items-center gap-4 cursor-pointer hover:border-brand-400 hover:bg-brand-50/30 transition-colors"
            >
              {preview ? (
                <img src={preview} alt="" className="w-16 h-16 rounded-lg object-cover" />
              ) : (
                <div className="w-16 h-16 rounded-lg bg-slate-100 flex items-center justify-center">
                  <Upload size={20} className="text-slate-400" />
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-slate-700">
                  {preview ? 'Change image' : 'Upload image'}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">JPG, PNG, WebP — max 2MB</p>
              </div>
              {preview && (
                <button type="button" onClick={e => { e.stopPropagation(); setPreview(null); setForm(f => ({ ...f, image: null })) }}
                  className="ml-auto text-slate-400 hover:text-red-500">
                  <X size={16} />
                </button>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImage} />
          </div>

          {/* Name */}
          <Field label="Product Name *" error={errors.name}>
            <input className="form-input" value={form.name} onChange={e => set('name', e.target.value)}
              placeholder="e.g. Basmati Rice 25kg" required />
          </Field>

          {/* Category */}
          <Field label="Category *" error={errors.category_id}>
            <select className="form-input" value={form.category_id} onChange={e => set('category_id', e.target.value)} required>
              <option value="">Select category…</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </Field>

          {/* Quantity */}
          <Field label="Quantity *" error={errors.quantity}>
            <input type="number" min="0" className="form-input" value={form.quantity}
              onChange={e => set('quantity', e.target.value)} required />
          </Field>

          {/* Minimum stock */}
          <Field label="Minimum Stock *" error={errors.minimum_stock}>
            <input type="number" min="0" className="form-input" value={form.minimum_stock}
              onChange={e => set('minimum_stock', e.target.value)} required />
          </Field>

          {/* Price */}
          <Field label="Unit Price (MAD) *" error={errors.unit_price}>
            <input type="number" min="0" step="0.01" className="form-input" value={form.unit_price}
              onChange={e => set('unit_price', e.target.value)} required />
          </Field>

          {/* Supplier */}
          <Field label="Supplier *" error={errors.supplier}>
            <input className="form-input" value={form.supplier} onChange={e => set('supplier', e.target.value)}
              placeholder="e.g. Al Baraka Foods" required />
          </Field>

          {/* Entry date */}
          <Field label="Entry Date *" error={errors.entry_date}>
            <input type="date" className="form-input" value={form.entry_date}
              onChange={e => set('entry_date', e.target.value)} required />
          </Field>

          {/* Expiry date */}
          <Field label="Expiration Date" error={errors.expiration_date}>
            <input type="date" className="form-input" value={form.expiration_date}
              onChange={e => set('expiration_date', e.target.value)} />
          </Field>

          {/* Notes */}
          <Field label="Notes" error={errors.notes}>
            <textarea rows={2} className="form-input resize-none" value={form.notes}
              onChange={e => set('notes', e.target.value)} placeholder="Optional notes…" />
          </Field>
        </div>

        <div className="flex gap-3 justify-end mt-6 pt-4 border-t border-slate-100">
          <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? <><Spinner size={14} /> Saving…</> : (isEdit ? 'Update Product' : 'Add Product')}
          </button>
        </div>
      </form>
    </Modal>
  )
}