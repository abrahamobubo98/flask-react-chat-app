import React from 'react';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-center">
        <div className="search-container">
          <input 
            type="text" 
            placeholder="Search..." 
            className="search-bar"
          />
        </div>
      </div>
      
      <div className="nav-right">
        <button className="help-button">Help</button>
      </div>
    </nav>
  );
}

export default Navbar; 