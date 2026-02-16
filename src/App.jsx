import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ProductProvider } from './context/ProductContext';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ProductList from './components/Product/ProductList';
import ProductDetails from './components/Product/ProductDetails';
import Cart from './components/Cart/Cart';
import Checkout from './components/Checkout/Checkout';
import PaymentSuccess from './components/Checkout/PaymentSuccess';
import Orders from './pages/Orders';
import AdminDashboard from './components/Admin/AdminDashboard';
import ProductManagement from './components/Admin/ProductManagement';
import UserManagement from './components/Admin/UserManagement';
import AddEditProduct from './components/Admin/AddEditProduct';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import AdminProtectedRoute from './components/Auth/AdminProtectedRoute';
import './styles/App.css';

const originalCreateElement = React.createElement;
React.createElement = function(type, props, ...children) {
  if (process.env.NODE_ENV === 'development') {
    if (children && children.length > 0) {
      const safeChildren = children.map((child, index) => {
        if (child && typeof child === 'object' && !React.isValidElement(child)) {
          if (child.id !== undefined && child.name !== undefined) {
            console.warn('⚠️ Converting category object to string:', child);
            return child.name || String(child);
          }
        }
        return child;
      });
      
      return originalCreateElement.call(this, type, props, ...safeChildren);
    }
  }
  
  return originalCreateElement.apply(this, arguments);
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <ProductProvider>
          <CartProvider>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="products" element={<ProductList />} />
                <Route path="products/:id" element={<ProductDetails />} />
                <Route path="cart" element={
                  <ProtectedRoute>
                    <Cart />
                  </ProtectedRoute>
                } />
                <Route path="checkout" element={
                  <ProtectedRoute>
                    <Checkout />
                  </ProtectedRoute>
                } />
                <Route path="payment-success" element={<PaymentSuccess />} />
                <Route path="orders" element={
                  <ProtectedRoute>
                    <Orders />
                  </ProtectedRoute>
                } />              
                <Route path="admin" element={
                  <AdminProtectedRoute>
                    <AdminDashboard />
                  </AdminProtectedRoute>
                } />
                <Route path="admin/products" element={
                  <AdminProtectedRoute>
                    <ProductManagement />
                  </AdminProtectedRoute>
                } />
                <Route path="admin/products/add" element={
                  <AdminProtectedRoute>
                    <AddEditProduct />
                  </AdminProtectedRoute>
                } />
                <Route path="admin/products/edit/:id" element={
                  <AdminProtectedRoute>
                    <AddEditProduct />
                  </AdminProtectedRoute>
                } />
                <Route path="admin/users" element={
                  <AdminProtectedRoute>
                    <UserManagement />
                  </AdminProtectedRoute>
                } />
              </Route>
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </CartProvider>
        </ProductProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;