fetch('https://fouru-backend-api.onrender.com/api/admin/bookings')
  .then(res => res.json())
  .then(data => {
    console.log("Total Bookings:", data.data.length);
    data.data.forEach(b => console.log(`- Status: ${b.status}, Tech: ${b.technician ? b.technician.name : 'None'}`));
  })
  .catch(console.error);
