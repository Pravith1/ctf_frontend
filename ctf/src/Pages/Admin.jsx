import { useState } from 'react';
import Sidebar from '../components/admin/Sidebar';
import MainContent from '../components/admin/MainContent';
import '../App.css';

function Admin() {
  const [activeMenu, setActiveMenu] = useState('View');
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <div className="app-container" style={{ flex: 1 }}>
        <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
        <MainContent activeMenu={activeMenu} />
      </div>
      <Footer />
    </div>
  );
}

export default Admin;
