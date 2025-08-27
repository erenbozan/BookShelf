import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom'
import './App.css'
import LoginPage from './pages/Login'
import RegisterPage from './pages/Register'
import AdminDashboard from './pages/AdminDashboard'

function Home() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  const role = typeof window !== 'undefined' ? localStorage.getItem('role') : null
  const username = typeof window !== 'undefined' ? localStorage.getItem('username') : null
  return (
    <div>
      <h2>BookShelf</h2>
      {token ? (
        <>
          <p>
            Hoş geldiniz{username ? `, ${username}` : ''}.
            {role === 'ADMIN' ? ' (ADMIN)' : role === 'USER' ? '' : ''}
          </p>
          {role === 'ADMIN' && (
            <p><Link to="/admin">Admin Dashboard</Link></p>
          )}
          <button onClick={() => { localStorage.removeItem('token'); localStorage.removeItem('role'); localStorage.removeItem('username'); window.location.reload() }}>Çıkış Yap</button>
        </>
      ) : (
        <p>
          <Link to="/login">Giriş Yap</Link> veya <Link to="/register">Kayıt Ol</Link>
        </p>
      )}
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/admin" element={
          (typeof window !== 'undefined' && localStorage.getItem('token') && String(localStorage.getItem('role') || '').toUpperCase().includes('ADMIN'))
            ? <AdminDashboard />
            : <Navigate to="/login" replace />
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
