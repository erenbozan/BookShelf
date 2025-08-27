import { useState } from 'react'
import { useNavigate, Link, Navigate } from 'react-router-dom'
import { login } from '../api'

export default function LoginPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const existingToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  const existingRole = typeof window !== 'undefined' ? localStorage.getItem('role') : null
  if (existingToken) {
    return <Navigate to={existingRole === 'ADMIN' ? '/admin' : '/'} replace />
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await login(form)
      if (data?.token) localStorage.setItem('token', data.token)
      if (data?.role) localStorage.setItem('role', String(data.role).toUpperCase())
      if (data?.username) localStorage.setItem('username', data.username)
      const roleVal = String(data?.role || '').toUpperCase()
      if (roleVal.includes('ADMIN')) {
        navigate('/admin', { replace: true })
      } else {
        navigate('/', { replace: true })
      }
    } catch (err) {
      setError(err.message || 'Giriş başarısız')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: '40px auto' }}>
      <h2>Giriş Yap</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label>Kullanıcı Adı</label>
          <input
            type="text"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            required
            style={{ width: '100%', padding: 8 }}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Şifre</label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            style={{ width: '100%', padding: 8 }}
          />
        </div>
        {error && <div style={{ color: 'tomato', marginBottom: 12 }}>{error}</div>}
        <button disabled={loading} type="submit">
          {loading ? 'Gönderiliyor...' : 'Giriş Yap'}
        </button>
      </form>
      <p style={{ marginTop: 16 }}>
        Hesabın yok mu? <Link to="/register">Kayıt Ol</Link>
      </p>
    </div>
  )
}


