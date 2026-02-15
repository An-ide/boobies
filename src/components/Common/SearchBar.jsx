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
              ✕
            </button>
          )}
          <button type="submit" className="submit-button">
            🔍
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;