import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useProducts } from '../../context/ProductContext';
import { fetchProductById } from '../../utils/api';
import { LoadingSpinner } from '../Common';
import './ProductDetails.css';

const Icons = {
  Star: ({ filled }) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? '#f59e0b' : 'none'} stroke="#f59e0b" strokeWidth="1.5">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  ),
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
  Cart: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
      <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
    </svg>
  ),
  Bolt: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  ),
  Check: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  Truck: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
      <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
    </svg>
  ),
  Return: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/>
    </svg>
  ),
  Shield: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  ),
  ChevronRight: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  ),
};

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { products } = useProducts();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);
  useEffect(() => {
    window.scrollTo({ top: 0 });
    setSelectedImage(0);
    setQuantity(1);
    (async () => {
      try {
        setLoading(true);
        const data = await fetchProductById(id);
        if (data && data.isActive !== false) {
          setProduct(data);
        } else {
          const fb = Array.isArray(products) ? products.find(p => String(p.id) === id) : null;
          setProduct(fb && fb.isActive !== false ? fb : null);
        }
      } catch {
        const fb = Array.isArray(products) ? products.find(p => String(p.id) === id) : null;
        setProduct(fb && fb.isActive !== false ? fb : null);
      } finally {
        setLoading(false);
      }
    })();
  }, [id, products]);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2500);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/checkout');
  };

  if (loading) return <LoadingSpinner />;

  if (!product) {
    return (
      <div className="pdp-404">
        <h2>Product not found</h2>
        <Link to="/shop" className="pdp-back-link">Back to Shop</Link>
      </div>
    );
  }

  const images = [];
  if (product.image) images.push(product.image);
  if (product.images && Array.isArray(product.images)) {
    product.images.forEach(img => { if (!images.includes(img)) images.push(img); });
  }
  if (images.length === 0) images.push(`https://picsum.photos/seed/${product.id}/800/900`);

  const discount = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : (product.discount || 0);

  const specs = product.specs || [
    { label: 'Material', value: 'Premium Leather' },
    { label: 'Sole', value: 'Rubber' },
    { label: 'Closure', value: 'Lace-up' },
  ];

  const related = Array.isArray(products)
    ? products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4)
    : [];

  return (
    <div className="pdp">
      <div className="pdp-inner">
        <div className="pdp-breadcrumb">
          <Link to="/shop">Shop</Link>
          <Icons.ChevronRight />
          <span>{product.category}</span>
          <Icons.ChevronRight />
          <span>{product.name}</span>
        </div>

        <div className="pdp-layout">
          <div className="pdp-gallery">
            <div className="pdp-main-img">
              <div className="pdp-main-img-bg" style={{ backgroundImage: `url(${images[selectedImage]})` }} />
              <img src={images[selectedImage]} alt={product.name} />
              {discount > 0 && <div className="pdp-badge">-{discount}%</div>}
              {product.stock > 0 && product.stock < 10 && (
                <div className="pdp-badge pdp-badge--low">Only {product.stock} left</div>
              )}
            </div>
            {images.length > 1 && (
              <div className="pdp-thumbs">
                {images.map((img, i) => (
                  <button key={i} className={`pdp-thumb ${selectedImage === i ? 'active' : ''}`} onClick={() => setSelectedImage(i)}>
                    <img src={img} alt="" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="pdp-info">
            <div className="pdp-info-header">
              <span className="pdp-cat">{product.category}</span>
              <div className="pdp-rating">
                {[1,2,3,4,5].map(i => <Icons.Star key={i} filled={i <= Math.round(product.rating || 4.5)} />)}
                <span className="pdp-rating-num">{product.rating || '4.5'}</span>
                <span className="pdp-rating-count">({product.reviewCount || 127} reviews)</span>
              </div>
            </div>

            <h1 className="pdp-title">{product.name}</h1>

            <div className="pdp-price">
              <span className="pdp-price-current">${product.price?.toFixed(2)}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <>
                  <span className="pdp-price-old">${product.originalPrice.toFixed(2)}</span>
                  <span className="pdp-price-badge">Save {discount}%</span>
                </>
              )}
            </div>

            <p className="pdp-desc">{product.description}</p>

            <div className="pdp-qty">
              <span className="pdp-label">Quantity</span>
              <div className="pdp-qty-row">
                <button className="pdp-qty-btn" onClick={() => setQuantity(q => Math.max(1, q - 1))} disabled={quantity <= 1}>
                  <Icons.Minus />
                </button>
                <span className="pdp-qty-val">{quantity}</span>
                <button className="pdp-qty-btn" onClick={() => setQuantity(q => q + 1)}>
                  <Icons.Plus />
                </button>
              </div>
            </div>

            <div className="pdp-stock">
              <Icons.Check />
              <span>In Stock — Free shipping over $50</span>
            </div>

            <div className="pdp-actions">
              <button className="pdp-btn pdp-btn--primary" onClick={handleAddToCart} disabled={addedToCart || product.stock <= 0}>
                <Icons.Cart />
                {addedToCart ? 'Added to Cart' : 'Add to Cart'}
              </button>
              <button className="pdp-btn pdp-btn--secondary" onClick={handleBuyNow} disabled={product.stock <= 0}>
                <Icons.Bolt />
                Buy Now
              </button>
            </div>

            <div className="pdp-usp">
              <div className="pdp-usp-item">
                <Icons.Truck />
                <span>Free shipping on orders over $50</span>
              </div>
              <div className="pdp-usp-item">
                <Icons.Return />
                <span>30-day easy returns</span>
              </div>
              <div className="pdp-usp-item">
                <Icons.Shield />
                <span>Secure checkout</span>
              </div>
            </div>

            <div className="pdp-specs">
              <h3>Specifications</h3>
              <div className="pdp-specs-grid">
                {specs.map((s, i) => (
                  <div key={i} className="pdp-spec">
                    <span className="pdp-spec-l">{s.label}</span>
                    <span className="pdp-spec-v">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <div className="pdp-related">
            <div className="pdp-related-header">
              <h2>Complete the look</h2>
              <Link to="/shop" className="pdp-related-link">View all <Icons.ChevronRight /></Link>
            </div>
            <div className="pdp-related-grid">
              {related.map(p => (
                <Link key={p.id} to={`/product/${p.id}`} className="pdp-related-card">
                  <div className="pdp-related-img">
                    <img src={p.image || p.images?.[0] || `https://picsum.photos/seed/${p.id}/300/300`} alt={p.name} />
                  </div>
                  <div className="pdp-related-body">
                    <span className="pdp-related-name">{p.name}</span>
                    <span className="pdp-related-price">${p.price?.toFixed(2)}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
