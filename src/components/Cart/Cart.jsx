import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import CartItem from './CartItem';
import './Cart.css';

const Icons = {
  Cart: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
      <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
    </svg>
  ),
  ArrowLeft: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
    </svg>
  ),
  ArrowRight: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
    </svg>
  ),
  Info: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
    </svg>
  ),
  Truck: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
      <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
    </svg>
  ),
  Return: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/>
    </svg>
  ),
  Shield: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  ),
  Tag: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/>
      <line x1="7" y1="7" x2="7.01" y2="7"/>
    </svg>
  ),
  AlertCircle: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  ),
};

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
      <div className="cart-empty-wrap">
        <div className="cart-empty">
          <div className="cart-empty-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
              <circle cx="9" cy="6" r="1" fill="currentColor"/>
              <circle cx="15" cy="6" r="1" fill="currentColor"/>
            </svg>
          </div>
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added anything yet. Browse our collection and find your pair.</p>
          <div className="cart-empty-suggestions">
            <span>Try:</span>
            <Link to="/products?category=Cowboy Boots">Cowboy Boots</Link>
            <Link to="/products?category=Work Boots">Work Boots</Link>
            <Link to="/products?category=Hiking">Hiking</Link>
          </div>
          <Link to="/products" className="cart-shop-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
            Browse Collection
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart">
      <div className="cart-inner">
        <div className="cart-top">
          <h1>
            <Icons.Cart />
            Cart
            <span className="cart-count">{getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'}</span>
          </h1>
          <button className="cart-clear-btn" onClick={() => setShowClearConfirm(true)}>Clear All</button>
        </div>

        <div className="cart-layout">
          <div className="cart-items">
            {cart.map(item => (
              <CartItem key={`${item.id}-${item.size}`} item={item} />
            ))}
            <Link to="/shop" className="cart-continue">
              <Icons.ArrowLeft />
              Continue Shopping
            </Link>
          </div>

          <div className="cart-summary">
            <div className="cart-summary-inner">
              <h3>Order Summary</h3>

              <div className="cs-row">
                <span>Subtotal ({getTotalItems()} items)</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {savings > 0 && (
                <div className="cs-row cs-savings">
                  <span>Savings</span>
                  <span>-${savings.toFixed(2)}</span>
                </div>
              )}
              <div className="cs-row">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="cs-row">
                <span>Tax (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>

              <div className="cs-divider" />

              <div className="cs-row cs-total">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>

              {subtotal < 50 && (
                <div className="cs-shipping-bar">
                  <div className="cs-shipping-bar-label">
                    <Icons.Truck />
                    Add ${(50 - subtotal).toFixed(2)} more for free shipping
                  </div>
                  <div className="cs-shipping-bar-track">
                    <div className="cs-shipping-bar-fill" style={{ width: `${Math.min((subtotal / 50) * 100, 100)}%` }} />
                  </div>
                </div>
              )}

              <Link to="/checkout" className="cs-checkout-btn">
                Checkout
                <Icons.ArrowRight />
              </Link>

              <div className="cs-promo">
                <div className="cs-promo-header">
                  <Icons.Tag />
                  Have a promo code?
                </div>
                <div className="cs-promo-input">
                  <input type="text" placeholder="Enter code" />
                  <button>Apply</button>
                </div>
              </div>

              <div className="cs-trust">
                <div className="cs-trust-item">
                  <Icons.Truck />
                  <div>
                    <strong>Free Shipping</strong>
                    <span>On orders over $50</span>
                  </div>
                </div>
                <div className="cs-trust-item">
                  <Icons.Return />
                  <div>
                    <strong>30-Day Returns</strong>
                    <span>No questions asked</span>
                  </div>
                </div>
                <div className="cs-trust-item">
                  <Icons.Shield />
                  <div>
                    <strong>Secure Checkout</strong>
                    <span>SSL encrypted</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showClearConfirm && (
        <div className="cart-overlay" onClick={() => setShowClearConfirm(false)}>
          <div className="cart-modal" onClick={e => e.stopPropagation()}>
            <div className="cart-modal-icon">
              <Icons.AlertCircle />
            </div>
            <h3>Clear Cart?</h3>
            <p>All {getTotalItems()} items will be removed from your cart.</p>
            <div className="cart-modal-actions">
              <button className="cart-modal-cancel" onClick={() => setShowClearConfirm(false)}>Cancel</button>
              <button className="cart-modal-confirm" onClick={handleClearCart}>Clear Cart</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
