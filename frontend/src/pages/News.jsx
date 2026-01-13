import { useState, useEffect } from 'react';
import useScrollAnimation from '../hooks/useScrollAnimation';

const News = () => {
  useScrollAnimation();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [schemes, setSchemes] = useState([]);
  const [schemesLoading, setSchemesLoading] = useState(true);
  const [schemesPage, setSchemesPage] = useState(1);
  const [schemesTotalPages, setSchemesTotalPages] = useState(1);
  const [schemesHasMore, setSchemesHasMore] = useState(true);

  useEffect(() => {
    fetchNews(1);
    fetchSchemes();
  }, []);
  
  const fetchSchemes = async (page = 1) => {
    setSchemesLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/youtube/schemes?page=${page}&limit=6`);
      const data = await response.json();
      
      if (response.ok) {
        if (data.videos) {
          setSchemes(data.videos.map((video, index) => ({
            id: (page - 1) * 6 + index + 1,
            title: video.title,
            description: video.description,
            thumbnail: video.thumbnail,
            videoId: video.id,
            channelTitle: video.channelTitle
          })));
          setSchemesTotalPages(data.totalPages || 1);
          setSchemesPage(page);
          setSchemesHasMore(data.hasMore !== false);
        } else {
          setSchemes(data.map((video, index) => ({
            id: index + 1,
            title: video.title,
            description: video.description,
            thumbnail: video.thumbnail,
            videoId: video.id,
            channelTitle: video.channelTitle
          })));
        }
      }
    } catch (err) {
      console.error('Failed to fetch schemes:', err);
    } finally {
      setSchemesLoading(false);
    }
  };
  
  const handleSchemesPageChange = (page) => {
    if (page >= 1 && page <= schemesTotalPages) {
      fetchSchemes(page);
    }
  };
  
  useEffect(() => {
    fetchNews(1);
    fetchSchemes(1);
  }, []);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      fetchNews(page);
    }
  };

  const fetchNews = async (page = 1) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/news?page=${page}&limit=10`);
      const data = await response.json();
      
      if (response.ok) {
        setNews(data.articles || data);
        setTotalPages(data.totalPages || 1);
        setTotal(data.total || (data.articles || data).length);
        setCurrentPage(page);
      } else {
        setError(data.message || 'Failed to fetch news');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="page-background" style={{paddingTop: '100px'}}>
      <div className="container-fluid py-4">
        <div className="container">
          <div className="row">
            <div className="col-12 d-flex justify-content-between align-items-center mb-4">
              <h1 className="display-5 fw-bold mb-0">
                <i className="fas fa-newspaper me-3"></i>Latest News
              </h1>
              {!loading && !error && (
                <nav aria-label="News pagination">
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
              <p>Loading news...</p>
            </div>
          )}
          
          {error && (
            <div className="alert alert-danger d-flex align-items-center">
              <i className="fas fa-exclamation-triangle me-3 fs-4"></i>
              <div>
                <h5 className="mb-1">Error!</h5>
                <p className="mb-0">{error}</p>
              </div>
            </div>
          )}
          
          {!loading && !error && (
            <div className="row g-4 mb-5">
              {news.map((article, index) => (
                <div key={index} className="col-12 col-sm-6 col-md-6 col-lg-4">
                  <div className={`card feature-card h-100 fade-in stagger-${(index % 6) + 1}`}>
                    <div className="card-body">
                      <h5 className="card-title">{article.title}</h5>
                      <p className="card-text">{article.summary}</p>
                      <div className="d-flex justify-content-between align-items-center mt-3">
                        <small className="text-muted">
                          <i className="fas fa-calendar me-1"></i>
                          {formatDate(article.publishedAt)}
                        </small>
                        <small className="text-muted">
                          <i className="fas fa-building me-1"></i>
                          {article.source}
                        </small>
                      </div>
                      {article.url && article.url !== '#' && (
                        <a 
                          href={article.url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="btn feature-btn btn-sm mt-3"
                        >
                          <i className="fas fa-external-link-alt me-2"></i>Read More
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          

          

          
          {/* Government Schemes Section */}
          <div className="row mb-5">
            <div className="col-12 d-flex justify-content-between align-items-center mb-4">
              <h3 className="fw-bold mb-0">
                <i className="fas fa-play-circle me-2"></i>Government Schemes
              </h3>
              {!schemesLoading && (schemesTotalPages > 1 || schemesPage > 1) && (
                <nav aria-label="Schemes pagination">
                  <ul className="pagination mb-0">
                    <li className={`page-item ${schemesPage === 1 ? 'disabled' : ''}`}>
                      <button 
                        className="page-link" 
                        onClick={() => handleSchemesPageChange(schemesPage - 1)}
                        disabled={schemesPage === 1}
                      >
                        Previous
                      </button>
                    </li>
                    {[...Array(schemesTotalPages)].map((_, index) => {
                      const page = index + 1;
                      return (
                        <li key={page} className={`page-item ${schemesPage === page ? 'active' : ''}`}>
                          <button 
                            className="page-link" 
                            onClick={() => handleSchemesPageChange(page)}
                          >
                            {page}
                          </button>
                        </li>
                      );
                    })}
                    <li className={`page-item ${!schemesHasMore || schemesPage === schemesTotalPages ? 'disabled' : ''}`}>
                      <button 
                        className="page-link" 
                        onClick={() => handleSchemesPageChange(schemesPage + 1)}
                        disabled={!schemesHasMore || schemesPage === schemesTotalPages}
                      >
                        Next
                      </button>
                    </li>
                  </ul>
                </nav>
              )}
            </div>
            <div className="col-12">
              {schemesLoading ? (
                <div className="text-center py-4">
                  <div className="position-relative d-inline-block mb-3">
                    <div className="spinner-border text-primary" style={{
                      width: '60px',
                      height: '60px',
                      borderWidth: '3px'
                    }} role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <img 
                      src="/logo.png" 
                      alt="NeoKrishi" 
                      className="position-absolute top-50 start-50 translate-middle rounded-circle"
                      style={{
                        width: '45px',
                        height: '45px',
                        objectFit: 'contain',
                        backgroundColor: 'white',
                        padding: '6px'
                      }}
                    />
                  </div>
                  <p>Loading schemes...</p>
                </div>
              ) : (
                <div className="row g-4">
                  {schemes.map((scheme) => (
                    <div key={scheme.id} className="col-12 col-md-6 col-lg-4">
                      <div className="card h-100">
                        <img 
                          src={scheme.thumbnail} 
                          className="card-img-top" 
                          alt={scheme.title}
                          style={{height: '200px', objectFit: 'cover', cursor: 'pointer'}}
                          onClick={() => setSelectedVideo(scheme)}
                        />
                        <div className="card-body">
                          <h5 className="card-title">{scheme.title}</h5>
                          <p className="card-text">{scheme.description}</p>
                          {scheme.channelTitle && (
                            <small className="text-muted d-block mb-2">
                              <i className="fas fa-tv me-1"></i>{scheme.channelTitle}
                            </small>
                          )}
                          <button 
                            className="btn btn-primary"
                            onClick={() => setSelectedVideo(scheme)}
                          >
                            <i className="fas fa-play me-2"></i>Watch Video
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {!schemesLoading && schemes.length === 0 && (
                <div className="text-center py-5">
                  <i className="fas fa-video fa-3x mb-3 text-muted"></i>
                  <h5>No Scheme Videos Available</h5>
                  <p className="text-muted">Unable to load government scheme videos at the moment. Please try again later.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Video Modal */}
      {selectedVideo && (
        <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.8)'}}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{selectedVideo.title}</h5>
                <button type="button" className="btn-close" onClick={() => setSelectedVideo(null)}></button>
              </div>
              <div className="modal-body p-0">
                <div className="ratio ratio-16x9">
                  <iframe
                    src={`https://www.youtube.com/embed/${selectedVideo.videoId}?autoplay=1`}
                    title={selectedVideo.title}
                    allowFullScreen
                    allow="autoplay; encrypted-media"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default News;