// Simple test for /api/login proxy
// Usage: node test/authApiTest.mjs [baseUrl] [phone] [password]

const base = process.argv[2] || 'http://localhost:5173';
const phone = process.argv[3] || '13800000000';
const password = process.argv[4] || 'testpass';

const url = new URL('/artemis/login', base).toString();

console.log('Testing login proxy:', url);

async function run() {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, password }),
      credentials: 'include'
    });

    const text = await res.text();
    let body;
    try { body = JSON.parse(text); } catch(e) { body = text; }

    console.log('HTTP', res.status, res.statusText);
    console.log('Response body:', body);
    process.exit(res.ok ? 0 : 2);
  } catch (err) {
    console.error('Request failed:', err);
    process.exit(1);
  }
}

run();
