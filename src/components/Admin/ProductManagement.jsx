import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../../context/ProductContext';
import { addProduct, updateProduct } from '../../utils/api';
import { LoadingSpinner } from '../Common';
import './ProductManagement.css';

const Icons = {
  Plus: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  ),
  Edit: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  ),
  Trash: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
    </svg>
  ),
  ArrowLeft: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
    </svg>
  ),
  Close: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
};

const ProductManagement = () => {
  const { products, categories, loading, refreshProducts, softDeleteProduct } = useProducts();
  const [editingProduct, setEditingProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    images: [''],
    stock: '',
    isActive: true
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (index, value) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const addImageField = () => {
    setFormData(prev => ({ ...prev, images: [...prev.images, ''] }));
  };

  const removeImageField = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      images: formData.images.filter(img => img.trim() !== '')
    };
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, productData);
      } else {
        await addProduct(productData);
      }
      await refreshProducts();
      resetForm();
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      images: product.images,
      stock: product.stock,
      isActive: product.isActive
    });
    setShowForm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await softDeleteProduct(deleteTarget);
      setDeleteTarget(null);
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      images: [''],
      stock: '',
      isActive: true
    });
    setEditingProduct(null);
    setShowForm(false);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="pm">
      <div className="pm-header">
        <div className="pm-header-left">
          <Link to="/admin" className="pm-back-btn">
            <Icons.ArrowLeft />
          </Link>
          <div>
            <h1>Product Management</h1>
            <p className="pm-header-sub">{products.length} products total</p>
          </div>
        </div>
        <button className="pm-add-btn" onClick={() => setShowForm(true)}>
          <Icons.Plus />
          Add Product
        </button>
      </div>

      <div className="pm-table-wrap">
        <table className="pm-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id}>
                <td>
                  <div className="pm-product-cell">
                    <div className="pm-product-thumb">
                      {product.image || (product.images && product.images[0]) ? (
                        <img src={product.image || product.images[0]} alt={product.name} />
                      ) : (
                        product.name?.charAt(0)?.toUpperCase() || 'P'
                      )}
                    </div>
                    <div>
                      <span className="pm-product-name">{product.name}</span>
                      <span className="pm-product-id">ID: {product.id}</span>
                    </div>
                  </div>
                </td>
                <td><span className="pm-cat-badge">{product.category}</span></td>
                <td className="pm-price-cell">${product.price?.toFixed(2)}</td>
                <td>
                  <span className={`pm-stock-badge ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                    {product.stock}
                  </span>
                </td>
                <td>
                  <span className={`pm-status-badge ${product.isActive ? 'active' : 'inactive'}`}>
                    {product.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>
                  <div className="pm-actions">
                    <button className="pm-action-btn edit" onClick={() => handleEdit(product)} title="Edit">
                      <Icons.Edit />
                    </button>
                    <button className="pm-action-btn delete" onClick={() => setDeleteTarget(product.id)} title={product.isActive ? 'Deactivate' : 'Activate'}>
                      <Icons.Trash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && (
          <div className="pm-empty">
            <p>No products found.</p>
          </div>
        )}
      </div>

      {showForm && (
        <div className="pm-overlay" onClick={() => setShowForm(false)}>
          <div className="pm-modal" onClick={e => e.stopPropagation()}>
            <div className="pm-modal-header">
              <h2>{editingProduct ? 'Edit Product' : 'New Product'}</h2>
              <button className="pm-modal-close" onClick={resetForm}>
                <Icons.Close />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="pm-form">
              <div className="pm-form-grid">
                <div className="pm-field">
                  <label>Product Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Enter product name" required />
                </div>
                <div className="pm-field">
                  <label>Category</label>
                  <select name="category" value={formData.category} onChange={handleInputChange} required>
                    <option value="">Select category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="pm-field">
                  <label>Price ($)</label>
                  <input type="number" name="price" value={formData.price} onChange={handleInputChange} min="0" step="0.01" placeholder="0.00" required />
                </div>
                <div className="pm-field">
                  <label>Stock</label>
                  <input type="number" name="stock" value={formData.stock} onChange={handleInputChange} min="0" placeholder="0" required />
                </div>
              </div>
              <div className="pm-field">
                <label>Description</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} rows="3" placeholder="Enter product description" required />
              </div>
              <div className="pm-field">
                <label>Images</label>
                {formData.images.map((image, index) => (
                  <div key={index} className="pm-img-row">
                    <input type="url" placeholder="Image URL" value={image} onChange={(e) => handleImageChange(index, e.target.value)} />
                    {formData.images.length > 1 && (
                      <button type="button" className="pm-img-remove" onClick={() => removeImageField(index)}>Remove</button>
                    )}
                  </div>
                ))}
                <button type="button" className="pm-img-add" onClick={addImageField}>+ Add Image</button>
              </div>
              <div className="pm-field-check">
                <label>
                  <input type="checkbox" name="isActive" checked={formData.isActive} onChange={e => setFormData(prev => ({ ...prev, isActive: e.target.checked }))} />
                  <span>Active (visible to customers)</span>
                </label>
              </div>
              <div className="pm-form-actions">
                <button type="submit" className="pm-submit-btn">{editingProduct ? 'Update Product' : 'Add Product'}</button>
                <button type="button" className="pm-cancel-btn" onClick={resetForm}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="pm-overlay" onClick={() => setDeleteTarget(null)}>
          <div className="pm-confirm-modal" onClick={e => e.stopPropagation()}>
            <div className="pm-confirm-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </div>
            <h3>Deactivate Product</h3>
            <p>Are you sure you want to deactivate this product? It will no longer be visible to customers.</p>
            <div className="pm-confirm-actions">
              <button className="pm-cancel-btn" onClick={() => setDeleteTarget(null)}>Cancel</button>
              <button className="pm-confirm-btn" onClick={handleDeleteConfirm}>Deactivate</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
