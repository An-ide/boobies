import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import './Header.css';

const HomeIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    <polyline points="9 22 9 12 15 12 15 22"></polyline>
  </svg>
);

const CategoryIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7"></rect>
    <rect x="14" y="3" width="7" height="7"></rect>
    <rect x="3" y="14" width="7" height="7"></rect>
    <rect x="14" y="14" width="7" height="7"></rect>
  </svg>
);

const CartIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="9" cy="21" r="1"></circle>
    <circle cx="20" cy="21" r="1"></circle>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
  </svg>
);

const UserIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const OrdersIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
    <polyline points="13 2 13 9 20 9"></polyline>
  </svg>
);

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const LogoutIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
    <polyline points="16 17 21 12 16 7"></polyline>
    <line x1="21" y1="12" x2="9" y2="12"></line>
  </svg>
);

const Header = () => {
  const { user, logout, isAdmin } = useAuth();
  const { getTotalItems } = useCart();
  const [activeTab, setActiveTab] = useState('home');
  const [showBottomNav, setShowBottomNav] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showBottomAccountMenu, setShowBottomAccountMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  const ignoreNextClick = useRef(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setShowBottomNav(window.innerWidth <= 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    const path = location.pathname;
    if (path === '/') setActiveTab('home');
    else if (path === '/products' || path.includes('/products/')) setActiveTab('category');
    else if (path === '/cart') setActiveTab('cart');
    else if (path === '/orders') setActiveTab('orders');
    else if (path === '/admin') setActiveTab('admin');
  }, [location]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setShowUserMenu(false);
    setShowBottomAccountMenu(false);
  };

  const handleBottomAccountClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (ignoreNextClick.current) {
      ignoreNextClick.current = false;
      return;
    }
    
    setShowBottomAccountMenu(prev => !prev);
    
    ignoreNextClick.current = true;
    setTimeout(() => {
      ignoreNextClick.current = false;
    }, 100);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    } else {
      navigate('/products');
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserMenu && !event.target.closest('.user-section')) {
        setShowUserMenu(false);
      }
      
      if (showBottomAccountMenu) {
        const clickedElement = event.target;
        const isMenu = menuRef.current && menuRef.current.contains(clickedElement);
        const isButton = buttonRef.current && buttonRef.current.contains(clickedElement);
        
        if (!isMenu && !isButton) {
          setShowBottomAccountMenu(false);
        }
      }
    };

    document.addEventListener('click', handleClickOutside, true);
    document.addEventListener('touchstart', handleClickOutside, true);
    
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
      document.removeEventListener('touchstart', handleClickOutside, true);
    };
  }, [showUserMenu, showBottomAccountMenu]);

  useEffect(() => {
    setShowBottomAccountMenu(false);
  }, [location]);

  const bottomNavItems = [
    {
      id: 'home',
      label: 'Home',
      icon: <HomeIcon />,
      path: '/',
      show: true
    },
    {
      id: 'category',
      label: 'Shop',
      icon: <CategoryIcon />,
      path: '/products',
      show: true
    },
    {
      id: 'cart',
      label: 'Cart',
      icon: <CartIcon />,
      path: '/cart',
      show: true,
      badge: getTotalItems() > 0 ? getTotalItems() : null
    },
    {
      id: 'account',
      label: user ? 'Account' : 'Login',
      icon: <UserIcon />,
      path: user ? '/account' : '/login',
      show: true,
      isLoggedIn: !!user
    }
  ];

  const desktopMenuItems = [
    { id: 'home', label: 'Home', path: '/' },
    { id: 'products', label: 'Products', path: '/products' },
    ...(user && isAdmin() ? [{ id: 'admin', label: 'Admin', path: '/admin' }] : [])
  ];

  return (
    <>
      {!showBottomNav ? (
        <header className="header">
          <nav className="navbar container">
            <div className="nav-left">
              <Link to="/" className="logo">
                <span className="logo-text">SPICX</span>
                <span className="logo-dot">.</span>
              </Link>
              
              <div className="nav-links">
                {desktopMenuItems.map((item) => (
                  <NavLink
                    key={item.id}
                    to={item.path}
                    className={({ isActive }) => 
                      `nav-link ${isActive ? 'active' : ''}`
                    }
                    end={item.path === '/'}
                  >
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </div>

            <div className="nav-right">
              <form className="search-bar" onSubmit={handleSearch}>
                <div className="search-wrapper">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                  />
                  <button type="submit" className="search-button">
                    <SearchIcon />
                  </button>
                </div>
              </form>

              <div className="action-icons">
                <NavLink to="/cart" className="action-icon cart-icon">
                  <CartIcon />
                  {getTotalItems() > 0 && (
                    <span className="cart-badge">{getTotalItems()}</span>
                  )}
                </NavLink>

                {user ? (
                  <div className="user-section">
                    <button 
                      className="action-icon user-icon"
                      onClick={() => setShowUserMenu(!showUserMenu)}
                    >
                      <UserIcon />
                    </button>
                    
                    {showUserMenu && (
                      <div className="simple-dropdown">
                        <div className="user-info-dropdown">
                          <div className="user-initial">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                            </svg>
                          </div>
                          <div className="user-details">
                            <div className="user-name-dropdown">{user.name}</div>
                            <div className="user-email-dropdown">{user.email}</div>
                          </div>
                        </div>
                        
                        <Link 
                          to="/account" 
                          className="dropdown-option"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <UserIcon />
                          <span>My Account</span>
                        </Link>

                        <div className="dropdown-divider"></div>

                        <Link 
                          to="/orders" 
                          className="dropdown-option orders-option"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <OrdersIcon />
                          <span>My Orders</span>
                        </Link>
                        
                        {isAdmin() && (
                          <Link 
                            to="/admin" 
                            className="dropdown-option admin-option"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <span>Admin Dashboard</span>
                          </Link>
                        )}
                        
                        <div className="dropdown-divider"></div>
                        
                        <button 
                          className="dropdown-option logout-option"
                          onClick={handleLogout}
                        >
                          <LogoutIcon />
                          <span>Logout</span>
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="auth-buttons">
                    <Link to="/login" className="login-button">
                      Sign In
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </nav>
        </header>
      ) : (
        <header className="mobile-header">
          <div className="mobile-top">
            <Link to="/" className="mobile-logo">
              <span className="logo-text">SPICX</span>
              <span className="logo-dot">.</span>
            </Link>
            
            <div className="mobile-actions">
              <form className="mobile-search" onSubmit={handleSearch}>
                <div className="mobile-search-wrapper">
                  <SearchIcon />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="mobile-search-input"
                  />
                </div>
              </form>
            </div>
          </div>
        </header>
      )}

      {showBottomNav && (
        <nav className="bottom-nav">
          {bottomNavItems
            .filter(item => item.show)
            .map((item) => (
            <div key={item.id} className="bottom-account-menu-container">
              {item.isLoggedIn && item.id === 'account' ? (
                <button
                  ref={buttonRef}
                  className={`bottom-nav-button ${activeTab === item.id ? 'active' : ''}`}
                  onClick={handleBottomAccountClick}
                >
                  <div className="bottom-nav-icon">
                    {item.icon}
                    {item.badge && <span className="bottom-nav-badge">{item.badge}</span>}
                  </div>
                  <span className="bottom-nav-label">{item.label}</span>
                </button>
              ) : (
                <NavLink
                  to={item.path}
                  className={({ isActive }) => 
                    `bottom-nav-item ${isActive ? 'active' : ''}`
                  }
                  onClick={() => {
                    setActiveTab(item.id);
                    setShowBottomAccountMenu(false);
                  }}
                  end={item.path === '/'}
                >
                  <div className="bottom-nav-icon">
                    {item.icon}
                    {item.badge && <span className="bottom-nav-badge">{item.badge}</span>}
                  </div>
                  <span className="bottom-nav-label">{item.label}</span>
                </NavLink>
              )}
              
              {item.id === 'account' && item.isLoggedIn && showBottomAccountMenu && (
                <div 
                  ref={menuRef}
                  className="bottom-account-menu"
                >
                  <div className="bottom-menu-user-info">
                    <div className="bottom-menu-avatar">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                      </svg>
                    </div>
                    <div className="bottom-menu-details">
                      <div className="bottom-menu-name">{user.name}</div>
                      <div className="bottom-menu-email">{user.email}</div>
                    </div>
                  </div>
                  
                  <div className="bottom-menu-divider"></div>
                  
                  <div className="account-menu-options">
                    <Link 
                      to="/account" 
                      className="account-menu-option"
                      onClick={() => setShowBottomAccountMenu(false)}
                    >
                      <div className="account-option-icon">
                        <UserIcon />
                      </div>
                      <div className="account-option-content">
                        <div className="account-option-title">My Account</div>
                        <div className="account-option-subtitle">Profile and settings</div>
                      </div>
                    </Link>
                    <Link 
                      to="/orders" 
                      className="account-menu-option orders-option"
                      onClick={() => setShowBottomAccountMenu(false)}
                    >
                      <div className="account-option-icon">
                        <OrdersIcon />
                      </div>
                      <div className="account-option-content">
                        <div className="account-option-title">My Orders</div>
                        <div className="account-option-subtitle">View and track orders</div>
                      </div>
                    </Link>
                    
                    {isAdmin() && (
                      <Link 
                        to="/admin" 
                        className="account-menu-option admin-option"
                        onClick={() => setShowBottomAccountMenu(false)}
                      >
                        <div className="account-option-icon">
                          <span className="admin-badge">A</span>
                        </div>
                        <div className="account-option-content">
                          <div className="account-option-title">Admin Dashboard</div>
                          <div className="account-option-subtitle">Manage store and products</div>
                        </div>
                      </Link>
                    )}
                  </div>
                  
                  <div className="bottom-menu-divider"></div>
                  
                  <button 
                    className="bottom-menu-logout"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLogout();
                    }}
                  >
                    <div className="logout-icon">
                      <LogoutIcon />
                    </div>
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </nav>
      )}
    </>
  );
};

export default Header;