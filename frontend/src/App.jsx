import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Wrench } from 'lucide-react';
import './App.css';

import Home from './pages/Home';
import Services from './pages/Services';
import Booking from './pages/Booking';

function App() {
  return (
    <Router>
      <div className="app-container">
        <header className="app-header">
          <div className="container nav-container">
            <Link to="/" className="logo">
              <Wrench size={28} />
              <span>4u - For Your Services</span>
            </Link>
            <nav className="nav-links">
              <Link to="/" className="nav-link">Home</Link>
              <Link to="/services" className="nav-link">Services</Link>
              <Link to="/booking" className="btn btn-primary">Book Now</Link>
            </nav>
          </div>
        </header>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/booking" element={<Booking />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
