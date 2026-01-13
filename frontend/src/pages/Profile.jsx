import { useState, useEffect } from 'react';
import useScrollAnimation from '../hooks/useScrollAnimation';

const Profile = () => {
  useScrollAnimation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyTo, setReplyTo] = useState(null);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        setError('Failed to load profile');
      }
    } catch (err) {
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleReply = (sender) => {
    setReplyTo(sender);
    setShowReplyModal(true);
  };

  const sendReply = async (message) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/community/message/${replyTo._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message })
      });
      
      if (response.ok) {
        alert('Reply sent successfully!');
        setShowReplyModal(false);
      } else {
        alert('Failed to send reply');
      }
    } catch (err) {
      alert('Failed to send reply');
    }
  };

  if (loading) {
    return (
      <div className="page-background" style={{paddingTop: '100px'}}>
        <div className="container-fluid py-4">
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
            <p>Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-background" style={{paddingTop: '100px'}}>
        <div className="container-fluid py-4">
          <div className="alert alert-danger text-center">
            <i className="fas fa-exclamation-triangle me-2"></i>{error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-background" style={{paddingTop: '100px'}}>
      <div className="container-fluid py-4">
        <div className="container">
          <div className="row justify-content-center mb-4">
            <div className="col-12 col-md-6 col-lg-4">
              <div className="card feature-card bounce-in">
                <div className="card-body text-center">
                  <div className="mb-4">
                    <img 
                      src="https://i.etsystatic.com/32486242/r/il/961434/5428907342/il_fullxfull.5428907342_rin0.jpg"
                      alt="Profile"
                      className="rounded-circle"
                      style={{width: '120px', height: '120px', objectFit: 'cover'}}
                    />
                  </div>
                  <h4 className="mb-2">{user.email.split('@')[0]}</h4>
                  <p className="text-muted mb-3">{user.email}</p>
                  <span className="badge bg-success fs-6">Member since {new Date(user.joinDate).getFullYear()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Social Stats */}
          <div className="row justify-content-center mb-4">
            <div className="col-12 col-lg-8">
              <div className="row g-3">
                <div className="col-6">
                  <div className="card feature-card fade-in stagger-2">
                    <div className="card-body text-center">
                      <i className="fas fa-users fa-2x mb-2 text-primary"></i>
                      <h4 className="mb-1">{user.followers?.length || 0}</h4>
                      <small className="text-muted">Followers</small>
                    </div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="card feature-card fade-in stagger-3">
                    <div className="card-body text-center">
                      <i className="fas fa-user-plus fa-2x mb-2 text-success"></i>
                      <h4 className="mb-1">{user.following?.length || 0}</h4>
                      <small className="text-muted">Following</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row justify-content-center">
            <div className="col-12 col-lg-8">
              <div className="card feature-card fade-in stagger-4">
                <div className="card-header">
                  <h5 className="mb-0">
                    <i className="fas fa-info-circle me-2"></i>Account Information
                  </h5>
                </div>
                <div className="card-body">
                  <div className="row g-3">
                    <div className="col-12 col-md-6">
                      <label className="form-label fw-semibold">Email</label>
                      <input type="email" className="form-control" value={user.email} readOnly />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label fw-semibold">Member Since</label>
                      <input type="text" className="form-control" value={new Date(user.joinDate).toLocaleDateString()} readOnly />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Messages Container */}
          <div className="row justify-content-center mt-4">
            <div className="col-12 col-lg-8">
              <div className="card feature-card fade-in stagger-5">
                <div className="card-header">
                  <h5 className="mb-0">
                    <i className="fas fa-envelope me-2"></i>Messages ({user.messages?.length || 0})
                  </h5>
                </div>
                <div className="card-body">
                  {user.messages && user.messages.length > 0 ? (
                    <div className="messages-container" style={{maxHeight: '400px', overflowY: 'auto'}}>
                      {user.messages.map((msg, index) => (
                        <div key={index} className="message-item p-3 mb-2 border rounded">
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <strong className="text-primary">{msg.from?.name || msg.from?.email || 'Unknown User'}</strong>
                            <small className="text-muted">{new Date(msg.timestamp).toLocaleString()}</small>
                          </div>
                          <p className="mb-2">{msg.message}</p>
                          <button 
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handleReply(msg.from)}
                          >
                            <i className="fas fa-reply me-1"></i>Reply
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <i className="fas fa-inbox fa-3x mb-3 text-muted"></i>
                      <h6>No messages yet</h6>
                      <p className="text-muted">Messages from other farmers will appear here</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reply Modal */}
      {showReplyModal && (
        <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content" style={{backgroundColor: '#1a1a1a', color: '#ffffff'}}>
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="fas fa-reply me-2"></i>
                  Reply to {replyTo?.name || replyTo?.email}
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowReplyModal(false)}></button>
              </div>
              <div className="modal-body">
                <textarea
                  className="form-control"
                  rows="4"
                  placeholder="Type your reply here..."
                  id="replyMessage"
                  style={{color: '#000000 !important', backgroundColor: '#ffffff !important', border: '1px solid #ccc'}}
                ></textarea>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowReplyModal(false)}>
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary"
                  onClick={() => {
                    const messageText = document.getElementById('replyMessage').value;
                    if (messageText.trim()) {
                      sendReply(messageText);
                    }
                  }}
                >
                  <i className="fas fa-paper-plane me-2"></i>
                  Send Reply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;