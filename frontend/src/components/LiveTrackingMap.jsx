import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { io } from 'socket.io-client';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon in Leaflet
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const socket = io(API_URL);

// Component to recenter map when location changes
const RecenterMap = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    if (position) map.setView(position, map.getZoom());
  }, [position]);
  return null;
};

const LiveTrackingMap = ({ bookingId, initialLocation }) => {
  const [techLocation, setTechLocation] = useState(initialLocation || null); // [lat, lng]

  useEffect(() => {
    if (initialLocation && (!techLocation || (initialLocation[0] !== techLocation[0] && initialLocation[1] !== techLocation[1]))) {
      setTechLocation(initialLocation);
    }
  }, [initialLocation]);

  useEffect(() => {
    if (!bookingId) return;

    // Join room for this booking
    socket.emit('joinBookingRoom', bookingId);

    // Listen for updates
    socket.on('locationUpdated', (location) => {
      console.log('Location update received:', location);
      setTechLocation([location.lat, location.lng]);
    });

    return () => {
      socket.off('locationUpdated');
    };
  }, [bookingId]);

  if (!techLocation) {
    return (
      <div className="tracking-placeholder">
        <p>Waiting for technician to start sharing location...</p>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div style={{ height: '400px', width: '100%', borderRadius: '1rem', overflow: 'hidden' }}>
      <MapContainer center={techLocation} zoom={15} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        <Marker position={techLocation}>
          <Popup>Technician is here</Popup>
        </Marker>
        <RecenterMap position={techLocation} />
      </MapContainer>
    </div>
  );
};

export default LiveTrackingMap;
