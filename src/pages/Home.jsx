import React, { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import ProductList from '../components/Product/ProductList';
import { LoadingSpinner } from '../components/Common';
import './Home.css';

import heroBg1 from '../assets/images/hero-bg-1.jpg';
import heroBg2 from '../assets/images/hero-bg-2.jpg';
import heroBg3 from '../assets/images/hero-bg-3.jpg';
import heroBg4 from '../assets/images/hero-bg-4.jpg';
import heroBg5 from '../assets/images/hero-bg-5.jpg';
import heroBg6 from '../assets/images/hero-bg-6.jpg';
import heroBg7 from '../assets/images/hero-bg-7.jpg';
import heroBg8 from '../assets/images/hero-bg-8.jpg';

const Home = () => {
  const { products, loading } = useProducts();
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');
  const [currentSlide, setCurrentSlide] = useState(0);
  const timeoutRef = useRef(null);

  const heroSlides = [
    {
      id: 'image-1',
      src: heroBg1,
      alt: 'Sports shoes collection',
      title: 'Performance Unleashed',
      subtitle: 'Engineered for athletes who demand excellence'
    },
    {
      id: 'image-2',
      src: heroBg2,
      alt: 'Running shoes',
      title: 'Run with Passion',
      subtitle: 'Lightweight shoes for your daily runs'
    },
    {
      id: 'image-3',
      src: heroBg3,
      alt: 'Casual sneakers',
      title: 'Casual Comfort',
      subtitle: 'Style that feels as good as it looks'
    },
    {
      id: 'image-4',
      src: heroBg4,
      alt: 'Formal leather shoes',
      title: 'Business Class',
      subtitle: 'Professional elegance for the workplace'
    },
    {
      id: 'image-5',
      src: heroBg5,
      alt: 'Hiking boots',
      title: 'Adventure Awaits',
      subtitle: 'Built for the trails and beyond'
    },
    {
      id: 'image-6',
      src: heroBg6,
      alt: 'Limited edition sneakers',
      title: 'Limited Editions',
      subtitle: 'Exclusive designs for the discerning collector'
    },
    {
      id: 'image-7',
      src: heroBg7,
      alt: 'Comfort slippers',
      title: 'Home Comfort',
      subtitle: 'Relaxation starts from the ground up'
    },
    {
      id: 'image-8',
      src: heroBg8,
      alt: 'All shoe collection',
      title: 'Complete Collection',
      subtitle: 'Find your perfect pair among thousands'
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  useEffect(() => {
    clearTimeout(timeoutRef.current);
    
    timeoutRef.current = setTimeout(() => {
      nextSlide();
    }, 5000);

    return () => clearTimeout(timeoutRef.current);
  }, [currentSlide]);

  useEffect(() => {
    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, []);

  if (query) {
    return (
      <div className="search-results-page">
        <div className="container">
          <h1>Search Results for "{query}"</h1>
          <ProductList searchQuery={query} />
        </div>
      </div>
    );
  }

  const featuredProducts = products.slice(0, 6);
  const currentSlideData = heroSlides[currentSlide];

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-bg">
          {heroSlides.map((slide, index) => (
            <div
              key={slide.id}
              className={`slide ${index === currentSlide ? 'active' : ''}`}
            >
              <img
                className="hero-media"
                src={slide.src}
                alt={slide.alt}
                loading={index < 4 ? 'eager' : 'lazy'}
              />
            </div>
          ))}
        </div>

        <div className="hero-content">
          <h1>{currentSlideData.title}</h1>
          <p>{currentSlideData.subtitle}</p>
          <Link to="/products" className="btn-primary">
            Shop Now
          </Link>
        </div>

        <button className="nav-btn prev" onClick={prevSlide} aria-label="Previous slide">
          <svg width="24" height="24" viewBox="0 0 24 24">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <button className="nav-btn next" onClick={nextSlide} aria-label="Next slide">
          <svg width="24" height="24" viewBox="0 0 24 24">
            <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <div className="slide-dots">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              className={`dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      <section className="section featured-products">
        <div className="container">
          <div className="section-header">
            <h2>Featured Shoes</h2>
            <p>Handpicked collection of our best sellers</p>
          </div>
          
          <div className="featured-grid">
            {featuredProducts.map((product) => (
              <Link 
                key={product.id} 
                to={`/products/${product.id}`} 
                className="featured-card"
              >
                <div className="featured-image">
                  <img 
                    src={product.images?.[0] || 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop'} 
                    alt={product.name}
                    loading="lazy"
                  />
                  
                  {product.isNew && (
                    <span className="featured-badge new">New</span>
                  )}
                  {product.discount > 0 && (
                    <span className="featured-badge sale">-{product.discount}%</span>
                  )}
                </div>
                
                <div className="featured-info">
                  <h3 className="featured-title">{product.name}</h3>
                  <div className="featured-price-row">
                    <span className="featured-price">${product.price}</span>
                    {product.originalPrice && (
                      <span className="featured-original-price">${product.originalPrice}</span>
                    )}
                  </div>
                  <span className="featured-link">Shop Now →</span>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="text-center mt-4">
            <Link to="/products" className="btn-secondary">
              View All Products
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;