import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login, setToken } from '../utils/auth';
const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await login(formData.email, formData.password);
      if (result.token) {
        setToken(result.token);
        window.location.href = '/';
      } else {
        setError(result.message || 'Login failed');
      }
    } catch (err) {
      setError('Network error');
    }
    setLoading(false);
  };

  return (
    <div className="page-background d-flex align-items-center justify-content-center" style={{minHeight: 'calc(100vh - 200px)', paddingTop: '100px', paddingBottom: '100px'}}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-10 col-xl-8">
            <div className="card shadow-lg border-0 rounded-4 auth-card">
              <div className="row g-0">
                {/* Left Column - Logo */}
                <div className="col-12 col-md-6 d-flex align-items-center justify-content-center p-5 auth-logo-section" style={{backgroundColor: '#2E7D32'}}>
                  <div className="text-center text-white">
                    <img 
                      src="/logo.png" 
                      alt="NeoKrishi Logo" 
                      className="mb-4"
                      style={{width: '200px', height: '200px', objectFit: 'contain'}}
                    />
                    <h2 className="fw-bold mb-3">
                      <span style={{color: '#F9A825'}}>Neo</span><span style={{color: '#FFFFFF'}}>Krishi</span>
                    </h2>
                    <p className="lead">Your digital companion for modern farming solutions</p>
                  </div>
                </div>
                
                {/* Right Column - Form */}
                <div className="col-12 col-md-6 auth-form-section">
                  <div className="p-5">
                    <h2 className="text-center mb-4" style={{color: '#2E7D32'}}>
                      <i className="fas fa-sign-in-alt me-2"></i>Welcome Back
                    </h2>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <form onSubmit={handleSubmit}>
                      <div className="mb-3">
                        <label className="form-label fw-semibold">Email</label>
                        <input
                          type="email"
                          className="form-control form-control-lg"
                          placeholder="Enter your email"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <label className="form-label fw-semibold">Password</label>
                        <input
                          type="password"
                          className="form-control form-control-lg"
                          placeholder="Enter your password"
                          value={formData.password}
                          onChange={(e) => setFormData({...formData, password: e.target.value})}
                          required
                        />
                      </div>
                      <button type="submit" className="btn btn-lg w-100 mb-3" style={{backgroundColor: '#2E7D32', color: 'white'}} disabled={loading}>
                        {loading ? (
                          <><i className="fas fa-spinner fa-spin me-2"></i>Logging in...</>
                        ) : (
                          <><i className="fas fa-sign-in-alt me-2"></i>Login</>
                        )}
                      </button>
                    </form>
                    <div className="text-center">
                      <Link to="/register" className="text-decoration-none" style={{color: '#2E7D32'}}>
                        Don't have an account? <strong>Register</strong>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;