import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        
        <div className="footer-section">
          <h3 className="footer-title">Privacy</h3>
          <ul className="footer-links">
            <li><a href="/privacy-policy">Privacy Policy</a></li>
            <li><a href="/terms-and-condition">Terms and Condition</a></li>
            <li><a href="/refund-policy">Return and Refund Policy</a></li>
            <li><a href="/shipping-policy">Shipping Policy</a></li>
            <li><a href="https://github.com/an-ide" target="_blank" rel="noopener noreferrer">Contact Us</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3 className="footer-title">Subscribe</h3>
          <p className="footer-text">
            Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
          </p>
          <form className="newsletter-form">
            <input 
              type="email" 
              placeholder="Email *" 
              required 
              className="newsletter-input"
            />
            <button type="submit" className="subscribe-btn">SUBSCRIBE</button>
          </form>
        </div>

      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} SpicX. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;