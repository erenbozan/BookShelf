import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAdminDashboard, createAdminBook, getAdminUsers } from '../api'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [saving, setSaving] = useState(false)
  const [bookForm, setBookForm] = useState({ title: '', author: '', description: '', publishedYear: '' })

  // Users modal state
  const [showUsersModal, setShowUsersModal] = useState(false)
  const [usersLoading, setUsersLoading] = useState(false)
  const [usersError, setUsersError] = useState('')
  const [users, setUsers] = useState([])

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
        <button
          onClick={async () => {
            setUsersError('')
            setShowUsersModal(true)
            setUsersLoading(true)
            try {
              const list = await getAdminUsers()
              setUsers(Array.isArray(list) ? list : [])
            } catch (err) {
              setUsersError(err.message || 'Kullanıcılar yüklenemedi')
            } finally {
              setUsersLoading(false)
            }
          }}
          style={{ background: '#0ea5e9', color: '#fff' }}
        >
          Kullanıcıları Listele
        </button>
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

      {showUsersModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div style={{ width: 720, maxHeight: '80vh', overflow: 'hidden', background: '#fff', color: '#111', borderRadius: 12, padding: 16, boxShadow: '0 10px 25px rgba(0,0,0,.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h3 style={{ margin: 0 }}>Kullanıcı Listesi</h3>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={async () => {
                  setUsersError('')
                  setUsersLoading(true)
                  try {
                    const list = await getAdminUsers()
                    setUsers(Array.isArray(list) ? list : [])
                  } catch (err) {
                    setUsersError(err.message || 'Kullanıcılar yüklenemedi')
                  } finally {
                    setUsersLoading(false)
                  }
                }} style={{ background: '#e5e7eb', color: '#111' }}>Yenile</button>
                <button onClick={() => setShowUsersModal(false)} style={{ background: '#e5e7eb', color: '#111' }}>Kapat</button>
              </div>
            </div>
            {usersError && <div style={{ color: 'tomato', marginBottom: 12 }}>{usersError}</div>}
            {usersLoading ? (
              <div style={{ padding: 16 }}>Yükleniyor...</div>
            ) : (
              <div style={{ overflow: 'auto', maxHeight: '65vh', border: '1px solid #e5e7eb', borderRadius: 8 }}>
                <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
                  <thead>
                    <tr style={{ background: '#f9fafb' }}>
                      <th style={{ textAlign: 'left', padding: '10px 12px', borderBottom: '1px solid #e5e7eb' }}>ID</th>
                      <th style={{ textAlign: 'left', padding: '10px 12px', borderBottom: '1px solid #e5e7eb' }}>Kullanıcı Adı</th>
                      <th style={{ textAlign: 'left', padding: '10px 12px', borderBottom: '1px solid #e5e7eb' }}>Ad Soyad</th>
                      <th style={{ textAlign: 'left', padding: '10px 12px', borderBottom: '1px solid #e5e7eb' }}>Email</th>
                      <th style={{ textAlign: 'left', padding: '10px 12px', borderBottom: '1px solid #e5e7eb' }}>Rol</th>
                      <th style={{ textAlign: 'left', padding: '10px 12px', borderBottom: '1px solid #e5e7eb' }}>Durum</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id}>
                        <td style={{ padding: '10px 12px', borderBottom: '1px solid #f1f5f9' }}>{u.id}</td>
                        <td style={{ padding: '10px 12px', borderBottom: '1px solid #f1f5f9' }}>{u.username}</td>
                        <td style={{ padding: '10px 12px', borderBottom: '1px solid #f1f5f9' }}>{[u.firstName, u.lastName].filter(Boolean).join(' ')}</td>
                        <td style={{ padding: '10px 12px', borderBottom: '1px solid #f1f5f9' }}>{u.email}</td>
                        <td style={{ padding: '10px 12px', borderBottom: '1px solid #f1f5f9' }}>
                          <span style={{ padding: '2px 8px', borderRadius: 999, background: u.role === 'ADMIN' ? '#fef3c7' : '#e0f2fe', color: '#111' }}>{u.role}</span>
                        </td>
                        <td style={{ padding: '10px 12px', borderBottom: '1px solid #f1f5f9' }}>
                          {u.enabled ? 'Aktif' : 'Pasif'}
                        </td>
                      </tr>
                    ))}
                    {Array.isArray(users) && users.length === 0 && !usersLoading && !usersError && (
                      <tr>
                        <td colSpan={6} style={{ padding: 16, textAlign: 'center', color: '#6b7280' }}>Kayıt bulunamadı</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
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


