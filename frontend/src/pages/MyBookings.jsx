import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { MapPin, Calendar, Clock, User as UserIcon } from 'lucide-react';
import LiveTrackingMap from '../components/LiveTrackingMap';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const MyBookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyBookings = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/bookings/my`);
        setBookings(res.data.data);
      } catch (err) {
        console.error("Failed to fetch bookings", err);
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      fetchMyBookings();
    }
  }, [user]);

  if (loading) return <div style={{textAlign:'center', padding:'4rem', color:'#64748b', fontSize:'1.1rem', fontWeight:'500'}}>Loading your bookings...</div>;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', padding: '3rem 1.5rem', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: '800', color: '#0f172a', marginBottom: '2.5rem' }}>My Bookings</h1>
        
        {bookings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', backgroundColor: 'white', borderRadius: '1.25rem', border: '1px dashed #cbd5e1', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
            <Calendar size={56} color="#94a3b8" style={{ margin: '0 auto 1.5rem auto' }} />
            <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#334155', marginBottom: '0.5rem' }}>No bookings yet</h3>
            <p style={{ color: '#64748b', fontSize: '1.1rem' }}>When you book a service, you'll be able to track it here.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {bookings.map(booking => (
              <div key={booking._id} style={{ backgroundColor: 'white', borderRadius: '1.25rem', padding: '2rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0', overflow: 'hidden', position: 'relative' }}>
                
                {booking.status === 'In Progress' && (
                  <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', backgroundColor: '#0ea5e9' }}></div>
                )}
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#0f172a', margin: '0 0 0.5rem 0' }}>{booking.service_type}</h3>
                    <p style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', margin: 0, color: '#64748b', fontSize: '0.95rem', lineHeight: '1.4' }}>
                      <MapPin size={16} /> <span style={{ maxWidth: '400px' }}>{booking.address}</span>
                    </p>
                  </div>
                  <div style={{ backgroundColor: booking.status === 'Completed' ? '#dcfce7' : booking.status === 'In Progress' ? '#e0f2fe' : '#f1f5f9', color: booking.status === 'Completed' ? '#166534' : booking.status === 'In Progress' ? '#0369a1' : '#475569', padding: '0.35rem 1rem', borderRadius: '2rem', fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '0.5rem', border: `1px solid ${booking.status === 'Completed' ? '#bbf7d0' : booking.status === 'In Progress' ? '#bae6fd' : '#e2e8f0'}` }}>
                    {booking.status === 'In Progress' && <span style={{ width: '6px', height: '6px', backgroundColor: '#0284c7', borderRadius: '50%', animation: 'pulse 2s infinite' }}></span>}
                    {booking.status}
                  </div>
                </div>

                {booking.technician && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', backgroundColor: '#f8fafc', padding: '1rem 1.25rem', borderRadius: '0.75rem', border: '1px solid #f1f5f9' }}>
                    <div style={{ backgroundColor: '#e2e8f0', padding: '0.6rem', borderRadius: '50%' }}><UserIcon size={20} color="#475569" /></div>
                    <div>
                      <p style={{ margin: '0 0 0.2rem 0', fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600' }}>Assigned Technician</p>
                      <p style={{ margin: 0, fontSize: '1.05rem', fontWeight: '700', color: '#0f172a' }}>{booking.technician.name} • ⭐{booking.technician.rating || '4.5'}</p>
                    </div>
                  </div>
                )}

                {booking.status === 'In Progress' && (
                  <div style={{ marginTop: '2rem', borderTop: '1px dashed #cbd5e1', paddingTop: '1.5rem' }}>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f172a', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Clock size={18} color="#0ea5e9" /> Live Tracking Available
                    </h4>
                    <LiveTrackingMap bookingId={booking._id} />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
