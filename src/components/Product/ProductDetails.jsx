import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { fetchProductById } from '../../utils/api';
import { LoadingSpinner } from '../Common';
import './ProductDetails.css';

const ProductDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'instant'
    });
  }, []);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'instant'
    });
  }, [id]);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const data = await fetchProductById(id);
      setProduct(data);
    } catch (error) {
      console.error('Error loading product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!user) {
      window.location.href = '/login';
      return;
    }
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    if (!user) {
      window.location.href = '/login';
      return;
    }
    addToCart(product, quantity);
    window.location.href = '/checkout';
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
    if (product?.originalPrice && product?.originalPrice > product?.price) {
      const discount = ((product.originalPrice - product.price) / product.originalPrice) * 100;
      return Math.round(discount);
    }
    return product?.discount || 0;
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!product || !product.isActive) {
    return (
      <div className="product-not-found">
        <h2>Product not found</h2>
      </div>
    );
  }

  const discount = calculateDiscount();
  const images = product.images || [product.image];

  return (
    <div className="product-details-wrapper">
      <div className="product-details-container">
        <div className="product-details-grid">
          <div className="product-images-section">
            <div className="main-image-container">
              <img 
                src={images[selectedImage]} 
                alt={product.name} 
                className="main-product-image"
              />
              
              {discount > 0 && (
                <div className="discount-badge">
                  <span className="discount-percent">{discount}%</span>
                  <span className="discount-label">OFF</span>
                </div>
              )}
            </div>

            {images.length > 1 && (
              <div className="thumbnail-strip">
                {images.map((image, index) => (
                  <div 
                    key={index}
                    className={`thumbnail-item ${selectedImage === index ? 'active' : ''}`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img src={image} alt={`${product.name} view ${index + 1}`} />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="product-info-section">
            <div className="product-category">{product.category}</div>

            <h1 className="product-title">{product.name}</h1>

            <div className="product-rating">
              <div className="rating-stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star} className={`star ${star <= (product.rating || 4.5) ? 'filled' : ''}`}>
                    ★
                  </span>
                ))}
              </div>
              <span className="rating-count">{product.reviewCount || 127} reviews</span>
            </div>

            <div className="price-section">
              <span className="current-price">{formatPrice(product.price)}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <>
                  <span className="original-price">{formatPrice(product.originalPrice)}</span>
                  <span className="discount-tag">{discount}% off</span>
                </>
              )}
            </div>

            <div className="description-section">
              <h3>Description</h3>
              <p className="product-description">{product.description}</p>
            </div>

            <div className="quantity-selector">
              <label>Quantity:</label>
              <div className="quantity-controls">
                <button
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  disabled={quantity <= 1}
                  className="quantity-btn"
                >
                  −
                </button>
                <span className="quantity-value">{quantity}</span>
                <button
                  onClick={() => setQuantity(prev => prev + 1)}
                  className="quantity-btn"
                >
                  +
                </button>
              </div>
            </div>

            <div className="action-buttons">
              <button className="add-to-cart-btn" onClick={handleAddToCart}>
                Add to Cart
              </button>
              <button className="buy-now-btn" onClick={handleBuyNow}>
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;