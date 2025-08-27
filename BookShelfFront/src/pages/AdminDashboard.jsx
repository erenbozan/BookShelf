import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAdminDashboard, createAdminBook } from '../api'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [saving, setSaving] = useState(false)
  const [bookForm, setBookForm] = useState({ title: '', author: '', description: '', publishedYear: '' })

  async function handleFetch() {
    setError('')
    setLoading(true)
    try {
      const res = await getAdminDashboard()
      setData(res)
    } catch (err) {
      setError(err.message || 'Yüklenemedi')
    } finally {
      setLoading(false)
    }
  }

  function handleLogout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token')
      localStorage.removeItem('role')
      localStorage.removeItem('username')
    }
    navigate('/login', { replace: true })
  }

  useEffect(() => {
    const role = typeof window !== 'undefined' ? localStorage.getItem('role') : null
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    if (!token || role !== 'ADMIN') {
      navigate('/login', { replace: true })
      return
    }
    // Do not auto-fetch; wait for user to click the button
  }, [navigate])

  return (
    <div style={{ maxWidth: 720, margin: '40px auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <h2 style={{ color: '#111', margin: 0 }}>Admin Dashboard</h2>
        <button onClick={handleLogout} style={{ background: '#ef4444', color: '#fff' }}>Çıkış Yap</button>
      </div>
      <div style={{ margin: '12px 0', display: 'flex', gap: 8 }}>
        <button onClick={handleFetch} disabled={loading}>
          {loading ? 'Yükleniyor...' : 'Dashboard verisini getir'}
        </button>
        <button onClick={() => setShowAddModal(true)} style={{ background: '#2563eb', color: '#fff' }}>Kitap Ekle</button>
      </div>
      {error && <div style={{ color: 'tomato', marginBottom: 12 }}>{error}</div>}
      {data && (
        <div style={{ background: '#ffffff', color: '#111', padding: 16, borderRadius: 12, border: '1px solid #e5e7eb', boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.06)' }}>
          {'message' in data && <p style={{ margin: '8px 0' }}><strong>Mesaj:</strong> {String(data.message)}</p>}
          {'totalUsers' in data && <p style={{ margin: '8px 0' }}><strong>Toplam Kullanıcı:</strong> {Number(data.totalUsers)}</p>}
          {'totalBooks' in data && <p style={{ margin: '8px 0' }}><strong>Toplam Kitap:</strong> {Number(data.totalBooks)}</p>}
          <details style={{ marginTop: 12 }}>
            <summary>Ham JSON</summary>
            <pre style={{ overflow: 'auto', background: '#f5f5f5', color: '#111', padding: 12, borderRadius: 8 }}>{JSON.stringify(data, null, 2)}</pre>
          </details>
        </div>
      )}

      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div style={{ width: 420, background: '#fff', color: '#111', borderRadius: 12, padding: 16, boxShadow: '0 10px 25px rgba(0,0,0,.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h3 style={{ margin: 0 }}>Kitap Ekle</h3>
              <button onClick={() => setShowAddModal(false)} style={{ background: '#e5e7eb', color: '#111' }}>Kapat</button>
            </div>
            <div style={{ display: 'grid', gap: 10 }}>
              <label>
                <div>Başlık</div>
                <input type="text" value={bookForm.title} onChange={(e) => setBookForm({ ...bookForm, title: e.target.value })} style={{ width: '100%', padding: 8 }} />
              </label>
              <label>
                <div>Yazar</div>
                <input type="text" value={bookForm.author} onChange={(e) => setBookForm({ ...bookForm, author: e.target.value })} style={{ width: '100%', padding: 8 }} />
              </label>
              <label>
                <div>Açıklama</div>
                <textarea value={bookForm.description} onChange={(e) => setBookForm({ ...bookForm, description: e.target.value })} rows={3} style={{ width: '100%', padding: 8 }} />
              </label>
              <label>
                <div>Yayın Yılı</div>
                <input type="number" value={bookForm.publishedYear} onChange={(e) => setBookForm({ ...bookForm, publishedYear: e.target.value })} style={{ width: '100%', padding: 8 }} />
              </label>
              {saving ? (
                <button disabled>Kaydediliyor...</button>
              ) : (
                <button onClick={async () => {
                  try {
                    setSaving(true)
                    setError('')
                    const payload = {
                      title: bookForm.title.trim(),
                      author: bookForm.author.trim(),
                      description: bookForm.description.trim(),
                      publishedYear: Number(bookForm.publishedYear),
                    }
                    await createAdminBook(payload)
                    setShowAddModal(false)
                    setBookForm({ title: '', author: '', description: '', publishedYear: '' })
                    // Optionally refresh dashboard data
                    // await handleFetch()
                  } catch (err) {
                    setError(err.message || 'Kaydetme başarısız')
                  } finally {
                    setSaving(false)
                  }
                }} style={{ background: '#16a34a', color: '#fff' }}>Kaydet</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


