import OverviewPage from './OverviewPage';
import CategoriesPage from './CategoriesPage';
import QuestionsPage from './QuestionsPage';

function MainContent({ activeMenu }) {
  return (
    <div className="main-content">
      {activeMenu === 'Overview' && <OverviewPage />}
      {activeMenu === 'Categories' && <CategoriesPage />}
      {activeMenu === 'Questions' && <QuestionsPage />}
    </div>
  );
}

export default MainContent;
