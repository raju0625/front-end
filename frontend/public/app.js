// API Base URL - automatically detects environment
const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? ''  // Use relative URLs for local development
  : 'https://backend-tghd.onrender.com';  // Replace with your backend URL

async function postJSON(url, data) {
  // Use full URL if API_BASE_URL is set, otherwise use relative
  const fullUrl = API_BASE_URL ? `${API_BASE_URL}${url}` : url;
  const res = await fetch(fullUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  let body = null;
  try { body = await res.json(); } catch {}
  if (!res.ok) {
    const message = (body && body.message) || `Request failed (${res.status})`;
    const err = new Error(message);
    err.status = res.status;
    throw err;
  }
  return body;
}

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const loginMsg = document.getElementById('msg');
  const regForm = document.getElementById('registerForm');
  const regMsg = document.getElementById('regMsg');

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    loginMsg.textContent = '';
    loginMsg.className = 'msg';
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const btn = loginForm.querySelector('button');
    btn.disabled = true;
    try {
      const res = await postJSON('/api/auth/login', { email, password });
      loginMsg.textContent = res.message || 'Login successful';
      loginMsg.className = 'msg success';
    } catch (err) {
      loginMsg.textContent = err.message || 'Login failed';
      loginMsg.className = 'msg error';
    } finally {
      btn.disabled = false;
    }
  });

  regForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    regMsg.textContent = '';
    regMsg.className = 'msg';
    const email = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPassword').value;
    const btn = regForm.querySelector('button');
    btn.disabled = true;
    try {
      const res = await postJSON('/api/auth/register', { email, password });
      regMsg.textContent = res.message || 'Registered';
      regMsg.className = 'msg success';
    } catch (err) {
      regMsg.textContent = err.message || 'Registration failed';
      regMsg.className = 'msg error';
    } finally {
      btn.disabled = false;
    }
  });
});



