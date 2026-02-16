import React from 'react';
import { useProducts } from '../../context/ProductContext';
import './Filters.css';

const Filters = ({ categories }) => {
  const { selectedCategory, setSelectedCategory, sortBy, setSortBy } = useProducts();

  // Handle both string and object categories
  const getCategoryName = (category) => {
    if (typeof category === 'string') return category;
    if (category && typeof category === 'object') return category.name || category.category || '';
    return String(category);
  };

  return (
    <div className="filters-container">
      <div className="filter-group">
        <label htmlFor="category">Category:</label>
        <select
          id="category"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Categories</option>
          {categories.map((category, index) => {
            const categoryName = getCategoryName(category);
            const categoryValue = typeof category === 'object' ? category.name : category;
            
            return (
              <option 
                key={typeof category === 'object' ? category.id || index : category} 
                value={categoryValue}
              >
                {categoryName}
              </option>
            );
          })}
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="sort">Sort By:</label>
        <select
          id="sort"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="filter-select"
        >
          <option value="default">Default</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="name-asc">Name: A to Z</option>
          <option value="name-desc">Name: Z to A</option>
        </select>
      </div>
    </div>
  );
};

export default Filters;