import React, { createContext, useState, useContext, useEffect } from 'react';
import { fetchProducts, fetchCategories } from '../utils/api';

const ProductContext = createContext();

export const useProducts = () => useContext(ProductContext);

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  const [errors, setErrors] = useState({});
  
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(16);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    filterAndSortProducts();
    setCurrentPage(1);
  }, [products, searchTerm, selectedCategory, sortBy]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setErrors({});
      
      const [productsData, categoriesData] = await Promise.all([
        fetchProducts(),
        fetchCategories()
      ]);
      
      if (Array.isArray(productsData)) {
        setProducts(productsData);
        setFilteredProducts(productsData);
      } else {
        console.error('Invalid products data:', productsData);
        setProducts([]);
        setFilteredProducts([]);
      }
      
      let processedCategories = [];
      
      if (categoriesData && Array.isArray(categoriesData)) {
        processedCategories = categoriesData.map(item => {
          if (typeof item === 'string') return item.trim();
          
          if (item && typeof item === 'object') {
            const categoryName = item.name || item.category || item.title || item.value;
            return categoryName ? String(categoryName).trim() : '';
          }
          
          return String(item).trim();
        })
        .filter(cat => cat && cat !== '')
        .filter((cat, index, self) => self.indexOf(cat) === index);
        
        processedCategories.sort((a, b) => a.localeCompare(b));
      }
      
      if (processedCategories.length === 0) {
        processedCategories = ['Sports', 'Casual', 'Formal', 'Sneakers', 'Boots'];
      }
      
      console.log('✅ Categories (strings only):', processedCategories);
      setCategories(processedCategories);
      
    } catch (error) {
      console.error('Error loading products:', error);
      setErrors({ loadError: 'Failed to load products' });
      setProducts([]);
      setFilteredProducts([]);
      setCategories(['Sports', 'Casual', 'Formal']);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortProducts = () => {
    let result = [...products];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(product =>
        product.name?.toLowerCase().includes(term) ||
        product.description?.toLowerCase().includes(term) ||
        product.category?.toLowerCase().includes(term)
      );
    }

    if (selectedCategory !== 'all') {
      result = result.filter(product => product.category === selectedCategory);
    }

    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price-high':
        result.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'name-asc':
        result.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        break;
      case 'name-desc':
        result.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
        break;
      default:
        result.sort((a, b) => {
          if (a.isNew && !b.isNew) return -1;
          if (!a.isNew && b.isNew) return 1;
          return 0;
        });
        break;
    }

    setFilteredProducts(result);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const getCurrentProducts = () => {
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    return filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  };

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const addProduct = (product) => {
    setProducts(prev => [...prev, product]);
  };

  const updateProduct = (id, updatedData) => {
    setProducts(prev => prev.map(product =>
      product.id === id ? { ...product, ...updatedData } : product
    ));
  };

  const softDeleteProduct = (id) => {
    setProducts(prev => prev.map(product =>
      product.id === id ? { ...product, isActive: false } : product
    ));
  };

  const value = {
    products,
    filteredProducts,
    categories,
    loading,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    errors,
    addProduct,
    updateProduct,
    softDeleteProduct,
    refreshProducts: loadProducts,
    
    currentPage,
    totalPages,
    productsPerPage,
    currentProducts: getCurrentProducts(),
    handlePageChange,
    goToNextPage,
    goToPreviousPage
  };

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
};