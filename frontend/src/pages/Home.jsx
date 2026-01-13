import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import WeatherCard from '../components/WeatherCard';
import useScrollAnimation from '../hooks/useScrollAnimation';

const Home = () => {
  const [loading, setLoading] = useState(true);
  useScrollAnimation();
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);
  
  if (loading) {
    return (
      <div className="page-background d-flex align-items-center justify-content-center" style={{minHeight: '100vh'}}>
        <div className="text-center">
          <div className="position-relative d-inline-block mb-4">
            <div className="spinner-border text-primary" style={{
              width: '120px',
              height: '120px',
              borderWidth: '6px'
            }} role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <img 
              src="/logo.jpeg" 
              alt="NeoKrishi" 
              className="position-absolute top-50 start-50 translate-middle rounded-circle"
              style={{
                width: '90px',
                height: '90px',
                objectFit: 'contain',
                backgroundColor: 'white',
                padding: '12px'
              }}
            />
          </div>
          <h3 className="fw-bold mb-2">
            <span style={{color: '#F9A825'}}>Neo</span><span style={{color: '#2E7D32'}}>Krishi</span>
          </h3>
          <p className="text-muted">Loading your farming dashboard...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="page-background" style={{paddingTop: '100px'}}>
      <div className="container-fluid py-5">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center mb-5">
              <div className="mb-4 bounce-in">
                <img 
                  src="/logo.jpeg" 
                  alt="NeoKrishi Logo" 
                  style={{
                    width: '180px',
                    height: '180px',
                    objectFit: 'contain'
                  }}
                />
              </div>
              <h1 className="display-4 fw-bold mb-3 fade-in stagger-1" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.1)'}}>
                Welcome to <span style={{color: '#F9A825'}}>Neo</span><span style={{color: '#2E7D32'}}>Krishi</span>
              </h1>
              <p className="lead mb-4 fade-in stagger-2">Your digital companion for modern farming solutions</p>
              <div className="mb-5 scale-in stagger-3">
                <WeatherCard />
              </div>
            </div>
          </div>
          <div className="row g-4">
            <div className="col-12 col-sm-6 col-lg-4">
              <div className="card feature-card h-100 fade-in stagger-1">
                <div className="card-body text-center">
                  <i className="fas fa-chart-line fa-4x mb-4 feature-icon" style={{color: '#F6A623'}}></i>
                  <h5 className="card-title">Market Prices</h5>
                  <p className="card-text">Check latest crop prices from mandis and make informed selling decisions</p>
                  <Link to="/market" className="btn feature-btn">
                    <i className="fas fa-rupee-sign me-2"></i>View Prices
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-6 col-lg-4">
              <div className="card feature-card h-100 fade-in stagger-2">
                <div className="card-body text-center">
                  <i className="fas fa-leaf fa-4x mb-4 feature-icon" style={{color: '#F6A623'}}></i>
                  <h5 className="card-title">Crop Recommendation</h5>
                  <p className="card-text">Get AI-powered crop suggestions based on soil and weather conditions</p>
                  <Link to="/crop-recommendation" className="btn feature-btn">
                    <i className="fas fa-seedling me-2"></i>Get Suggestions
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-6 col-lg-4">
              <div className="card feature-card h-100 fade-in stagger-3">
                <div className="card-body text-center">
                  <i className="fas fa-microscope fa-4x mb-4 feature-icon" style={{color: '#F6A623'}}></i>
                  <h5 className="card-title">Disease Detection</h5>
                  <p className="card-text">Identify crop diseases instantly by uploading photos of affected plants</p>
                  <Link to="/detect-disease" className="btn feature-btn">
                    <i className="fas fa-camera me-2"></i>Scan Disease
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-6 col-lg-4">
              <div className="card feature-card h-100 fade-in stagger-4">
                <div className="card-body text-center">
                  <i className="fas fa-newspaper fa-4x mb-4 feature-icon" style={{color: '#F6A623'}}></i>
                  <h5 className="card-title">Agriculture News</h5>
                  <p className="card-text">Stay updated with latest farming news, government schemes and market trends</p>
                  <Link to="/news" className="btn feature-btn">
                    <i className="fas fa-book-open me-2"></i>Read News
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-6 col-lg-4">
              <div className="card feature-card h-100 fade-in stagger-5">
                <div className="card-body text-center">
                  <i className="fas fa-users fa-4x mb-4 feature-icon" style={{color: '#F6A623'}}></i>
                  <h5 className="card-title">Farmer Community</h5>
                  <p className="card-text">Connect with fellow farmers, share experiences and learn from each other</p>
                  <Link to="/community" className="btn feature-btn">
                    <i className="fas fa-handshake me-2"></i>Join Community
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;