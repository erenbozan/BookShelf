import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { registerUser } from '../api'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await registerUser(form)
      navigate('/login')
    } catch (err) {
      setError(err.message || 'Kayıt başarısız')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 520, margin: '40px auto' }}>
      <h2>Kayıt Ol</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gap: 12 }}>
          <div>
            <label>Kullanıcı Adı</label>
            <input
              type="text"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
              style={{ width: '100%', padding: 8 }}
            />
          </div>
          <div>
            <label>Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              style={{ width: '100%', padding: 8 }}
            />
          </div>
          <div>
            <label>Şifre</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              style={{ width: '100%', padding: 8 }}
            />
          </div>
          <div>
            <label>Ad</label>
            <input
              type="text"
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              required
              style={{ width: '100%', padding: 8 }}
            />
          </div>
          <div>
            <label>Soyad</label>
            <input
              type="text"
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              required
              style={{ width: '100%', padding: 8 }}
            />
          </div>
        </div>
        {error && <div style={{ color: 'tomato', marginTop: 12 }}>{error}</div>}
        <button disabled={loading} type="submit" style={{ marginTop: 16 }}>
          {loading ? 'Gönderiliyor...' : 'Kayıt Ol'}
        </button>
      </form>
      <p style={{ marginTop: 16 }}>
        Zaten hesabın var mı? <Link to="/login">Giriş Yap</Link>
      </p>
    </div>
  )
}


