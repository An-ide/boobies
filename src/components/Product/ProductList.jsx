import React, { useState, useEffect } from 'react';
import { useProducts } from '../../context/ProductContext';
import ProductCard from './ProductCard';
import LoadingSpinner from '../Common/LoadingSpinner';
import { useLocation } from 'react-router-dom';
import './ProductList.css';

const ProductList = () => {
  const { 
    filteredProducts, 
    loading, 
    categories,
    currentPage,
    totalPages,
    currentProducts,
    handlePageChange,
    goToNextPage,
    goToPreviousPage
  } = useProducts();
  
  const [sortBy, setSortBy] = useState('featured');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [minRating, setMinRating] = useState(0);
  const [filteredAndSorted, setFilteredAndSorted] = useState([]);
  
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get('search') || '';
  const categoryQuery = queryParams.get('category') || '';
  
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') setShowFilters(false);
    };
    
    const handleClickOutside = (e) => {
      if (showFilters && !e.target.closest('.filter-sidebar') && 
          !e.target.closest('.filter-toggle')) {
        setShowFilters(false);
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    document.addEventListener('click', handleClickOutside);
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showFilters]);
  
  useEffect(() => {
    if (categoryQuery && categories.includes(categoryQuery)) {
      setSelectedCategories([categoryQuery]);
    }
  }, [categoryQuery, categories]);

  useEffect(() => {
    const filtered = filterAndSortProducts();
    setFilteredAndSorted(filtered);
    if (handlePageChange) handlePageChange(1);
  }, [filteredProducts, searchQuery, selectedCategories, minRating, priceRange, sortBy]);

  const handleCategoryToggle = (category) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handlePriceChange = (e, index) => {
    const value = parseInt(e.target.value);
    const newRange = [...priceRange];
    newRange[index] = value;
    
    if (index === 0 && value > priceRange[1]) {
      newRange[1] = value;
    }
    if (index === 1 && value < priceRange[0]) {
      newRange[0] = value;
    }
    
    setPriceRange(newRange);
  };

  const filterAndSortProducts = () => {
    let products = [...filteredProducts];
    
    if (searchQuery) {
      products = products.filter(product => 
        product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.tags && product.tags.some(tag => 
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        )) ||
        product.category?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (selectedCategories.length > 0) {
      products = products.filter(product => 
        selectedCategories.includes(product.category)
      );
    }
    
    if (minRating > 0) {
      products = products.filter(product => 
        (product.rating || 0) >= minRating
      );
    }
    
    products = products.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );
    
    switch(sortBy) {
      case 'price-low':
        return products.sort((a, b) => (a.price || 0) - (b.price || 0));
      case 'price-high':
        return products.sort((a, b) => (b.price || 0) - (a.price || 0));
      case 'rating':
        return products.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      default:
        return products;
    }
  };

  const totalProducts = filteredAndSorted.length;

  const getCurrentPageProducts = () => {
    const startIndex = (currentPage - 1) * 12;
    const endIndex = startIndex + 12;
    return filteredAndSorted.slice(startIndex, endIndex);
  };

  const displayProducts = getCurrentPageProducts();

  const resetFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, 1000]);
    setMinRating(0);
    setSortBy('featured');
  };

  const clearSearch = () => {
    const params = new URLSearchParams(location.search);
    params.delete('search');
    window.location.href = '/products?' + params.toString();
  };

  const FilterIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
    </svg>
  );

  const SortIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  );

  const CloseIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  );

  const SearchIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="product-list-container">
      <div className="products-header">
        <div className="header-content">
          {searchQuery ? (
            <>
              <h1>Search Results</h1>
              <div className="search-results-info">
                <p className="products-count">{totalProducts} items found for "{searchQuery}"</p>
                <button 
                  className="clear-search-btn"
                  onClick={clearSearch}
                >
                  Clear Search
                </button>
              </div>
            </>
          ) : (
            <>
              <h1>Our Products</h1>
              <p className="products-count">{totalProducts} items found</p>
            </>
          )}
        </div>
        
        <div className="header-controls">
          {searchQuery && (
            <div className="search-indicator">
              <SearchIcon />
              <span>Searching: "{searchQuery}"</span>
            </div>
          )}
          
          <button 
            className={`filter-toggle ${showFilters ? 'active' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              setShowFilters(!showFilters);
            }}
          >
            <FilterIcon />
            <span>Filter</span>
            {(selectedCategories.length > 0 || minRating > 0 || priceRange[0] > 0 || priceRange[1] < 1000) && (
              <span className="filter-indicator"></span>
            )}
          </button>
          
          <div className="sort-container">
            <SortIcon />
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>
      </div>

      {showFilters && (
        <div className="filter-overlay" onClick={() => setShowFilters(false)}></div>
      )}

      <div className={`filter-panel ${showFilters ? 'open' : ''}`}>
        <div className="filter-panel-header">
          <div className="filter-panel-title">
            <FilterIcon />
            <h3>Filters</h3>
          </div>
          <div className="filter-panel-actions">
            {(selectedCategories.length > 0 || minRating > 0 || priceRange[0] > 0 || priceRange[1] < 1000) && (
              <button className="filter-clear-all" onClick={resetFilters}>Clear All</button>
            )}
            <button className="filter-done" onClick={() => setShowFilters(false)}>Done</button>
          </div>
        </div>

        <div className="filter-panel-body">
          {(searchQuery || selectedCategories.length > 0 || minRating > 0 || priceRange[0] > 0 || priceRange[1] < 1000) && (
            <div className="active-tags">
              {searchQuery && (
                <span className="active-tag">
                  "{searchQuery}"
                  <button onClick={clearSearch}><CloseIcon /></button>
                </span>
              )}
              {selectedCategories.map(cat => (
                <span key={cat} className="active-tag">
                  {cat}
                  <button onClick={() => handleCategoryToggle(cat)}><CloseIcon /></button>
                </span>
              ))}
              {minRating > 0 && (
                <span className="active-tag">
                  {minRating}+ stars
                  <button onClick={() => setMinRating(0)}><CloseIcon /></button>
                </span>
              )}
              {(priceRange[0] > 0 || priceRange[1] < 1000) && (
                <span className="active-tag">
                  ${priceRange[0]}-${priceRange[1]}
                  <button onClick={() => setPriceRange([0, 1000])}><CloseIcon /></button>
                </span>
              )}
            </div>
          )}

          <div className="filter-panel-grid">
            {categories && categories.length > 0 && (
              <div className="filter-block">
                <h4>Category</h4>
                <div className="filter-pills">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      className={`filter-pill ${selectedCategories.includes(cat) ? 'active' : ''}`}
                      onClick={() => handleCategoryToggle(cat)}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="filter-block">
              <h4>Price</h4>
              <div className="filter-price">
                <div className="filter-price-inputs">
                  <div className="filter-price-field">
                    <span className="filter-price-currency">$</span>
                    <input type="number" min="0" max="1000" value={priceRange[0]} onChange={(e) => handlePriceChange(e, 0)} />
                  </div>
                  <span className="filter-price-to">to</span>
                  <div className="filter-price-field">
                    <span className="filter-price-currency">$</span>
                    <input type="number" min="0" max="1000" value={priceRange[1]} onChange={(e) => handlePriceChange(e, 1)} />
                  </div>
                </div>
                <div className="filter-price-slider">
                  <div className="filter-price-track">
                    <div className="filter-price-fill" style={{ left: `${(priceRange[0] / 1000) * 100}%`, width: `${((priceRange[1] - priceRange[0]) / 1000) * 100}%` }}></div>
                  </div>
                  <input type="range" min="0" max="1000" value={priceRange[0]} onChange={(e) => handlePriceChange(e, 0)} className="filter-range-input" />
                  <input type="range" min="0" max="1000" value={priceRange[1]} onChange={(e) => handlePriceChange(e, 1)} className="filter-range-input" />
                </div>
                <div className="filter-price-labels">
                  <span>$0</span>
                  <span>$500</span>
                  <span>$1,000+</span>
                </div>
              </div>
            </div>

            <div className="filter-block">
              <h4>Rating</h4>
              <div className="filter-ratings">
                {[5, 4, 3, 2].map(rating => (
                  <button
                    key={rating}
                    className={`filter-rating-btn ${minRating === rating ? 'active' : ''}`}
                    onClick={() => setMinRating(minRating === rating ? 0 : rating)}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                    <span>{rating}</span>
                  </button>
                ))}
                <button
                  className={`filter-rating-btn ${minRating === 0 ? 'active' : ''}`}
                  onClick={() => setMinRating(0)}
                >
                  Any
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="products-grid">
        {displayProducts.length > 0 ? (
          displayProducts.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product}
            />
          ))
        ) : (
          <div className="no-products">
            <div className="empty-state">
              <div className="empty-icon"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 17h16a1 1 0 0 0 1-1v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2a1 1 0 0 0 1 1z"/><path d="M6 10V6a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v4"/><path d="M16 10V6a2 2 0 0 0-2-2h-1a2 2 0 0 0-2 2v4"/><path d="M2 17v2a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1v-2"/></svg></div>
              <h3>No Products Found</h3>
              <p>{searchQuery ? `No products found for "${searchQuery}"` : 'Try adjusting your filters'}</p>
              <div className="empty-actions">
                {searchQuery && (
                  <button 
                    className="clear-btn"
                    onClick={clearSearch}
                  >
                    Clear Search
                  </button>
                )}
                <button 
                  className="clear-btn"
                  onClick={resetFilters}
                >
                  Reset All Filters
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {totalProducts > 0 && Math.ceil(totalProducts / 12) > 1 && (
        <div className="pagination">
          <button 
            className="page-btn prev" 
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          
          <div className="page-numbers">
            {[...Array(Math.ceil(totalProducts / 12))].map((_, index) => {
              const pageNumber = index + 1;
              if (
                pageNumber === 1 ||
                pageNumber === Math.ceil(totalProducts / 12) ||
                (pageNumber >= currentPage - 2 && pageNumber <= currentPage + 2)
              ) {
                return (
                  <button
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    className={`page-number ${currentPage === pageNumber ? 'active' : ''}`}
                  >
                    {pageNumber}
                  </button>
                );
              } else if (
                pageNumber === currentPage - 3 ||
                pageNumber === currentPage + 3
              ) {
                return <span key={pageNumber} className="page-ellipsis">...</span>;
              }
              return null;
            })}
          </div>
          
          <button 
            className="page-btn next"
            onClick={goToNextPage}
            disabled={currentPage === Math.ceil(totalProducts / 12)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductList;