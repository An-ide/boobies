import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../../context/ProductContext';
import { LoadingSpinner } from '../Common';
import './AddEditProduct.css';

const Icons = {
  ArrowLeft: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
    </svg>
  ),
  Image: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
    </svg>
  ),
};

const AddEditProduct = () => {
  const navigate = useNavigate();
  const { categories, addProduct, refreshProducts } = useProducts();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: categories.length > 0 ? categories[0] : '',
    images: [''],
    stock: '10',
    isActive: true
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    else if (formData.name.length < 3) newErrors.name = 'Name must be at least 3 characters';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    else if (formData.description.length < 10) newErrors.description = 'Description must be at least 10 characters';
    if (!formData.price) newErrors.price = 'Price is required';
    else {
      const price = parseFloat(formData.price);
      if (isNaN(price) || price <= 0) newErrors.price = 'Price must be greater than 0';
      else if (price > 10000) newErrors.price = 'Price cannot exceed $10,000';
    }
    if (!formData.stock) newErrors.stock = 'Stock quantity is required';
    else {
      const stock = parseInt(formData.stock);
      if (isNaN(stock) || stock < 0) newErrors.stock = 'Stock must be 0 or greater';
      else if (stock > 10000) newErrors.stock = 'Stock cannot exceed 10,000';
    }
    if (!formData.category) newErrors.category = 'Category is required';
    const hasImage = formData.images.some(img => img.trim() !== '');
    if (!hasImage) newErrors.images = 'At least one image is required';
    return newErrors;
  };

  const isValidUrl = (string) => {
    try { const url = new URL(string); return url.protocol === 'http:' || url.protocol === 'https:'; }
    catch (_) { return false; }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleImageChange = (index, value) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData(prev => ({ ...prev, images: newImages }));
    if (errors.images) setErrors(prev => ({ ...prev, images: '' }));
  };

  const addImageField = () => {
    if (formData.images.length < 5) setFormData(prev => ({ ...prev, images: [...prev.images, ''] }));
  };

  const removeImageField = (index) => {
    if (formData.images.length > 1) {
      setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setLoading(true);
    try {
      const productData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        category: formData.category,
        images: formData.images.filter(img => img.trim() !== ''),
        stock: parseInt(formData.stock),
        isActive: formData.isActive,
        id: Date.now(),
        createdAt: new Date().toISOString()
      };
      addProduct(productData);
      await refreshProducts();
      navigate('/admin/products');
    } catch (error) {
      console.error('Error adding product:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="aep">
      <div className="aep-header">
        <div className="aep-header-left">
          <button className="aep-back-btn" onClick={() => navigate('/admin/products')}>
            <Icons.ArrowLeft />
          </button>
          <div>
            <h1>Add New Product</h1>
            <p className="aep-header-sub">Fill in the details below</p>
          </div>
        </div>
      </div>

      {Object.keys(errors).length > 0 && (
        <div className="aep-errors">
          <p>Please fix the following errors:</p>
          <ul>
            {Object.entries(errors).map(([key, msg]) => (
              <li key={key}>{msg}</li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit} className="aep-form" noValidate>
        <div className="aep-card">
          <h2>Product Information</h2>
          <div className="aep-grid">
            <div className="aep-field">
              <label>Product Name <span className="aep-req">*</span></label>
              <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Enter product name" className={errors.name ? 'has-error' : ''} />
              {errors.name && <span className="aep-error-text">{errors.name}</span>}
            </div>
            <div className="aep-field">
              <label>Category <span className="aep-req">*</span></label>
              <select name="category" value={formData.category} onChange={handleInputChange} className={errors.category ? 'has-error' : ''}>
                {categories.length > 0 ? categories.map((cat, i) => (
                  <option key={i} value={cat}>{cat}</option>
                )) : (
                  <>
                    <option value="Sports">Sports</option>
                    <option value="Casual">Casual</option>
                    <option value="Formal">Formal</option>
                  </>
                )}
              </select>
              {errors.category && <span className="aep-error-text">{errors.category}</span>}
            </div>
            <div className="aep-field">
              <label>Price ($) <span className="aep-req">*</span></label>
              <input type="number" name="price" value={formData.price} onChange={handleInputChange} placeholder="0.00" min="0" step="0.01" className={errors.price ? 'has-error' : ''} />
              {errors.price && <span className="aep-error-text">{errors.price}</span>}
            </div>
            <div className="aep-field">
              <label>Stock <span className="aep-req">*</span></label>
              <input type="number" name="stock" value={formData.stock} onChange={handleInputChange} placeholder="0" min="0" className={errors.stock ? 'has-error' : ''} />
              {errors.stock && <span className="aep-error-text">{errors.stock}</span>}
            </div>
          </div>
          <div className="aep-field">
            <label>Description <span className="aep-req">*</span></label>
            <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Enter product description (minimum 10 characters)" rows="4" className={errors.description ? 'has-error' : ''} />
            {errors.description && <span className="aep-error-text">{errors.description}</span>}
          </div>
        </div>

        <div className="aep-card">
          <h2>
            <Icons.Image />
            Product Images
          </h2>
          {errors.images && <div className="aep-banner-error">{errors.images}</div>}
          {formData.images.map((image, index) => (
            <div key={index} className="aep-img-block">
              <div className="aep-img-row">
                <input type="url" value={image} onChange={(e) => handleImageChange(index, e.target.value)} placeholder="https://example.com/image.jpg" />
                {formData.images.length > 1 && (
                  <button type="button" className="aep-img-remove" onClick={() => removeImageField(index)} disabled={loading}>Remove</button>
                )}
              </div>
              {image.trim() && isValidUrl(image) && (
                <div className="aep-img-preview">
                  <img src={image} alt={`Preview ${index + 1}`} onError={(e) => { e.target.style.display = 'none'; }} />
                </div>
              )}
            </div>
          ))}
          <button type="button" className="aep-img-add" onClick={addImageField} disabled={loading || formData.images.length >= 5}>
            + Add Another Image {formData.images.length >= 1 && `(${formData.images.length}/5)`}
          </button>
        </div>

        <div className="aep-card">
          <h2>Product Status</h2>
          <label className="aep-checkbox">
            <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleInputChange} />
            <div>
              <span className="aep-checkbox-title">Active</span>
              <span className="aep-checkbox-desc">Product will be visible to customers</span>
            </div>
          </label>
        </div>

        <div className="aep-form-actions">
          <button type="submit" className="aep-submit" disabled={loading}>
            {loading ? 'Adding Product...' : 'Add Product'}
          </button>
          <button type="button" className="aep-cancel" onClick={() => navigate('/admin/products')} disabled={loading}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEditProduct;
