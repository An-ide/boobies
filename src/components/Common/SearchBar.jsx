import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchBar.css';

const SearchBar = () => {
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault(); // This prevents page reload
    e.stopPropagation(); // This stops event bubbling
    
    if (searchText.trim()) {
      // Navigate to search results
      navigate(`/search?q=${encodeURIComponent(searchText.trim())}`);
      setSearchText('');
    }
  };

  const handleClear = () => {
    setSearchText('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <div className="working-search-bar">
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-wrapper">
          <input
            type="text"
            placeholder="Search shoes..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyPress={handleKeyPress}
            className="search-input"
          />
          {searchText && (
            <button
              type="button"
              onClick={handleClear}
              className="clear-button"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          )}
          <button type="submit" className="submit-button">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;