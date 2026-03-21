fetch('https://fouru-backend-api.onrender.com/api/services/seed', { method: 'POST' })
  .then(res => res.json())
  .then(console.log)
  .catch(console.error);
