import { useState } from 'react';
import Sidebar from '../components/admin/Sidebar';
import MainContent from '../components/admin/MainContent';
import '../App.css';

function Admin() {
  const [activeMenu, setActiveMenu] = useState('View');
  
  return (
    <div className="app-container">
      <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
      <MainContent activeMenu={activeMenu} />
    </div>
  );
}

export default Admin;
