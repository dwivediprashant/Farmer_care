import { useState, useEffect } from 'react';
import useScrollAnimation from '../hooks/useScrollAnimation';

const DetectDisease = () => {
  useScrollAnimation();
  const [mode, setMode] = useState('advanced'); // Only advanced mode
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  
  useEffect(() => {
    // Reset states when component mounts
    setSelectedFile(null);
    setImagePreview(null);
    setResult(null);
    setError('');
  }, []);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }
      
      setSelectedFile(file);
      setError('');
      setResult(null);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleScan = async () => {
    if (!selectedFile) {
      setError('Please select an image first');
      return;
    }

    setScanning(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);
      
      const endpoint = '/api/disease/analyze-advanced';
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Analysis failed');
      }

      setResult(data);
    } catch (err) {
      setError(err.message || 'Failed to analyze image');
    } finally {
      setScanning(false);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'high': return 'danger';
      case 'medium': return 'warning';
      case 'low': return 'info';
      case 'none': return 'success';
      default: return 'secondary';
    }
  };

  return (
    <div className="page-background" style={{paddingTop: '100px'}}>
      <div className="container-fluid py-4">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <h1 className="display-5 fw-bold mb-4 text-center text-md-start fade-in visible">
                <i className="fas fa-microscope me-3"></i>Disease Detection
              </h1>
              

            </div>
          </div>

          <div className="row">
            <div className="col-12 col-lg-8 mx-auto mb-4">
              {/* Upload Section */}
              <div className="card search-filter-card slide-in-left visible">
                <div className="card-body">
                  <div className="row">
                    <div className="col-12 col-md-6">
                      <h5 className="card-title mb-4">
                        <i className="fas fa-camera me-2"></i>Upload Plant Image
                      </h5>
                      
                      <div className="mb-4">
                        <input 
                          type="file" 
                          className="form-control"
                          accept="image/*"
                          onChange={handleFileSelect}
                          disabled={uploading || scanning}
                        />
                        <small className="text-muted">Supported formats: JPG, PNG, GIF (Max 5MB)</small>
                      </div>

                      {imagePreview && (
                        <div className="mb-4">
                          <img 
                            src={imagePreview} 
                            alt="Preview" 
                            className="img-fluid rounded"
                            style={{maxHeight: '300px', width: '100%', objectFit: 'contain'}}
                          />
                        </div>
                      )}

                      <button 
                        className="btn feature-btn w-100"
                        onClick={handleScan}
                        disabled={!selectedFile || uploading || scanning}
                      >
                        {uploading && (
                          <><i className="fas fa-cloud-upload-alt me-2"></i>Uploading...</>
                        )}
                        {scanning && (
                          <><i className="fas fa-spinner fa-spin me-2"></i>Analyzing...</>
                        )}
                        {!uploading && !scanning && (
                          <><i className="fas fa-search me-2"></i>Detect Disease</>
                        )}
                      </button>
                    </div>

                    <div className="col-12 col-md-6">
                      {/* Detector Bot Image */}
                      <div className="d-flex flex-column justify-content-center align-items-center h-100">
                        <img 
                          src="https://img.icons8.com/color/96/000000/artificial-intelligence.png" 
                          alt="Disease Detector Bot" 
                          className="mb-3"
                          style={{width: '80px', height: '80px'}}
                        />
                        <h5 className="text-success">AI Disease Detector</h5>
                        <p className="text-muted text-center">Advanced plant disease detection using AI vision</p>
                      </div>

                      {/* Loader */}
                      {scanning && (
                        <div className="text-center mb-4">
                          <div className="spinner-border text-success" role="status" style={{width: '3rem', height: '3rem'}}>
                            <span className="visually-hidden">Analyzing...</span>
                          </div>
                          <p className="mt-3 text-muted">Analyzing your plant image...</p>
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
              {!result && !scanning && !error && (
                <div className="card feature-card">
                  <div className="card-body text-center py-5">
                    <i className="fas fa-microscope text-muted mb-3" style={{fontSize: '3rem'}}></i>
                    <h5 className="text-muted mb-3">No Analysis Made by User</h5>
                    <p className="text-muted">Upload a plant image and click "Detect Disease" to analyze for plant diseases</p>
                  </div>
                </div>
              )}

              {result && !scanning && (
                <div className="card feature-card bounce-in">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <h5 className="card-title mb-0">
                        <i className="fas fa-diagnoses me-2"></i>Detection Result
                      </h5>
                      <span className={`badge bg-${getSeverityColor(result.severity)}`}>
                        {result.severity} Risk
                      </span>
                    </div>
                    
                    <div className="text-center mb-4">
                      <h3 className="text-primary">{result.disease}</h3>
                      <div className="progress mb-2" style={{height: '8px'}}>
                        <div 
                          className="progress-bar bg-info" 
                          style={{width: `${result.confidence}%`}}
                        ></div>
                      </div>
                      <small className="text-muted">Confidence: {result.confidence}%</small>
                    </div>

                    <div className="mb-4">
                      <h6 className="fw-semibold mb-2">
                        <i className="fas fa-prescription-bottle-alt me-2"></i>Treatment:
                      </h6>
                      <p className="text-muted">{result.treatment}</p>
                    </div>

                    <div className="mb-4">
                      <h6 className="fw-semibold mb-2">
                        <i className="fas fa-shield-alt me-2"></i>Prevention:
                      </h6>
                      <p className="text-muted">{result.prevention}</p>
                    </div>

                    {/* Advanced Mode Results */}
                    {result.mode === 'advanced' && result.pesticides && (
                      <>
                        <div className="mb-3">
                          <h6 className="fw-semibold mb-2">
                            <i className="fas fa-spray-can me-2"></i>Recommended Pesticides:
                          </h6>
                          <ul className="list-unstyled">
                            {result.pesticides.map((pesticide, index) => (
                              <li key={index} className="mb-1">
                                <i className="fas fa-dot-circle text-danger me-2"></i>
                                {pesticide}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="mb-3">
                          <h6 className="fw-semibold mb-2">
                            <i className="fas fa-leaf me-2"></i>Organic Cures:
                          </h6>
                          <ul className="list-unstyled">
                            {result.organicCures.map((cure, index) => (
                              <li key={index} className="mb-1">
                                <i className="fas fa-seedling text-success me-2"></i>
                                {cure}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="mb-3">
                          <h6 className="fw-semibold mb-2">
                            <i className="fas fa-clock me-2"></i>Spray Timing:
                          </h6>
                          <p className="text-muted">{result.sprayTiming}</p>
                        </div>
                        
                        <div className="mb-3">
                          <h6 className="fw-semibold mb-2">
                            <i className="fas fa-flask me-2"></i>Recommended Fertilizers:
                          </h6>
                          <ul className="list-unstyled">
                            {result.fertilizers.map((fertilizer, index) => (
                              <li key={index} className="mb-1">
                                <i className="fas fa-vial text-info me-2"></i>
                                {fertilizer}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </>
                    )}
                    
                    {/* Basic Mode Results */}
                    {result.advice && (
                      <div className="mb-3">
                        <h6 className="fw-semibold mb-2">
                          <i className="fas fa-lightbulb me-2"></i>Recommendations:
                        </h6>
                        <ul className="list-unstyled">
                          {result.advice.map((advice, index) => (
                            <li key={index} className="mb-1">
                              <i className="fas fa-check text-success me-2"></i>
                              {advice}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="mt-4 p-3 bg-light rounded">
                      <small className="text-muted">
                        <i className="fas fa-info-circle me-1"></i>
                        Scan ID: {result.scanId} | 
                        Date: {new Date(result.scanDate).toLocaleString()}
                      </small>
                    </div>
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

export default DetectDisease;