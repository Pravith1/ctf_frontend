import { useState } from 'react';

function Sidebar({ activeMenu, setActiveMenu }) {
  const menuItems = ['Overview', 'Categories', 'Questions'];
  
  return (
    <div className="sidebar">
      <h2 className="sidebar-title">CTF Manager</h2>
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item}
            className={`sidebar-button ${activeMenu === item ? 'active' : ''}`}
            onClick={() => setActiveMenu(item)}
          >
            {item}
          </button>
        ))}
      </nav>
    </div>
  );
}

export default Sidebar;
