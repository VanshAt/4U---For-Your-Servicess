import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { MapPin, Calendar, Clock, User as UserIcon, Star, XCircle } from 'lucide-react';
import LiveTrackingMap from '../components/LiveTrackingMap';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const MyBookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submittingRating, setSubmittingRating] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);

  const handleCancel = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    setCancellingId(bookingId);
    try {
      await axios.put(`${API_URL}/api/bookings/${bookingId}/cancel`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setBookings(prev => prev.map(b => b._id === bookingId ? { ...b, status: 'Cancelled' } : b));
    } catch(err) {
      alert(err.response?.data?.message || "Failed to cancel booking");
    } finally {
      setCancellingId(null);
    }
  };

  const handleRate = async (bookingId, ratingValue) => {
    setSubmittingRating(bookingId);
    try {
      await axios.post(`${API_URL}/api/bookings/${bookingId}/rate`, { rating: ratingValue }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setBookings(prev => prev.map(b => b._id === bookingId ? { ...b, rating: ratingValue } : b));
    } catch(err) {
      alert("Failed to submit rating");
    } finally {
      setSubmittingRating(null);
    }
  };

  const StarRating = ({ booking }) => {
    const [hover, setHover] = useState(0);
    
    if (booking.rating) {
      return (
        <div style={{ display: 'flex', gap: '0.2rem', marginTop: '0.75rem', alignItems: 'center' }}>
          {[1,2,3,4,5].map(star => (
            <Star key={star} size={16} fill={star <= booking.rating ? "#f59e0b" : "none"} color={star <= booking.rating ? "#f59e0b" : "#cbd5e1"} />
          ))}
          <span style={{ fontSize: '0.85rem', color: '#64748b', marginLeft: '0.5rem' }}>You rated {booking.rating} stars</span>
        </div>
      );
    }

    return (
      <div style={{ marginTop: '0.75rem' }}>
        <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem', fontWeight: '600', color: '#475569' }}>Rate this service:</p>
        <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'center' }}>
          {[1,2,3,4,5].map(star => (
            <button 
              key={star}
              type="button"
              disabled={submittingRating === booking._id}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              onClick={() => handleRate(booking._id, star)}
              style={{ background: 'none', border: 'none', cursor: submittingRating === booking._id ? 'not-allowed' : 'pointer', padding: 0, transition: 'transform 0.1s' }}
              onMouseDown={e => e.currentTarget.style.transform = 'scale(0.9)'}
              onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              <Star size={24} fill={star <= (hover || 0) ? "#f59e0b" : "none"} color={star <= (hover || 0) ? "#f59e0b" : "#cbd5e1"} style={{ transition: 'all 0.2s' }} />
            </button>
          ))}
          {submittingRating === booking._id && <span style={{ fontSize: '0.8rem', color: '#64748b', marginLeft: '0.5rem' }}>Saving...</span>}
        </div>
      </div>
    );
  };

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
                  <div style={{ backgroundColor: booking.status === 'Completed' ? '#dcfce7' : booking.status === 'In Progress' ? '#e0f2fe' : booking.status === 'Cancelled' ? '#fee2e2' : '#f1f5f9', color: booking.status === 'Completed' ? '#166534' : booking.status === 'In Progress' ? '#0369a1' : booking.status === 'Cancelled' ? '#991b1b' : '#475569', padding: '0.35rem 1rem', borderRadius: '2rem', fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '0.5rem', border: `1px solid ${booking.status === 'Completed' ? '#bbf7d0' : booking.status === 'In Progress' ? '#bae6fd' : booking.status === 'Cancelled' ? '#fecaca' : '#e2e8f0'}` }}>
                    {booking.status === 'In Progress' && <span style={{ width: '6px', height: '6px', backgroundColor: '#0284c7', borderRadius: '50%', animation: 'pulse 2s infinite' }}></span>}
                    {booking.status}
                  </div>
                </div>

                {booking.technician && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', backgroundColor: '#f8fafc', padding: '1rem 1.25rem', borderRadius: '0.75rem', border: '1px solid #f1f5f9' }}>
                    <div style={{ backgroundColor: '#e2e8f0', padding: '0.6rem', borderRadius: '50%' }}><UserIcon size={20} color="#475569" /></div>
                    <div>
                      <p style={{ margin: '0 0 0.2rem 0', fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600' }}>Assigned Technician</p>
                      <p style={{ margin: 0, fontSize: '1.05rem', fontWeight: '700', color: '#0f172a' }}>{booking.technician.name} • ⭐{booking.technician.rating || 'New'}</p>
                      
                      {booking.status === 'Completed' && <StarRating booking={booking} />}
                    </div>
                  </div>
                )}

                {(booking.status === 'In Progress' || booking.status === 'Assigned') && (
                  <div style={{ marginTop: '2rem', borderTop: '1px dashed #cbd5e1', paddingTop: '1.5rem' }}>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f172a', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <MapPin size={18} color="#0ea5e9" /> {booking.status === 'In Progress' ? 'Live Tracking Available' : 'Technician Location (Static)'}
                    </h4>
                    <LiveTrackingMap 
                      bookingId={booking._id} 
                      initialLocation={
                        booking.technician?.location?.coordinates?.length === 2 && booking.technician.location.coordinates[0] !== 0 
                          ? [booking.technician.location.coordinates[1], booking.technician.location.coordinates[0]] // MongoDB is [lng, lat], Leaflet is [lat, lng]
                          : [19.0760, 72.8777] // Default fallback map view if no explicit coordinates
                      } 
                    />
                  </div>
                )}

                {(booking.status === 'Pending' || booking.status === 'Assigned') && (
                  <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', borderTop: booking.status === 'Pending' ? '1px dashed #cbd5e1' : 'none', paddingTop: booking.status === 'Pending' ? '1.5rem' : '0' }}>
                    <button 
                      onClick={() => handleCancel(booking._id)}
                      disabled={cancellingId === booking._id}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#fff1f2', color: '#e11d48', border: '1px solid #fecdd3', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontWeight: '600', cursor: cancellingId === booking._id ? 'not-allowed' : 'pointer', transition: 'all 0.2s', fontSize: '0.9rem' }}
                      onMouseDown={e => e.currentTarget.style.transform = 'scale(0.98)'}
                      onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                    >
                      <XCircle size={16} />
                      {cancellingId === booking._id ? 'Cancelling...' : 'Cancel Booking'}
                    </button>
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
