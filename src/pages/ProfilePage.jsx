import React, { useRef, useState } from 'react'
import { Camera, Save, Key, User, Mail, Shield } from 'lucide-react'
import { profileApi } from '../api/services'
import { Spinner } from '../components/ui'
import useAuthStore from '../store/authStore'
import toast from 'react-hot-toast'

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore()
  const fileRef              = useRef()

  // Profile form
  const [info, setInfo]         = useState({ name: user?.name || '', email: user?.email || '' })
  const [infoLoading, setInfoL] = useState(false)
  const [infoErrors, setInfoE]  = useState({})

  // Password form
  const [pw, setPw]             = useState({ current_password: '', password: '', password_confirmation: '' })
  const [pwLoading, setPwL]     = useState(false)
  const [pwErrors, setPwE]      = useState({})

  // Avatar
  const [avatarLoading, setAvL] = useState(false)
  const [preview, setPreview]   = useState(user?.avatar_url || null)

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'HM'

  // ── Avatar upload ────────────────────────────────────────────────────
  const handleAvatar = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setPreview(URL.createObjectURL(file))
    setAvL(true)
    const fd = new FormData()
    fd.append('avatar', file)
    try {
      const res = await profileApi.uploadAvatar(fd)
      updateUser({ ...user, avatar_url: res.data.avatar_url })
      toast.success('Avatar updated!')
    } catch {
      toast.error('Failed to upload avatar')
    } finally {
      setAvL(false)
    }
  }

  // ── Update profile ───────────────────────────────────────────────────
  const handleInfoSubmit = async (e) => {
    e.preventDefault()
    setInfoE({})
    setInfoL(true)
    try {
      const res = await profileApi.update(info)
      updateUser(res.data.user)
      toast.success('Profile updated!')
    } catch (err) {
      if (err.response?.status === 422) setInfoE(err.response.data.errors || {})
      else toast.error('Failed to update profile')
    } finally {
      setInfoL(false)
    }
  }

  // ── Change password ──────────────────────────────────────────────────
  const handlePwSubmit = async (e) => {
    e.preventDefault()
    setPwE({})
    setPwL(true)
    try {
      await profileApi.updatePassword(pw)
      toast.success('Password changed!')
      setPw({ current_password: '', password: '', password_confirmation: '' })
    } catch (err) {
      if (err.response?.status === 422) setPwE(err.response.data.errors || {})
      else toast.error('Failed to update password')
    } finally {
      setPwL(false)
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
    <div className="space-y-5 max-w-3xl animate-fade-in">

      {/* Profile card */}
      <div className="card p-6">
        <div className="flex items-center gap-5">
          {/* Avatar */}
          <div className="relative">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-brand-100 flex items-center justify-center">
              {preview ? (
                <img src={preview} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl font-bold text-brand-700">{initials}</span>
              )}
            </div>
            <button
              onClick={() => fileRef.current.click()}
              disabled={avatarLoading}
              className="absolute -bottom-1 -right-1 w-7 h-7 bg-brand-600 text-white rounded-full flex items-center justify-center shadow-md hover:bg-brand-700 transition-colors"
            >
              {avatarLoading ? <Spinner size={12} className="text-white" /> : <Camera size={13} />}
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatar} />
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-900">{user?.name}</h3>
            <p className="text-sm text-slate-500">{user?.email}</p>
            <div className="flex items-center gap-1.5 mt-2">
              <Shield size={12} className="text-brand-600" />
              <span className="text-xs font-semibold text-brand-700 capitalize bg-brand-50 px-2 py-0.5 rounded-full">
                {user?.role}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Update info */}
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-5">
          <User size={16} className="text-brand-600" />
          <h3 className="text-sm font-semibold text-slate-800">Account Information</h3>
        </div>
        <form onSubmit={handleInfoSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Full Name" error={infoErrors.name}>
              <div className="relative">
                <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input className="form-input pl-9" value={info.name}
                  onChange={e => setInfo(f => ({ ...f, name: e.target.value }))} required />
              </div>
            </Field>
            <Field label="Email Address" error={infoErrors.email}>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="email" className="form-input pl-9" value={info.email}
                  onChange={e => setInfo(f => ({ ...f, email: e.target.value }))} required />
              </div>
            </Field>
          </div>
          <div className="flex justify-end">
            <button type="submit" disabled={infoLoading} className="btn-primary">
              {infoLoading ? <><Spinner size={14} /> Saving…</> : <><Save size={15} /> Save Changes</>}
            </button>
          </div>
        </form>
      </div>

      {/* Change password */}
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-5">
          <Key size={16} className="text-brand-600" />
          <h3 className="text-sm font-semibold text-slate-800">Change Password</h3>
        </div>
        <form onSubmit={handlePwSubmit} className="space-y-4">
          <Field label="Current Password" error={pwErrors.current_password}>
            <input type="password" className="form-input" value={pw.current_password}
              onChange={e => setPw(f => ({ ...f, current_password: e.target.value }))} required />
          </Field>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="New Password" error={pwErrors.password}>
              <input type="password" className="form-input" value={pw.password}
                onChange={e => setPw(f => ({ ...f, password: e.target.value }))} required />
            </Field>
            <Field label="Confirm Password" error={pwErrors.password_confirmation}>
              <input type="password" className="form-input" value={pw.password_confirmation}
                onChange={e => setPw(f => ({ ...f, password_confirmation: e.target.value }))} required />
            </Field>
          </div>
          <div className="flex justify-end">
            <button type="submit" disabled={pwLoading} className="btn-primary">
              {pwLoading ? <><Spinner size={14} /> Updating…</> : <><Key size={15} /> Update Password</>}
            </button>
          </div>
        </form>
      </div>

    </div>
  )
}