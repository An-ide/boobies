import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './CartItem.css';

const Icons = {
  Minus: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  ),
  Plus: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  ),
  Trash: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
    </svg>
  ),
};

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  if (!item) {
    return <div className="ci ci-error">Item data is missing</div>;
  }

  const { id = '', name = 'Product', image, images = [], price = 0, quantity = 1 } = item;

  const imgSrc = image || images?.[0] || '';

  return (
    <div className="ci">
      <div className="ci-img">
        <Link to={`/product/${id}`}>
          <img
            src={imgSrc || `https://picsum.photos/seed/${id}/120/120`}
            alt={name}
            onError={(e) => { e.target.src = `https://picsum.photos/seed/${id}/120/120`; }}
          />
        </Link>
      </div>

      <div className="ci-body">
        <Link to={`/product/${id}`} className="ci-name">{name}</Link>
        <span className="ci-price">${typeof price === 'number' ? price.toFixed(2) : '0.00'}</span>
      </div>

      <div className="ci-qty">
        <button onClick={() => updateQuantity(id, Math.max(1, quantity - 1))} disabled={quantity <= 1}>
          <Icons.Minus />
        </button>
        <span>{quantity}</span>
        <button onClick={() => updateQuantity(id, quantity + 1)}>
          <Icons.Plus />
        </button>
      </div>

      <div className="ci-total">
        ${(typeof price === 'number' ? price * quantity : 0).toFixed(2)}
      </div>

      <button className="ci-remove" onClick={() => removeFromCart(id)} title="Remove">
        <Icons.Trash />
      </button>
    </div>
  );
};

export default CartItem;
