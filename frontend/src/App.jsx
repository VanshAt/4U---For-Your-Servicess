import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { Wrench, User, ChevronDown, LogOut, Shield } from 'lucide-react';
import './App.css';

import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Services from './pages/Services';
import Booking from './pages/Booking';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/AdminDashboard';
import TechnicianDashboard from './pages/TechnicianDashboard';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) return null; // Hide Navbar if not logged in

  return (
    <header className="app-header">
      <div className="container nav-container">
        <Link to="/" className="logo">
          <Wrench size={28} />
          <span>4u - For Your Services</span>
        </Link>
        <nav className="nav-links">
          {user.role === 'customer' && (
            <>
              <Link to="/" className="nav-link">Home</Link>
              <Link to="/services" className="nav-link">Services</Link>
            </>
          )}
          {user.role === 'admin' && <Link to="/secret-admin-panel" className="nav-link">Admin</Link>}
          {user.role === 'technician' && <Link to="/technician-dashboard" className="nav-link">Jobs</Link>}
          
          <div className="user-dropdown-container" ref={dropdownRef}>
            <button className="user-profile" onClick={() => setDropdownOpen(!dropdownOpen)}>
              <div className="user-avatar-placeholder">
                <User size={18} />
              </div>
              <span className="user-name">{user.name || 'User'}</span>
              <ChevronDown size={16} className={`dropdown-arrow ${dropdownOpen ? 'open' : ''}`} />
            </button>
            
            {dropdownOpen && (
              <div className="user-dropdown-menu">
                <div className="dropdown-header">
                  <p className="dropdown-name">{user.name}</p>
                  <p className="dropdown-email">{user.email}</p>
                  <div className="dropdown-role">
                    <Shield size={14} /> 
                    <span>{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</span>
                  </div>
                </div>
                <div className="dropdown-divider"></div>
                <button onClick={() => { setDropdownOpen(false); logout(); }} className="dropdown-item logout">
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Navbar />
          <main className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              {/* Protected Routes */}
              <Route path="/" element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              } />
              <Route path="/services" element={
                <ProtectedRoute>
                  <Services />
                </ProtectedRoute>
              } />
              <Route path="/booking" element={
                <ProtectedRoute>
                  <Booking />
                </ProtectedRoute>
              } />
              <Route path="/secret-admin-panel" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/technician-dashboard" element={
                <ProtectedRoute allowedRoles={['technician']}>
                  <TechnicianDashboard />
                </ProtectedRoute>
              } />

              {/* Catch all redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

