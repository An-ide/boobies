import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './PaymentSuccess.css';

const PaymentSuccess = () => {
  const [orderId] = useState(`ORD-${Date.now().toString().slice(-8)}`);
  const [deliveryDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + 3);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    });
  });

  const [confetti, setConfetti] = useState([]);

  useEffect(() => {
    // Generate confetti
    const newConfetti = [];
    for (let i = 0; i < 50; i++) {
      newConfetti.push({
        id: i,
        left: Math.random() * 100,
        animationDelay: Math.random() * 2,
        color: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][Math.floor(Math.random() * 5)],
        shape: ['circle', 'square', 'triangle'][Math.floor(Math.random() * 3)]
      });
    }
    setConfetti(newConfetti);

    // Add celebration animation
    document.body.classList.add('celebrating');
    
    return () => {
      document.body.classList.remove('celebrating');
    };
  }, []);

  return (
    <div className="payment-success">
      {/* Confetti Background */}
      <div className="confetti-container">
        {confetti.map((piece) => (
          <div
            key={piece.id}
            className={`confetti confetti-${piece.shape}`}
            style={{
              left: `${piece.left}%`,
              backgroundColor: piece.color,
              animationDelay: `${piece.animationDelay}s`
            }}
          />
        ))}
      </div>

      <div className="success-container">
        <div className="success-card">
          {/* Animated Checkmark */}
          <div className="success-animation">
            <div className="checkmark-circle">
              <div className="checkmark-stem"></div>
              <div className="checkmark-kick"></div>
            </div>
            <div className="success-rings">
              <div className="ring ring-1"></div>
              <div className="ring ring-2"></div>
              <div className="ring ring-3"></div>
            </div>
          </div>

          {/* Success Message */}
          <div className="success-content">
            <h1 className="success-title">Payment Successful! 🎉</h1>
            <p className="success-message">
              Thank you for your purchase. Your order has been confirmed and is being processed.
            </p>
            <p className="success-subtitle">
              A confirmation email with all the details has been sent to your inbox.
            </p>

            {/* Order Details Card */}
            <div className="order-summary">
              <div className="summary-header">
                <div className="summary-icon">📦</div>
                <h3>Order Summary</h3>
              </div>
              <div className="summary-details">
                <div className="detail-item">
                  <span className="detail-label">Order ID</span>
                  <span className="detail-value">{orderId}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Status</span>
                  <span className="detail-value status-confirmed">
                    <span className="status-dot"></span>
                    Confirmed
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Estimated Delivery</span>
                  <span className="detail-value">{deliveryDate}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Payment Method</span>
                  <span className="detail-value">Credit Card</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="success-actions">
              <Link to="/orders" className="action-btn primary-btn">
                <span className="btn-icon">📋</span>
                View Order Details
              </Link>
              <Link to="/products" className="action-btn secondary-btn">
                <span className="btn-icon">🛒</span>
                Continue Shopping
              </Link>
              <Link to="/" className="action-btn outline-btn">
                <span className="btn-icon">🏠</span>
                Back to Home
              </Link>
            </div>

            {/* Additional Info */}
            <div className="additional-info">
              <div className="info-item">
                <div className="info-icon">📧</div>
                <div className="info-text">
                  <strong>Email Sent</strong>
                  <small>Check your inbox for order confirmation</small>
                </div>
              </div>
              <div className="info-item">
                <div className="info-icon">🕒</div>
                <div className="info-text">
                  <strong>24/7 Support</strong>
                  <small>Need help? Contact our support team</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="floating-element el-1">✨</div>
        <div className="floating-element el-2">🎁</div>
        <div className="floating-element el-3">🚚</div>
      </div>
    </div>
  );
};

export default PaymentSuccess;