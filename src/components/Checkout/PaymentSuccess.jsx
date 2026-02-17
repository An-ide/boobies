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
    .toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    });

  return (
    <div className="payment-success">
      <div className={`success-card ${visible ? 'visible' : ''}`}>
        <div className="checkmark-wrapper">
          <svg className="checkmark" viewBox="0 0 52 52">
            <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
            <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
          </svg>
        </div>

        <h1 className="title">Payment Successful!</h1>
        <p className="subtitle">Thank you for your purchase. Your order has been confirmed.</p>

        <div className="order-summary">
          <div className="summary-row">
            <span>Order ID</span>
            <strong>{orderId}</strong>
          </div>
          <div className="summary-row">
            <span>Delivery by</span>
            <span>{deliveryDate}</span>
          </div>
          <div className="summary-row">
            <span>Payment method</span>
            <span className="payment-badge">
              {order?.paymentMethod === 'credit-card' ? 'Credit Card' 
                : order?.paymentMethod === 'paypal' ? 'PayPal' 
                : 'Cash on Delivery'}
            </span>
          </div>

          {order?.items && order.items.length > 0 && (
            <>
              <div className="items-divider"></div>
              {order.items.map(item => (
                <div key={item.id} className="item-row">
                  <span>{item.name} <span className="item-qty">x{item.quantity}</span></span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="total-row">
                <span>Total</span>
                <strong>${order.total?.toFixed(2)}</strong>
              </div>
            </>
          )}
        </div>

        <div className="actions">
          <Link to="/orders" className="btn btn-primary">
            <svg viewBox="0 0 24 24" width="18" height="18">
              <path d="M4 6h16v2H4V6zm2-4h12v2H6V2zm16 10v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-8h20zm-6 4h-4v2h4v-2z" fill="currentColor"/>
            </svg>
            <span>View Orders</span>
          </Link>
          <Link to="/products" className="btn btn-secondary">
            <svg viewBox="0 0 24 24" width="18" height="18">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-2-8.5h6v-2h-6v2zm0 4h6v-2h-6v2z" fill="currentColor"/>
            </svg>
            <span>Continue Shopping</span>
          </Link>
        </div>

        <div className="email-note">
          <svg viewBox="0 0 24 24" width="16" height="16">
            <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill="currentColor"/>
          </svg>
          <span>Confirmation sent to your email</span>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;