import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './CartItem.css';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();
  
  // Validate item exists and has required properties
  if (!item) {
    return (
      <div className="cart-item cart-item-error">
        <div className="error-message">Item data is missing</div>
      </div>
    );
  }

  // Destructure with default values to prevent undefined errors
  const {
    id = '',
    name = 'Unknown Product',
    images = [],
    category = 'Uncategorized',
    price = 0,
    quantity = 1
  } = item;

  const handleQuantityChange = (newQuantity) => {
    if (id && newQuantity >= 1) {
      updateQuantity(id, Math.max(1, newQuantity));
    }
  };

  const handleRemove = () => {
    if (id) {
      removeFromCart(id);
    }
  };

  return (
    <div className="cart-item">
      <div className="cart-item-image">
        <Link to={`/products/${id}`}>
          {/* Safe image access with fallback */}
          <img 
            src={images[0] || '/images/default-product.jpg'} 
            alt={name}
            onError={(e) => {
              e.target.src = '/images/default-product.jpg';
              e.target.onerror = null;
            }}
          />
        </Link>
      </div>
      
      <div className="cart-item-details">
        <Link to={`/products/${id}`}>
          <h3 className="cart-item-name">{name}</h3>
        </Link>
        <p className="cart-item-category">{category}</p>
        <div className="cart-item-price">
          {/* Safe price formatting */}
          ${typeof price === 'number' ? price.toFixed(2) : '0.00'}
        </div>
      </div>
      
      <div className="cart-item-quantity">
        <div className="quantity-controls">
          <button 
            onClick={() => handleQuantityChange(quantity - 1)}
            disabled={quantity <= 1}
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="quantity-value">{quantity}</span>
          <button 
            onClick={() => handleQuantityChange(quantity + 1)}
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
        <button 
          className="remove-item-btn"
          onClick={handleRemove}
          aria-label={`Remove ${name} from cart`}
        >
          Remove
        </button>
      </div>
      
      <div className="cart-item-total">
        {/* Safe total calculation */}
        ${(typeof price === 'number' ? price * quantity : 0).toFixed(2)}
      </div>
    </div>
  );
};

export default CartItem;