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
      <div className="orders-container">
        <h1>My Orders</h1>
        <p>Please log in to view your orders.</p>
        <Link to="/login" className="btn-primary">Sign In</Link>
      </div>
    );
  }

  return (
    <div className="orders-container">
      <h1>My Orders</h1>
      
      {orders.length === 0 ? (
        <div className="no-orders">
          <h2>No orders yet</h2>
          <p>Start shopping to see your orders here!</p>
          <Link to="/products" className="btn-primary">Browse Products</Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map(order => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div>
                  <h3>Order #{order.id}</h3>
                  <p className="order-date">
                    {new Date(order.date || order.createdAt || new Date()).toLocaleDateString()}
                  </p>
                </div>
                <div className="order-status">
                  <span className={`status-badge ${order.status || 'completed'}`}>
                    {order.status || 'Completed'}
                  </span>
                  <div className="order-total">
                    Total: ${(order.total || 0).toFixed(2)}
                  </div>
                </div>
              </div>
              
              <div className="order-items">
                <h4>Items:</h4>
                {order.items && order.items.map(item => (
                  <div key={item.id} className="order-item">
                    <div className="order-item-info">
                      <span className="order-item-name">{item.name}</span>
                      <span className="order-item-quantity">x{item.quantity}</span>
                    </div>
                    <div className="order-item-price">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
              
              {order.shippingAddress && (
                <div className="order-shipping">
                  <h4>Shipping Address:</h4>
                  <p>{order.shippingAddress.address}</p>
                  <p>{order.shippingAddress.city}, {order.shippingAddress.zipCode}</p>
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