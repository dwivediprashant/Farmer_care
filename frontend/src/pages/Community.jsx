import { useState, useEffect } from 'react';
import useScrollAnimation from '../hooks/useScrollAnimation';

const Community = () => {
  useScrollAnimation();
  const [farmers, setFarmers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFarmers();
  }, []);

  const fetchFarmers = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Token:', token ? 'exists' : 'missing');
      
      const response = await fetch('http://localhost:5000/api/community/all', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      console.log('Response:', response.status, data);
      
      if (response.ok) {
        setFarmers(data);
        console.log('Farmers loaded:', data.length);
      } else {
        setError(data.message || 'Failed to load farmers');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async (farmerId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/community/follow/${farmerId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      if (response.ok) {
        alert('Successfully followed farmer!');
        fetchFarmers();
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert('Failed to follow farmer');
    }
  };

  const handleMessage = (farmer) => {
    setSelectedFarmer(farmer);
    setShowMessageModal(true);
  };

  const sendMessage = async (message) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/community/message/${selectedFarmer._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message })
      });
      
      const data = await response.json();
      if (response.ok) {
        alert('Message sent successfully!');
        setShowMessageModal(false);
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert('Failed to send message');
    }
  };

  const closeModal = () => {
    setShowMessageModal(false);
    setSelectedFarmer(null);
  };

  const filteredFarmers = farmers.filter(farmer => {
    const matchesSearch = farmer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         farmer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         farmer.location?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="page-background" style={{paddingTop: '100px'}}>
      <div className="container-fluid py-4">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <h1 className="display-5 fw-bold mb-4 text-center text-md-start fade-in visible">
                <i className="fas fa-users me-3"></i>Farmer Community
              </h1>
            </div>
          </div>

          <div className="row mb-4">
            <div className="col-12">
              <div className="card search-filter-card slide-in-left visible">
                <div className="card-body">
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label fw-semibold">Search Users</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

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
              <p>Loading farmers...</p>
            </div>
          )}
          
          {error && (
            <div className="alert alert-danger">
              <i className="fas fa-exclamation-triangle me-2"></i>{error}
            </div>
          )}
          
          {!loading && !error && (
            <div className="row g-4">
              {filteredFarmers.map((farmer, index) => (
                <div key={farmer._id} className="col-12 col-sm-6 col-lg-4">
                  <div className={`card feature-card h-100 scale-in stagger-${(index % 6) + 1}`}>
                    <div className="card-body">
                      <div className="d-flex align-items-center mb-3">
                        <img
                          src={farmer.avatar || 'https://i.etsystatic.com/32486242/r/il/961434/5428907342/il_fullxfull.5428907342_rin0.jpg'}
                          alt={farmer.name || farmer.email}
                          className="rounded-circle me-3"
                          width="60"
                          height="60"
                        />
                        <div className="flex-grow-1">
                          <h5 className="card-title mb-1">{farmer.name || farmer.email.split('@')[0]}</h5>
                          <p className="text-muted mb-0">
                            <i className="fas fa-envelope me-1"></i>
                            {farmer.email}
                          </p>
                          {farmer.location && (
                            <p className="text-muted mb-0">
                              <i className="fas fa-map-marker-alt me-1"></i>
                              {farmer.location}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      {farmer.crops && farmer.crops.length > 0 && (
                        <div className="mb-3">
                          <small className="text-muted d-block mb-1">Crops:</small>
                          <div>
                            {farmer.crops.map(crop => (
                              <span key={crop} className="badge bg-success me-1 mb-1">{crop}</span>
                            ))}
                          </div>
                        </div>
                      )}

                      {farmer.experience && (
                        <div className="mb-3">
                          <small className="text-muted d-block mb-1">Experience:</small>
                          <strong className="text-primary">{farmer.experience}</strong>
                        </div>
                      )}

                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <small className="text-muted">
                          <i className="fas fa-users me-1"></i>
                          {farmer.followers?.length || 0} followers
                        </small>
                        <small className="text-muted">
                          <i className="fas fa-user-plus me-1"></i>
                          {farmer.following?.length || 0} following
                        </small>
                      </div>

                      <div className="d-flex gap-2">
                        <button
                          className="btn feature-btn flex-fill"
                          onClick={() => handleFollow(farmer._id)}
                        >
                          <i className="fas fa-user-plus me-2"></i>
                          Follow
                        </button>
                        <button
                          className="btn btn-outline-primary flex-fill"
                          onClick={() => handleMessage(farmer)}
                        >
                          <i className="fas fa-comment me-2"></i>
                          Message
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && !error && filteredFarmers.length === 0 && (
            <div className="text-center py-5">
              <i className="fas fa-search fa-3x mb-3 text-muted"></i>
              <h5>No farmers found</h5>
              <p className="text-muted">Try adjusting your search criteria</p>
            </div>
          )}
        </div>
      </div>

      {showMessageModal && (
        <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content" style={{backgroundColor: '#1a1a1a', color: '#ffffff'}}>
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="fas fa-comment me-2"></i>
                  Message {selectedFarmer?.name || selectedFarmer?.email}
                </h5>
                <button type="button" className="btn-close" onClick={closeModal}></button>
              </div>
              <div className="modal-body">
                <div className="d-flex align-items-center mb-3">
                  <img
                    src={selectedFarmer?.avatar || 'https://i.etsystatic.com/32486242/r/il/961434/5428907342/il_fullxfull.5428907342_rin0.jpg'}
                    alt={selectedFarmer?.name || selectedFarmer?.email}
                    className="rounded-circle me-3"
                    width="50"
                    height="50"
                  />
                  <div>
                    <h6 className="mb-0">{selectedFarmer?.name || selectedFarmer?.email}</h6>
                    <small className="text-muted">{selectedFarmer?.email}</small>
                  </div>
                </div>
                <textarea
                  className="form-control"
                  rows="4"
                  placeholder="Type your message here..."
                  style={{color: '#000000 !important', backgroundColor: '#ffffff !important', border: '1px solid #ccc'}}
                ></textarea>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn feature-btn"
                  onClick={() => {
                    const messageText = document.querySelector('textarea').value;
                    if (messageText.trim()) {
                      sendMessage(messageText);
                    }
                  }}
                >
                  <i className="fas fa-paper-plane me-2"></i>
                  Send Message
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Community;