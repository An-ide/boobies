import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './PaymentSuccess.css';

const PaymentSuccess = () => {
  const location = useLocation();
  const order = location.state?.order;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  const orderId = order?.id || `ORD-${Date.now().toString().slice(-8)}`;
  const deliveryDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
    .toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div className="ps-page">
      <div className={`ps-card ${visible ? 'in' : ''}`}>
        <div className="ps-icon-wrap">
          <svg className="ps-check" viewBox="0 0 52 52">
            <circle className="ps-check-circle" cx="26" cy="26" r="25" fill="none" />
            <path className="ps-check-path" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
          </svg>
        </div>

        <h1 className="ps-title">Order confirmed!</h1>
        <p className="ps-sub">Thanks, {order?.shippingAddress?.firstName || order?.items?.[0]?.name?.split(' ')[0] || 'there'}! Your order is on its way.</p>

        <div className="ps-summary">
          <div className="ps-row">
            <span className="ps-label">Order</span>
            <span className="ps-val">{orderId}</span>
          </div>
          <div className="ps-row">
            <span className="ps-label">Delivery</span>
            <span className="ps-val">{deliveryDate}</span>
          </div>
          <div className="ps-row">
            <span className="ps-label">Payment</span>
            <span className="ps-badge">
              {order?.paymentMethod === 'credit-card' ? 'Credit Card'
                : order?.paymentMethod === 'paypal' ? 'PayPal'
                : 'Cash on Delivery'}
            </span>
          </div>

          {order?.items && order.items.length > 0 && (
            <>
              <div className="ps-divider" />
              {order.items.map((item, i) => (
                <div key={item.id || i} className="ps-item">
                  <div className="ps-item-left">
                    <div className="ps-item-img">
                      <img
                        src={item.image || item.images?.[0] || `https://picsum.photos/seed/${item.id || i}/40/40`}
                        alt={item.name}
                        onError={(e) => { e.target.src = `https://picsum.photos/seed/${item.id || i}/40/40`; }}
                      />
                    </div>
                    <div className="ps-item-info">
                      <span className="ps-item-name">{item.name}</span>
                      <span className="ps-item-qty">x{item.quantity}</span>
                    </div>
                  </div>
                  <span className="ps-item-price">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="ps-total">
                <span>Total</span>
                <strong>${order.total?.toFixed(2)}</strong>
              </div>
            </>
          )}
        </div>

        <div className="ps-actions">
          <Link to="/orders" className="ps-btn ps-btn-primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>
            </svg>
            View Orders
          </Link>
          <Link to="/products" className="ps-btn ps-btn-secondary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
            Shop More
          </Link>
        </div>

        <div className="ps-note">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
          </svg>
          A confirmation has been sent to your email
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;