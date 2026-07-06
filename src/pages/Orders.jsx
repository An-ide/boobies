import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LoadingSpinner } from '../components/Common';
import './Orders.css';

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, [user]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      
      const userOrders = user ? allOrders.filter(order => order.userId === user.id) : [];
      
      userOrders.sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt));
      
      setOrders(userOrders);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return (
      <div className="orders-page">
        <div className="orders-empty-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
          </svg>
          <h2>Sign in required</h2>
          <p>Please sign in to view your orders.</p>
          <Link to="/login" className="orders-btn">Sign In</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="orders-top">
        <h1>My Orders</h1>
        <Link to="/products" className="orders-shop-link">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
          </svg>
          Continue Shopping
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="orders-empty-state">
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/>
            <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>
          </svg>
          <h2>No orders yet</h2>
          <p>Start shopping to see your orders here!</p>
          <Link to="/products" className="orders-btn">Browse Products</Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map(order => (
            <div key={order.id} className="order-card">
              <div className="order-card-top">
                <div className="order-card-info">
                  <span className="order-card-id">Order #{order.id}</span>
                  <span className="order-card-date">
                    {new Date(order.date || order.createdAt || new Date()).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
                </div>
                <div className="order-card-right">
                  <span className={`order-badge ${order.status || 'completed'}`}>
                    {order.status || 'Completed'}
                  </span>
                  <span className="order-card-total">${(order.total || 0).toFixed(2)}</span>
                </div>
              </div>
              {order.items && order.items.length > 0 && (
                <div className="order-card-items">
                  {order.items.map((item, i) => (
                    <div key={item.id || i} className="order-card-item">
                      <div className="order-card-item-img">
                        <img
                          src={item.image || item.images?.[0] || `https://picsum.photos/seed/${item.id || i}/48/48`}
                          alt={item.name}
                          onError={(e) => { e.target.src = `https://picsum.photos/seed/${item.id || i}/48/48`; }}
                        />
                      </div>
                      <div className="order-card-item-info">
                        <span className="order-card-item-name">{item.name}</span>
                        <span className="order-card-item-meta">Qty: {item.quantity} &middot; ${item.price?.toFixed(2)} each</span>
                      </div>
                      <span className="order-card-item-total">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}
              {order.shippingAddress && (
                <div className="order-card-address">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                  </svg>
                  <span>{order.shippingAddress.address}, {order.shippingAddress.city} {order.shippingAddress.zipCode}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;