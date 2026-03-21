fetch('https://fouru-backend-api.onrender.com/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: "admin@homeservices.com", password: "admin123", role: "admin" })
}).then(async r => {
  console.log('Status:', r.status);
  console.log('Text:', await r.text());
}).catch(console.error);
