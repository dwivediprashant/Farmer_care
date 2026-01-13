import { useState, useEffect } from 'react';

const WeatherCard = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getLocation();
  }, []);

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeather(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          setError('Location access denied. Using default location.');
          fetchWeather(28.6139, 77.2090); // Delhi coordinates
        }
      );
    } else {
      setError('Geolocation not supported. Using default location.');
      fetchWeather(28.6139, 77.2090); // Delhi coordinates
    }
  };

  const fetchWeather = async (lat, lon) => {
    try {
      const response = await fetch(`http://localhost:5000/api/weather?lat=${lat}&lon=${lon}`);
      const data = await response.json();
      
      if (response.ok) {
        setWeather(data);
      } else {
        setError(data.message || 'Failed to fetch weather');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="weather-forecast-container py-4 px-3">
        <h2 className="mb-0 fw-bold fade-in">Today's Weather</h2>
        <div className="today-weather-bar p-3 mb-4 rounded-3">
          <div className="text-center py-5">
            <div className="position-relative d-inline-block mb-3">
              <div className="spinner-border text-primary" style={{
                width: '80px',
                height: '80px',
                borderWidth: '4px'
              }} role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <img 
                src="/logo.png" 
                alt="NeoKrishi" 
                className="position-absolute top-50 start-50 translate-middle rounded-circle"
                style={{
                  width: '60px',
                  height: '60px',
                  objectFit: 'contain',
                  backgroundColor: 'white',
                  padding: '8px'
                }}
              />
            </div>
            <p>Loading weather...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card feature-card">
        <div className="card-body text-center">
          <i className="fas fa-exclamation-triangle fa-2x mb-3 text-warning"></i>
          <p className="text-danger">{error}</p>
        </div>
      </div>
    );
  }

  const getWeatherImage = (icon, description) => {
    // Check for overcast/cloudy conditions
    if (description && (description.toLowerCase().includes('overcast') || 
        description.toLowerCase().includes('cloudy') ||
        description.toLowerCase().includes('broken clouds'))) {
      return '/image.png';
    }
    
    const iconMap = {
      '01d': '/image.png', '01n': '/image copy.png',
      '02d': '/image copy 2.png', '02n': '/image copy 2.png',
      '03d': '/image copy 3.png', '03n': '/image copy 3.png',
      '04d': '/image.png', '04n': '/image.png',
      '09d': '/image.png', '09n': '/image.png',
      '10d': '/image.png', '10n': '/image.png',
      '11d': '/image.png', '11n': '/image.png',
      '13d': '/image copy 3.png', '13n': '/image copy 3.png',
      '50d': '/image copy 2.png', '50n': '/image copy 2.png'
    };
    return iconMap[icon] || '/image.png';
  };

  return (
    <div className="weather-forecast-container py-4 px-3">
      {/* Today's Weather Heading */}
      <div className="d-flex align-items-center justify-content-center mb-3" style={{marginTop: '100px'}}>
        <img 
          src="/image copy 3.png" 
          alt="Weather" 
          style={{width: '80px', height: '80px', objectFit: 'contain'}}
          className="me-3"
        />
        <h1 className="mb-0 fw-bold fade-in display-4">Today's Weather</h1>
      </div>
      
      {/* Today's Weather Bar - Two Column Layout */}
      <div className="today-weather-bar p-3 mb-4 rounded-3">
        <div className="row align-items-center">
          {/* Left Column - Weather Image */}
          <div className="col-12 col-md-4 text-center mb-3 mb-md-0">
            <img 
              src={getWeatherImage(weather.icon, weather.description)}
              alt={weather.description}
              style={{width: '80px', height: '80px', objectFit: 'contain'}}
            />
          </div>
          
          {/* Right Column - Weather Info */}
          <div className="col-12 col-md-8 text-center">
            <div className="d-flex justify-content-center align-items-center gap-4 mb-2">
              <h4 className="mb-0 fw-bold">{weather.location}, {weather.country}</h4>
              <h2 className="mb-0 fw-bold">{weather.temperature}°C</h2>
            </div>
            <div className="d-flex justify-content-center align-items-center gap-4">
              <p className="mb-0 text-capitalize opacity-90">{weather.description}</p>
              <p className="mb-0 opacity-90">H{weather.temperature + 2}° L{weather.temperature - 5}°</p>
              <span><i className="fas fa-tint me-1"></i>Humidity: {weather.humidity}%</span>
              <span><i className="fas fa-wind me-1"></i>Wind: {weather.windSpeed}m/s</span>
            </div>
          </div>
        </div>
      </div>
      
      <h3 className="text-center fw-bold mb-4 fade-in stagger-2">5-Day Weather Forecast</h3>
      
      <div className="d-flex flex-wrap justify-content-center gap-4 mx-auto" style={{maxWidth: 'fit-content'}}>
        {/* Current Weather Card */}
        <div className="weather-card d-flex flex-column justify-content-between align-items-center rounded-4 shadow border p-4 bounce-in" style={{
          width: '176px',
          height: '288px'
        }}>
          <h5 className="fw-bold">Today</h5>
          
          <div className="d-flex justify-content-center align-items-center" style={{height: '80px'}}>
            <img 
              src={getWeatherImage(weather.icon, weather.description)}
              alt={weather.description}
              style={{width: '64px', height: '64px', objectFit: 'contain'}}
            />
          </div>
          
          <p className="text-center px-2 mb-2" style={{fontSize: '0.875rem', fontWeight: '500'}}>
            {weather.description}
          </p>
          
          <p className="mb-2" style={{fontSize: '0.875rem', opacity: '0.7'}}>
            H {weather.temperature + 2}° · L {weather.temperature - 5}°
          </p>
          
          <p className="mb-0 fw-bold text-primary" style={{fontSize: '2.5rem'}}>
            {weather.temperature}°
          </p>
        </div>

        {/* 5-Day Forecast Cards */}
        {weather.forecast?.slice(1, 5).map((day, index) => (
          <div key={index} className={`weather-card d-flex flex-column justify-content-between align-items-center rounded-4 shadow border p-4 scale-in stagger-${index + 1}`} style={{
            width: '176px',
            height: '288px'
          }}>
            <h5 className="fw-bold">{day.date.split(' ')[0]}</h5>
            
            <div className="d-flex justify-content-center align-items-center" style={{height: '80px'}}>
              <img 
                src={getWeatherImage(day.icon, day.description)}
                alt={day.description}
                style={{width: '64px', height: '64px', objectFit: 'contain'}}
              />
            </div>
            
            <p className="text-center px-2 mb-2" style={{fontSize: '0.875rem', fontWeight: '500'}}>
              {day.description}
            </p>
            
            <p className="mb-2" style={{fontSize: '0.875rem', opacity: '0.7'}}>
              H {day.temperature + 2}° · L {day.temperature - 5}°
            </p>
            
            <p className="mb-0 fw-bold text-primary" style={{fontSize: '2.5rem'}}>
              {day.temperature}°
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherCard;