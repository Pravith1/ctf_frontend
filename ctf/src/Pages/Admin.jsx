import { useState, useRef } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Sidebar from '../components/admin/Sidebar';
import MainContent from '../components/admin/MainContent';
import '../App.css';

function Admin() {
  const [activeMenu, setActiveMenu] = useState('Overview');
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const scrollPositionRef = useRef(0);

  const handleEditCategory = (category) => {
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
      scrollPositionRef.current = mainContent.scrollTop;
    }
    setEditingCategory(category);
  };

  const handleEditQuestion = (category, question) => {
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
      scrollPositionRef.current = mainContent.scrollTop;
    }
    setEditingQuestion({ category, question });
  };

  const handleBackToOverview = () => {
    setEditingCategory(null);
    setEditingQuestion(null);
    setTimeout(() => {
      const mainContent = document.querySelector('.main-content');
      if (mainContent) {
        mainContent.scrollTop = scrollPositionRef.current;
      }
    }, 0);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <div className="app-container" style={{ flex: 1 }}>
        <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
        <MainContent
          activeMenu={activeMenu}
          editingCategory={editingCategory}
          editingQuestion={editingQuestion}
          onEditCategory={handleEditCategory}
          onEditQuestion={handleEditQuestion}
          onBackToOverview={handleBackToOverview}
        />
      </div>
      <Footer />
    </div>
  );
}

export default Admin;
