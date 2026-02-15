import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../../context/ProductContext';
import { LoadingSpinner } from '../Common';
import './AddEditProduct.css';

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
    
    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    } else if (formData.name.length < 3) {
      newErrors.name = 'Name must be at least 3 characters';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }
    
    if (!formData.price) {
      newErrors.price = 'Price is required';
    } else {
      const price = parseFloat(formData.price);
      if (isNaN(price) || price <= 0) {
        newErrors.price = 'Price must be greater than 0';
      } else if (price > 10000) {
        newErrors.price = 'Price cannot exceed $10,000';
      }
    }
    
    if (!formData.stock) {
      newErrors.stock = 'Stock quantity is required';
    } else {
      const stock = parseInt(formData.stock);
      if (isNaN(stock) || stock < 0) {
        newErrors.stock = 'Stock must be 0 or greater';
      } else if (stock > 10000) {
        newErrors.stock = 'Stock cannot exceed 10,000';
      }
    }
    
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    
    formData.images.forEach((image, index) => {
      if (image.trim() && !isValidUrl(image)) {
        newErrors[`image${index}`] = 'Please enter a valid URL';
      }
    });
    
    const hasImage = formData.images.some(img => img.trim() !== '');
    if (!hasImage) {
      newErrors.images = 'At least one image is required';
    }
    
    return newErrors;
  };
  
  const isValidUrl = (string) => {
    try {
      const url = new URL(string);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch (_) {
      return false;
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = (index, value) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData(prev => ({ ...prev, images: newImages }));
    
    if (errors[`image${index}`]) {
      setErrors(prev => ({ ...prev, [`image${index}`]: '' }));
    }
    if (errors.images) {
      setErrors(prev => ({ ...prev, images: '' }));
    }
  };

  const addImageField = () => {
    if (formData.images.length < 5) {
      setFormData(prev => ({ ...prev, images: [...prev.images, ''] }));
    }
  };

  const removeImageField = (index) => {
    if (formData.images.length > 1) {
      const newImages = formData.images.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, images: newImages }));
      
      const newErrors = { ...errors };
      delete newErrors[`image${index}`];
      setErrors(newErrors);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted');
    
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
      
      console.log('Product data to save:', productData);
      
      alert('Product added successfully!');
      await refreshProducts();
      navigate('/admin/products');
      
    } catch (error) {
      console.error('Error adding product:', error);
      alert(`Error: ${error.message || 'Failed to add product'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/products');
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="add-edit-product">
      <div className="product-form-header">
        <h1>Add New Product</h1>
        <button onClick={handleCancel} className="cancel-btn">
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="product-form" noValidate>
        {Object.keys(errors).length > 0 && (
          <div className="form-errors">
            <p>Please fix the following errors:</p>
            <ul>
              {Object.entries(errors).map(([key, message]) => (
                <li key={key}>{message}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="form-section">
          <h2>Product Information</h2>
          
          <div className="form-group">
            <label htmlFor="name">
              Product Name <span className="required">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter product name"
              required
              className={errors.name ? 'error' : ''}
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="description">
              Description <span className="required">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter product description (minimum 10 characters)"
              rows="4"
              required
              className={errors.description ? 'error' : ''}
            />
            {errors.description && <span className="error-message">{errors.description}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="price">
                Price ($) <span className="required">*</span>
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="0.00"
                min="0"
                step="0.01"
                required
                className={errors.price ? 'error' : ''}
              />
              {errors.price && <span className="error-message">{errors.price}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="stock">
                Stock Quantity <span className="required">*</span>
              </label>
              <input
                type="number"
                id="stock"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                placeholder="0"
                min="0"
                required
                className={errors.stock ? 'error' : ''}
              />
              {errors.stock && <span className="error-message">{errors.stock}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="category">
              Category <span className="required">*</span>
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
              className={errors.category ? 'error' : ''}
            >
              {categories.length > 0 ? (
                categories.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))
              ) : (
                <>
                  <option value="Sports">Sports</option>
                  <option value="Casual">Casual</option>
                  <option value="Formal">Formal</option>
                </>
              )}
            </select>
            {errors.category && <span className="error-message">{errors.category}</span>}
          </div>
        </div>

        <div className="form-section">
          <h2>Product Images</h2>
          {errors.images && (
            <div className="image-error">
              {errors.images}
            </div>
          )}
          
          {formData.images.map((image, index) => (
            <div key={index} className="image-input-group">
              <div className="form-group">
                <label htmlFor={`image-${index}`}>
                  Image URL {index + 1}
                  {index === 0 && ' *'}
                </label>
                <div className="image-input-wrapper">
                  <input
                    type="url"
                    id={`image-${index}`}
                    value={image}
                    onChange={(e) => handleImageChange(index, e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className={errors[`image${index}`] ? 'error' : ''}
                  />
                  {formData.images.length > 1 && (
                    <button
                      type="button"
                      className="remove-image-btn"
                      onClick={() => removeImageField(index)}
                      disabled={loading}
                    >
                      Remove
                    </button>
                  )}
                </div>
                {errors[`image${index}`] && (
                  <span className="error-message">{errors[`image${index}`]}</span>
                )}
                
                {image.trim() && isValidUrl(image) && (
                  <div className="image-preview">
                    <p>Preview:</p>
                    <img 
                      src={image} 
                      alt={`Preview ${index + 1}`} 
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML += '<p style="color:#ff6b6b">Image failed to load</p>';
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          ))}

          <button
            type="button"
            className="add-image-btn"
            onClick={addImageField}
            disabled={loading || formData.images.length >= 5}
          >
            + Add Another Image (Max 5)
          </button>
        </div>

        <div className="form-section">
          <h2>Product Status</h2>
          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleInputChange}
              />
              <span className="checkbox-text">Active (Product will be visible to customers)</span>
            </label>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="submit-btn"
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Add Product'}
          </button>
          <button
            type="button"
            className="cancel-btn"
            onClick={handleCancel}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEditProduct;