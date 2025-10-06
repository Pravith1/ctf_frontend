import ViewPage from './ViewPage';
import CategoriesPage from './CategoriesPage';
import QuestionsPage from './QuestionsPage';

function MainContent({ activeMenu }) {
  return (
    <div className="main-content">
      {activeMenu === 'Overview' && <ViewPage />}
      {activeMenu === 'Categories' && <CategoriesPage />}
      {activeMenu === 'Questions' && <QuestionsPage />}
    </div>
  );
}

export default MainContent;
