import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Fan, Droplets, Zap, Settings, ThermometerSnowflake, Waves, ChevronRight, CheckCircle2 } from 'lucide-react';

const iconMap = {
  Fan: <Fan size={32} className="service-card-icon" />,
  Droplets: <Droplets size={32} className="service-card-icon" />,
  Zap: <Zap size={32} className="service-card-icon" />,
  Settings: <Settings size={32} className="service-card-icon" />,
  ThermometerSnowflake: <ThermometerSnowflake size={32} className="service-card-icon" />,
  Waves: <Waves size={32} className="service-card-icon" />
};

const AllServicesCard = ({ icon, title, description, price, delay }) => (
  <div 
    className="service-card"
    style={{ animationDelay: `${delay}ms` }}
  >
    {/* Top Row: Icon and Arrow */}
    <div className="service-card-header">
      <div className="service-card-icon-box">
        {iconMap[icon] || <Settings size={26} className="service-card-icon" />}
      </div>
      
      <Link 
        to={`/booking?service=${title.toLowerCase().replace(/\s+/g, '-')}`} 
        className="service-card-arrow-btn"
      >
        <ChevronRight size={18} className="service-card-arrow-icon" />
      </Link>
    </div>
    
    {/* Content */}
    <h3 className="service-card-title">{title}</h3>
    
    <p className="service-card-desc">{description}</p>
    
    {/* Bottom Button */}
    <Link 
      to={`/booking?service=${title.toLowerCase().replace(/\s+/g, '-')}`} 
      className="service-card-book-btn group/btn"
    >
      Book Service
    </Link>
  </div>
);

const Services = () => {
  const [servicesList, setServicesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/services');
        if (!response.ok) {
          throw new Error('Failed to fetch services');
        }
        const data = await response.json();
        setServicesList(data);
      } catch (err) {
        console.error("Error fetching services:", err);
        setError("Failed to load services. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <div className="py-24 md:py-32 bg-background min-h-screen relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[150px] -z-10 animate-pulse-glow"></div>
      <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px] -z-10 animate-pulse-glow" style={{ animationDelay: '2s' }}></div>
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 -z-20"></div>

      <div className="container max-w-7xl mx-auto px-6">
        
        <div className="text-center mb-16 animate-fade-in-up flex flex-col items-center">
          <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary border border-primary/20 text-sm font-semibold mb-4 uppercase tracking-widest animate-scale-in">
            Premium Solutions
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-text-main via-indigo-200 to-primary">
            Expert Services,<br />Delivered Home.
          </h1>
          <p className="text-lg text-text-muted max-w-3xl mx-auto delay-100 animate-fade-in-up leading-relaxed">
            Experience unparalleled convenience with our verified professionals. From minor repairs to major installations, we guarantee top-tier service within 2 to 3 hours.
          </p>
        </div>
        
        {/* Master Card Wrapper for Services */}
        <div className="master-services-wrapper">
          {/* subtle inner gradients */}
          <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none"></div>
          
          <div className="wrapper-header">
             <h2 className="wrapper-title">Available Services</h2>
             <span className="wrapper-badge">Select a category below</span>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20 space-x-4">
               <div className="w-4 h-4 rounded-full bg-primary animate-bounce delay-75"></div>
               <div className="w-4 h-4 rounded-full bg-primary animate-bounce delay-150"></div>
               <div className="w-4 h-4 rounded-full bg-primary animate-bounce delay-300"></div>
            </div>
          ) : error ? (
             <div className="text-center py-20 animate-fade-in-up">
               <div className="inline-block p-6 rounded-2xl bg-error/10 border border-error/20">
                 <p className="text-error font-semibold text-lg">{error}</p>
               </div>
             </div>
          ) : (
            <div className="bento-grid relative z-10">
              {servicesList.map((service, idx) => (
                <AllServicesCard key={service._id || idx} {...service} delay={((idx % 4) + 1) * 100} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Services;
