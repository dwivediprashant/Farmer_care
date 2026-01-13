const Footer = () => {
  return (
    <footer className="neokrishi-footer">
      <div className="footer-container">
        
        {/* Logo + About */}
        <div className="footer-section about">
          <img
            alt="NeoKrishi Logo"
            src="/logo.jpeg"
            style={{ 
              width: "80px", 
              height: "80px", 
              objectFit: "contain",
              backgroundColor: "white",
              borderRadius: "10px",
              padding: "8px",
              marginBottom: "15px"
            }}
          />
          <p>
            Empowering farmers with weather insights, market prices, 
            community support and modern agricultural technology.
          </p>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li>Weather</li>
            <li>News</li>
            <li>Market Prices</li>
            <li>Community</li>
          </ul>
        </div>

        {/* Services */}
        <div className="footer-section">
          <h3>Features</h3>
          <ul>
            <li>Real-time Weather</li>
            <li>Agricultural News</li>
            <li>Market Analytics</li>
            <li>Farmer Network</li>
          </ul>
        </div>

        {/* Contact */}
        <div className="footer-section contact">
          <h3>Contact</h3>
          <p>Email: contact@neokrishi.com</p>
          <p>Phone: +91 98765 43210</p>
          <p>Address: Delhi, India</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2024 NeoKrishi — All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
