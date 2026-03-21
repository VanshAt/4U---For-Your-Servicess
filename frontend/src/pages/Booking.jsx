import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle2, FileText, ArrowLeft, MapPin, Loader2 } from 'lucide-react';
import LiveTrackingMap from '../components/LiveTrackingMap';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Booking = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialService = queryParams.get('service') || '';
  const titleParam = queryParams.get('title') || '';

  const [services, setServices] = useState([]);
  const [formData, setFormData] = useState({
    address: '',
    pincode: '',
    service_id: ''
  });
  
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingData, setBookingData] = useState(null); 
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  useEffect(() => {
    // Add Lottie Player script globally if not present
    if (!document.querySelector('script[src*="lottie-player"]')) {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js';
      script.async = true;
      document.body.appendChild(script);
    }

    const fetchServices = async () => {
      try {
        const res = await fetch(`${API_URL}/api/services`);
        const data = await res.json();
        setServices(data);
        
        if (data.length > 0) {
          let selected = data[0]._id;
          if (initialService) {
            const match = data.find(s => 
              s.title.toLowerCase().replace(/\s+/g, '-') === initialService || s._id === initialService
            );
            if (match) selected = match._id;
          }
          setFormData(prev => ({ ...prev, service_id: selected }));
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchServices();
  }, [initialService]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const { user } = useAuth();

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    
    setIsLocating(true);
    setErrorMsg('');
    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        const { latitude, longitude } = position.coords;
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
        if (!res.ok) throw new Error('Geocoding failed');
        const data = await res.json();
        
        if (data && data.display_name) {
          const pincode = data.address?.postcode || '';
          setFormData(prev => ({ ...prev, address: data.display_name, pincode }));
        } else {
          setErrorMsg('Could not fetch address details for this location.');
        }
      } catch (err) {
        console.error("Location Error:", err);
        setErrorMsg('Error fetching location details from maps.');
      } finally {
        setIsLocating(false);
      }
    }, (error) => {
      console.error(error);
      if (error.code === 1) {
        setErrorMsg('Please allow location access in your browser to use this feature.');
      } else {
        setErrorMsg('Unable to retrieve your location. Try entering manually.');
      }
      setIsLocating(false);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');
    
    try {
      const payload = {
        address: `${formData.address}, Pincode: ${formData.pincode}`,
        serviceType: formData.service_id, 
        timeSlot: 'ASAP',
        problemDescription: ''
      };

      const res = await fetch(`${API_URL}/api/bookings`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      if (res.ok && data.success) {
        const s = services.find(x => x._id === formData.service_id);
        setBookingData({
          id: data.data._id,
          name: user.name,
          phone: user.phone || 'N/A',
          service: s ? s.title : 'Selected Service',
          address: formData.address,
        });
        setBookingSuccess(true);
      } else {
        setErrorMsg('Error: ' + (data.message || data.error || 'Failed to book'));
      }
    } catch (error) {
      console.error('Submission Error:', error);
      setErrorMsg('Network Error: Could not reach server');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '0.75rem 1rem',
    borderRadius: '0.75rem',
    border: '1px solid #e2e8f0',
    outline: 'none',
    color: '#0f172a',
    backgroundColor: '#ffffff',
    fontSize: '1rem',
    boxSizing: 'border-box'
  };

  if (bookingSuccess && bookingData) {
    return (
      <div className="relative overflow-hidden" style={{ backgroundColor: '#f8fafc', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', fontFamily: 'sans-serif' }}>
        
        <div className="glass-card animate-fade-in-up" style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)', maxWidth: '48rem', width: '100%', borderRadius: '1.5rem', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          
          {/* Top Row: Success Anim & Details */}
          <div style={{ display: 'flex', flexWrap: 'wrap', borderBottom: '1px solid #e2e8f0' }}>
            
            {/* Left Column (Success Anim) */}
            <div style={{ flex: '1 1 300px', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <lottie-player 
                src="https://assets10.lottiefiles.com/packages/lf20_jbrw3hcz.json" 
                background="transparent" 
                speed="1" 
                style={{ width: '200px', height: '200px' }} 
                loop 
                autoplay
              ></lottie-player>
              <h2 style={{ marginTop: '1rem', fontSize: '1.5rem', fontWeight: '800', color: '#0f172a', textAlign: 'center' }}>Booking Confirmed!</h2>
              <p style={{ marginTop: '0.25rem', color: '#64748b', textAlign: 'center', fontSize: '0.875rem' }}>We're assigning an expert immediately.</p>
              
              <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center', width: '100%' }}>
                <a href="https://wa.me/919823125293" target="_blank" rel="noreferrer" style={{ flex: 1, textAlign: 'center', backgroundColor: '#10b981', color: '#fff', padding: '0.6rem 1rem', borderRadius: '0.5rem', textDecoration: 'none', fontWeight: '500', fontSize: '0.875rem' }}>WhatsApp Admin</a>
                <a href="tel:9823125293" style={{ flex: 1, textAlign: 'center', backgroundColor: '#f1f5f9', color: '#0f172a', border: '1px solid #e2e8f0', padding: '0.6rem 1rem', borderRadius: '0.5rem', textDecoration: 'none', fontWeight: '500', fontSize: '0.875rem' }}>Call Support</a>
              </div>
            </div>

            {/* Right Column (Details) */}
            <div style={{ flex: '1 1 300px', padding: '2rem', borderLeft: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Reference ID</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0f172a', marginTop: '0.1rem', letterSpacing: '0.05em' }}>#{bookingData.id.toString().substring(0, 8)}</div>
                </div>
                <div style={{ backgroundColor: 'rgba(52, 211, 153, 0.1)', color: '#34d399', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.3rem', border: '1px solid rgba(52, 211, 153, 0.2)' }}>
                  <span style={{ width: '6px', height: '6px', backgroundColor: '#34d399', borderRadius: '50%', animation: 'pulse 2s infinite' }}></span>
                  Active
                </div>
              </div>
              
              <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #e2e8f0', paddingBottom: '0.5rem' }}>
                  <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Service</div>
                  <div style={{ fontWeight: '600', color: '#0f172a', fontSize: '0.875rem' }}>{bookingData.service}</div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #e2e8f0', paddingBottom: '0.5rem' }}>
                  <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Customer</div>
                  <div style={{ fontWeight: '500', color: '#0f172a', fontSize: '0.875rem' }}>{bookingData.name}</div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Address</div>
                  <div style={{ fontWeight: '500', color: '#0f172a', fontSize: '0.875rem', textAlign: 'right', maxWidth: '60%' }}>{bookingData.address}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Real Live Tracking Map Section */}
          <div style={{ padding: '2rem', backgroundColor: '#f8fafc' }}>
            <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1rem', fontWeight: '600', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 size={18} className="text-emerald-500" /> Real-Time Service Tracking
            </h3>
            
            <LiveTrackingMap bookingId={bookingData.id} />
            
            <div style={{ marginTop: '2.5rem', display: 'flex', gap: '1rem', borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem' }}>
              <button onClick={() => navigate('/')} style={{ flex: 1, backgroundColor: '#ffffff', color: '#0f172a', border: '1px solid #cbd5e1', padding: '0.75rem 1rem', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: '600', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                <ArrowLeft size={18} /> Home Dashboard
              </button>
            </div>
          </div>

        </div>
      </div>
    );
  }

  // Initial Form View (Mimicing `book_now.html`)
  return (
    <div className="relative overflow-hidden" style={{ backgroundColor: '#f8fafc', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', fontFamily: 'sans-serif' }}>
      <div className="glass-card animate-fade-in-up" style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.03)', maxWidth: '42rem', width: '100%', borderRadius: '1.5rem', padding: '2.5rem', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0f172a', margin: 0, letterSpacing: '-0.025em' }}>
            {titleParam ? decodeURIComponent(titleParam) : 'Book Service'}
          </h2>
        </div>
        <p style={{ color: '#64748b', marginTop: '0.5rem', marginBottom: '2rem' }}>Fill in your details and our expert will contact you shortly.</p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* No name/phone fields here anymore - using user account info */}

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '-0.75rem', zIndex: 10 }}>
            <button 
              type="button" 
              onClick={handleGetLocation} 
              disabled={isLocating}
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', backgroundColor: '#f1f5f9', color: '#2563eb', border: '1px solid #bfdbfe', padding: '0.5rem 0.75rem', borderRadius: '0.5rem', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600', transition: 'all 0.2s', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}
            >
              {isLocating ? <Loader2 size={16} className="animate-spin" /> : <MapPin size={16} />}
              {isLocating ? 'Detecting...' : 'Use Current Location'}
            </button>
          </div>
          
          <textarea name="address" placeholder="Complete address" rows="3" required style={{...inputStyle, resize: 'none'}} value={formData.address} onChange={handleChange}></textarea>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem' }}>
            <div style={{ flex: '1 1 200px' }}>
              <input name="pincode" placeholder="Pincode" required style={inputStyle} value={formData.pincode} onChange={handleChange} />
            </div>
            <div style={{ flex: '1 1 200px' }}>
              <select name="service_id" required style={{...inputStyle, cursor: 'pointer', appearance: 'none', backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2364748b%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1.25rem top 50%', backgroundSize: '0.65rem auto'}} value={formData.service_id} onChange={handleChange}>
                 <option value="" disabled>Select a service</option>
                 {services.map(s => (
                   <option key={s._id} value={s._id}>{s.title} — ₹{s.price}</option>
                 ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
            <button 
              type="submit" 
              disabled={isSubmitting} 
              style={{ backgroundColor: '#2563eb', color: 'white', padding: '0.875rem 1.5rem', borderRadius: '0.75rem', border: 'none', cursor: 'pointer', fontWeight: '600', flexShrink: 0, opacity: isSubmitting ? 0.7 : 1, transition: 'background-color 0.2s', boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2), 0 2px 4px -1px rgba(37, 99, 235, 0.1)' }}
            >
              {isSubmitting ? 'Processing...' : 'Confirm Booking'}
            </button>
            <div style={{ fontSize: '0.875rem', color: errorMsg ? '#ef4444' : '#64748b' }}>{errorMsg}</div>
          </div>

        </form>
      </div>
    </div>
  );
};

export default Booking;
