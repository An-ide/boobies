import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import CartItem from './CartItem';
import './Cart.css';

const Cart = () => {
  const { cart, getTotalPrice, getTotalItems, clearCart, getSavings } = useCart();
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const subtotal = getTotalPrice();
  const shipping = subtotal > 50 ? 0 : 5.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;
  const savings = getSavings?.() || 0;

  const handleClearCart = () => {
    clearCart();
    setShowClearConfirm(false);
  };

  if (cart.length === 0) {
    return (
      <div className="empty-cart-container">
        <div className="empty-cart">
          <div className="empty-cart-icon">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
          </div>
          <h2>Your Shopping Cart is Empty</h2>
          <p className="empty-cart-message">
            Looks like you haven't added any items to your cart yet.
          </p>
          <Link to="/products" className="continue-shopping-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"></path>
            </svg>
            Start Shopping
          </Link>
          
          <div className="empty-cart-suggestions">
            <h3>You Might Like</h3>
            <div className="suggestion-items">
              <div className="suggestion-item">
                <div className="suggestion-image" style={{ background: '#f3f4f6' }}></div>
                <div className="suggestion-info">
                  <span>Running Shoes</span>
                  <small>From $89.99</small>
                </div>
              </div>
              <div className="suggestion-item">
                <div className="suggestion-image" style={{ background: '#f3f4f6' }}></div>
                <div className="suggestion-info">
                  <span>Casual Sneakers</span>
                  <small>From $69.99</small>
                </div>
              </div>
              <div className="suggestion-item">
                <div className="suggestion-image" style={{ background: '#f3f4f6' }}></div>
                <div className="suggestion-info">
                  <span>Hiking Boots</span>
                  <small>From $129.99</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      {/* Header */}
      <div className="cart-header">
        <div className="container">
          <h1>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            Shopping Cart
            <span className="cart-count-badge">{getTotalItems()} items</span>
          </h1>
          <div className="cart-steps">
            <div className="step active">
              <div className="step-number">1</div>
              <span>Cart</span>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <span>Information</span>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <span>Payment</span>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <span>Review</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container cart-container">
        <div className="cart-layout">
          {/* Main Cart Items */}
          <div className="cart-main">
            <div className="cart-items-header">
              <h2>Items in Your Cart</h2>
              <button 
                className="clear-cart-btn"
                onClick={() => setShowClearConfirm(true)}
              >
                Clear All
              </button>
            </div>
            
            <div className="cart-items-list">
              {cart.map(item => (
                <CartItem key={`${item.id}-${item.size}`} item={item} />
              ))}
            </div>

            {/* Continue Shopping Section */}
            <div className="continue-shopping-section">
              <Link to="/products" className="continue-link">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5M12 19l-7-7 7-7"></path>
                </svg>
                Continue Shopping
              </Link>
              <span className="free-shipping-note">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M12 16v-4M12 8h.01"></path>
                </svg>
                Free shipping on orders over $50
              </span>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="cart-sidebar">
            <div className="order-summary">
              <div className="summary-header">
                <h3>Order Summary</h3>
                <div className="estimated-total">
                  <span>Estimated Total</span>
                  <span className="total-price">${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="summary-details">
                {savings > 0 && (
                  <div className="summary-row savings">
                    <span>Savings</span>
                    <span className="savings-amount">-${savings.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="summary-row">
                  <span>Subtotal ({getTotalItems()} items)</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                
                <div className="summary-row">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                </div>
                
                <div className="summary-row">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>

                <div className="summary-divider"></div>

                <div className="summary-row total">
                  <span>Total</span>
                  <span className="total-amount">${total.toFixed(2)}</span>
                </div>

                {subtotal < 50 && (
                  <div className="free-shipping-progress">
                    <div className="progress-label">
                      <span>Add ${(50 - subtotal).toFixed(2)} more for FREE shipping!</span>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${(subtotal / 50) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              <div className="summary-actions">
                <Link to="/checkout" className="checkout-btn">
                  Proceed to Checkout
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7"></path>
                  </svg>
                </Link>
                
                <div className="payment-methods">
                  <div className="payment-icons">
                    <span>💳</span>
                    <span>🏦</span>
                    <span>📱</span>
                    <span>🔒</span>
                  </div>
                  <small>Secure payment with 256-bit SSL encryption</small>
                </div>
              </div>

              {/* Promo Code Section */}
              <div className="promo-section">
                <div className="promo-header">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                    <line x1="7" y1="7" x2="7.01" y2="7"></line>
                  </svg>
                  <span>Have a promo code?</span>
                </div>
                <div className="promo-input">
                  <input type="text" placeholder="Enter promo code" />
                  <button className="apply-promo">Apply</button>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="trust-badges">
                <div className="trust-badge">
                  <div className="badge-icon">🚚</div>
                  <div className="badge-text">
                    <strong>Free Shipping</strong>
                    <small>On orders over $50</small>
                  </div>
                </div>
                <div className="trust-badge">
                  <div className="badge-icon">↩️</div>
                  <div className="badge-text">
                    <strong>30-Day Returns</strong>
                    <small>Easy returns</small>
                  </div>
                </div>
                <div className="trust-badge">
                  <div className="badge-icon">🔒</div>
                  <div className="badge-text">
                    <strong>Secure Payment</strong>
                    <small>100% secure</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recently Viewed Section */}
      <div className="recently-viewed">
        <div className="container">
          <h3>Recently Viewed</h3>
          <div className="recent-items">
            {/* Add recently viewed items here */}
          </div>
        </div>
      </div>

      {/* Clear Cart Confirmation Modal */}
      {showClearConfirm && (
        <div className="modal-overlay">
          <div className="confirmation-modal">
            <div className="modal-header">
              <h3>Clear Cart?</h3>
              <button className="close-modal" onClick={() => setShowClearConfirm(false)}>
                ×
              </button>
            </div>
            <div className="modal-content">
              <p>Are you sure you want to remove all items from your cart?</p>
            </div>
            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setShowClearConfirm(false)}>
                Cancel
              </button>
              <button className="confirm-btn" onClick={handleClearCart}>
                Clear Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;