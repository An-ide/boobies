import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [isAdding, setIsAdding] = useState(false);
  const [imageError, setImageError] = useState(false);

  if (!product.isActive) return null;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      navigate('/login');
      return;
    }
    
    setIsAdding(true);
    addToCart(product, 1);
    setTimeout(() => setIsAdding(false), 1500);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const calculateDiscount = () => {
    if (product.originalPrice && product.originalPrice > product.price) {
      const discount = ((product.originalPrice - product.price) / product.originalPrice) * 100;
      return Math.round(discount);
    }
    return product.discount || 0;
  };

  const discount = calculateDiscount();

  const fallbackImage = 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop';

  return (
    <div className="product-card-premium">
      <Link to={`/products/${product.id}`} className="product-card-link">
        <div className="card-gallery">
          <div className="card-image-container">
            <img 
              src={imageError ? fallbackImage : (product.images?.[0] || product.image || fallbackImage)}
              alt={product.name}
              className="card-image"
              loading="lazy"
              onError={() => setImageError(true)}
            />
            
            {discount > 0 && (
              <div className="card-discount-badge">
                <span className="discount-percent">{discount}%</span>
                <span className="discount-label">OFF</span>
              </div>
            )}

            <div className="card-quick-view">
              <span>Quick View</span>
            </div>
          </div>
        </div>

        <div className="card-details">
          {product.articleCode && (
            <div className="card-article-code">{product.articleCode}</div>
          )}

          <h3 className="card-title">{product.name}</h3>

          {product.color && (
            <div className="card-color">
              <span className="color-label">Color:</span>
              <span className="color-value">{product.color}</span>
            </div>
          )}

          <div className="card-rating">
            <div className="rating-stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} className={`star ${star <= Math.round(product.rating || 4.3) ? 'filled' : ''}`}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill={star <= Math.round(product.rating || 4.3) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                </span>
              ))}
            </div>
            <span className="rating-count">({product.reviewCount || 127} reviews)</span>
          </div>

          <div className="card-price">
            <span className="current-price-large">
              {formatPrice(product.price || 99)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <>
                <span className="original-price-large">
                  {formatPrice(product.originalPrice)}
                </span>
                <span className="price-discount-tag">
                  {discount}% off
                </span>
              </>
            )}
          </div>

          {product.material && (
            <div className="card-material">
              <span className="material-tag">{product.material}</span>
            </div>
          )}

          <p className="card-description">
            {product.description?.split('.')[0] || 'Durable outsole with grippy treads for all outdoor adventure'}
          </p>
        </div>
      </Link>

      <button
        className={`card-add-button ${isAdding ? 'adding' : ''}`}
        onClick={handleAddToCart}
        disabled={isAdding}
      >
        <span className="button-icon">{isAdding 
          ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
          : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
        }</span>
        <span className="button-text">
          {isAdding ? 'ADDED TO CART' : 'ADD TO CART'}
        </span>
      </button>
    </div>
  );
};

export default ProductCard;