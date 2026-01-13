import { useState, useEffect } from 'react';
import useScrollAnimation from '../hooks/useScrollAnimation';

const CropReco = () => {
  useScrollAnimation();
  const [mode, setMode] = useState('advanced'); // Only advanced mode
  const [formData, setFormData] = useState({
    soilType: '',
    lastCrop: '',
    yearsUsed: '',
    season: 'Kharif',
    // Advanced mode fields
    nitrogen: '',
    phosphorus: '',
    potassium: '',
    ph: '',
    moisture: '',
    location: ''
  });
  const [soilTypes, setSoilTypes] = useState([]);
  const [crops, setCrops] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOptions();
    // Reset states when component mounts
    setRecommendation(null);
    setError('');
  }, []);

  const fetchOptions = async () => {
    try {
      const [soilRes, cropsRes, seasonsRes] = await Promise.all([
        fetch('http://localhost:5000/api/crop-reco/soil-types'),
        fetch('http://localhost:5000/api/crop-reco/crops'),
        fetch('http://localhost:5000/api/crop-reco/seasons')
      ]);

      const [soilData, cropsData, seasonsData] = await Promise.all([
        soilRes.json(),
        cropsRes.json(),
        seasonsRes.json()
      ]);

      setSoilTypes(soilData);
      setCrops(cropsData);
      setSeasons(seasonsData);
    } catch (err) {
      setError('Failed to load form options');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = '/api/crop-reco/advanced';
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          yearsUsed: parseInt(formData.yearsUsed),
          nitrogen: formData.nitrogen ? parseFloat(formData.nitrogen) : undefined,
          phosphorus: formData.phosphorus ? parseFloat(formData.phosphorus) : undefined,
          potassium: formData.potassium ? parseFloat(formData.potassium) : undefined,
          ph: formData.ph ? parseFloat(formData.ph) : undefined,
          moisture: formData.moisture ? parseFloat(formData.moisture) : undefined
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        setRecommendation(data);
      } else {
        setError(data.message || 'Failed to get recommendation');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="page-background" style={{paddingTop: '100px'}}>
      <div className="container-fluid py-4">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <h1 className="display-5 fw-bold mb-4 text-center text-md-start fade-in visible">
                <i className="fas fa-leaf me-3"></i>Crop Recommendation
              </h1>
              

            </div>
          </div>

          <div className="row">
            <div className="col-12 col-lg-10 mx-auto mb-4">
              {/* Input Form */}
              <div className="card search-filter-card slide-in-left visible">
                <div className="card-body">
                  <div className="row">
                    <div className="col-12 col-md-8">
                      <h5 className="card-title mb-4">
                        <i className="fas fa-seedling me-2"></i>Farm Details
                      </h5>
                      <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Soil Type</label>
                      <select 
                        className="form-select"
                        name="soilType"
                        value={formData.soilType}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select Soil Type</option>
                        {soilTypes.map(soil => (
                          <option key={soil} value={soil}>{soil}</option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Last Crop Grown</label>
                      <select 
                        className="form-select"
                        name="lastCrop"
                        value={formData.lastCrop}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select Last Crop</option>
                        {crops.map(crop => (
                          <option key={crop} value={crop}>{crop}</option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Years Used for Same Crop</label>
                      <input 
                        type="number"
                        className="form-control"
                        name="yearsUsed"
                        value={formData.yearsUsed}
                        onChange={handleInputChange}
                        min="0"
                        max="50"
                        required
                        placeholder="Enter number of years"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="form-label fw-semibold">Season</label>
                      <select 
                        className="form-select"
                        name="season"
                        value={formData.season}
                        onChange={handleInputChange}
                      >
                        {seasons.map(season => (
                          <option key={season} value={season}>{season}</option>
                        ))}
                      </select>
                    </div>
                    
                    {/* AI Analysis Fields */}
                    <div className="alert alert-info mb-3">
                      <i className="fas fa-info-circle me-2"></i>
                      <strong>AI-Powered Analysis:</strong> Enter soil nutrients for precise recommendations
                    </div>
                        
                        <div className="row mb-3">
                          <div className="col-4">
                            <label className="form-label fw-semibold">Nitrogen (N)</label>
                            <input 
                              type="number"
                              className="form-control"
                              name="nitrogen"
                              value={formData.nitrogen}
                              onChange={handleInputChange}
                              placeholder="mg/kg"
                              step="0.1"
                            />
                          </div>
                          <div className="col-4">
                            <label className="form-label fw-semibold">Phosphorus (P)</label>
                            <input 
                              type="number"
                              className="form-control"
                              name="phosphorus"
                              value={formData.phosphorus}
                              onChange={handleInputChange}
                              placeholder="mg/kg"
                              step="0.1"
                            />
                          </div>
                          <div className="col-4">
                            <label className="form-label fw-semibold">Potassium (K)</label>
                            <input 
                              type="number"
                              className="form-control"
                              name="potassium"
                              value={formData.potassium}
                              onChange={handleInputChange}
                              placeholder="mg/kg"
                              step="0.1"
                            />
                          </div>
                        </div>
                        
                        <div className="row mb-3">
                          <div className="col-6">
                            <label className="form-label fw-semibold">pH Level</label>
                            <input 
                              type="number"
                              className="form-control"
                              name="ph"
                              value={formData.ph}
                              onChange={handleInputChange}
                              placeholder="6.0-8.0"
                              min="0"
                              max="14"
                              step="0.1"
                            />
                          </div>
                          <div className="col-6">
                            <label className="form-label fw-semibold">Moisture (%)</label>
                            <input 
                              type="number"
                              className="form-control"
                              name="moisture"
                              value={formData.moisture}
                              onChange={handleInputChange}
                              placeholder="0-100"
                              min="0"
                              max="100"
                              step="0.1"
                            />
                          </div>
                        </div>
                        
                        <div className="mb-3">
                          <label className="form-label fw-semibold">Location (for weather data)</label>
                          <input 
                            type="text"
                            className="form-control"
                            name="location"
                            value={formData.location}
                            onChange={handleInputChange}
                            placeholder="City, State or coordinates"
                          />
                        </div>
                        <button 
                          type="submit" 
                          className="btn feature-btn w-100"
                          disabled={loading}
                        >
                          <i className="fas fa-magic me-2"></i>
                          {loading ? 'Getting Recommendation...' : 'Get Recommendation'}
                        </button>
                      </form>
                    </div>

                    <div className="col-12 col-md-4">
                      {/* Recommender Bot Image */}
                      <div className="d-flex flex-column justify-content-center align-items-center h-100">
                        <img 
                          src="https://img.icons8.com/color/96/000000/bot.png" 
                          alt="Crop Recommender Bot" 
                          className="mb-3"
                          style={{width: '80px', height: '80px'}}
                        />
                        <h5 className="text-success">AI Crop Recommender</h5>
                        <p className="text-muted text-center">Smart crop recommendations based on your farm data</p>
                      </div>

                      {/* Loader */}
                      {loading && (
                        <div className="text-center mb-4">
                          <div className="spinner-border text-success" role="status" style={{width: '3rem', height: '3rem'}}>
                            <span className="visually-hidden">Analyzing...</span>
                          </div>
                          <p className="mt-3 text-muted">Analyzing your farm data...</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results Section - Full Width at Bottom */}
          <div className="row">
            <div className="col-12">
              {/* Error Section */}
              {error && (
                <div className="alert alert-danger">
                  <i className="fas fa-exclamation-triangle me-2"></i>{error}
                </div>
              )}

              {/* No Analysis Message */}
              {!recommendation && !loading && !error && (
                <div className="card feature-card">
                  <div className="card-body text-center py-5">
                    <i className="fas fa-seedling text-muted mb-3" style={{fontSize: '3rem'}}></i>
                    <h5 className="text-muted mb-3">No Analysis Made by User</h5>
                    <p className="text-muted">Fill in your farm details and click "Get Recommendation" to analyze crop recommendations</p>
                  </div>
                </div>
              )}

              {recommendation && !loading && (
                <div className="card feature-card bounce-in">
                  <div className="card-body">
                    {mode === 'advanced' && recommendation.crops ? (
                      // Advanced AI Response
                      <>
                        <h5 className="card-title text-success">
                          <i className="fas fa-robot me-2"></i>AI-Powered Recommendations
                        </h5>
                        {recommendation.crops.map((crop, index) => (
                          <div key={index} className="mb-4 p-3 border rounded">
                            <h4 className="text-primary">{crop.name}</h4>
                            <div className="row mb-2">
                              <div className="col-6">
                                <small className="text-muted">Profitability:</small>
                                <div className="progress" style={{height: '6px'}}>
                                  <div className="progress-bar bg-success" style={{width: `${crop.profitability * 10}%`}}></div>
                                </div>
                                <small>{crop.profitability}/10</small>
                              </div>
                              <div className="col-6">
                                <small className="text-muted">Soil Match:</small>
                                <div className="progress" style={{height: '6px'}}>
                                  <div className="progress-bar bg-info" style={{width: `${crop.soilMatch * 10}%`}}></div>
                                </div>
                                <small>{crop.soilMatch}/10</small>
                              </div>
                            </div>
                            <p><strong>Climate:</strong> {crop.suitability}</p>
                            {crop.tips && (
                              <ul className="list-unstyled">
                                {crop.tips.map((tip, tipIndex) => (
                                  <li key={tipIndex} className="mb-1">
                                    <i className="fas fa-arrow-right text-success me-2"></i>
                                    {tip}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ))}
                      </>
                    ) : recommendation.aiResponse ? (
                      // AI Text Response Fallback
                      <>
                        <h5 className="card-title text-success">
                          <i className="fas fa-robot me-2"></i>AI Analysis
                        </h5>
                        <div className="p-3 bg-light rounded" style={{whiteSpace: 'pre-wrap'}}>
                          {recommendation.aiResponse}
                        </div>
                      </>
                    ) : (
                      // Basic Mode Response
                      <>
                        <h5 className="card-title text-success">
                          <i className="fas fa-check-circle me-2"></i>Recommended Crop
                        </h5>
                        <div className="text-center mb-4">
                          <h2 className="display-6 fw-bold text-primary">{recommendation.recommendation}</h2>
                          <div className="progress mb-2" style={{height: '8px'}}>
                            <div 
                              className="progress-bar bg-success" 
                              style={{width: `${recommendation.confidence}%`}}
                            ></div>
                          </div>
                          <small className="text-muted">Confidence: {recommendation.confidence}%</small>
                        </div>
                        
                        <h6 className="fw-semibold mb-3">
                          <i className="fas fa-lightbulb me-2"></i>Recommendations:
                        </h6>
                        <ul className="list-unstyled">
                          {recommendation.notes?.map((note, index) => (
                            <li key={index} className="mb-2">
                              <i className="fas fa-arrow-right text-success me-2"></i>
                              {note}
                            </li>
                          ))}
                        </ul>
                        
                        <div className="mt-4 p-3 bg-light rounded">
                          <small className="text-muted">
                            <strong>Based on:</strong> {recommendation.soilType} soil, 
                            last crop: {recommendation.lastCrop}, 
                            used for {recommendation.yearsUsed} years
                          </small>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CropReco;