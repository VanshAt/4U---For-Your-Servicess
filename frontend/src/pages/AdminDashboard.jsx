import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Layout, Users, ClipboardList, MapPin } from 'lucide-react';
import LiveTrackingMap from '../components/LiveTrackingMap';
import './AdminDashboard.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('bookings');
  const [bookings, setBookings] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [bookingsRes, techRes] = await Promise.all([
        axios.get(`${API_URL}/api/admin/bookings`),
        axios.get(`${API_URL}/api/technicians`)
      ]);
      setBookings(bookingsRes.data);
      setTechnicians(techRes.data.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching data', err);
    }
  };

  const handleAssign = async (bookingId, technicianId) => {
    try {
      await axios.put(`${API_URL}/api/admin/bookings/${bookingId}/assign`, { technicianId });
      setSelectedBooking(null);
      fetchData();
    } catch (err) {
      alert('Failed to assign technician');
    }
  };

  if (loading) return <div className="loading">Loading Dashboard...</div>;

  const renderBookings = () => (
    <>
      <header>
        <h1>Service Bookings</h1>
        <p>Manage and assign service requests from here.</p>
      </header>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Customer</th>
              <th>Service</th>
              <th>Status</th>
              <th>Technician</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(booking => (
              <tr key={booking._id}>
                <td>
                  <strong>{booking.customer?.name}</strong>
                  <div className="sub-text">{booking.customer?.phone}</div>
                </td>
                <td>{booking.service_type}</td>
                <td>
                  <span className={`status-badge ${booking.status.toLowerCase().replace(' ', '-')}`}>
                    {booking.status}
                  </span>
                </td>
                <td>{booking.technician?.name || 'Unassigned'}</td>
                <td>
                  {booking.status === 'Pending' && (
                    <button 
                      className="btn btn-sm btn-outline"
                      onClick={() => setSelectedBooking(booking)}
                    >
                      Assign
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );

  const renderTechnicians = () => (
    <>
      <header>
        <h1>Our Technicians</h1>
        <p>View and manage your service professionals.</p>
      </header>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Specialties</th>
              <th>Rating</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {technicians.map(tech => (
              <tr key={tech._id}>
                <td><strong>{tech.name}</strong></td>
                <td>{tech.phone}</td>
                <td>{tech.email}</td>
                <td>{tech.service_type.join(', ')}</td>
                <td>{tech.rating}⭐</td>
                <td>
                  <span className={`status-badge ${tech.availability ? 'in-progress' : 'completed'}`}>
                    {tech.availability ? 'Available' : 'Busy'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );

  const renderLiveTracking = () => (
    <>
      <header>
        <h1>Live Tracking</h1>
        <p>Monitor active technician locations in real-time.</p>
      </header>
      <div className="tracking-map-container">
        {bookings.filter(b => b.status === 'In Progress').length > 0 ? (
          <div className="active-tracking-list">
            {bookings.filter(b => b.status === 'In Progress').map(booking => (
              <div key={booking._id} className="tracking-item-card">
                <h3>{booking.service_type} for {booking.customer?.name}</h3>
                <p><strong>Technician:</strong> {booking.technician?.name}</p>
                <LiveTrackingMap bookingId={booking._id} />
              </div>
            ))}
          </div>
        ) : (
          <div className="no-active-jobs">
            <MapPin size={48} color="#cbd5e1" />
            <h3>No Active Jobs</h3>
            <p>Technician locations will appear here when they start a job.</p>
          </div>
        )}
      </div>
    </>
  );

  return (
    <div className="admin-dashboard">
      <aside className="sidebar">
        <div className="sidebar-logo">Admin Panel</div>
        <nav>
          <div 
            className={`nav-item ${activeTab === 'bookings' ? 'active' : ''}`}
            onClick={() => setActiveTab('bookings')}
          >
            <ClipboardList size={20} /> Bookings
          </div>
          <div 
            className={`nav-item ${activeTab === 'technicians' ? 'active' : ''}`}
            onClick={() => setActiveTab('technicians')}
          >
            <Users size={20} /> Technicians
          </div>
          <div 
            className={`nav-item ${activeTab === 'tracking' ? 'active' : ''}`}
            onClick={() => setActiveTab('tracking')}
          >
            <MapPin size={20} /> Live Tracking
          </div>
        </nav>
      </aside>
      
      <main className="dashboard-content">
        {activeTab === 'bookings' && renderBookings()}
        {activeTab === 'technicians' && renderTechnicians()}
        {activeTab === 'tracking' && renderLiveTracking()}

        {selectedBooking && activeTab === 'bookings' && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>Assign Technician</h3>
              <p>Select a technician for {selectedBooking.service_type} service.</p>
              <div className="tech-list">
                {technicians
                  .filter(t => t.service_type.includes(selectedBooking.service_type))
                  .map(tech => (
                  <div key={tech._id} className="tech-item" onClick={() => handleAssign(selectedBooking._id, tech._id)}>
                    <strong>{tech.name}</strong>
                    <span>{tech.rating}⭐</span>
                  </div>
                ))}
              </div>
              <button className="btn btn-outline" onClick={() => setSelectedBooking(null)}>Cancel</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
