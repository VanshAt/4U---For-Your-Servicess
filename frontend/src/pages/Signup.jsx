import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './Auth.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    address: '',
    role: 'customer',
    service_type: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = formData.role === 'customer' 
        ? '/api/auth/register/customer' 
        : '/api/auth/register/technician';
      
      const payload = { ...formData };
      if (formData.role === 'technician') {
        payload.service_type = formData.service_type.split(',').map(s => s.trim());
      }

      await axios.post(`${API_URL}${endpoint}`, payload);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Join 4U</h2>
        <p>Create an account to get started</p>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Register As</label>
            <select name="role" value={formData.role} onChange={handleChange}>
              <option value="customer">Customer</option>
              <option value="technician">Technician</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" name="name" placeholder="John Doe" onChange={handleChange} required />
          </div>
          
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" name="email" placeholder="name@example.com" onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input type="text" name="phone" placeholder="+91 98765 43210" onChange={handleChange} required />
          </div>
          
          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" placeholder="••••••••" onChange={handleChange} required />
          </div>

          {formData.role === 'customer' ? (
            <div className="form-group">
              <label>Address</label>
              <input type="text" name="address" placeholder="123 Street, City" onChange={handleChange} required />
            </div>
          ) : (
            <div className="form-group">
              <label>Service Specialties (comma separated)</label>
              <input type="text" name="service_type" placeholder="ac-repair, plumbing" onChange={handleChange} required />
            </div>
          )}
          
          <button type="submit" className="btn btn-primary auth-btn">Sign Up</button>
        </form>
        
        <p className="auth-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
