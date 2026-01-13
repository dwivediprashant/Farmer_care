import { useState, useEffect } from 'react';
import useScrollAnimation from '../hooks/useScrollAnimation';

const Market = () => {
  useScrollAnimation();
  const [prices, setPrices] = useState([]);
  const [commodities, setCommodities] = useState([]);
  const [states, setStates] = useState([]);
  const [selectedCommodity, setSelectedCommodity] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [pricesRes, commoditiesRes, statesRes] = await Promise.all([
        fetch('http://localhost:5000/api/market?page=1&limit=12'),
        fetch('http://localhost:5000/api/market/commodities'),
        fetch('http://localhost:5000/api/market/states')
      ]);

      const [pricesData, commoditiesData, statesData] = await Promise.all([
        pricesRes.json(),
        commoditiesRes.json(),
        statesRes.json()
      ]);

      if (pricesData.articles) {
        setPrices(pricesData.articles);
        setTotalPages(pricesData.totalPages || 1);
        setTotal(pricesData.total || pricesData.articles.length);
        setCurrentPage(1);
      } else {
        setPrices(pricesData);
        setTotalPages(1);
        setTotal(pricesData.length);
        setCurrentPage(1);
      }
      setCommodities(commoditiesData);
      setStates(statesData);
    } catch (err) {
      setError('Failed to load market data');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCommodity) params.append('commodity', selectedCommodity);
      if (selectedState) params.append('state', selectedState);
      params.append('page', page);
      params.append('limit', 12);
      
      const response = await fetch(`http://localhost:5000/api/market?${params}`);
      const data = await response.json();
      
      if (data.articles) {
        setPrices(data.articles);
        setTotalPages(data.totalPages || 1);
        setTotal(data.total || data.articles.length);
        setCurrentPage(page);
      } else {
        setPrices(data);
        setTotalPages(1);
        setTotal(data.length);
        setCurrentPage(1);
      }
    } catch (err) {
      setError('Failed to search market data');
    } finally {
      setLoading(false);
    }
  };
  
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      handleSearch(page);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="page-background" style={{paddingTop: '100px'}}>
      <div className="container-fluid py-4">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center mb-3">
              <div className="d-flex justify-content-center gap-4 mb-3">
                <span className="bounce-in" style={{fontSize: '3rem', animation: 'bounce 2s infinite', animationDelay: '0s'}}>🍅</span>
                <span className="bounce-in" style={{fontSize: '3rem', animation: 'bounce 2s infinite', animationDelay: '0.2s'}}>🧅</span>
                <span className="bounce-in" style={{fontSize: '3rem', animation: 'bounce 2s infinite', animationDelay: '0.4s'}}>🥔</span>
                <span className="bounce-in" style={{fontSize: '3rem', animation: 'bounce 2s infinite', animationDelay: '0.6s'}}>🌽</span>
                <span className="bounce-in" style={{fontSize: '3rem', animation: 'bounce 2s infinite', animationDelay: '0.8s'}}>🥕</span>
                <span className="bounce-in" style={{fontSize: '3rem', animation: 'bounce 2s infinite', animationDelay: '1s'}}>🌶️</span>
                <span className="bounce-in" style={{fontSize: '3rem', animation: 'bounce 2s infinite', animationDelay: '1.2s'}}>🥬</span>
                <span className="bounce-in" style={{fontSize: '3rem', animation: 'bounce 2s infinite', animationDelay: '1.4s'}}>🍆</span>
              </div>
            </div>
          </div>
          
          <div className="row">
            <div className="col-12 d-flex justify-content-between align-items-center mb-4">
              <h1 className="display-5 fw-bold mb-0">
                <i className="fas fa-chart-line me-3"></i>Market Prices
              </h1>
              {!loading && !error && (
                <nav aria-label="Market pagination">
                  <ul className="pagination mb-0">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                      <button 
                        className="page-link" 
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </button>
                    </li>
                    {[...Array(totalPages)].map((_, index) => {
                      const page = index + 1;
                      return (
                        <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                          <button 
                            className="page-link" 
                            onClick={() => handlePageChange(page)}
                          >
                            {page}
                          </button>
                        </li>
                      );
                    })}
                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                      <button 
                        className="page-link" 
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </button>
                    </li>
                  </ul>
                </nav>
              )}
            </div>
          </div>

          {/* Search Filters */}
          <div className="row mb-4">
            <div className="col-12">
              <div className="card search-filter-card slide-in-left observed visible">
                <div className="card-body">
                  <div className="row g-3">
                    <div className="col-12 col-sm-6 col-md-4">
                      <label className="form-label fw-semibold">Commodity</label>
                      <select 
                        className="form-select"
                        value={selectedCommodity}
                        onChange={(e) => setSelectedCommodity(e.target.value)}
                      >
                        <option value="">All Commodities</option>
                        {commodities.map(commodity => (
                          <option key={commodity} value={commodity}>{commodity}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-12 col-sm-6 col-md-4">
                      <label className="form-label fw-semibold">State</label>
                      <select 
                        className="form-select"
                        value={selectedState}
                        onChange={(e) => setSelectedState(e.target.value)}
                      >
                        <option value="">All States</option>
                        {states.map(state => (
                          <option key={state} value={state}>{state}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-12 col-md-4 d-flex align-items-end">
                      <button 
                        className="btn feature-btn w-100"
                        onClick={() => handleSearch(1)}
                        disabled={loading}
                      >
                        <i className="fas fa-search me-2"></i>
                        {loading ? 'Searching...' : 'Search Prices'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          {error && (
            <div className="alert alert-danger">
              <i className="fas fa-exclamation-triangle me-2"></i>{error}
            </div>
          )}

          {loading && (
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
              <p>Loading market prices...</p>
            </div>
          )}

          {!loading && !error && prices.length > 0 && (
            <div className="row g-4">
              {prices.map((price, index) => (
                <div key={index} className="col-12 col-md-6 col-lg-4">
                  <div className={`card feature-card h-100 scale-in stagger-${(index % 6) + 1}`}>
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <h5 className="card-title mb-0">{price.commodity}</h5>
                        <span className="badge bg-success">{price.source}</span>
                      </div>
                      <p className="text-muted mb-2">
                        <i className="fas fa-map-marker-alt me-1"></i>
                        {price.market}, {price.district ? `${price.district}, ` : ''}{price.state}
                      </p>
                      {price.variety && price.variety !== 'N/A' && (
                        <p className="text-muted mb-2">
                          <i className="fas fa-seedling me-1"></i>
                          {price.variety} {price.grade && price.grade !== 'N/A' ? `(${price.grade})` : ''}
                        </p>
                      )}
                      <div className="row text-center mb-3">
                        <div className="col-4">
                          <small className="text-muted d-block">Min Price</small>
                          <strong className="text-danger">{formatPrice(price.minPrice)}</strong>
                        </div>
                        <div className="col-4">
                          <small className="text-muted d-block">Modal Price</small>
                          <strong className="text-primary">{formatPrice(price.modalPrice)}</strong>
                        </div>
                        <div className="col-4">
                          <small className="text-muted d-block">Max Price</small>
                          <strong className="text-success">{formatPrice(price.maxPrice)}</strong>
                        </div>
                      </div>
                      <small className="text-muted">
                        <i className="fas fa-calendar me-1"></i>
                        {new Date(price.date).toLocaleDateString()}
                      </small>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {!loading && !error && prices.length === 0 && (
            <div className="text-center py-5">
              <i className="fas fa-search fa-3x mb-3 text-muted"></i>
              <h5>No Data Available</h5>
              <p className="text-muted">No market prices found for the selected criteria. Try adjusting your search filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Market;