import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import { CheckCircle, Play, MapPin, RefreshCw, Loader2 } from 'lucide-react';
import './TechnicianDashboard.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const socket = io(API_URL);

const TechnicianDashboard = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [activeJob, setActiveJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user) fetchJobs();
  }, [user]);

  const fetchJobs = async () => {
    try {
      setRefreshing(true);
      const res = await axios.get(`${API_URL}/api/technicians/${user.id}/jobs`);
      setJobs(res.data);
    } catch (err) {
      console.error('Error fetching jobs', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const updateStatus = async (jobId, status) => {
    try {
      await axios.put(`${API_URL}/api/bookings/${jobId}/status`, { status });
      if (status === 'In Progress') {
        setActiveJob(jobId);
        startTracking(jobId);
      } else {
        setActiveJob(null);
      }
      fetchJobs();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const startTracking = (jobId) => {
    if ("geolocation" in navigator) {
      navigator.geolocation.watchPosition((position) => {
        const { latitude, longitude } = position.coords;
        socket.emit('technicianLocationUpdate', {
          bookingId: jobId,
          location: { lat: latitude, lng: longitude }
        });
      }, (err) => console.error(err), { enableHighAccuracy: true });
    }
  };

  if (loading) {
    return (
      <div className="tech-loading-container">
        <Loader2 className="spinner-icon large" />
        <p>Loading your jobs...</p>
      </div>
    );
  }

  return (
    <div className="tech-dashboard container">
      <div className="tech-header">
        <div className="tech-header-content">
          <div>
            <h1>Technician Console</h1>
            <p className="welcome-text">Welcome back, <strong>{user?.name}</strong></p>
          </div>
          <button 
            className={`btn-refresh ${refreshing ? 'spinning' : ''}`} 
            onClick={fetchJobs}
            title="Refresh Jobs"
          >
            <RefreshCw size={24} />
          </button>
        </div>
        <div className="tech-stats-bar">
          <div className="stat-card">
            <span className="stat-label">Today's Jobs</span>
            <span className="stat-value">{jobs.filter(j => j.status === 'Completed').length}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Estimated Earnings</span>
            <span className="stat-value">₹{jobs.filter(j => j.status === 'Completed').length * 499}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Direct Jobs</span>
            <span className="stat-value">{jobs.length}</span>
          </div>
        </div>
      </div>
      
      <div className="section-header">
        <div className="section-title">
          <Play size={20} className="play-icon" /> Active & Assigned Jobs
        </div>
      </div>
      <div className="jobs-list">
        {jobs.length === 0 ? (
          <p>No jobs assigned to you yet.</p>
        ) : (
          jobs.map(job => (
            <div key={job._id} className={`job-card ${activeJob === job._id ? 'active' : ''}`}>
              <div className="job-info">
                <h3>{job.service_type}</h3>
                <p><strong>Customer:</strong> {job.customer?.name}</p>
                <p><strong>Address:</strong> {job.address}</p>
                <p><strong>Status:</strong> {job.status}</p>
              </div>
              
              <div className="job-actions">
                {job.status === 'Assigned' && (
                  <button className="btn btn-primary" onClick={() => updateStatus(job._id, 'In Progress')}>
                    <Play size={18} /> Start Job
                  </button>
                )}
                {job.status === 'In Progress' && (
                  <>
                    <div className="tracking-status">
                      <MapPin size={18} className="pulse" /> Location Sharing Active
                    </div>
                    <button className="btn btn-success" onClick={() => updateStatus(job._id, 'Completed')}>
                      <CheckCircle size={18} /> Mark Completed
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TechnicianDashboard;
