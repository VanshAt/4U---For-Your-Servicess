import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ShieldCheck, Clock, Settings, Droplets, Zap, Fan, ArrowRight, CheckCircle2, ChevronRight, Hammer } from 'lucide-react';
import './Home.css';

const ServiceCard = ({ icon, title, desc, delay }) => (
  <div className={`service-card-wrapper animate-reveal-up delay-${delay}`}>
    <div className="service-card-header">
      <div className="service-icon-bg shadow-md">
        {icon}
      </div>
      <Link to="/booking" className="arrow-btn">
        <ArrowRight size={16} />
      </Link>
    </div>
    <h3 className="service-card-title">{title}</h3>
    <p className="service-card-desc">{desc}</p>
    <Link to="/booking" className="btn btn-secondary service-card-btn">
      <span>Book Service</span>
    </Link>
  </div>
);

const ReviewCard = ({ name, rating, text, delay }) => (
  <div className={`review-card animate-reveal-up delay-${delay}`}>
    <div className="review-rating">
      {[...Array(rating)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
    </div>
    <p className="review-text">
      <span className="review-quote">"</span>
      {text}
    </p>
    <div className="review-author">
      <div className="customer-avatar shadow-lg">
        {name.charAt(0)}
      </div>
      <div>
        <h4 className="customer-name">{name}</h4>
        <div className="customer-verified">
          <CheckCircle2 size={12} /> Verified Customer
        </div>
      </div>
    </div>
  </div>
);

const Home = () => {
  return (
    <div className="home-page overflow-hidden">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-bg-effects">
          <div className="hero-glow-1 animate-glow-pulse-bg"></div>
          <div className="hero-glow-2 animate-glow-pulse-bg delay-700"></div>
          <div className="hero-glow-3 animate-float"></div>
        </div>

        <div className="container relative z-10 w-full">
          <div className="hero-content-grid">
            {/* Left Content */}
            <div className="text-left animate-slide-blur max-w-2xl">
              <h1 className="hero-title">
                Premium Home <br />
                <span className="gradient-text inline-block mt-2">Services</span>
              </h1>
              <p className="hero-subtitle animate-reveal-up delay-200">
                Experience expert home maintenance with our 2-hour guarantee. We deliver verified professionals right to your doorstep.
              </p>
              <div className="hero-buttons animate-reveal-up delay-300">
                <Link to="/booking" className="btn btn-primary shadow-glow hover:scale-105 transition-transform duration-300 w-full sm:w-auto text-center justify-center">
                  Book Now
                  <ArrowRight size={18} className="ml-2" />
                </Link>
                <Link to="/services" className="btn btn-secondary w-full sm:w-auto text-center justify-center">
                  Explore Services
                </Link>
              </div>
            </div>

            {/* Right Abstract Visual */}
            <div className="abstract-visual-container animate-slide-blur delay-200">
               {/* Main floating glass card */}
               <div className="floating-glass-card animate-float shadow-2xl">
                  <div className="status-bar">
                    <div className="status-info">
                      <div className="status-icon">
                        <Fan size={24} />
                      </div>
                      <div className="status-text">
                        <h4>AC Repair</h4>
                        <p>In Progress</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="progress-container">
                     <div className="progress-header">
                       <span>Technician Arriving</span>
                       <span>15 min</span>
                     </div>
                     <div className="progress-track">
                       <div className="progress-fill"></div>
                     </div>
                  </div>
               </div>

               {/* Secondary floating card */}
               <div className="floating-mini-card animate-float" style={{animationDelay: '1s'}}>
                  <div className="mini-card-icon">
                    <ShieldCheck size={20} />
                  </div>
                  <div className="mini-card-text">
                    <h4>100% Verified</h4>
                    <p>Professionals only</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Banner */}
      <div className="container px-4 sm:px-6 lg:px-8 animate-reveal-up delay-500 trust-banner-wrapper">
        <div className="trust-banner">
          <div className="trust-item">
            <div className="trust-icon primary">
              <Clock size={28} />
            </div>
            <div className="trust-text">
              <h3>2-Hour ETA</h3>
              <p>Lightning fast</p>
            </div>
          </div>
          <div className="trust-item">
            <div className="trust-icon secondary">
              <ShieldCheck size={28} />
            </div>
            <div className="trust-text">
              <h3>Verified Pros</h3>
              <p>Background checked</p>
            </div>
          </div>
          <div className="trust-item">
            <div className="trust-icon accent">
              <Star size={28} />
            </div>
            <div className="trust-text">
              <h3>Top Quality</h3>
              <p>Guaranteed satisfaction</p>
            </div>
          </div>
        </div>
      </div>

      {/* Services Snippet */}
      <section className="section-padding relative mt-20">
        <div className="container relative z-10 w-full">
          <div className="services-header animate-reveal-up">
            <div>
              <h2 className="services-title">Our Expertise</h2>
              <p className="services-subtitle">Comprehensive solutions for your home</p>
            </div>
            <Link to="/services" className="services-link hidden md:flex hover:translate-x-1 transition-transform">
              View all services 
              <ArrowRight size={18} />
            </Link>
          </div>
          
          <div className="bento-grid">
            {/* Standard Grid Cards */}
            <div className="col-span-12 md:col-span-6 lg:col-span-3">
              <ServiceCard 
                 icon={<Fan size={28} />} 
                 title="AC Repair" 
                 desc="Servicing, gas refill, and expert repairs for your cooling." 
                 delay="100" 
              />
            </div>
            <div className="col-span-12 md:col-span-6 lg:col-span-3">
               <ServiceCard 
                 icon={<Droplets size={28} />} 
                 title="Plumbing" 
                 desc="Expert fixing of leakages, blocks, and new fixtures installation." 
                 delay="200" 
               />
            </div>
            <div className="col-span-12 md:col-span-6 lg:col-span-3">
               <ServiceCard 
                 icon={<Zap size={28} />} 
                 title="Electrician" 
                 desc="Safe resolution of wiring issues, switches, and appliance setups." 
                 delay="300" 
               />
            </div>
            <div className="col-span-12 md:col-span-6 lg:col-span-3">
               <ServiceCard 
                 icon={<Hammer size={28} />} 
                 title="Carpentry" 
                 desc="Premium woodworks, furniture assembly and repairing tasks." 
                 delay="400" 
               />
            </div>

            <div className="col-span-12 md:col-span-6 lg:col-span-3">
               <ServiceCard 
                 icon={<Settings size={28} />} 
                 title="Appliance Maintenance" 
                 desc="Washing machines, fridges, geysers, etc." 
                 delay="500" 
               />
            </div>
          </div>
          
          <div className="mt-12 md:mt-16 text-center animate-reveal-up delay-500">
            <Link to="/services" className="btn btn-secondary w-full border-border">
              View All Services
            </Link>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="section-padding bg-surface border-t border-border/30 relative overflow-hidden mt-10">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[100px] -z-10"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[80px] -z-10"></div>
        
        <div className="container relative z-10 w-full">
          <div className="text-center max-w-2xl mx-auto mb-16 animate-reveal-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight text-text-main">Loved by Thousands</h2>
            <p className="text-text-muted text-lg font-light">Don't just take our word for it. Here's what our community says.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            <ReviewCard delay="100" name="Rahul Sharma" rating={5} text="The technician arrived in 90 minutes. Extremely professional and diagnosed the issue right away!" />
            <div className="hidden lg:block lg:translate-y-8">
              <ReviewCard delay="200" name="Priya Patel" rating={5} text="Super fast service. My washing machine broke down right before a big laundry day. Booked at 10 AM, fixed by 1 PM." />
            </div>
            <div className="lg:hidden">
              <ReviewCard delay="200" name="Priya Patel" rating={5} text="Super fast service. My washing machine broke down right before a big laundry day. Booked at 10 AM, fixed by 1 PM." />
            </div>
            <ReviewCard delay="300" name="Amit Kumar" rating={4} text="Great app for urgent electrician needs. Transparent pricing, no hidden fees, and highly skilled staff." />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
