import { Link } from 'react-router-dom';

const LoginRequired = () => {
  return (
    <div className="page-background" style={{paddingTop: '100px'}}>
      <div className="container-fluid py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-md-8 col-lg-6">
              <div className="alert alert-warning alert-dismissible fade show" role="alert">
                <h4 className="alert-heading">
                  <i className="fas fa-lock me-2"></i>Login Required
                </h4>
                <p>You need to login to access this feature. Please login or create an account to continue.</p>
                <hr />
                <div className="d-flex gap-3">
                  <Link to="/login" className="btn btn-primary">
                    <i className="fas fa-sign-in-alt me-2"></i>Login
                  </Link>
                  <Link to="/register" className="btn btn-outline-primary">
                    <i className="fas fa-user-plus me-2"></i>Register
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

export default LoginRequired;