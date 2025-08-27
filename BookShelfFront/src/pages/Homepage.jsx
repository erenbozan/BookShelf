import { Link } from 'react-router-dom'
import { useState } from 'react'
import { getAllBooks, getBooksByTitle, getFavoriteBooks } from '../api'

export default function Homepage() {
  const username = typeof window !== 'undefined' ? localStorage.getItem('username') : null
  const role = typeof window !== 'undefined' ? localStorage.getItem('role') : null
  const [showBooks, setShowBooks] = useState(false)
  const [booksLoading, setBooksLoading] = useState(false)
  const [booksError, setBooksError] = useState('')
  const [books, setBooks] = useState([])
  const [searchTitle, setSearchTitle] = useState('')
  const [showFavs, setShowFavs] = useState(false)
  const [favsLoading, setFavsLoading] = useState(false)
  const [favsError, setFavsError] = useState('')
  const [favs, setFavs] = useState([])
  return (
    <div style={{ maxWidth: 720, margin: '40px auto' }}>
      <h2>Hoş geldiniz{username ? `, ${username}` : ''}</h2>
      <p>BookShelf ana sayfasındasınız.</p>
      {role === 'ADMIN' ? (
        <p><Link to="/admin">Admin Dashboard'a git</Link></p>
      ) : (
        <p>Keyifli okumalar!</p>
      )}
      <div style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button
          onClick={async () => {
            setBooksError('')
            setShowBooks(true)
            setBooksLoading(true)
            try {
              const list = await getAllBooks()
              setBooks(Array.isArray(list) ? list : [])
            } catch (err) {
              setBooksError(err.message || 'Kitaplar yüklenemedi')
            } finally {
              setBooksLoading(false)
            }
          }}
          style={{ background: '#0ea5e9', color: '#fff' }}
        >
          Kütüphaneyi Aç
        </button>
        <button
          onClick={async () => {
            setFavsError('')
            setShowFavs(true)
            setFavsLoading(true)
            try {
              const list = await getFavoriteBooks()
              setFavs(Array.isArray(list) ? list : [])
            } catch (err) {
              setFavsError(err.message || 'Favoriler yüklenemedi')
            } finally {
              setFavsLoading(false)
            }
          }}
          style={{ background: '#f97316', color: '#fff' }}
        >
          Favori Kitaplarım
        </button>
        <button onClick={() => { localStorage.removeItem('token'); localStorage.removeItem('role'); localStorage.removeItem('username'); window.location.href = '/login' }}>Çıkış Yap</button>
      </div>

      {showBooks && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div style={{ width: 900, maxHeight: '80vh', overflow: 'hidden', background: '#fff', color: '#111', borderRadius: 12, padding: 16, boxShadow: '0 10px 25px rgba(0,0,0,.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, gap: 12 }}>
              <h3 style={{ margin: 0, whiteSpace: 'nowrap' }}>Kütüphane</h3>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', flex: 1 }}>
                <input
                  type="text"
                  placeholder="Başlığa göre ara..."
                  value={searchTitle}
                  onChange={(e) => setSearchTitle(e.target.value)}
                  onKeyDown={async (e) => {
                    if (e.key === 'Enter') {
                      setBooksError('')
                      setBooksLoading(true)
                      try {
                        const list = searchTitle.trim() ? await getBooksByTitle(searchTitle.trim()) : await getAllBooks()
                        setBooks(Array.isArray(list) ? list : [])
                      } catch (err) {
                        setBooksError(err.message || 'Arama başarısız')
                      } finally {
                        setBooksLoading(false)
                      }
                    }
                  }}
                  style={{ flex: 1, padding: 8, border: '1px solid #e5e7eb', borderRadius: 8 }}
                />
                <button onClick={async () => {
                  setBooksError('')
                  setBooksLoading(true)
                  try {
                    const list = searchTitle.trim() ? await getBooksByTitle(searchTitle.trim()) : await getAllBooks()
                    setBooks(Array.isArray(list) ? list : [])
                  } catch (err) {
                    setBooksError(err.message || 'Arama başarısız')
                  } finally {
                    setBooksLoading(false)
                  }
                }} style={{ background: '#22c55e', color: '#fff' }}>Ara</button>
                <button onClick={async () => {
                  setBooksError('')
                  setBooksLoading(true)
                  try {
                    const list = await getAllBooks()
                    setBooks(Array.isArray(list) ? list : [])
                    setSearchTitle('')
                  } catch (err) {
                    setBooksError(err.message || 'Kitaplar yüklenemedi')
                  } finally {
                    setBooksLoading(false)
                  }
                }} style={{ background: '#e5e7eb', color: '#111' }}>Yenile</button>
                <button onClick={() => setShowBooks(false)} style={{ background: '#e5e7eb', color: '#111' }}>Kapat</button>
              </div>
            </div>
            {booksError && <div style={{ color: 'tomato', marginBottom: 12 }}>{booksError}</div>}
            {booksLoading ? (
              <div style={{ padding: 16 }}>Yükleniyor...</div>
            ) : (
              <div style={{ overflow: 'auto', maxHeight: '65vh', border: '1px solid #e5e7eb', borderRadius: 8, padding: 8 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  {books.map((b) => (
                    <div key={b.id} style={{ border: '1px solid #e5e7eb', borderRadius: 10, padding: 12, background: '#fafafa' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <h4 style={{ margin: 0 }}>{b.title}</h4>
                        <span style={{ color: '#64748b' }}>{b.publishedYear}</span>
                      </div>
                      <div style={{ color: '#334155', marginTop: 4 }}>{b.author}</div>
                      {b.description && (
                        <p style={{ marginTop: 8, color: '#111' }}>{b.description}</p>
                      )}
                    </div>
                  ))}
                  {Array.isArray(books) && books.length === 0 && !booksLoading && !booksError && (
                    <div style={{ gridColumn: '1 / -1', padding: 16, textAlign: 'center', color: '#6b7280' }}>Kitap bulunamadı</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {showFavs && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div style={{ width: 720, maxHeight: '80vh', overflow: 'hidden', background: '#fff', color: '#111', borderRadius: 12, padding: 16, boxShadow: '0 10px 25px rgba(0,0,0,.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h3 style={{ margin: 0 }}>Favori Kitaplarım</h3>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={async () => {
                  setFavsError('')
                  setFavsLoading(true)
                  try {
                    const list = await getFavoriteBooks()
                    setFavs(Array.isArray(list) ? list : [])
                  } catch (err) {
                    setFavsError(err.message || 'Favoriler yüklenemedi')
                  } finally {
                    setFavsLoading(false)
                  }
                }} style={{ background: '#e5e7eb', color: '#111' }}>Yenile</button>
                <button onClick={() => setShowFavs(false)} style={{ background: '#e5e7eb', color: '#111' }}>Kapat</button>
              </div>
            </div>
            {favsError && <div style={{ color: 'tomato', marginBottom: 12 }}>{favsError}</div>}
            {favsLoading ? (
              <div style={{ padding: 16 }}>Yükleniyor...</div>
            ) : (
              <div style={{ overflow: 'auto', maxHeight: '65vh', border: '1px solid #e5e7eb', borderRadius: 8, padding: 8 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}>
                  {favs.map((b) => (
                    <div key={b.id} style={{ border: '1px solid #e5e7eb', borderRadius: 10, padding: 12, background: '#fafafa' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <h4 style={{ margin: 0 }}>{b.title}</h4>
                        <span style={{ color: '#64748b' }}>{b.publishedYear}</span>
                      </div>
                      <div style={{ color: '#334155', marginTop: 4 }}>{b.author}</div>
                      {b.description && (
                        <p style={{ marginTop: 8, color: '#111' }}>{b.description}</p>
                      )}
                    </div>
                  ))}
                  {Array.isArray(favs) && favs.length === 0 && !favsLoading && !favsError && (
                    <div style={{ gridColumn: '1 / -1', padding: 16, textAlign: 'center', color: '#6b7280' }}>Favori kitap bulunamadı</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}


