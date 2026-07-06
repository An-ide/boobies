import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import './Checkout.css';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, getTotalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: user?.email || '',
    address: '',
    city: '',
    zipCode: '',
    paymentMethod: 'credit-card'
  });
  const [processing, setProcessing] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);

    try {
      const order = {
        id: Date.now(),
        userId: user?.id,
        items: cart,
        total: getTotalPrice(),
        shippingAddress: {
          address: formData.address,
          city: formData.city,
          zipCode: formData.zipCode
        },
        paymentMethod: formData.paymentMethod,
        status: 'completed',
        date: new Date().toISOString()
      };

      const orders = JSON.parse(localStorage.getItem('orders') || '[]');
      orders.push(order);
      localStorage.setItem('orders', JSON.stringify(orders));

      clearCart();

      navigate('/payment-success', { state: { order } });
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const subtotal = getTotalPrice();
  const shipping = subtotal >= 100 ? 0 : 9.99;
  const total = subtotal + shipping;

  return (
    <div className="co-container">
      <div className="co-inner">
        <div className="co-header">
          <h1>Checkout</h1>
          <div className="co-steps">
            <span className="co-step active">Cart</span>
            <span className="co-step-line" />
            <span className="co-step active">Details</span>
            <span className="co-step-line" />
            <span className="co-step">Payment</span>
          </div>
        </div>

        <div className="co-layout">
          <form className="co-form" onSubmit={handleSubmit}>
            <div className="co-card">
              <div className="co-card-header">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                  <line x1="12" y1="22.08" x2="12" y2="12"/>
                </svg>
                <h2>Shipping Information</h2>
              </div>
              <div className="co-card-body">
                <div className="co-row">
                  <div className="co-field">
                    <label htmlFor="firstName">First Name</label>
                    <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleInputChange} required placeholder="John" />
                  </div>
                  <div className="co-field">
                    <label htmlFor="lastName">Last Name</label>
                    <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleInputChange} required placeholder="Doe" />
                  </div>
                </div>
                <div className="co-field">
                  <label htmlFor="email">Email</label>
                  <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} required placeholder="john@example.com" />
                </div>
                <div className="co-field">
                  <label htmlFor="address">Address</label>
                  <input type="text" id="address" name="address" value={formData.address} onChange={handleInputChange} required placeholder="123 Main St" />
                </div>
                <div className="co-row">
                  <div className="co-field">
                    <label htmlFor="city">City</label>
                    <input type="text" id="city" name="city" value={formData.city} onChange={handleInputChange} required placeholder="New York" />
                  </div>
                  <div className="co-field">
                    <label htmlFor="zipCode">ZIP Code</label>
                    <input type="text" id="zipCode" name="zipCode" value={formData.zipCode} onChange={handleInputChange} required placeholder="10001" />
                  </div>
                </div>
              </div>
            </div>

            <div className="co-card">
              <div className="co-card-header">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                  <line x1="1" y1="10" x2="23" y2="10"/>
                </svg>
                <h2>Payment Method</h2>
              </div>
              <div className="co-card-body">
                <div className="co-payment-options">
                  <label className={`co-payment-option ${formData.paymentMethod === 'credit-card' ? 'active' : ''}`}>
                    <input type="radio" name="paymentMethod" value="credit-card" checked={formData.paymentMethod === 'credit-card'} onChange={handleInputChange} />
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>
                    </svg>
                    <span>Credit Card</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="co-check">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </label>
                  <label className={`co-payment-option ${formData.paymentMethod === 'paypal' ? 'active' : ''}`}>
                    <input type="radio" name="paymentMethod" value="paypal" checked={formData.paymentMethod === 'paypal'} onChange={handleInputChange} />
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106z"/></svg>
                    <span>PayPal</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="co-check">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </label>
                  <label className={`co-payment-option ${formData.paymentMethod === 'cod' ? 'active' : ''}`}>
                    <input type="radio" name="paymentMethod" value="cod" checked={formData.paymentMethod === 'cod'} onChange={handleInputChange} />
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                    </svg>
                    <span>Cash on Delivery</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="co-check">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </label>
                </div>
              </div>
            </div>
          </form>

          <div className="co-sidebar">
            <div className="co-card co-summary-card">
              <div className="co-card-header">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
                </svg>
                <h2>Order Summary</h2>
              </div>
              <div className="co-card-body co-summary-body">
                {cart.map(item => (
                  <div key={item.id} className="co-summary-item">
                    <div className="co-summary-item-img">
                      <img
                        src={item.image || item.images?.[0] || `https://picsum.photos/seed/${item.id}/80/80`}
                        alt={item.name}
                        onError={(e) => { e.target.src = `https://picsum.photos/seed/${item.id}/80/80`; }}
                      />
                      <span className="co-summary-qty">{item.quantity}</span>
                    </div>
                    <div className="co-summary-item-info">
                      <span className="co-summary-item-name">{item.name}</span>
                      <span className="co-summary-item-price">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="co-summary-totals">
                <div className="co-summary-row">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="co-summary-row">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? <span className="co-free">Free</span> : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="co-summary-row co-summary-total">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
              <button
                type="submit"
                className="co-place-btn"
                disabled={processing}
                onClick={handleSubmit}
              >
                {processing ? (
                  <>
                    <span className="co-spinner" />
                    Processing...
                  </>
                ) : (
                  <>
                    Place Order
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                    </svg>
                  </>
                )}
              </button>
              <div className="co-secure">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                Secured with SSL encryption
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;