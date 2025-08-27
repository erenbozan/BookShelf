const BASE = '/api';

export async function login({ username, password }) {
  const res = await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) throw await buildError(res);
  return res.json();
}

export async function registerUser({ username, email, password, firstName, lastName }) {
  const res = await fetch(`${BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password, firstName, lastName }),
  });
  if (!res.ok) throw await buildError(res);
  return res.json();
}

export async function getAdminDashboard() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const res = await fetch(`${BASE}/admin/dashboard`, {
    headers: {
      'Authorization': token ? `Bearer ${token}` : '',
    },
  });
  if (!res.ok) throw await buildError(res);
  return res.json();
}

export async function createAdminBook({ title, author, description, publishedYear }) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const res = await fetch(`${BASE}/admin/books`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    },
    body: JSON.stringify({ title, author, description, publishedYear }),
  });
  if (!res.ok) throw await buildError(res);
  return res.json();
}

export async function getAdminUsers() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const res = await fetch(`${BASE}/admin/users`, {
    headers: {
      'Authorization': token ? `Bearer ${token}` : '',
    },
  });
  if (!res.ok) throw await buildError(res);
  return res.json();
}

async function buildError(res) {
  let data;
  try {
    data = await res.json();
  } catch (_) {
    // ignore
  }
  const message = data?.message || data?.error || `HTTP ${res.status}`;
  return new Error(message);
}


export async function getAllBooks() {
  const res = await fetch(`${BASE}/books`);
  if (!res.ok) throw await buildError(res);
  return res.json();
}

export async function getBooksByTitle(title) {
  const q = encodeURIComponent(title || '');
  const res = await fetch(`${BASE}/books/search/title?title=${q}`);
  if (!res.ok) throw await buildError(res);
  return res.json();
}

export async function getFavoriteBooks() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const res = await fetch(`${BASE}/favorites/books`, {
    headers: {
      'Authorization': token ? `Bearer ${token}` : '',
    },
  });
  if (!res.ok) throw await buildError(res);
  return res.json();
}

